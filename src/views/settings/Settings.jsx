import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { doc, getDoc, updateDoc, collection, getDocs } from "firebase/firestore";
import { db } from "config/firebase";
import { toast } from "react-toastify";
import { Card, Row, Col, Button, Form, Modal } from "react-bootstrap";

export default function Settings() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState({ firstName: "", lastName: "" });
  const [editRole, setEditRole] = useState("");
  const [editStatus, setEditStatus] = useState("");
  const [profilePic, setProfilePic] = useState(null);
  const [roles, setRoles] = useState([]);
  
  // ✅ Popup States
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [updatedData, setUpdatedData] = useState(null);

  const auth = getAuth();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        await loadUserData(currentUser.uid);
        await loadRoles();
      } else {
        navigate("/login");
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const loadUserData = async (uid) => {
    try {
      const docRef = doc(db, "users", uid);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        const data = docSnap.data();
        setUserData(data);
        setEditName({ firstName: data.firstName || "", lastName: data.lastName || "" });
        setEditRole(data.role || "");
        setEditStatus(data.status || "Active");
        if (data.profilePic) {
          setProfilePic(data.profilePic);
        }
      }
    } catch (error) {
      console.error("Error loading user data:", error);
    }
  };

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

  const handleUpdateProfile = async () => {
    if (!editName.firstName && !editName.lastName) {
      toast.error("Please enter name");
      return;
    }

    try {
      const userRef = doc(db, "users", user.uid);
      
      const updatedFields = {
        firstName: editName.firstName,
        lastName: editName.lastName,
        role: editRole,
        status: editStatus,
        updatedAt: new Date().toISOString()
      };

      await updateDoc(userRef, updatedFields);
      
      const newUserData = {
        ...userData,
        ...updatedFields
      };
      setUserData(newUserData);
      
      setIsEditing(false);
      
      // ✅ Show Success Popup
      setUpdatedData({
        firstName: editName.firstName,
        lastName: editName.lastName,
        role: editRole || "Not assigned",
        status: editStatus
      });
      setShowSuccessModal(true);
      
      toast.success("✅ Profile updated successfully!");
      
    } catch (error) {
      console.error("Update error:", error);
      toast.error("❌ Failed to update profile");
    }
  };

  const handleModalClose = () => {
    setShowSuccessModal(false);
  };

  if (loading) {
    return (
      <div className="text-center py-5">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
        <h5 className="mt-3 text-muted">Loading Profile...</h5>
      </div>
    );
  }

  const avatarText = userData?.firstName?.charAt(0) || user?.email?.charAt(0) || "U";

  return (
    <>
      <div className="container-fluid p-4" style={{ backgroundColor: "#f8f9fc" }}>
        <Row>
          <Col lg={10} className="mx-auto">
            {/* Header Section */}
            <div className="d-flex align-items-center justify-content-between mb-4">
              <div>
                <h4 className="fw-bold mb-1" style={{ fontSize: "1.5rem", color: "#1a1a2e" }}>
                  <i className="ph ph-user-circle me-2 text-primary" />
                  Profile Settings
                </h4>
                <p className="text-muted mb-0" style={{ fontSize: "0.9rem" }}>
                  Manage your account settings and preferences
                </p>
              </div>
              <div className="d-flex gap-2">
                <Button
                  variant="outline-secondary"
                  size="sm"
                  onClick={() => window.location.reload()}
                  style={{ borderRadius: "10px" }}
                >
                  <i className="ph ph-arrow-clockwise me-1" />
                  Refresh
                </Button>
              </div>
            </div>

            {/* Profile Card */}
            <Card className="shadow-sm border-0 overflow-hidden" style={{ borderRadius: "16px" }}>
              {/* Gradient Header with Profile Picture */}
              <div
                style={{
                  background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                  padding: "40px 30px 30px 30px"
                }}
              >
                <div className="d-flex align-items-center gap-4">
                  {profilePic ? (
                    <img
                      src={profilePic}
                      alt="Profile"
                      style={{
                        width: "80px",
                        height: "80px",
                        borderRadius: "50%",
                        objectFit: "cover",
                        border: "4px solid white",
                        boxShadow: "0 8px 30px rgba(0,0,0,0.2)",
                        flexShrink: 0
                      }}
                    />
                  ) : (
                    <div
                      style={{
                        width: "80px",
                        height: "80px",
                        borderRadius: "50%",
                        backgroundColor: "white",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: "32px",
                        fontWeight: "700",
                        color: "#667eea",
                        boxShadow: "0 8px 30px rgba(0,0,0,0.2)",
                        flexShrink: 0
                      }}
                    >
                      {avatarText}
                    </div>
                  )}

                  <div>
                    <h4 className="text-white mb-1" style={{ fontWeight: "600" }}>
                      {userData?.firstName} {userData?.lastName || ""}
                    </h4>
                    <p className="text-white text-opacity-75 mb-1" style={{ fontSize: "0.9rem" }}>
                      <i className="ph ph-envelope me-2" />
                      {user?.email}
                    </p>
                    <span
                      style={{
                        display: "inline-block",
                        padding: "2px 14px",
                        fontSize: "12px",
                        fontWeight: "600",
                        color: "#fff",
                        background: "rgba(255,255,255,0.2)",
                        borderRadius: "20px"
                      }}
                    >
                      ● {userData?.status || "Active"}
                    </span>
                  </div>
                </div>
              </div>

              {/* Body Section */}
              <Card.Body className="p-4" style={{ backgroundColor: "#ffffff" }}>
                <Row className="g-4">
                  {/* Left Column - Account Details */}
                  <Col md={12}>
                    <h6
                      className="fw-bold text-uppercase text-muted mb-3"
                      style={{ fontSize: "0.7rem", letterSpacing: "1px" }}
                    >
                      Account Details
                    </h6>

                    {/* First Name */}
                    <div className="p-3 rounded-3 mb-3" style={{ backgroundColor: "#f8f9fc" }}>
                      <div className="row">
                        <div className="col-sm-3">
                          <p className="text-muted small mb-0">First Name</p>
                        </div>
                        <div className="col-sm-9">
                          {isEditing ? (
                            <Form.Control
                              type="text"
                              value={editName.firstName}
                              onChange={(e) => setEditName({ ...editName, firstName: e.target.value })}
                              style={{ borderRadius: "8px" }}
                            />
                          ) : (
                            <p className="fw-semibold mb-0">{userData?.firstName || "-"}</p>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Last Name */}
                    <div className="p-3 rounded-3 mb-3" style={{ backgroundColor: "#f8f9fc" }}>
                      <div className="row">
                        <div className="col-sm-3">
                          <p className="text-muted small mb-0">Last Name</p>
                        </div>
                        <div className="col-sm-9">
                          {isEditing ? (
                            <Form.Control
                              type="text"
                              value={editName.lastName}
                              onChange={(e) => setEditName({ ...editName, lastName: e.target.value })}
                              style={{ borderRadius: "8px" }}
                            />
                          ) : (
                            <p className="fw-semibold mb-0">{userData?.lastName || "-"}</p>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Email */}
                    <div className="p-3 rounded-3 mb-3" style={{ backgroundColor: "#f8f9fc" }}>
                      <div className="row">
                        <div className="col-sm-3">
                          <p className="text-muted small mb-0">Email Address</p>
                        </div>
                        <div className="col-sm-9">
                          <p className="fw-semibold mb-0" style={{ wordBreak: "break-all" }}>
                            {user?.email || "-"}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Role - Text Input */}
                    <div className="p-3 rounded-3 mb-3" style={{ backgroundColor: "#f8f9fc" }}>
                      <div className="row">
                        <div className="col-sm-3">
                          <p className="text-muted small mb-0">Role</p>
                        </div>
                        <div className="col-sm-9">
                          {isEditing ? (
                            <Form.Control
                              type="text"
                              value={editRole}
                              onChange={(e) => setEditRole(e.target.value)}
                              placeholder="Enter role"
                              style={{ borderRadius: "8px" }}
                            />
                          ) : (
                            <p className="fw-semibold mb-0">{userData?.role || "-"}</p>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Account Status */}
                    <div className="p-3 rounded-3 mb-3" style={{ backgroundColor: "#f8f9fc" }}>
                      <div className="row">
                        <div className="col-sm-3">
                          <p className="text-muted small mb-0">Account Status</p>
                        </div>
                        <div className="col-sm-9">
                          {isEditing ? (
                            <Form.Select
                              value={editStatus}
                              onChange={(e) => setEditStatus(e.target.value)}
                              style={{ borderRadius: "8px" }}
                            >
                              <option value="Active">Active</option>
                              <option value="Inactive">Inactive</option>
                              <option value="Suspended">Suspended</option>
                            </Form.Select>
                          ) : (
                            <p className="fw-semibold mb-0 text-success">
                              <i className="ph ph-check-circle me-1" />
                              {userData?.status || "Active"}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Member Since */}
                    <div className="p-3 rounded-3" style={{ backgroundColor: "#f8f9fc" }}>
                      <div className="row">
                        <div className="col-sm-3">
                          <p className="text-muted small mb-0">Member Since</p>
                        </div>
                        <div className="col-sm-9">
                          <p className="fw-semibold mb-0">
                            {userData?.createdAt ? new Date(userData.createdAt).toLocaleDateString() : "-"}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Edit Buttons */}
                    <div className="mt-4 d-flex gap-2">
                      {isEditing ? (
                        <>
                          <Button
                            variant="primary"
                            onClick={handleUpdateProfile}
                            style={{ borderRadius: "10px" }}
                          >
                            <i className="ph ph-check me-1" />
                            Save Changes
                          </Button>
                          <Button
                            variant="secondary"
                            onClick={() => setIsEditing(false)}
                            style={{ borderRadius: "10px" }}
                          >
                            Cancel
                          </Button>
                        </>
                      ) : (
                        <Button
                          variant="primary"
                          onClick={() => setIsEditing(true)}
                          style={{ borderRadius: "10px" }}
                        >
                          <i className="ph ph-pencil me-1" />
                          Edit Profile
                        </Button>
                      )}
                    </div>
                  </Col>
                </Row>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </div>

      {/* ✅ SUCCESS POPUP MODAL */}
      <Modal show={showSuccessModal} onHide={handleModalClose} centered>
        <Modal.Header closeButton style={{ borderBottom: "none" }}>
          <Modal.Title className="text-success fw-bold">
            <i className="ph ph-check-circle me-2" style={{ fontSize: "24px" }} />
            Profile Updated!
          </Modal.Title>
        </Modal.Header>
        <Modal.Body style={{ padding: "20px 24px" }}>
          <p className="text-muted mb-4" style={{ fontSize: "0.95rem" }}>
            Your profile has been updated successfully.
          </p>

          <div style={{ backgroundColor: "#f8f9fc", borderRadius: "12px", padding: "16px 20px" }}>
            <div className="d-flex justify-content-between align-items-center py-2 border-bottom">
              <span className="text-muted" style={{ fontSize: "0.85rem" }}>First Name</span>
              <span className="fw-semibold">{updatedData?.firstName || "-"}</span>
            </div>
            <div className="d-flex justify-content-between align-items-center py-2 border-bottom">
              <span className="text-muted" style={{ fontSize: "0.85rem" }}>Last Name</span>
              <span className="fw-semibold">{updatedData?.lastName || "-"}</span>
            </div>
            <div className="d-flex justify-content-between align-items-center py-2 border-bottom">
              <span className="text-muted" style={{ fontSize: "0.85rem" }}>Role</span>
              <span className="fw-semibold">{updatedData?.role || "-"}</span>
            </div>
            <div className="d-flex justify-content-between align-items-center py-2">
              <span className="text-muted" style={{ fontSize: "0.85rem" }}>Status</span>
              <span className={`fw-semibold ${
                updatedData?.status === "Active" ? "text-success" : 
                updatedData?.status === "Inactive" ? "text-warning" : "text-danger"
              }`}>
                {updatedData?.status || "-"}
              </span>
            </div>
          </div>
        </Modal.Body>
        <Modal.Footer style={{ borderTop: "none" }}>
          <Button
            variant="primary"
            onClick={handleModalClose}
            style={{
              borderRadius: "10px",
              padding: "10px 30px",
              fontWeight: "600"
            }}
          >
            Done
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}