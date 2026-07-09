import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { doc, getDoc } from "firebase/firestore";
import { db } from "config/firebase";

import MainCard from "components/MainCard";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Badge from "react-bootstrap/Badge";

export default function ViewPurchaseOrder() {
    const { id } = useParams();
    const [orders, setOrders] = useState([]);
    const [filteredOrders, setFilteredOrders] = useState([]);
    const [search, setSearch] = useState("");
    const [order, setOrder] = useState(null);

    useEffect(() => {
        const loadOrder = async () => {
            console.log("ID:", id);

            const snap = await getDoc(doc(db, "purchaseOrders", id));

            console.log("Exists:", snap.exists());

            if (snap.exists()) {
                console.log(snap.data());
                setOrder(snap.data());
            } else {
                console.log("Document not found");
            }
        };

        loadOrder();
    }, [id]);

    if (!order) return <h3>Loading...</h3>;

    const handleSearch = (e) => {
        const value = e.target.value;

        setSearch(value);

        const filtered = orders.filter((order) =>
            (
                order.client +
                order.po +
                order.pid +
                order.name
            )
                .toLowerCase()
                .includes(value.toLowerCase())
        );

        setFilteredOrders(filtered);
    };

    return (
        <>
            <MainCard title="Purchase Order Details">

                <Row>

                    <Col md={6}>
                        <h6>Client</h6>
                        <p>{order.client || "-"}</p>

                        <h6>PO#</h6>
                        <p>{order.po}</p>

                        <h6>PID</h6>
                        <p>{order.pid}</p>

                        <h6>Name</h6>
                        <p>{order.name}</p>

                        <h6>Description</h6>
                        <p>{order.description || "-"}</p>

                        <h6>Category</h6>
                        <p>{order.category || "-"}</p>

                        <h6>Price</h6>
                        <p>${order.price || 0}</p>

                        <h6>Stock</h6>
                        <p>{order.stock || 0}</p>

                        <h6>Condition</h6>
                        <p>{order.condition || "-"}</p>

                        <h6>Published</h6>

                        <Badge bg={order.published ? "success" : "secondary"}>
                            {order.published ? "Yes" : "No"}
                        </Badge>
                    </Col>

                    <Col md={6}>
                        <h5 className="mb-3">Images</h5>

                        <div className="d-flex flex-wrap">
                            {order.images?.length > 0 ? (
                                order.images.map((img, index) => (
                                    <img
                                        key={index}
                                        src={img}
                                        alt=""
                                        style={{
                                            width: "180px",
                                            height: "180px",
                                            objectFit: "cover",
                                            borderRadius: "10px",
                                            margin: "8px",
                                            border: "1px solid #ddd"
                                        }}
                                    />
                                ))
                            ) : (
                                <p>No Images</p>
                            )}
                        </div>
                    </Col>

                </Row>

            </MainCard>

            <MainCard title="Meta Data" className="mt-4">

                <Row>

                    <Col md={12}>
                        <h6>Meta Title</h6>
                        <p>{order.metaTitle || "-"}</p>

                        <h6>Meta Keywords</h6>
                        <p>{order.metaKeywords || "-"}</p>

                        <h6>Meta Description</h6>
                        <p>{order.metaDescription || "-"}</p>
                    </Col>

                </Row>

            </MainCard>
        </>
    );
}