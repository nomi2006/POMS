import { toast } from "react-toastify";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  addDoc,
  updateDoc,
  collection,
  doc,
  getDoc
} from "firebase/firestore";
import { db } from "config/firebase";
import {
  Card,
  Form,
  Button,
  Row,
  Col,
  Modal
} from "react-bootstrap";
import Swal from "sweetalert2";

const moduleOptions = [
  "Admin",
  "Purchase Order",
  "Procurement",
  "Yarn Purchase",
  "Accessories Purchase",
//   "Dying & Knitting",
  "Knitting",
  "Dying",
  "Embroidery",
  "QC",
  "Packing",
  "Client",
//   "Settings",
  "Management"
];

export default function AddUserRole() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [loading, setLoading] = useState(false);
//   const [showSuccessModal, setShowSuccessModal] = useState(false);
//   const [savedRole, setSavedRole] = useState(null);
  const [formData, setFormData] = useState({
    roleId: "",
    roleName: "",
    status: "Active"
  });

  useEffect(() => {
    if (id) {
      loadRole();
    }
  }, [id]);

  const loadRole = async () => {
    try {
      const docRef = doc(db, "userRoles", id);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setFormData(docSnap.data());
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to load role");
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

    if (!formData.roleName) {
      toast.error("Please select role name");
      return;
    }
    try {
      setLoading(true);
      const roleId = `ROLE-${Date.now()}`;
      const data = {
        ...formData,
        roleId: roleId,
        updatedAt: new Date().toISOString()
      };
      let savedData;
if (id) {
  await updateDoc(doc(db, "userRoles", id), data);
  await Swal.fire({
    icon: "success",
    title: "Role Updated!",
    text: "User role has been updated successfully.",
    confirmButtonColor: "#0d6efd",
    timer: 2000,
    showConfirmButton: false
  });
  navigate("/user-role");
} else {
  const docRef = await addDoc(collection(db, "userRoles"), {
    ...data,
    createdAt: new Date().toISOString()
  });
await Swal.fire({
  icon: "success",
  title: "Role Saved!",
  text: "Your new role has been created successfully.",
  showClass: {
    popup: "animate__animated animate__zoomIn"
  },
  hideClass: {
    popup: "animate__animated animate__zoomOut"
  }
});
  navigate("/user-role");
}
      setSavedRole(savedData);
      setShowSuccessModal(true);
    } catch (error) {
      console.error("❌ Error saving:", error);
      toast.error("Failed to save: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleModalClose = () => {
    setShowSuccessModal(false);
    navigate("/user-role");
  };

  return (
    <>
      <div className="container-fluid p-4">
        <div className="text-center py-4 border-bottom mb-4">
          <h2 className="fw-bold text-uppercase mb-0" style={{ letterSpacing: "2px", fontSize: "2rem" }}>
            {id ? "EDIT" : "ADD"} USER ROLE
          </h2>
        </div>

        <Row className="justify-content-center">
          <Col lg={8}>
            <Card className="shadow-sm border-0">
              <Card.Body className="p-4">
                <Form onSubmit={handleSubmit}>
                  {/* ID - Auto Generated */}
                  <Form.Group className="mb-3">
                    <Form.Label className="fw-bold">ID</Form.Label>
                    <Form.Control
                      type="text"
                      value={`ROLE-${Date.now()}`}
                      disabled
                      className="bg-light"
                    />
                    <Form.Text className="text-muted">Auto-generated ID</Form.Text>
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Form.Label className="fw-bold">Role Name <span className="text-danger">*</span></Form.Label>
                    <Form.Select
                      name="roleName"
                      value={formData.roleName}
                      onChange={handleChange}
                      required
                    >
                      <option value="">Select Role</option>
                      {moduleOptions.map((role) => (
                        <option key={role} value={role}>{role}</option>
                      ))}
                    </Form.Select>
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Form.Label className="fw-bold">Status <span className="text-danger">*</span></Form.Label>
                    <Form.Select
                      name="status"
                      value={formData.status}
                      onChange={handleChange}
                      required
                    >
                      <option value="Active">Active</option>
                      <option value="De-Active">De-Active</option>
                    </Form.Select>
                  </Form.Group>

                  <div className="d-flex gap-2 mt-4">
                    <Button type="submit" variant="primary" disabled={loading}>
                      {loading ? "Saving..." : (id ? "Update Role" : "Save Role")}
                    </Button>
                    <Button type="button" variant="secondary" onClick={() => navigate("/user-role")}>
                      Cancel
                    </Button>
                  </div>
                </Form>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </div>
    </>
  );
}