import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getAuth, signOut, onAuthStateChanged, updateProfile } from "firebase/auth";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { db, storage } from "config/firebase";
import { toast } from "react-toastify";
import { Card, Row, Col, Button, Form } from "react-bootstrap";

export default function Settings() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [profilePic, setProfilePic] = useState(null);
  const [previewPic, setPreviewPic] = useState(null);

  const auth = getAuth();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        await loadUserData(currentUser.uid);
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
        setUserData(docSnap.data());
        if (docSnap.data().profilePic) {
          setProfilePic(docSnap.data().profilePic);
        }
      }
    } catch (error) {
      console.error("Error loading user data:", error);
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setPreviewPic(URL.createObjectURL(file));
      handleUpload(file);
    }
  };

  const handleUpload = async (file) => {
    if (!file) return;
    
    try {
      setUploading(true);
      
      // Upload to Firebase Storage
      const storageRef = ref(storage, `profilePics/${user.uid}`);
      await uploadBytes(storageRef, file);
      const downloadURL = await getDownloadURL(storageRef);
      
      // Update Firestore
      const userRef = doc(db, "users", user.uid);
      await updateDoc(userRef, {
        profilePic: downloadURL
      });
      
      // Update Auth profile
      await updateProfile(user, {
        photoURL: downloadURL
      });
      
      setProfilePic(downloadURL);
      toast.success("✅ Profile picture updated successfully!");
      
    } catch (error) {
      console.error("Upload error:", error);
      toast.error("❌ Failed to upload profile picture");
    } finally {
      setUploading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      toast.success("✅ Logged out successfully!");
      navigate("/login");
    } catch (error) {
      console.error("Logout error:", error);
      toast.error("❌ Failed to logout");
    }
  };

  if (loading) {
    return (
      <div className="text-center py-5">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
        <h5 className="mt-3">Loading Profile...</h5>
      </div>
    );
  }

  const avatarText = userData?.firstName?.charAt(0) || user?.email?.charAt(0) || "U";

  return (
    <div className="container-fluid p-4">
      <Row>
        <Col lg={8} className="mx-auto">
          {/* Header */}
          <div className="d-flex align-items-center justify-content-between mb-4">
            <div>
              <h2 className="fw-bold mb-0" style={{ fontSize: "1.75rem" }}>
                <i className="ph ph-user-circle me-2 text-primary"></i>
                Profile Settings
              </h2>
              <p className="text-muted mb-0">Manage your account settings and preferences</p>
            </div>
          </div>

          {/* Profile Card */}
          <Card className="shadow-sm border-0 overflow-hidden">
            <div className="bg-primary" style={{ height: "100px" }}></div>
            <Card.Body className="p-4" style={{ marginTop: "-50px" }}>
              <Row>
                <Col md={4} className="text-center text-md-start">
                  {/* Avatar with Upload */}
                  <div className="position-relative d-inline-block">
                    <div 
                      className="d-inline-flex align-items-center justify-content-center rounded-circle bg-white shadow-sm border border-3 border-white position-relative"
                      style={{ width: "100px", height: "100px", fontSize: "40px", fontWeight: "600", overflow: "hidden" }}
                    >
                      {profilePic ? (
                        <img 
                          src={profilePic} 
                          alt="Profile" 
                          style={{ width: "100%", height: "100%", objectFit: "cover" }}
                        />
                      ) : (
                        <span className="text-primary">{avatarText}</span>
                      )}
                    </div>
                    
                    {/* Upload Button */}
                    <label 
                      className="position-absolute bottom-0 end-0 bg-primary rounded-circle d-flex align-items-center justify-content-center shadow-sm"
                      style={{ 
                        width: "32px", 
                        height: "32px", 
                        cursor: "pointer",
                        border: "2px solid white",
                        bottom: "0px",
                        right: "0px"
                      }}
                    >
                      <i className="ph ph-camera text-white" style={{ fontSize: "16px" }}></i>
                      <input 
                        type="file" 
                        accept="image/*" 
                        onChange={handleFileChange}
                        style={{ display: "none" }}
                        disabled={uploading}
                      />
                    </label>
                  </div>
                  
                  {uploading && (
                    <div className="mt-2">
                      <span className="text-muted small">Uploading...</span>
                      <div className="spinner-border spinner-border-sm text-primary ms-2" role="status">
                        <span className="visually-hidden">Loading...</span>
                      </div>
                    </div>
                  )}

                  <div className="mt-3">
                    <h5 className="fw-bold mb-0">{userData?.firstName} {userData?.lastName}</h5>
                    <p className="text-muted mb-0">
                      <i className="ph ph-envelope me-1"></i>
                      {user?.email}
                    </p>
                    <p className="text-muted mb-0 small">
                      <i className="ph ph-calendar me-1"></i>
                      Member since {userData?.createdAt ? new Date(userData.createdAt).toLocaleDateString() : "-"}
                    </p>
                  </div>
                </Col>

                <Col md={8} className="mt-4 mt-md-0">
                  <h6 className="fw-bold text-uppercase text-muted mb-3" style={{ fontSize: "0.75rem", letterSpacing: "1px" }}>
                    Account Details
                  </h6>

                  <Row className="g-3">
                    <Col sm={6}>
                      <div className="p-3 rounded-3" style={{ backgroundColor: "#f8f9fa" }}>
                        <p className="text-muted small mb-0">First Name</p>
                        <p className="fw-bold mb-0">{userData?.firstName || "-"}</p>
                      </div>
                    </Col>
                    <Col sm={6}>
                      <div className="p-3 rounded-3" style={{ backgroundColor: "#f8f9fa" }}>
                        <p className="text-muted small mb-0">Last Name</p>
                        <p className="fw-bold mb-0">{userData?.lastName || "-"}</p>
                      </div>
                    </Col>
                    <Col sm={12}>
                      <div className="p-3 rounded-3" style={{ backgroundColor: "#f8f9fa" }}>
                        <p className="text-muted small mb-0">Email Address</p>
                        <p className="fw-bold mb-0">{user?.email || "-"}</p>
                      </div>
                    </Col>
                    <Col sm={6}>
                      <div className="p-3 rounded-3" style={{ backgroundColor: "#f8f9fa" }}>
                        <p className="text-muted small mb-0">User ID</p>
                        <p className="fw-bold mb-0 text-truncate" style={{ fontSize: "0.85rem" }}>
                          {user?.uid?.substring(0, 15)}...
                        </p>
                      </div>
                    </Col>
                    <Col sm={6}>
                      <div className="p-3 rounded-3" style={{ backgroundColor: "#f8f9fa" }}>
                        <p className="text-muted small mb-0">Account Status</p>
                        <p className="fw-bold mb-0 text-success">✅ Active</p>
                      </div>
                    </Col>
                  </Row>
                </Col>
              </Row>

              <hr className="my-4" />

              {/* Logout Button */}
              <div className="d-flex justify-content-end">
                <Button
                  variant="danger"
                  className="px-4 py-2"
                  onClick={handleLogout}
                >
                  <i className="ph ph-sign-out me-2"></i>
                  Logout
                </Button>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </div>
  );
}