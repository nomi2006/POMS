import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { collection, getDocs, query, where, orderBy } from "firebase/firestore";
import { db } from "config/firebase";
import { toast } from "react-toastify";
import {
  Card,
  Table,
  Button,
  Badge,
  Form,
  Row,
  Col,
  InputGroup
} from "react-bootstrap";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import Swal from "sweetalert2";

export default function PurchaseOrderReport() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [clients, setClients] = useState([]);

  const [filters, setFilters] = useState({
    fromDate: "",
    toDate: "",
    search: "",
    client: "",
    stage: "",
    minTotal: "",
    maxTotal: ""
  });

  const [stats, setStats] = useState({
    totalOrders: 0,
    totalClients: 0,
    totalUnits: 0,
    grandTotal: 0
  });

  useEffect(() => {
    loadData();
    loadClients();
  }, []);

  const loadClients = async () => {
    try {
      const snapshot = await getDocs(collection(db, "clients"));
      const data = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data()
      }));
      setClients(data);
    } catch (error) {
      console.error("Error loading clients:", error);
    }
  };

  const loadData = async () => {
    try {
      setLoading(true);
      const snapshot = await getDocs(collection(db, "purchaseOrders"));
      const data = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data()
      }));
      setOrders(data);
      setFilteredOrders(data);
      calculateStats(data);
    } catch (error) {
      console.error("Error loading data:", error);
      toast.error("Failed to load purchase orders");
    } finally {
      setLoading(false);
    }
  };

  const calculateStats = (data) => {
    const uniqueClients = new Set(data.map((order) => order.clientId).filter(Boolean));
    setStats({
      totalOrders: data.length,
      totalClients: uniqueClients.size,
      totalUnits: data.reduce((sum, order) => sum + Number(order.totalUnits || 0), 0),
      grandTotal: data.reduce((sum, order) => sum + Number(order.grandTotal || 0), 0)
    });
  };

  const applyFilters = () => {
    let filtered = [...orders];

    if (filters.fromDate) {
      const from = new Date(filters.fromDate);
      filtered = filtered.filter((order) => {
        if (!order.createdAt) return false;
        const date = order.createdAt.toDate ? order.createdAt.toDate() : new Date(order.createdAt);
        return date >= from;
      });
    }

    if (filters.toDate) {
      const to = new Date(filters.toDate);
      to.setHours(23, 59, 59);
      filtered = filtered.filter((order) => {
        if (!order.createdAt) return false;
        const date = order.createdAt.toDate ? order.createdAt.toDate() : new Date(order.createdAt);
        return date <= to;
      });
    }

    if (filters.client) {
      filtered = filtered.filter((order) => order.clientId === filters.client);
    }

    if (filters.stage) {
      filtered = filtered.filter((order) => order.stage === filters.stage);
    }

    if (filters.search) {
      const searchTerm = filters.search.toLowerCase();
      filtered = filtered.filter((order) =>
        order.po?.toLowerCase().includes(searchTerm) ||
        order.clientName?.toLowerCase().includes(searchTerm) ||
        order.pid?.toLowerCase().includes(searchTerm)
      );
    }

    if (filters.minTotal) {
      filtered = filtered.filter((order) => Number(order.grandTotal || 0) >= Number(filters.minTotal));
    }
    if (filters.maxTotal) {
      filtered = filtered.filter((order) => Number(order.grandTotal || 0) <= Number(filters.maxTotal));
    }

    setFilteredOrders(filtered);
    calculateStats(filtered);
  };

  const resetFilters = () => {
    setFilters({
      fromDate: "",
      toDate: "",
      search: "",
      client: "",
      stage: "",
      minTotal: "",
      maxTotal: ""
    });
    setFilteredOrders(orders);
    calculateStats(orders);
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
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
      Completed: "success",
      "Order Issued": "primary"
    };
    return <Badge bg={colors[stage] || "secondary"}>{stage || "Draft"}</Badge>;
  };

  // ✅ Updated exportPDF with Swal confirmation
  const exportPDF = () => {
    Swal.fire({
      title: 'Download PDF?',
      text: 'Are you sure you want to download this report as PDF?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#0d6efd',
      cancelButtonColor: '#dc3545',
      confirmButtonText: '✅ Yes, Download',
      cancelButtonText: '❌ Cancel'
    }).then((result) => {
      if (result.isConfirmed) {
        const doc = new jsPDF();
        const pageWidth = doc.internal.pageSize.getWidth();

        doc.setFontSize(18);
        doc.text("Purchase Order Report", pageWidth / 2, 20, { align: "center" });

        doc.setFontSize(10);
        let dateText = "All Orders";
        if (filters.fromDate || filters.toDate) {
          dateText = `From: ${filters.fromDate || "Start"} To: ${filters.toDate || "End"}`;
        }
        doc.text(dateText, pageWidth / 2, 28, { align: "center" });

        doc.setFontSize(10);
        doc.text(`Total Orders: ${stats.totalOrders}`, 14, 38);
        doc.text(`Total Clients: ${stats.totalClients}`, 14, 44);
        doc.text(`Total Units: ${stats.totalUnits}`, 14, 50);
        doc.text(`Grand Total: $${stats.grandTotal.toFixed(2)}`, 14, 56);

        const tableData = filteredOrders.map((order) => [
          order.po || "-",
          order.clientName || "-",
          order.pid || "-",
          formatDate(order.createdAt),
          order.totalUnits || 0,
          `$${Number(order.grandTotal || 0).toFixed(2)}`,
          order.stage || "Draft"
        ]);

        autoTable(doc, {
          startY: 62,
          head: [["PO #", "Client", "PID", "Date", "Units", "Total", "Stage"]],
          body: tableData,
          theme: "striped",
          headStyles: { fillColor: [13, 110, 253], textColor: [255, 255, 255] },
          styles: { fontSize: 8 }
        });

        doc.save("purchase_order_report.pdf");

        Swal.fire({
          icon: 'success',
          title: '✅ PDF Downloaded!',
          text: 'Your report has been downloaded successfully.',
          timer: 2000,
          showConfirmButton: false
        });
      }
    });
  };

  return (
    <div className="container-fluid p-4">
      <div className="text-center py-4 border-bottom mb-4">
        <h2 className="fw-bold text-uppercase mb-0" style={{ letterSpacing: "2px", fontSize: "2rem" }}>
          📊 Purchase Order Report
        </h2>
      </div>

      <Card className="shadow-sm border-0 mb-4">
        <Card.Body>
          <Row className="g-3">
            <Col md={3}>
              <Form.Group>
                <Form.Label className="fw-bold small text-muted">From Date</Form.Label>
                <Form.Control type="date" name="fromDate" value={filters.fromDate} onChange={handleFilterChange} />
              </Form.Group>
            </Col>
            <Col md={3}>
              <Form.Group>
                <Form.Label className="fw-bold small text-muted">To Date</Form.Label>
                <Form.Control type="date" name="toDate" value={filters.toDate} onChange={handleFilterChange} />
              </Form.Group>
            </Col>
            <Col md={3}>
              <Form.Group>
                <Form.Label className="fw-bold small text-muted">Client</Form.Label>
                <Form.Select name="client" value={filters.client} onChange={handleFilterChange}>
                  <option value="">All Clients</option>
                  {clients.map((client) => (
                    <option key={client.id} value={client.id}>{client.name}</option>
                  ))}
                </Form.Select>
              </Form.Group>
            </Col>
            <Col md={3}>
              <Form.Group>
                <Form.Label className="fw-bold small text-muted">Stage</Form.Label>
                <Form.Select name="stage" value={filters.stage} onChange={handleFilterChange}>
                  <option value="">All Stages</option>
                  <option value="Draft">Draft</option>
                  <option value="Pending">Pending</option>
                  <option value="Approved">Approved</option>
                  <option value="Completed">Completed</option>
                  <option value="Order Issued">Order Issued</option>
                </Form.Select>
              </Form.Group>
            </Col>
            <Col md={4}>
              <Form.Group>
                <Form.Label className="fw-bold small text-muted">Search</Form.Label>
                <Form.Control type="text" name="search" value={filters.search} onChange={handleFilterChange} placeholder="Search by PO#, Client, PID..." />
              </Form.Group>
            </Col>
            <Col md={3}>
              <Form.Group>
                <Form.Label className="fw-bold small text-muted">Min Total</Form.Label>
                <Form.Control type="number" name="minTotal" value={filters.minTotal} onChange={handleFilterChange} placeholder="Min $" />
              </Form.Group>
            </Col>
            <Col md={3}>
              <Form.Group>
                <Form.Label className="fw-bold small text-muted">Max Total</Form.Label>
                <Form.Control type="number" name="maxTotal" value={filters.maxTotal} onChange={handleFilterChange} placeholder="Max $" />
              </Form.Group>
            </Col>
            <Col md={2} className="d-flex align-items-end gap-2">
              <Button variant="primary" onClick={applyFilters} className="w-100"><i className="ph ph-funnel me-1" />Apply</Button>
              <Button variant="outline-secondary" onClick={resetFilters} className="w-100"><i className="ph ph-arrow-clockwise me-1" />Reset</Button>
            </Col>
          </Row>
        </Card.Body>
      </Card>

      <Row className="g-3 mb-4">
        <Col md={3}>
          <Card className="border-0 shadow-sm text-center bg-primary text-white">
            <Card.Body><h6 className="text-white-50">Total Orders</h6><h2 className="fw-bold mb-0">{stats.totalOrders}</h2></Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="border-0 shadow-sm text-center bg-success text-white">
            <Card.Body><h6 className="text-white-50">Total Clients</h6><h2 className="fw-bold mb-0">{stats.totalClients}</h2></Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="border-0 shadow-sm text-center bg-warning text-white">
            <Card.Body><h6 className="text-white-50">Total Units</h6><h2 className="fw-bold mb-0">{stats.totalUnits.toLocaleString()}</h2></Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="border-0 shadow-sm text-center bg-info text-white">
            <Card.Body><h6 className="text-white-50">Grand Total</h6><h2 className="fw-bold mb-0">${stats.grandTotal.toFixed(2)}</h2></Card.Body>
          </Card>
        </Col>
      </Row>

      <Card className="shadow-sm border-0">
        <Card.Header className="bg-white d-flex justify-content-between align-items-center py-3">
          <h6 className="fw-bold mb-0"><i className="ph ph-list me-2 text-primary" />Orders ({filteredOrders.length})</h6>
          <Button variant="success" onClick={exportPDF} size="sm"><i className="ph ph-file-pdf me-1" />Export PDF</Button>
        </Card.Header>
        <Card.Body className="p-0">
          {loading ? (
            <div className="text-center py-5"><div className="spinner-border text-primary" /><h5 className="mt-3">Loading...</h5></div>
          ) : (
            <div className="table-responsive">
              <Table hover className="mb-0 align-middle" style={{ fontSize: "0.9rem" }}>
                <thead className="table-light">
                  <tr>
                    <th>PO #</th>
                    <th>Client</th>
                    <th>PID</th>
                    <th>Date</th>
                    <th className="text-center">Total Units</th>
                    <th className="text-center">Grand Total</th>
                    <th className="text-center">Stage</th>
                    <th className="text-center">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredOrders.length > 0 ? (
                    filteredOrders.map((order) => (
                      <tr key={order.id}>
                        <td className="fw-bold">{order.po || "-"}</td>
                        <td>{order.clientName || "-"}</td>
                        <td>{order.pid || "-"}</td>
                        <td>{formatDate(order.createdAt)}</td>
                        <td className="text-center">{order.totalUnits || 0}</td>
                        <td className="text-center fw-bold text-success">${Number(order.grandTotal || 0).toFixed(2)}</td>
                        <td className="text-center">{getStageBadge(order.stage)}</td>
                        <td className="text-center">
                          <Button size="sm" variant="outline-primary" onClick={() => navigate(`/purchase-order/view/${order.id}`)}>
                            <i className="ph ph-eye" />
                          </Button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr><td colSpan="8" className="text-center py-4 text-muted">No orders found</td></tr>
                  )}
                </tbody>
              </Table>
            </div>
          )}
        </Card.Body>
        <Card.Footer className="bg-white py-2">
          <span className="text-muted small">Showing {filteredOrders.length} order{filteredOrders.length !== 1 ? "s" : ""}</span>
        </Card.Footer>
      </Card>
    </div>
  );
}