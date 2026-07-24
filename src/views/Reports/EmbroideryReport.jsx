import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { collection, getDocs } from "firebase/firestore";
import { db } from "config/firebase";
import { toast } from "react-toastify";
import {
  Card,
  Table,
  Button,
  Form,
  Row,
  Col
} from "react-bootstrap";
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import Swal from 'sweetalert2';

export default function EmbroideryReport() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [poList, setPoList] = useState([]);

  const [filters, setFilters] = useState({
    fromDate: "",
    toDate: "",
    search: "",
    poNumber: "",
    status: ""
  });

  const [stats, setStats] = useState({
    totalRecords: 0,
    totalQty: 0
  });

  useEffect(() => {
    loadData();
    loadPOs();
  }, []);

  const loadPOs = async () => {
    try {
      const snapshot = await getDocs(collection(db, "purchaseOrders"));
      const data = snapshot.docs.map((doc) => ({
        id: doc.id,
        po: doc.data().po || ""
      }));
      setPoList(data);
    } catch (error) {
      console.error("Error loading POs:", error);
    }
  };

  const loadData = async () => {
    try {
      setLoading(true);
      const snapshot = await getDocs(collection(db, "embroiderySent"));
      const data = snapshot.docs.map((doc) => {
        const docData = doc.data();
        const firstItem = docData.tableItems && docData.tableItems.length > 0 ? docData.tableItems[0] : {};
        return {
          id: doc.id,
          poNumber: docData.poNumber || "-",
          style: firstItem.style || "-",
          color: firstItem.color || "-",
          colorName: firstItem.colorName || "-",
          quantity: firstItem.quantity || "-",
          status: firstItem.status || "-",
          date: firstItem.date || docData.date || "-",
          createdAt: docData.createdAt || null
        };
      });
      setData(data);
      setFilteredData(data);
      calculateStats(data);
    } catch (error) {
      console.error("Error loading data:", error);
      toast.error("Failed to load embroidery data");
    } finally {
      setLoading(false);
    }
  };

  const calculateStats = (data) => {
    setStats({
      totalRecords: data.length,
      totalQty: data.reduce((sum, item) => sum + Number(item.quantity || 0), 0)
    });
  };

  const applyFilters = () => {
    let filtered = [...data];

    if (filters.fromDate) {
      const from = new Date(filters.fromDate);
      filtered = filtered.filter((item) => {
        if (!item.createdAt) return false;
        const date = item.createdAt.toDate ? item.createdAt.toDate() : new Date(item.createdAt);
        return date >= from;
      });
    }

    if (filters.toDate) {
      const to = new Date(filters.toDate);
      to.setHours(23, 59, 59);
      filtered = filtered.filter((item) => {
        if (!item.createdAt) return false;
        const date = item.createdAt.toDate ? item.createdAt.toDate() : new Date(item.createdAt);
        return date <= to;
      });
    }

    if (filters.poNumber) {
      filtered = filtered.filter((item) => item.poNumber === filters.poNumber);
    }

    if (filters.status) {
      filtered = filtered.filter((item) => item.status === filters.status);
    }

    if (filters.search) {
      const searchTerm = filters.search.toLowerCase();
      filtered = filtered.filter((item) =>
        item.poNumber?.toLowerCase().includes(searchTerm) ||
        item.style?.toLowerCase().includes(searchTerm) ||
        item.colorName?.toLowerCase().includes(searchTerm)
      );
    }

    setFilteredData(filtered);
    calculateStats(filtered);
  };

  const resetFilters = () => {
    setFilters({ fromDate: "", toDate: "", search: "", poNumber: "", status: "" });
    setFilteredData(data);
    calculateStats(data);
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
        doc.text("Embroidery Report", pageWidth / 2, 20, { align: "center" });

        doc.setFontSize(10);
        let dateText = "All Records";
        if (filters.fromDate || filters.toDate) {
          dateText = `From: ${filters.fromDate || "Start"} To: ${filters.toDate || "End"}`;
        }
        doc.text(dateText, pageWidth / 2, 28, { align: "center" });

        doc.setFontSize(10);
        doc.text(`Total Records: ${stats.totalRecords}`, 14, 38);
        doc.text(`Total Qty: ${stats.totalQty}`, 14, 44);

        const tableData = filteredData.map((item) => [
          item.poNumber,
          item.style,
          item.colorName || item.color,
          item.quantity,
          item.status || "-",
          formatDate(item.date)
        ]);

        autoTable(doc, {
          startY: 50,
          head: [["PO #", "Style", "Color", "Qty", "Status", "Date"]],
          body: tableData,
          theme: "striped",
          headStyles: { fillColor: [13, 110, 253], textColor: [255, 255, 255] },
          styles: { fontSize: 8 }
        });

        doc.save("embroidery_report.pdf");

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
          📊 Embroidery Report
        </h2>
      </div>

      <Card className="shadow-sm border-0 mb-4">
        <Card.Body>
          <Row className="g-3">
            <Col md={3}>
              <Form.Group><Form.Label className="fw-bold small text-muted">From Date</Form.Label><Form.Control type="date" name="fromDate" value={filters.fromDate} onChange={handleFilterChange} /></Form.Group>
            </Col>
            <Col md={3}>
              <Form.Group><Form.Label className="fw-bold small text-muted">To Date</Form.Label><Form.Control type="date" name="toDate" value={filters.toDate} onChange={handleFilterChange} /></Form.Group>
            </Col>
            <Col md={2}>
              <Form.Group><Form.Label className="fw-bold small text-muted">PO #</Form.Label><Form.Select name="poNumber" value={filters.poNumber} onChange={handleFilterChange}>
                <option value="">All POs</option>
                {poList.map((po) => (<option key={po.id} value={po.po}>{po.po}</option>))}
              </Form.Select></Form.Group>
            </Col>
            <Col md={2}>
              <Form.Group><Form.Label className="fw-bold small text-muted">Status</Form.Label><Form.Select name="status" value={filters.status} onChange={handleFilterChange}>
                <option value="">All Status</option>
                <option value="Pending">Pending</option>
                <option value="In Progress">In Progress</option>
                <option value="Completed">Completed</option>
              </Form.Select></Form.Group>
            </Col>
            <Col md={2}>
              <Form.Group><Form.Label className="fw-bold small text-muted">Search</Form.Label><Form.Control type="text" name="search" value={filters.search} onChange={handleFilterChange} placeholder="Search..." /></Form.Group>
            </Col>
            <Col md={2} className="d-flex align-items-end gap-2">
              <Button variant="primary" onClick={applyFilters} className="w-100"><i className="ph ph-funnel me-1" />Apply</Button>
              <Button variant="outline-secondary" onClick={resetFilters} className="w-100"><i className="ph ph-arrow-clockwise me-1" />Reset</Button>
            </Col>
          </Row>
        </Card.Body>
      </Card>

      <Row className="g-3 mb-4">
        <Col md={6}><Card className="border-0 shadow-sm text-center bg-primary text-white"><Card.Body><h6 className="text-white-50">Total Records</h6><h2 className="fw-bold mb-0">{stats.totalRecords}</h2></Card.Body></Card></Col>
        <Col md={6}><Card className="border-0 shadow-sm text-center bg-success text-white"><Card.Body><h6 className="text-white-50">Total Qty</h6><h2 className="fw-bold mb-0">{stats.totalQty}</h2></Card.Body></Card></Col>
      </Row>

      <Card className="shadow-sm border-0">
        <Card.Header className="bg-white d-flex justify-content-between align-items-center py-3">
          <h6 className="fw-bold mb-0"><i className="ph ph-list me-2 text-primary" />Records ({filteredData.length})</h6>
          <Button variant="success" onClick={exportPDF} size="sm"><i className="ph ph-file-pdf me-1" />Export PDF</Button>
        </Card.Header>
        <Card.Body className="p-0">
          {loading ? (
            <div className="text-center py-5"><div className="spinner-border text-primary" /><h5 className="mt-3">Loading...</h5></div>
          ) : (
            <div className="table-responsive">
              <Table hover className="mb-0 align-middle" style={{ fontSize: "0.9rem" }}>
                <thead className="table-light"><tr><th>PO #</th><th>Style</th><th>Color</th><th className="text-center">Qty</th><th>Status</th><th>Date</th><th className="text-center">Action</th></tr></thead>
                <tbody>
                  {filteredData.length > 0 ? (
                    filteredData.map((item) => (
                      <tr key={item.id}>
                        <td>{item.poNumber}</td>
                        <td>{item.style}</td>
                        <td><span className="d-inline-block me-1" style={{ width: "12px", height: "12px", backgroundColor: item.color || "#ddd", borderRadius: "50%" }} />{item.colorName || item.color}</td>
                        <td className="text-center">{item.quantity}</td>
                        <td>{item.status || "-"}</td>
                        <td>{formatDate(item.date)}</td>
                        <td className="text-center">
                          <Button size="sm" variant="outline-primary" onClick={() => navigate(`/embroidery/edit/${item.id}`)}><i className="ph ph-eye" /></Button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr><td colSpan="7" className="text-center py-4 text-muted">No records found</td></tr>
                  )}
                </tbody>
              </Table>
            </div>
          )}
        </Card.Body>
        <Card.Footer className="bg-white py-2">
          <span className="text-muted small">Showing {filteredData.length} record{filteredData.length !== 1 ? "s" : ""}</span>
        </Card.Footer>
      </Card>
    </div>
  );
}