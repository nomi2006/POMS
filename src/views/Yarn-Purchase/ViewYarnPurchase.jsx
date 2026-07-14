import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { doc, getDoc } from "firebase/firestore";
import { db } from "config/firebase";
import {
  Row,
  Col,
  Card,
  Button,
  Table,
  Badge
} from "react-bootstrap";

export default function ViewYarnPurchase() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [purchase, setPurchase] = useState(null);

  useEffect(() => {
    loadYarnPurchase();
  }, [id]);

  const loadYarnPurchase = async () => {
    try {
      const snap = await getDoc(doc(db, "yarnPurchases", id));
      if (snap.exists()) {
        setPurchase({
          id: snap.id,
          ...snap.data()
        });
      } else {
        toast.error("Yarn Purchase not found");
        navigate("/yarn-purchase/list");
      }
    } catch (error) {
      console.log(error);
      toast.error("Failed to load Yarn Purchase");
    }
  };

  if (!purchase) {
    return (
      <div className="text-center py-5">
        <h4>Loading Yarn Purchase...</h4>
      </div>
    );
  }

  const getStageBadge = (stage) => {
    const colors = {
      Draft: "secondary",
      Pending: "warning",
      Approved: "info",
      Ordered: "primary",
      Received: "success",
      Completed: "dark"
    };
    return <Badge bg={colors[stage] || "secondary"}>{stage || "Draft"}</Badge>;
  };

  return (
    <div className="container-fluid p-4">

      {/* HEADER */}
      <Card className="shadow-sm border-0 mb-4">
        <Card.Body className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3">
          <div>
            <h2 className="fw-bold mb-1">Yarn Purchase Details</h2>
            <div className="text-muted">
              PO Number: <strong className="ms-2">{purchase.poNumber || "-"}</strong>
            </div>
          </div>
          <div className="d-flex gap-2">
            <Button variant="secondary" onClick={() => navigate("/yarn-purchase/list")}>
              Back
            </Button>
            <Button variant="primary" onClick={() => navigate(`/yarn-purchase/edit/${purchase.id}`)}>
              Edit
            </Button>
            <Button variant="success" onClick={() => window.print()}>
              Print
            </Button>
          </div>
        </Card.Body>
      </Card>

      {/* DETAILS */}
      <Row className="mb-4">
        <Col lg={8}>
          <Card className="shadow-sm h-100">
            <Card.Header>
              <h5 className="mb-0">Purchase Order Details</h5>
            </Card.Header>
            <Card.Body>
              <Row>
                <Col md={4} className="mb-3">
                  <small className="text-muted">PO Number</small>
                  <h6>{purchase.poNumber || "-"}</h6>
                </Col>
                <Col md={4} className="mb-3">
                  <small className="text-muted">Client</small>
                  <h6>{purchase.clientName || "-"}</h6>
                </Col>
                {/* <Col md={4} className="mb-3">
                  <small className="text-muted">Style</small>
                  <h6>{purchase.style || "-"}</h6>
                </Col> */}
                {/* <Col md={4} className="mb-3">
                  <small className="text-muted">Order Date</small>
                  <h6>{purchase.orderDate || "-"}</h6>
                </Col>
                <Col md={4} className="mb-3">
                  <small className="text-muted">Delivery Date</small>
                  <h6>{purchase.deliveryDate || "-"}</h6>
                </Col> */}
                {/* <Col md={4} className="mb-3">
                  <small className="text-muted">Mill Name</small>
                  <h6>{purchase.millName || "-"}</h6>
                </Col>
                <Col md={4} className="mb-3">
                  <small className="text-muted">Yarn Type</small>
                  <h6>{purchase.yarnType || "-"}</h6>
                </Col> */}
                <Col md={4} className="mb-3">
                  <small className="text-muted">Currency</small>
                  <h6>{purchase.currency || "USD"}</h6>
                </Col>
                <Col md={4} className="mb-3">
                  <small className="text-muted">Stage</small>
                  <h6>{getStageBadge(purchase.stage)}</h6>
                </Col>
              </Row>
            </Card.Body>
          </Card>
        </Col>
        <Col lg={4}>
          <Card className="shadow-sm h-100">
            <Card.Header>
              <h5 className="mb-0">Summary</h5>
            </Card.Header>
            <Card.Body>
              <div className="mb-3">
                <small className="text-muted">Total Items</small>
                <h3 className="fw-bold text-primary">{purchase.totalItems || 0}</h3>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* YARN ITEMS TABLE - UPDATED WITH NEW FIELDS */}
      <Card className="shadow-sm mb-4">
        <Card.Header>
          <h5 className="mb-0">Yarn Items</h5>
        </Card.Header>
        <Card.Body className="p-0">
          <div className="table-responsive">
            <Table bordered hover className="mb-0 align-middle">
              <thead className="table-light">
                <tr>
                  <th className="text-center">#</th>
                  <th className="text-center">STYLE</th>
                  <th className="text-center">YARN COUNT</th>
                  <th className="text-center">FABRIC REQUIRED</th>
                  <th className="text-center">YARN BASE</th>
                  <th className="text-center">TOP FABRIC</th>
                  <th className="text-center">BOTTOM FABRIC</th>
                </tr>
              </thead>
              <tbody>
                {purchase.yarnItems?.length > 0 ? (
                  purchase.yarnItems.map((item, index) => (
                    <tr key={index}>
                      <td className="text-center">{index + 1}</td>
                      <td className="text-center">{item.style || "-"}</td>
                      <td className="text-center">{item.yarnCount || "-"}</td>
                      <td className="text-center">{item.fabricRequired || "-"}</td>
                      <td className="text-center">{item.yarnBase || "-"}</td>
                      <td className="text-center">{item.topFabric || "-"}</td>
                      <td className="text-center">{item.bottomFabric || "-"}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="7" className="text-center py-4 text-muted">
                      No yarn items found.
                    </td>
                  </tr>
                )}
              </tbody>
            </Table>
          </div>
        </Card.Body>
      </Card>
    </div>
  );
}