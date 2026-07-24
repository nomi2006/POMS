import { toast } from "react-toastify";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  addDoc,
  updateDoc,
  collection,
  doc,
  getDoc,
  getDocs
} from "firebase/firestore";
import { db } from "config/firebase";
import {
  Card,
  Form,
  Button,
  Row,
  Col,
  Badge,
  Dropdown
} from "react-bootstrap";
import Swal from "sweetalert2";

const moduleOptions = [
  "Admin",
  "Purchase Order",
  "Procurement",
  "Yarn Purchase",
  "Accessories Purchase",
  "Knitting",
  "Dying",
  "Embroidery",
  "QC",
  "Packing",
  "Client",
  "Management"
];

export default function AddUserRole() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [loading, setLoading] = useState(false);
  const [existingRoles, setExistingRoles] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [formData, setFormData] = useState({
    roleId: "",
    roleName: "",
    status: "Active"
  });

  useEffect(() => {
    loadExistingRoles();
    if (id) {
      loadRole();
    }
  }, [id]);

  const loadExistingRoles = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, "userRoles"));
      const data = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data()
      }));
      setExistingRoles(data);
    } catch (error) {
      console.error("Error loading existing roles:", error);
    }
  };

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

  const resetForm = () => {
    setFormData({
      roleId: "",
      roleName: "",
      status: "Active"
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.roleName) {
      toast.error("Please enter role name");
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
          confirmButtonColor: "#0d6efd",
          timer: 2000,
          showConfirmButton: false
        });
        resetForm();
        navigate("/user-role");
      }
    } catch (error) {
      console.error("❌ Error saving:", error);
      toast.error("Failed to save: " + error.message);
    } finally {
      setLoading(false);
    }
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
                  {/* ✅ ROLE NAME - Manual Input */}
                  <Form.Group className="mb-3">
                    <Form.Label className="fw-bold">Role Name <span className="text-danger">*</span></Form.Label>
                    <Form.Control
                      type="text"
                      name="roleName"
                      value={formData.roleName}
                      onChange={handleChange}
                      placeholder="Enter role name (e.g., Admin, Manager, etc.)"
                      required
                      style={{ borderRadius: "8px", padding: "12px" }}
                    />
                    <Form.Text className="text-muted">
                      Enter a role name. This will appear in Add User (Manual) dropdown.
                    </Form.Text>
                  </Form.Group>

                  {/* ✅ EXISTING ROLES - Dropdown */}
                  <Form.Group className="mb-3">
                    <Form.Label className="fw-bold">Existing Roles</Form.Label>
                    <Dropdown 
                      show={showDropdown} 
                      onToggle={() => setShowDropdown(!showDropdown)}
                      className="w-100"
                    >
                      <Dropdown.Toggle 
                        variant="light" 
                        className="w-100 text-start d-flex justify-content-between align-items-center"
                        style={{ 
                          borderRadius: "8px", 
                          padding: "12px",
                          border: "1px solid #ced4da",
                          backgroundColor: "#fff"
                        }}
                      >
                        <span className="text-muted">
                          {existingRoles.length > 0 ? `${existingRoles.length} roles available` : "No roles found"}
                        </span>
                        <i className="ph ph-caret-down"></i>
                      </Dropdown.Toggle>

                      <Dropdown.Menu className="w-100 p-0" style={{ maxHeight: "250px", overflowY: "auto" }}>
                        {existingRoles.length > 0 ? (
                          existingRoles.map((role, index) => (
                            <Dropdown.Item
                              key={index}
                              className="d-flex justify-content-between align-items-center px-3 py-2"
                              style={{
                                borderBottom: index < existingRoles.length - 1 ? "1px solid #f0f0f0" : "none"
                              }}
                            >
                              <span>
                                <i 
                                  className="ph ph-check-circle me-2" 
                                  style={{ 
                                    color: role.status === "Active" ? "#28a745" : "#6c757d",
                                    fontSize: "16px"
                                  }}
                                />
                                {role.roleName}
                              </span>
                              <Badge 
                                bg={role.status === "Active" ? "success" : "secondary"}
                                style={{ fontSize: "0.7rem", padding: "4px 10px", borderRadius: "12px" }}
                              >
                                {role.status || "Active"}
                              </Badge>
                            </Dropdown.Item>
                          ))
                        ) : (
                          <Dropdown.Item className="text-center text-muted py-3">
                            No roles found
                          </Dropdown.Item>
                        )}
                      </Dropdown.Menu>
                    </Dropdown>
                    <Form.Text className="text-muted">
                      Click to view all existing roles with their status.
                    </Form.Text>
                  </Form.Group>

                  {/* ✅ STATUS */}
                  <Form.Group className="mb-3">
                    <Form.Label className="fw-bold">Status <span className="text-danger">*</span></Form.Label>
                    <Form.Select
                      name="status"
                      value={formData.status}
                      onChange={handleChange}
                      required
                      style={{ borderRadius: "8px", padding: "12px" }}
                    >
                      <option value="Active">Active</option>
                      <option value="De-Active">De-Active</option>
                    </Form.Select>
                  </Form.Group>

                  <div className="d-flex gap-2 mt-4">
                    <Button 
                      type="submit" 
                      variant="primary" 
                      disabled={loading}
                      style={{ borderRadius: "10px", padding: "10px 30px" }}
                    >
                      {loading ? "Saving..." : (id ? "Update Role" : "Save Role")}
                    </Button>
                    <Button 
                      type="button" 
                      variant="secondary" 
                      onClick={() => {
                        resetForm();
                        navigate("/user-role");
                      }}
                      style={{ borderRadius: "10px", padding: "10px 30px" }}
                    >
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