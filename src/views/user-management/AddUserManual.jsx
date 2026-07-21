import Swal from "sweetalert2";
import { toast } from "react-toastify";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
    addDoc,
    collection,
    getDocs
} from "firebase/firestore";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth, db } from "config/firebase";
import {
    Card,
    Form,
    Button,
    Row,
    Col
} from "react-bootstrap";

export default function AddUserManual() {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [roles, setRoles] = useState([]);
    const [loadingRoles, setLoadingRoles] = useState(true);
    const [formData, setFormData] = useState({
        firstName: "",
        lastName: "",
        email: "",
        password: "",
        confirmPassword: "",
        role: ""
    });

    const defaultRoles = [
        "Admin",
        "Purchase Order",
        "Procurement",
        "Yarn Purchase",
        "Accessories Purchase",
        // "Dying & Knitting",
        "Knitting",
        "Dying",
        "Embroidery",
        "QC",
        "Packing",
        "Client",
        // "Settings",
        "Management"
    ];

    useEffect(() => {
        loadRoles();
    }, []);

    const loadRoles = async () => {
        try {
            setLoadingRoles(true);
            const querySnapshot = await getDocs(collection(db, "userRoles"));
            const firebaseRoles = querySnapshot.docs.map((doc) => doc.data().roleName);
            const allRoles = [...new Set([...defaultRoles, ...firebaseRoles])];
            setRoles(allRoles);
        } catch (error) {
            console.error("❌ Error loading roles:", error);
            setRoles(defaultRoles);
            toast.error("Failed to load roles");
        } finally {
            setLoadingRoles(false);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (formData.password !== formData.confirmPassword) {
            toast.error("Passwords do not match!");
            return;
        }
        if (!formData.role) {
            toast.error("Please select a role");
            return;
        }
        try {
            setLoading(true);
            console.log("Creating user...");
            const userCredential = await createUserWithEmailAndPassword(
                auth,
                formData.email.trim(),
                formData.password
            );
            console.log("Auth user created:", userCredential.user.uid);
            await addDoc(collection(db, "users"), {
                firstName: formData.firstName.trim(),
                lastName: formData.lastName.trim(),
                email: formData.email.trim(),
                role: formData.role,
                uid: userCredential.user.uid,
                createdAt: new Date()
            });
            setFormData({
                firstName: "",
                lastName: "",
                email: "",
                password: "",
                confirmPassword: "",
                role: ""
            });
            console.log("Firestore user saved");
            Swal.fire({
                icon: "success",
                title: "User Added!",
                text: "New user has been added successfully.",
                showClass: {
                    popup: "animate__animated animate__zoomIn"
                },
                hideClass: {
                    popup: "animate__animated animate__zoomOut"
                }
            }).then(() => {
                navigate("/add-user-manual");
            });
        } catch (error) {
            console.error("Save Error:", error);
            if (error.code === "auth/email-already-in-use") {
                toast.error("Email already in use");
            }
            else if (error.code === "auth/weak-password") {
                toast.error("Password should be at least 6 characters");
            }
            else {
                toast.error(error.message);
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container-fluid p-4">
            <div className="text-center py-4 border-bottom mb-4">
                <h2 className="fw-bold text-uppercase mb-0" style={{ letterSpacing: "2px", fontSize: "2rem" }}>
                    ADD USER (MANUAL)
                </h2>
            </div>

            <Row className="justify-content-center">
                <Col lg={8}>
                    <Card className="shadow-sm border-0">
                        <Card.Body className="p-4">
                            <Form onSubmit={handleSubmit}>
                                <Row>
                                    <Col md={6}>
                                        <Form.Group className="mb-3">
                                            <Form.Label className="fw-bold">First Name <span className="text-danger">*</span></Form.Label>
                                            <Form.Control
                                                type="text"
                                                name="firstName"
                                                value={formData.firstName}
                                                onChange={handleChange}
                                                placeholder="Enter First Name"
                                                required
                                            />
                                        </Form.Group>
                                    </Col>
                                    <Col md={6}>
                                        <Form.Group className="mb-3">
                                            <Form.Label className="fw-bold">Last Name <span className="text-danger">*</span></Form.Label>
                                            <Form.Control
                                                type="text"
                                                name="lastName"
                                                value={formData.lastName}
                                                onChange={handleChange}
                                                placeholder="Enter Last Name"
                                                required
                                            />
                                        </Form.Group>
                                    </Col>
                                </Row>

                                <Form.Group className="mb-3">
                                    <Form.Label className="fw-bold">Email <span className="text-danger">*</span></Form.Label>
                                    <Form.Control
                                        type="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        placeholder="Enter Email"
                                        required
                                    />
                                </Form.Group>

                                <Row>
                                    <Col md={6}>
                                        <Form.Group className="mb-3">
                                            <Form.Label className="fw-bold">Password <span className="text-danger">*</span></Form.Label>
                                            <Form.Control
                                                type="password"
                                                name="password"
                                                value={formData.password}
                                                onChange={handleChange}
                                                placeholder="Enter Password"
                                                required
                                            />
                                        </Form.Group>
                                    </Col>
                                    <Col md={6}>
                                        <Form.Group className="mb-3">
                                            <Form.Label className="fw-bold">Confirm Password <span className="text-danger">*</span></Form.Label>
                                            <Form.Control
                                                type="password"
                                                name="confirmPassword"
                                                value={formData.confirmPassword}
                                                onChange={handleChange}
                                                placeholder="Confirm Password"
                                                required
                                            />
                                        </Form.Group>
                                    </Col>
                                </Row>

                                <Form.Group className="mb-3">
                                    <Form.Label className="fw-bold">Role <span className="text-danger">*</span></Form.Label>
                                    <Form.Select
                                        name="role"
                                        value={formData.role}
                                        onChange={handleChange}
                                        required
                                        disabled={loadingRoles}
                                    >
                                        <option value="">{loadingRoles ? "Loading roles..." : "Select Role"}</option>
                                        {roles.map((role) => (
                                            <option key={role} value={role}>
                                                {role}
                                            </option>
                                        ))}
                                    </Form.Select>
                                    {roles.length === 0 && !loadingRoles && (
                                        <Form.Text className="text-warning">
                                            No roles found. Please add a role first.
                                        </Form.Text>
                                    )}
                                </Form.Group>

                                <div className="d-flex gap-2 mt-4">
                                    <Button type="submit" variant="primary" disabled={loading}>
                                        {loading ? "Saving..." : "Add User"}
                                    </Button>
                                    <Button type="button" variant="secondary" onClick={() => navigate("/user-management")}>
                                        Cancel
                                    </Button>
                                </div>
                            </Form>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </div>
    );
}