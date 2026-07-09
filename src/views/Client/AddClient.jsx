import { db } from "config/firebase";
import MainCard from "components/MainCard";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import { useState, useEffect } from "react";
import {
    collection,
    addDoc,
    doc,
    getDoc,
    updateDoc
} from "firebase/firestore";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";

export default function AddClient() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [client, setClient] = useState({
        name: "",
        company: "",
        email: "",
        phone: "",
        address: ""
    });

    const handleChange = (e) => {
        setClient({
            ...client,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async () => {
        try {
            if (id) {
                await updateDoc(doc(db, "clients", id), client);

                toast.success("Client Updated Successfully");
            } else {
                await addDoc(collection(db, "clients"), {
                    ...client,
                    createdAt: new Date()
                });

                toast.success("Client Added Successfully");
            }

            navigate("/client/list");
        } catch (error) {
            console.log(error);
            toast.error(error.message);
        }
    };

    useEffect(() => {
        if (!id) return;

        const loadClient = async () => {
            const snap = await getDoc(doc(db, "clients", id));

            if (snap.exists()) {
                setClient(snap.data());
            }
        };

        loadClient();
    }, [id]);

    return (
        <MainCard title="Add Client">
            <Row>
                <Col md={6}>
                    <Form.Group className="mb-3">
                        <Form.Label>Client Name</Form.Label>
                        <Form.Control
                            name="name"
                            value={client.name}
                            onChange={handleChange}
                        />
                    </Form.Group>
                </Col>

                <Col md={6}>
                    <Form.Group className="mb-3">
                        <Form.Label>Company</Form.Label>
                        <Form.Control
                            name="company"
                            value={client.company}
                            onChange={handleChange}
                        />
                    </Form.Group>
                </Col>

                <Col md={6}>
                    <Form.Group className="mb-3">
                        <Form.Label>Email</Form.Label>
                        <Form.Control
                            name="email"
                            value={client.email}
                            onChange={handleChange}
                        />
                    </Form.Group>
                </Col>

                <Col md={6}>
                    <Form.Group className="mb-3">
                        <Form.Label>Phone</Form.Label>
                        <Form.Control
                            name="phone"
                            value={client.phone}
                            onChange={handleChange}
                        />
                    </Form.Group>
                </Col>

                <Col md={12}>
                    <Form.Group className="mb-3">
                        <Form.Label>Address</Form.Label>
                        <Form.Control
                            as="textarea"
                            rows={4}
                            name="address"
                            value={client.address}
                            onChange={handleChange}
                        />
                    </Form.Group>
                </Col>

                <Col md={12}>
                    <Button onClick={handleSubmit}>
                        {id ? "Update Client" : "Save Client"}
                    </Button>
                </Col>
            </Row>
        </MainCard>
    );
}