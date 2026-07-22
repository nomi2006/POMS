import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getAuth, sendPasswordResetEmail, deleteUser } from "firebase/auth";
import { auth, db } from "config/firebase";
import { doc, updateDoc, deleteDoc, collection, getDocs } from "firebase/firestore";
import { toast } from "react-toastify";
import {
  Card,
  Table,
  Button,
  Badge,
  Form,
  Modal
} from "react-bootstrap";
import Swal from "sweetalert2";

export default function UsersList() {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showChangePasswordModal, setShowChangePasswordModal] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [editData, setEditData] = useState({
    displayName: "",
    email: "",
    role: "",
    status: "Active"
  });
  const [roles, setRoles] = useState([]);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const currentUser = auth.currentUser;

  useEffect(() => {
    loadUsers();
    loadRoles();
  }, []);

  const loadRoles = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, "userRoles"));
      const data = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data()
      }));
      setRoles(data);
    } catch (error) {
      console.error("Error loading roles:", error);
    }
  };

  const loadUsers = async () => {
    try {
      setLoading(true);
      const querySnapshot = await getDocs(collection(db, "users"));
      const usersData = querySnapshot.docs.map((doc) => ({
        uid: doc.id,
        ...doc.data()
      }));
      setUsers(usersData);
      setFiltered(usersData);
    } catch (error) {
      console.error("Error loading users:", error);
      toast.error("Failed to load users");
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    const value = e.target.value.toLowerCase();
    setSearch(value);
    const filteredData = users.filter((item) =>
      item.email?.toLowerCase().includes(value) ||
      item.firstName?.toLowerCase().includes(value) ||
      item.lastName?.toLowerCase().includes(value) ||
      item.role?.toLowerCase().includes(value) ||
      item.uid?.toLowerCase().includes(value)
    );
    setFiltered(filteredData);
  };

  // ✅ DELETE USER - Fixed
  const handleDelete = async (user) => {
    const result = await Swal.fire({
      title: "Delete User?",
      text: `Are you sure you want to delete ${user.email}? This action cannot be undone.`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#dc3545",
      cancelButtonColor: "#6c757d",
      confirmButtonText: "Delete",
      cancelButtonText: "Cancel"
    });

    if (!result.isConfirmed) return;

    try {
      await deleteDoc(doc(db, "users", user.uid));
      toast.success("User deleted successfully!");
      loadUsers();
    } catch (error) {
      console.error("Delete error:", error);
      toast.error("Failed to delete user");
    }
  };

  // ✅ CHANGE PASSWORD
  const handleChangePasswordClick = (user) => {
    setEditingUser(user);
    setNewPassword("");
    setConfirmPassword("");
    setShowChangePasswordModal(true);
  };

  const handleChangePasswordSave = async () => {
    if (newPassword.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }

    if (newPassword !== confirmPassword) {
      toast.error("Passwords do not match!");
      return;
    }

    try {
      await sendPasswordResetEmail(auth, editingUser.email);
      
      await Swal.fire({
        icon: "success",
        title: "Password Reset Email Sent!",
        text: `A password reset link has been sent to ${editingUser.email}. The user can set a new password using the link.`,
        confirmButtonColor: "#0d6efd",
        confirmButtonText: "Done"
      });
      
      setShowChangePasswordModal(false);
      toast.success("Password reset email sent successfully!");
    } catch (error) {
      console.error("Change password error:", error);
      toast.error("Failed to send password reset email");
    }
  };

  // ✅ EDIT USER
  const handleEditClick = (user) => {
    setEditingUser(user);
    setEditData({
      displayName: `${user.firstName || ""} ${user.lastName || ""}`.trim(),
      email: user.email || "",
      role: user.role || "",
      status: user.status || "Active"
    });
    setShowEditModal(true);
  };

  const handleEditSave = async () => {
    try {
      const nameParts = editData.displayName.split(" ");
      const firstName = nameParts[0] || "";
      const lastName = nameParts.slice(1).join(" ") || "";

      await updateDoc(doc(db, "users", editingUser.uid), {
        firstName: firstName,
        lastName: lastName,
        role: editData.role,
        status: editData.status
      });

      toast.success("User updated successfully!");
      setShowEditModal(false);
      loadUsers();
    } catch (error) {
      console.error("Update error:", error);
      toast.error("Failed to update user");
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "-";
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric"
      });
    } catch {
      return "-";
    }
  };

  return (
    <div className="container-fluid p-4">
      <Card className="shadow-sm border-0">
        <Card.Header className="bg-white border-0 d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3 py-3">
          <h4 className="fw-bold mb-0">Users List</h4>
          <div className="d-flex gap-2 w-100 w-md-auto">
            <Form.Control
              type="text"
              placeholder="Search by email, name, role, UID..."
              value={search}
              onChange={handleSearch}
              className="border-1"
              style={{ minWidth: "250px", borderRadius: "8px" }}
            />
            <Button
              variant="primary"
              onClick={() => navigate("/add-user-manual")}
              className="px-3"
              style={{ whiteSpace: "nowrap" }}
            >
              + Add User
            </Button>
          </div>
        </Card.Header>
        <Card.Body className="p-0">
          {loading ? (
            <div className="text-center py-5">
              <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
              <h5 className="mt-3 text-muted">Loading Users...</h5>
            </div>
          ) : (
            <div className="table-responsive">
              <Table hover className="mb-0 align-middle" style={{ fontSize: "0.9rem" }}>
                <thead className="table-light">
                  <tr>
                    <th className="text-center">#</th>
                    <th className="text-center">Email</th>
                    <th className="text-center">Role</th>
                    <th className="text-center">Status</th>
                    <th className="text-center">Created</th>
                    <th className="text-center">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.length > 0 ? (
                    filtered.map((user, index) => (
                      <tr key={user.uid}>
                        <td className="text-center">{index + 1}</td>
                        <td className="text-center">{user.email || "-"}</td>
                        <td className="text-center">
                          <Badge bg="info" className="fw-normal">
                            {user.role || "No Role"}
                          </Badge>
                        </td>
                        <td className="text-center">
                          <Badge
                            bg={
                              currentUser && currentUser.uid === user.uid ? "success" : "secondary"
                            }
                          >
                            {currentUser && currentUser.uid === user.uid ? "Login" : "Logout"}
                          </Badge>
                        </td>
                        <td className="text-center" style={{ fontSize: "0.8rem" }}>
                          {formatDate(user.createdAt)}
                        </td>
                        <td className="text-center">
                          <div className="d-flex gap-1 justify-content-center flex-wrap">
                            <Button
                              size="sm"
                              variant="outline-primary"
                              onClick={() => handleEditClick(user)}
                              title="Edit User"
                            >
                              <i className="ph ph-pencil" />
                            </Button>
                            <Button
                              size="sm"
                              variant="outline-info"
                              onClick={() => handleChangePasswordClick(user)}
                              title="Change Password"
                            >
                              <i className="ph ph-key" />
                            </Button>
                            <Button
                              size="sm"
                              variant="outline-danger"
                              onClick={() => handleDelete(user)}
                              title="Delete User"
                            >
                              <i className="ph ph-trash" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="6" className="text-center py-4 text-muted">
                        No users found.
                        <Button variant="link" onClick={() => navigate("/add-user-manual")}>
                          Add one now
                        </Button>
                      </td>
                    </tr>
                  )}
                </tbody>
              </Table>
            </div>
          )}
        </Card.Body>
        <Card.Footer className="bg-white border-0 py-2">
          <div className="text-muted small">
            Total: {filtered.length} user{filtered.length !== 1 ? "s" : ""}
          </div>
        </Card.Footer>
      </Card>

      {/* ✅ EDIT MODAL */}
      <Modal show={showEditModal} onHide={() => setShowEditModal(false)} centered>
        <Modal.Header closeButton style={{ borderBottom: "none" }}>
          <Modal.Title>
            <i className="ph ph-pencil me-2 text-primary" />
            Edit User
          </Modal.Title>
        </Modal.Header>
        <Modal.Body style={{ padding: "20px 24px" }}>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label className="fw-bold">Display Name</Form.Label>
              <Form.Control
                type="text"
                value={editData.displayName}
                onChange={(e) => setEditData({ ...editData, displayName: e.target.value })}
                placeholder="Enter display name"
                style={{ borderRadius: "8px" }}
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label className="fw-bold">Email</Form.Label>
              <Form.Control
                type="email"
                value={editData.email}
                disabled
                className="bg-light"
                style={{ borderRadius: "8px" }}
              />
              <Form.Text className="text-muted">Email cannot be changed</Form.Text>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label className="fw-bold">Role</Form.Label>
              <Form.Select
                value={editData.role}
                onChange={(e) => setEditData({ ...editData, role: e.target.value })}
                style={{ borderRadius: "8px" }}
              >
                <option value="">Select Role</option>
                {roles.map((role) => (
                  <option key={role.id} value={role.roleName}>
                    {role.roleName}
                  </option>
                ))}
              </Form.Select>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label className="fw-bold">Status</Form.Label>
              <Form.Select
                value={editData.status}
                onChange={(e) => setEditData({ ...editData, status: e.target.value })}
                style={{ borderRadius: "8px" }}
              >
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
                <option value="Suspended">Suspended</option>
              </Form.Select>
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer style={{ borderTop: "none" }}>
          <Button variant="secondary" onClick={() => setShowEditModal(false)}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleEditSave}>
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>

      {/* ✅ CHANGE PASSWORD MODAL */}
      <Modal show={showChangePasswordModal} onHide={() => setShowChangePasswordModal(false)} centered>
        <Modal.Header closeButton style={{ borderBottom: "none" }}>
          <Modal.Title>
            <i className="ph ph-key me-2 text-warning" />
            Change Password
          </Modal.Title>
        </Modal.Header>
        <Modal.Body style={{ padding: "20px 24px" }}>
          <p className="text-muted mb-3">
            Set new password for <strong>{editingUser?.email}</strong>
          </p>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label className="fw-bold">New Password</Form.Label>
              <Form.Control
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Enter new password"
                style={{ borderRadius: "8px" }}
                required
              />
              <Form.Text className="text-muted">Password must be at least 6 characters</Form.Text>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label className="fw-bold">Confirm Password</Form.Label>
              <Form.Control
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirm new password"
                style={{ borderRadius: "8px" }}
                required
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer style={{ borderTop: "none" }}>
          <Button variant="secondary" onClick={() => setShowChangePasswordModal(false)}>
            Cancel
          </Button>
          <Button variant="warning" onClick={handleChangePasswordSave}>
            <i className="ph ph-save me-2" />
            Save Password
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}