import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { doc, getDoc } from "firebase/firestore";
import { db } from "config/firebase";

import {
    Row,
    Col,
    Card,
    Button,
    Table
} from "react-bootstrap";

export default function ViewPurchaseOrder() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [order, setOrder] = useState(null);

    useEffect(() => {
        loadPurchaseOrder();
    }, [id]);

    const loadPurchaseOrder = async () => {
        try {
            const snap = await getDoc(doc(db, "purchaseOrders", id));
            if (snap.exists()) {
                setOrder({
                    id: snap.id,
                    ...snap.data()
                });
            }
        } catch (error) {
            console.log(error);
        }
    };
    if (!order) {
        return (
            <div className="text-center py-5">
                <h4>Loading Purchase Order...</h4>
            </div>
        );
    }

    return (
        <div className="container-fluid p-4">

            {/* HEADER */}
            <Card className="shadow-sm border-0 mb-4">
                <Card.Body className="d-flex justify-content-between align-items-center">
                    <div>
                        <h2 className="fw-bold mb-1">
                            Purchase Order
                        </h2>
                        <div className="text-muted">
                            PO Number :
                            <strong className="ms-2">
                                {order.po || "-"}
                            </strong>
                        </div>
                    </div>
                    <div className="d-flex gap-2">
                        <Button
                            variant="secondary"
                            onClick={() => navigate("/purchase-order/list")}
                        >
                            Back
                        </Button>
                        <Button
                            variant="primary"
                            onClick={() =>
                                navigate(`/purchase-order/edit/${order.id}`)
                            }
                        >
                            Edit
                        </Button>
                        <Button
                            variant="success"
                            onClick={() => window.print()}
                        >
                            Print
                        </Button>
                    </div>
                </Card.Body>
            </Card>
            {/* PURCHASE ORDER DETAILS */}
            <Row className="mb-4">
                <Col lg={8}>
                    <Card className="shadow-sm h-100">
                        <Card.Header>
                            <h5 className="mb-0">
                                Purchase Order Details
                            </h5>
                        </Card.Header>
                        <Card.Body>
                            <Row>
                                <Col md={4} className="mb-3">
                                    <small className="text-muted">
                                        PO Number
                                    </small>
                                    <h6>{order.po || "-"}</h6>
                                </Col>
                                <Col md={4} className="mb-3">
                                    <small className="text-muted">
                                        PID
                                    </small>
                                    <h6>{order.pid || "-"}</h6>
                                </Col>
                                <Col md={4} className="mb-3">
                                    <small className="text-muted">
                                        Client
                                    </small>

                                    <h6>{order.clientName || "-"}</h6>
                                </Col>
                                <Col md={4} className="mb-3">
                                    <small className="text-muted">
                                        Stage
                                    </small>
                                    <h6>{order.stage || "-"}</h6>
                                </Col>
                                <Col md={4} className="mb-3">
                                    <small className="text-muted">
                                        Ship Via
                                    </small>
                                    <h6>{order.shipVia || "-"}</h6>
                                </Col>
                                <Col md={4} className="mb-3">
                                    <small className="text-muted">
                                        Ship Date
                                    </small>
                                    <h6>{order.shipDate || "-"}</h6>
                                </Col>
                                <Col md={4} className="mb-3">
                                    <small className="text-muted">
                                        Reference No
                                    </small>
                                    <h6>{order.referenceNo || "-"}</h6>
                                </Col>
                                <Col md={4} className="mb-3">
                                    <small className="text-muted">
                                        Terms
                                    </small>
                                    <h6>{order.terms || "-"}</h6>
                                </Col>
                                <Col md={4} className="mb-3">
                                    <small className="text-muted">
                                        Division
                                    </small>
                                    <h6>{order.division || "-"}</h6>
                                </Col>
                                <Col md={6} className="mb-3">
                                    <small className="text-muted">
                                        Season
                                    </small>
                                    <h6>{order.season || "-"}</h6>
                                </Col>
                                <Col md={6} className="mb-3">
                                    <small className="text-muted">
                                        Last Revised
                                    </small>
                                    <h6>{order.revised || "-"}</h6>
                                </Col>
                            </Row>
                        </Card.Body>
                    </Card>
                </Col>
                <Col lg={4}>
                    <Card className="shadow-sm h-100">
                        <Card.Header>
                            <h5 className="mb-0">
                                Shipping Address
                            </h5>
                        </Card.Header>
                        <Card.Body>
                            <p className="mb-0" style={{ whiteSpace: "pre-line" }}>
                                {order.shipAddress || "-"}
                            </p>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
            {/* PRODUCTS */}
            <Card className="shadow-sm mb-4">
                <Card.Header>
                    <h5 className="mb-0">
                        Products
                    </h5>
                </Card.Header>
                <Card.Body className="p-0">
                    <div className="table-responsive">
                        <Table bordered hover className="mb-0 align-middle">
                            <thead className="table-light">
                                <tr>
                                    <th style={{ width: "90px" }}>
                                        Image
                                    </th>
                                    <th>Style</th>
                                    <th>Ship Date</th>
                                    <th>PPK</th>
                                    <th>12M</th>
                                    <th>18M</th>
                                    <th>24M</th>
                                    <th>Per CTN</th>
                                    <th>Total Units</th>
                                    <th>Cost</th>
                                    <th>Total Cost</th>
                                </tr>
                            </thead>
                            <tbody>
                                {order.products?.length > 0 ? (
                                    order.products.map((item, index) => (
                                        <tr key={index}>
                                            <td className="text-center">
                                                {item.preview || item.image ? (
                                                    <img
                                                        src={item.preview || item.image}
                                                        alt="Product"
                                                        style={{
                                                            width: "70px",
                                                            height: "70px",
                                                            objectFit: "cover",
                                                            borderRadius: "8px",
                                                            border: "1px solid #ddd"
                                                        }}
                                                    />
                                                ) : (
                                                    <div
                                                        style={{
                                                            width: "70px",
                                                            height: "70px",
                                                            border: "1px dashed #ccc",
                                                            display: "flex",
                                                            alignItems: "center",
                                                            justifyContent: "center",
                                                            borderRadius: "8px",
                                                            color: "#888",
                                                            fontSize: "12px"
                                                        }}
                                                    >
                                                        No Image
                                                    </div>
                                                )}
                                            </td>
                                            <td>{item.style || "-"}</td>
                                            <td>{item.shipDate || "-"}</td>
                                            <td>{item.ppk || 0}</td>
                                            <td>{item.size12 || 0}</td>
                                            <td>{item.size18 || 0}</td>
                                            <td>{item.size24 || 0}</td>
                                            <td>{item.perCtn || 0}</td>
                                            <td className="fw-bold">
                                                {item.totalUnits || 0}
                                            </td>
                                            <td>
                                                $
                                                {Number(item.cost || 0).toFixed(2)}
                                            </td>
                                            <td className="fw-bold text-success">
                                                $
                                                {Number(item.totalCost || 0).toFixed(2)}
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td
                                            colSpan={11}
                                            className="text-center py-4"
                                        >
                                            No Products Found
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </Table>
                    </div>
                </Card.Body>
            </Card>
            {/* SUMMARY */}
            <Row className="g-3 mb-4">
                <Col md={4}>
                    <Card className="shadow-sm border-0">
                        <Card.Body className="text-center">
                            <h6 className="text-muted mb-2">
                                Total Products
                            </h6>
                            <h2 className="fw-bold text-primary mb-0">
                                {order.totalProducts || order.products?.length || 0}
                            </h2>
                        </Card.Body>
                    </Card>
                </Col>
                <Col md={4}>
                    <Card className="shadow-sm border-0">
                        <Card.Body className="text-center">
                            <h6 className="text-muted mb-2">
                                Total Units
                            </h6>
                            <h2 className="fw-bold text-warning mb-0">
                                {Number(order.totalUnits || 0).toLocaleString()}
                            </h2>
                        </Card.Body>
                    </Card>
                </Col>
                <Col md={4}>
                    <Card className="shadow-sm border-0">
                        <Card.Body className="text-center">
                            <h6 className="text-muted mb-2">
                                Grand Total
                            </h6>
                            <h2 className="fw-bold text-success mb-0">
                                $
                                {Number(order.grandTotal || 0).toFixed(2)}
                            </h2>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
            {/* REMARKS */}
            <Card className="shadow-sm border-0 mb-4">
                <Card.Header>
                    <h5 className="mb-0">
                        Remarks
                    </h5>
                </Card.Header>
                <Card.Body>
                    {order.remarks ? (
                        <p
                            className="mb-0"
                            style={{ whiteSpace: "pre-line" }}
                        >
                            {order.remarks}
                        </p>
                    ) : (
                        <p className="text-muted mb-0">
                            No remarks available.
                        </p>
                    )}
                </Card.Body>
            </Card>
        </div>
    );
}