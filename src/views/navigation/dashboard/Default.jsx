import { useEffect, useState } from "react";
import { collection, getDocs, query, orderBy } from "firebase/firestore";
import { db } from "config/firebase";
import { Card, Table, Badge, Row, Col } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

export default function DefaultPage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [orders, setOrders] = useState([]);
  const [stats, setStats] = useState({
    totalOrders: 0,
    totalClients: 0,
    todayOrders: 0,
    monthOrders: 0
  });

  useEffect(() => {
    loadDashboard();
  }, []);

  const loadDashboard = async () => {
    try {
      setLoading(true);

      // 🔥 Purchase Orders fetch karein
      const ordersQuery = query(
        collection(db, "purchaseOrders"),
        orderBy("createdAt", "desc")
      );
      const ordersSnap = await getDocs(ordersQuery);
      
      const ordersData = ordersSnap.docs.map((doc) => ({
        id: doc.id,
        ...doc.data()
      }));

      // 🔥 Clients fetch karein
      const clientsSnap = await getDocs(collection(db, "clients"));

      // 📊 Stats calculate karein
      const today = new Date();
      
      // Today's orders
      const todayOrders = ordersData.filter((order) => {
        if (!order.createdAt) return false;
        let date;
        if (order.createdAt.toDate) {
          date = order.createdAt.toDate();
        } else if (typeof order.createdAt === 'string') {
          date = new Date(order.createdAt);
        } else {
          date = order.createdAt;
        }
        return (
          date.getDate() === today.getDate() &&
          date.getMonth() === today.getMonth() &&
          date.getFullYear() === today.getFullYear()
        );
      });

      // This month orders
      const monthOrders = ordersData.filter((order) => {
        if (!order.createdAt) return false;
        let date;
        if (order.createdAt.toDate) {
          date = order.createdAt.toDate();
        } else if (typeof order.createdAt === 'string') {
          date = new Date(order.createdAt);
        } else {
          date = order.createdAt;
        }
        return (
          date.getMonth() === today.getMonth() &&
          date.getFullYear() === today.getFullYear()
        );
      });

      setStats({
        totalOrders: ordersData.length,
        totalClients: clientsSnap.size,
        todayOrders: todayOrders.length,
        monthOrders: monthOrders.length
      });

      setOrders(ordersData);

    } catch (error) {
      console.error("Error loading dashboard:", error);
    } finally {
      setLoading(false);
    }
  };

  const getStageBadge = (stage) => {
    const colors = {
      Draft: "secondary",
      Pending: "warning",
      Approved: "info",
      Completed: "success",
      "Order Issued": "primary"
    };
    return <Badge bg={colors[stage] || "secondary"}>{stage || "Draft"}</Badge>;
  };

  const formatDate = (date) => {
    if (!date) return "-";
    if (date.toDate) {
      return date.toDate().toLocaleDateString();
    }
    if (typeof date === 'string') {
      return new Date(date).toLocaleDateString();
    }
    return date.toLocaleDateString();
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

  return (
    <div className="container-fluid p-4">
      {/* 📊 HEADER */}
      <Row className="align-items-center mb-4">
        <Col md={8}>
          <h1 style={{ fontSize: "48px", fontWeight: "400" }}>
            Dashboard - Admin
          </h1>
          <p className="text-muted">
            Welcome <span className="text-primary">User</span>, everything looks great.
          </p>
        </Col>
        <Col md={4} className="text-end">
          <button className="btn btn-light me-2">
            <i className="ph ph-gear me-1"></i>
            Settings
          </button>
          <button className="btn btn-light">
            <i className="ph ph-calendar me-1"></i>
            All Time
          </button>
        </Col>
      </Row>

      {/* 📊 STATS CARDS */}
      <Row className="g-3 mb-4">
        <Col md={3}>
          <Card className="border-0 shadow-sm text-center bg-primary text-white">
            <Card.Body>
              <h6 className="text-white-50">Total Purchase Orders</h6>
              <h2 className="fw-bold mb-0">{stats.totalOrders}</h2>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="border-0 shadow-sm text-center bg-success text-white">
            <Card.Body>
              <h6 className="text-white-50">Total Clients</h6>
              <h2 className="fw-bold mb-0">{stats.totalClients}</h2>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="border-0 shadow-sm text-center bg-warning text-white">
            <Card.Body>
              <h6 className="text-white-50">Today's Orders</h6>
              <h2 className="fw-bold mb-0">{stats.todayOrders}</h2>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="border-0 shadow-sm text-center bg-info text-white">
            <Card.Body>
              <h6 className="text-white-50">This Month</h6>
              <h2 className="fw-bold mb-0">{stats.monthOrders}</h2>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* 📋 ALL ORDERS TABLE */}
      <Card className="shadow-sm border-0">
        <Card.Header className="bg-white d-flex justify-content-between align-items-center py-3">
          <h6 className="fw-bold mb-0">
            <i className="ph ph-shopping-cart me-2 text-primary"></i>
            ALL ORDERS
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
                  <th className="text-center" style={{ width: "90px" }}>IMAGE</th>
                  <th>PO #</th>
                  <th>Client</th>
                  <th>PID</th>
                  <th>Stage</th>
                  <th>Ship Date</th>
                  <th className="text-center">Total Units</th>
                  <th className="text-center">Grand Total</th>
                  <th className="text-center">Action</th>
                </tr>
              </thead>
              <tbody>
                {orders.length > 0 ? (
                  orders.map((order) => (
                    <tr 
                      key={order.id}
                      style={{ cursor: "pointer" }}
                      onClick={() => navigate(`/purchase-order/view/${order.id}`)}
                    >
                      <td className="text-center">
                        {order.products && order.products.length > 0 && order.products[0].image ? (
                          <img 
                            src={order.products[0].image} 
                            alt="product" 
                            style={{ width: "50px", height: "50px", objectFit: "cover", borderRadius: "4px" }}
                          />
                        ) : (
                          <div 
                            className="d-flex align-items-center justify-content-center" 
                            style={{ width: "50px", height: "50px", backgroundColor: "#f8f9fa", borderRadius: "4px", fontSize: "12px", color: "#999" }}
                          >
                            No Image
                          </div>
                        )}
                      </td>
                      <td className="fw-bold">{order.po || "-"}</td>
                      <td>{order.clientName || "-"}</td>
                      <td>{order.pid || "-"}</td>
                      <td>{getStageBadge(order.stage)}</td>
                      <td>{formatDate(order.shipDate)}</td>
                      <td className="text-center">{order.totalUnits || 0}</td>
                      <td className="text-center fw-bold text-success">
                        ${Number(order.grandTotal || 0).toFixed(2)}
                      </td>
                      <td className="text-center">
                        <button 
                          className="btn btn-sm btn-outline-primary"
                          onClick={(e) => {
                            e.stopPropagation();
                            navigate(`/purchase-order/view/${order.id}`);
                          }}
                        >
                          <i className="ph ph-eye"></i>
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="9" className="text-center py-4 text-muted">
                      No purchase orders found.
                    </td>
                  </tr>
                )}
              </tbody>
            </Table>
          </div>
        </Card.Body>
        <Card.Footer className="bg-white py-2">
          <span className="text-muted small">
            Showing {orders.length} orders
          </span>
        </Card.Footer>
      </Card>
    </div>
  );
}