import { useEffect, useState } from "react";
import { collection, getDocs, query, orderBy, limit } from "firebase/firestore";
import { db } from "config/firebase";
import { Card, Table, Badge, Row, Col } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import Chart from "react-apexcharts";

export default function DefaultPage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [recentOrders, setRecentOrders] = useState([]);
  const [topClients, setTopClients] = useState([]);
  const [monthlyData, setMonthlyData] = useState([]);
  const [statusData, setStatusData] = useState([]);
  const [stats, setStats] = useState({
    totalOrders: 0,
    totalClients: 0,
    todayOrders: 0,
    monthOrders: 0,
    pendingOrders: 0,
    completedOrders: 0,
    totalRevenue: 0
  });

  useEffect(() => {
    loadDashboard();
  }, []);

  const loadDashboard = async () => {
    try {
      setLoading(true);

      // ✅ Fetch all orders
      const ordersSnap = await getDocs(collection(db, "purchaseOrders"));
      const ordersData = ordersSnap.docs.map((doc) => ({
        id: doc.id,
        ...doc.data()
      }));

      // ✅ Fetch clients
      const clientsSnap = await getDocs(collection(db, "clients"));

      // ✅ Calculate stats
      const today = new Date();
      const todayOrders = ordersData.filter((order) => {
        if (!order.createdAt) return false;
        const date = order.createdAt.toDate ? order.createdAt.toDate() : new Date(order.createdAt);
        return (
          date.getDate() === today.getDate() &&
          date.getMonth() === today.getMonth() &&
          date.getFullYear() === today.getFullYear()
        );
      });

      const monthOrders = ordersData.filter((order) => {
        if (!order.createdAt) return false;
        const date = order.createdAt.toDate ? order.createdAt.toDate() : new Date(order.createdAt);
        return (
          date.getMonth() === today.getMonth() &&
          date.getFullYear() === today.getFullYear()
        );
      });

      const pendingOrders = ordersData.filter((order) => order.stage === "Pending" || order.stage === "Draft");
      const completedOrders = ordersData.filter((order) => order.stage === "Completed");

      const totalRevenue = ordersData.reduce((sum, order) => sum + Number(order.grandTotal || 0), 0);

      setStats({
        totalOrders: ordersData.length,
        totalClients: clientsSnap.size,
        todayOrders: todayOrders.length,
        monthOrders: monthOrders.length,
        pendingOrders: pendingOrders.length,
        completedOrders: completedOrders.length,
        totalRevenue: totalRevenue
      });

      // ✅ Recent orders (top 10)
      const sortedOrders = [...ordersData].sort((a, b) => {
        const dateA = a.createdAt?.toDate ? a.createdAt.toDate() : new Date(a.createdAt);
        const dateB = b.createdAt?.toDate ? b.createdAt.toDate() : new Date(b.createdAt);
        return dateB - dateA;
      });
      setRecentOrders(sortedOrders.slice(0, 10));

      // ✅ Top Clients (by order count)
      const clientMap = {};
      ordersData.forEach((order) => {
        const clientName = order.clientName || "Unknown";
        if (!clientMap[clientName]) {
          clientMap[clientName] = { name: clientName, count: 0, total: 0 };
        }
        clientMap[clientName].count += 1;
        clientMap[clientName].total += Number(order.grandTotal || 0);
      });
      const sortedClients = Object.values(clientMap)
        .sort((a, b) => b.count - a.count)
        .slice(0, 5);
      setTopClients(sortedClients);

      // ✅ Monthly data (last 6 months)
      const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
      const monthlyOrders = {};
      ordersData.forEach((order) => {
        if (!order.createdAt) return;
        const date = order.createdAt.toDate ? order.createdAt.toDate() : new Date(order.createdAt);
        const key = `${monthNames[date.getMonth()]} ${date.getFullYear()}`;
        if (!monthlyOrders[key]) {
          monthlyOrders[key] = 0;
        }
        monthlyOrders[key] += 1;
      });
      
      const sortedMonths = Object.keys(monthlyOrders).sort((a, b) => {
        const dateA = new Date(a);
        const dateB = new Date(b);
        return dateA - dateB;
      });
      const last6Months = sortedMonths.slice(-6);
      const monthData = last6Months.map((month) => monthlyOrders[month] || 0);
      setMonthlyData({
        categories: last6Months,
        series: monthData
      });

      // ✅ Status distribution
      const statusCounts = {
        Draft: 0,
        Pending: 0,
        Approved: 0,
        "Order Issued": 0,
        Completed: 0
      };
      ordersData.forEach((order) => {
        const stage = order.stage || "Draft";
        if (statusCounts[stage] !== undefined) {
          statusCounts[stage] += 1;
        }
      });
      setStatusData(Object.entries(statusCounts).filter(([_, count]) => count > 0));

    } catch (error) {
      console.error("Error loading dashboard:", error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (date) => {
    if (!date) return "-";
    if (date.toDate) return date.toDate().toLocaleDateString();
    if (typeof date === "string") return new Date(date).toLocaleDateString();
    return date.toLocaleDateString();
  };

  const getStageBadge = (stage) => {
    const colors = {
      Draft: "secondary",
      Pending: "warning",
      Approved: "info",
      "Order Issued": "primary",
      Completed: "success"
    };
    return <Badge bg={colors[stage] || "secondary"}>{stage || "Draft"}</Badge>;
  };

  // ✅ Chart options
  const barChartOptions = {
    chart: {
      type: "bar",
      height: 280,
      toolbar: { show: false }
    },
    plotOptions: {
      bar: {
        borderRadius: 4,
        horizontal: false,
        columnWidth: "55%"
      }
    },
    dataLabels: { enabled: false },
    stroke: { show: true, width: 2, colors: ["transparent"] },
    xaxis: {
      categories: monthlyData.categories || ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
    },
    fill: { opacity: 1 },
    colors: ["#0d6efd"],
    tooltip: {
      y: {
        formatter: (val) => `${val} orders`
      }
    }
  };

  const pieChartOptions = {
    chart: {
      type: "pie",
      height: 280,
      toolbar: { show: false }
    },
    labels: statusData.map(([label]) => label),
    colors: ["#6c757d", "#ffc107", "#0d6efd", "#0dcaf0", "#28a745"],
    legend: {
      position: "bottom"
    },
    responsive: [{
      breakpoint: 480,
      options: {
        chart: { width: 200 },
        legend: { position: "bottom" }
      }
    }]
  };

  if (loading) {
    return (
      <div className="text-center py-5">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
        <h5 className="mt-3 text-muted">Loading Dashboard...</h5>
      </div>
    );
  }

  const barSeries = [{
    name: "Orders",
    data: monthlyData.series || [0, 0, 0, 0, 0, 0]
  }];

  const pieSeries = statusData.map(([_, count]) => count);

  return (
    <div className="container-fluid p-4">
      {/* Header */}
      <Row className="align-items-center mb-4">
        <Col md={8}>
          <h4 className="fw-bold mb-1">Dashboard</h4>
          <p className="text-muted mb-0">Welcome back! Here's what's happening with your orders.</p>
        </Col>
        {/* <Col md={4} className="text-end">
          <button className="btn btn-light me-2">
            <i className="ph ph-gear me-1" />
            Settings
          </button>
          <button className="btn btn-light">
            <i className="ph ph-calendar me-1" />
            All Time
          </button>
        </Col> */}
      </Row>

      {/* 📊 STATS CARDS */}
      <Row className="g-3 mb-4">
        <Col xl={3} lg={6}>
          <Card className="border-0 shadow-sm bg-primary text-white">
            <Card.Body className="d-flex justify-content-between align-items-center">
              <div>
                <h6 className="text-white-50">Total Orders</h6>
                <h2 className="fw-bold mb-0">{stats.totalOrders}</h2>
              </div>
              <div className="bg-white bg-opacity-25 p-3 rounded-circle">
                <i className="ph ph-shopping-cart" style={{ fontSize: "24px" }} />
              </div>
            </Card.Body>
          </Card>
        </Col>
        <Col xl={3} lg={6}>
          <Card className="border-0 shadow-sm bg-success text-white">
            <Card.Body className="d-flex justify-content-between align-items-center">
              <div>
                <h6 className="text-white-50">Total Clients</h6>
                <h2 className="fw-bold mb-0">{stats.totalClients}</h2>
              </div>
              <div className="bg-white bg-opacity-25 p-3 rounded-circle">
                <i className="ph ph-users" style={{ fontSize: "24px" }} />
              </div>
            </Card.Body>
          </Card>
        </Col>
        <Col xl={3} lg={6}>
          <Card className="border-0 shadow-sm bg-warning text-white">
            <Card.Body className="d-flex justify-content-between align-items-center">
              <div>
                <h6 className="text-white-50">Today's Orders</h6>
                <h2 className="fw-bold mb-0">{stats.todayOrders}</h2>
              </div>
              <div className="bg-white bg-opacity-25 p-3 rounded-circle">
                <i className="ph ph-calendar" style={{ fontSize: "24px" }} />
              </div>
            </Card.Body>
          </Card>
        </Col>
        <Col xl={3} lg={6}>
          <Card className="border-0 shadow-sm bg-info text-white">
            <Card.Body className="d-flex justify-content-between align-items-center">
              <div>
                <h6 className="text-white-50">Total Revenue</h6>
                <h2 className="fw-bold mb-0">${stats.totalRevenue.toFixed(2)}</h2>
              </div>
              <div className="bg-white bg-opacity-25 p-3 rounded-circle">
                <i className="ph ph-currency-dollar" style={{ fontSize: "24px" }} />
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* 📈 CHARTS */}
      <Row className="g-4 mb-4">
        <Col lg={8}>
          <Card className="shadow-sm border-0">
            <Card.Header className="bg-white d-flex justify-content-between align-items-center py-3">
              <h6 className="fw-bold mb-0">
                <i className="ph ph-chart-bar me-2 text-primary" />
                Monthly Orders
              </h6>
            </Card.Header>
            <Card.Body>
              <Chart
                options={barChartOptions}
                series={barSeries}
                type="bar"
                height={280}
              />
            </Card.Body>
          </Card>
        </Col>
        <Col lg={4}>
          <Card className="shadow-sm border-0">
            <Card.Header className="bg-white d-flex justify-content-between align-items-center py-3">
              <h6 className="fw-bold mb-0">
                <i className="ph ph-chart-pie me-2 text-primary" />
                Order Status
              </h6>
            </Card.Header>
            <Card.Body>
              {pieSeries.length > 0 ? (
                <Chart
                  options={pieChartOptions}
                  series={pieSeries}
                  type="pie"
                  height={280}
                />
              ) : (
                <div className="text-center py-5 text-muted">
                  <p>No order data available</p>
                </div>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* 🏆 TOP CLIENTS & 📋 RECENT ORDERS */}
      <Row className="g-4">
        <Col lg={4}>
          <Card className="shadow-sm border-0">
            <Card.Header className="bg-white d-flex justify-content-between align-items-center py-3">
              <h6 className="fw-bold mb-0">
                <i className="ph ph-trophy me-2 text-warning" />
                Top Clients
              </h6>
            </Card.Header>
            <Card.Body className="p-0">
              <div className="table-responsive">
                <Table hover className="mb-0">
                  <thead className="table-light">
                    <tr>
                      <th>#</th>
                      <th>Client</th>
                      <th className="text-center">Orders</th>
                      <th className="text-end">Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    {topClients.length > 0 ? (
                      topClients.map((client, index) => (
                        <tr key={index}>
                          <td>
                            {index === 0 && <span className="text-warning">🥇</span>}
                            {index === 1 && <span className="text-secondary">🥈</span>}
                            {index === 2 && <span className="text-danger">🥉</span>}
                            {index > 2 && <span className="text-muted">{index + 1}</span>}
                          </td>
                          <td>{client.name}</td>
                          <td className="text-center">{client.count}</td>
                          <td className="text-end fw-bold text-success">
                            ${client.total.toFixed(2)}
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="4" className="text-center py-4 text-muted">
                          No clients found
                        </td>
                      </tr>
                    )}
                  </tbody>
                </Table>
              </div>
            </Card.Body>
          </Card>
        </Col>
        <Col lg={8}>
          <Card className="shadow-sm border-0">
            <Card.Header className="bg-white d-flex justify-content-between align-items-center py-3">
              <h6 className="fw-bold mb-0">
                <i className="ph ph-clock me-2 text-primary" />
                Recent Orders
              </h6>
              <span 
                className="text-primary small fw-bold" 
                style={{ cursor: "pointer" }}
                onClick={() => navigate("/purchase-order/list")}
              >
                View All →
              </span>
            </Card.Header>
            <Card.Body className="p-0">
              <div className="table-responsive">
                <Table hover className="mb-0 align-middle" style={{ fontSize: "0.9rem" }}>
                  <thead className="table-light">
                    <tr>
                      <th>PO #</th>
                      <th>Client</th>
                      <th className="text-center">Units</th>
                      <th className="text-center">Total</th>
                      <th className="text-center">Stage</th>
                      <th className="text-center">Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentOrders.length > 0 ? (
                      recentOrders.map((order) => (
                        <tr 
                          key={order.id} 
                          style={{ cursor: "pointer" }}
                          onClick={() => navigate(`/purchase-order/view/${order.id}`)}
                        >
                          <td className="fw-bold">{order.po || "-"}</td>
                          <td>{order.clientName || "-"}</td>
                          <td className="text-center">{order.totalUnits || 0}</td>
                          <td className="text-center fw-bold text-success">
                            ${Number(order.grandTotal || 0).toFixed(2)}
                          </td>
                          <td className="text-center">{getStageBadge(order.stage)}</td>
                          <td className="text-center" style={{ fontSize: "0.8rem" }}>
                            {formatDate(order.createdAt)}
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="6" className="text-center py-4 text-muted">
                          No orders found
                        </td>
                      </tr>
                    )}
                  </tbody>
                </Table>
              </div>
            </Card.Body>
            <Card.Footer className="bg-white py-2">
              <span className="text-muted small">
                Showing {recentOrders.length} recent orders
              </span>
            </Card.Footer>
          </Card>
        </Col>
      </Row>
    </div>
  );
}