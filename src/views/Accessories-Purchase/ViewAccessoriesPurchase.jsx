import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { doc, getDoc } from "firebase/firestore";
import { db } from "config/firebase";
import { toast } from "react-toastify";
import {
  Row,
  Col,
  Card,
  Button,
  Table
} from "react-bootstrap";

export default function ViewAccessoriesPurchase() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [purchase, setPurchase] = useState(null);

  useEffect(() => {
    loadAccessoriesPurchase();
  }, [id]);

  const loadAccessoriesPurchase = async () => {
    try {
      const snap = await getDoc(doc(db, "accessoriesPurchases", id));
      if (snap.exists()) {
        setPurchase({
          id: snap.id,
          ...snap.data()
        });
      } else {
        toast.error("Accessories Purchase not found");
        navigate("/accessories-purchase/list");
      }
    } catch (error) {
      console.log(error);
      toast.error("Failed to load Accessories Purchase");
    }
  };

  if (!purchase) {
    return (
      <div className="text-center py-5">
        <h4>Loading Accessories Purchase...</h4>
      </div>
    );
  }

  return (
    <div className="container-fluid p-4">

      {/* HEADER */}
      <Card className="shadow-sm border-0 mb-4">
        <Card.Body className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3">
          <div>
            <h2 className="fw-bold mb-1">Accessories Purchase Details</h2>
            <div className="text-muted">
              PO Number: <strong className="ms-2">{purchase.poNumber || "-"}</strong>
            </div>
          </div>
          <div className="d-flex gap-2">
            <Button variant="secondary" onClick={() => navigate("/accessories-purchase/list")}>
              Back
            </Button>
            <Button variant="primary" onClick={() => navigate(`/accessories-purchase/edit/${purchase.id}`)}>
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
                <Col md={6} className="mb-3">
                  <small className="text-muted">PO Number</small>
                  <h6>{purchase.poNumber || "-"}</h6>
                </Col>
                <Col md={6} className="mb-3">
                  <small className="text-muted">Client</small>
                  <h6>{purchase.clientName || "-"}</h6>
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

      {/* ACCESSORIES ITEMS TABLE */}
      <Card className="shadow-sm mb-4">
        <Card.Header>
          <h5 className="mb-0">Accessories Items</h5>
        </Card.Header>
        <Card.Body className="p-0">
          <div className="table-responsive">
            <Table bordered hover className="mb-0 align-middle">
              <thead className="table-light">
                <tr>
                  <th className="text-center">#</th>
                  <th className="text-center">STYLE</th>
                  <th className="text-center">DESCRIPTION</th>
                  <th className="text-center">QUANTITY</th>
                </tr>
              </thead>
              <tbody>
                {purchase.accessoryItems?.length > 0 ? (
                  purchase.accessoryItems.map((item, index) => (
                    <tr key={index}>
                      <td className="text-center">{index + 1}</td>
                      <td className="text-center">{item.style || "-"}</td>
                      <td className="text-center">{item.description || "-"}</td>
                      <td className="text-center">{item.quantity || "-"}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="4" className="text-center py-4 text-muted">
                      No accessories items found.
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