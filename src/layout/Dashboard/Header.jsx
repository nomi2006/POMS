import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from "react-router-dom";
import { signOut, onAuthStateChanged } from "firebase/auth";
import { auth, db } from "config/firebase";
import { doc, getDoc } from "firebase/firestore";
// react-bootstrap
import Button from 'react-bootstrap/Button';
import Dropdown from 'react-bootstrap/Dropdown';
import Form from 'react-bootstrap/Form';
import Image from 'react-bootstrap/Image';
import Nav from 'react-bootstrap/Nav';
import Stack from 'react-bootstrap/Stack';
// project-imports
import MainCard from 'components/MainCard';
import SimpleBarScroll from 'components/third-party/SimpleBar';
import { handlerDrawerOpen, useGetMenuMaster } from 'api/menu';
import { toast } from "react-toastify";
// assets
import Img1 from 'assets/images/user/avatar-1.png';
import Img2 from 'assets/images/user/avatar-2.png';
import Img3 from 'assets/images/user/avatar-3.png';
import Img4 from 'assets/images/user/avatar-4.png';
import Img5 from 'assets/images/user/avatar-5.png';

const notifications = [
  // ... notifications array same rahega
];

export default function Header() {
  const { menuMaster } = useGetMenuMaster();
  const drawerOpen = menuMaster?.isDashboardDrawerOpened;
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [profilePic, setProfilePic] = useState(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        await loadUserData(currentUser.uid);
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
        if (data.profilePic) {
          setProfilePic(data.profilePic);
        }
      }
    } catch (error) {
      console.error("Error loading user data:", error);
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      toast.success("✅ Logged out successfully!");
      navigate("/login");
    } catch (error) {
      toast.error(error.message);
    }
  };

  const handleShare = async () => {
    try {
      if (navigator.share) {
        await navigator.share({
          title: 'Datta Able Dashboard',
          text: 'Check out my dashboard!',
          url: window.location.href,
        });
      } else {
        await navigator.clipboard.writeText(window.location.href);
        toast.success("✅ Link copied to clipboard!");
      }
    } catch (error) {
      if (error.name !== 'AbortError') {
        console.error('Share error:', error);
        toast.error("❌ Failed to share");
      }
    }
  };

  const avatarText = userData?.firstName?.charAt(0) || user?.email?.charAt(0) || "U";

  return (
    <header className="pc-header">
      <div className="header-wrapper">
        <div className="me-auto pc-mob-drp">
          <Nav className="list-unstyled">
            <Nav.Item className="pc-h-item pc-sidebar-collapse">
              <Nav.Link
                as={Link}
                to="#"
                className="pc-head-link ms-0"
                id="sidebar-hide"
                onClick={() => {
                  handlerDrawerOpen(!drawerOpen);
                }}
              >
                <i className="ph ph-list" />
              </Nav.Link>
            </Nav.Item>

            <Nav.Item className="pc-h-item pc-sidebar-popup">
              <Nav.Link as={Link} to="#" className="pc-head-link ms-0" id="mobile-collapse" onClick={() => handlerDrawerOpen(!drawerOpen)}>
                <i className="ph ph-list" />
              </Nav.Link>
            </Nav.Item>

            <Dropdown className="pc-h-item dropdown">
              <Dropdown.Toggle variant="link" className="pc-head-link arrow-none m-0 trig-drp-search" id="dropdown-search">
                <i className="ph ph-magnifying-glass" />
              </Dropdown.Toggle>
              <Dropdown.Menu className="pc-h-dropdown drp-search">
                <Form className="px-3 py-2">
                  <Form.Control type="search" placeholder="Search here. . ." className="border-0 shadow-none" />
                </Form>
              </Dropdown.Menu>
            </Dropdown>
          </Nav>
        </div>
        <div className="ms-auto">
          <Nav className="list-unstyled">
            <Dropdown className="pc-h-item" align="end">
              <Dropdown.Toggle className="pc-head-link me-0 arrow-none" variant="link" id="notification-dropdown">
                <i className="ph ph-bell" />
                <span className="badge bg-success pc-h-badge">3</span>
              </Dropdown.Toggle>

              <Dropdown.Menu className="dropdown-notification pc-h-dropdown">
                <Dropdown.Header className="d-flex align-items-center justify-content-between">
                  <h5 className="m-0">Notifications</h5>
                  <Link className="btn btn-link btn-sm" to="#">
                    Mark all read
                  </Link>
                </Dropdown.Header>
                <SimpleBarScroll style={{ maxHeight: 'calc(100vh - 215px)' }}>
                  <div className="dropdown-body text-wrap position-relative">
                    {notifications.map((notification, index) => (
                      <React.Fragment key={notification.id}>
                        {index === 0 || notifications[index - 1].date !== notification.date ? (
                          <p className="text-span">{notification.date}</p>
                        ) : null}
                        <MainCard className="mb-0">
                          <Stack direction="horizontal" gap={3}>
                            <Image className="img-radius avatar rounded-0" src={notification.avatar} alt="Generic placeholder image" />
                            <div>
                              <span className="float-end text-sm text-muted">{notification.time}</span>
                              <h5 className="text-body mb-2">{notification.title}</h5>
                              <p className="mb-0">{notification.description}</p>
                              {notification.actions && (
                                <div className="mt-2">
                                  <Button variant="outline-secondary" size="sm" className="me-2">
                                    Decline
                                  </Button>
                                  <Button variant="primary" size="sm">
                                    Accept
                                  </Button>
                                </div>
                              )}
                            </div>
                          </Stack>
                        </MainCard>
                      </React.Fragment>
                    ))}
                  </div>
                </SimpleBarScroll>

                <div className="text-center py-2">
                  <Link to="#!" className="link-danger">
                    Clear all Notifications
                  </Link>
                </div>
              </Dropdown.Menu>
            </Dropdown>

            {/* ✅ MODERN PROFILE DROPDOWN - FIXED */}
            <Dropdown
              className="pc-h-item"
              align="end"
              onToggle={(isOpen) => setIsDropdownOpen(isOpen)}
            >
              <Dropdown.Toggle
                as="div"
                className="pc-head-link arrow-none me-0"
                id="user-profile-dropdown"
                style={{
                  backgroundColor: 'transparent',
                  border: 'none',
                  padding: '6px 10px',
                  borderRadius: '12px',
                  boxShadow: 'none',
                  outline: 'none',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  transition: 'none'
                }}
              >
                <div className="d-flex align-items-center gap-2">
                  {profilePic ? (
                    <img
                      src={profilePic}
                      alt="Profile"
                      style={{
                        width: "36px",
                        height: "36px",
                        borderRadius: "50%",
                        objectFit: "cover",
                        border: "2px solid #e0e0e0",
                        pointerEvents: "none",
                        userSelect: "none",
                        display: "block"
                      }}
                      onError={(e) => {
                        e.target.style.display = 'none';
                      }}
                    />
                  ) : (
                    <div
                      className="d-flex align-items-center justify-content-center rounded-circle text-white"
                      style={{
                        width: "36px",
                        height: "36px",
                        fontSize: "15px",
                        fontWeight: "600",
                        background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                        flexShrink: 0
                      }}
                    >
                      {avatarText}
                    </div>
                  )}
                  <i
                    className="ph ph-caret-down"
                    style={{
                      fontSize: "12px",
                      color: "#6c757d",
                      transition: "transform 0.3s ease",
                      transform: isDropdownOpen ? "rotate(180deg)" : "rotate(0deg)"
                    }}
                  />
                </div>
              </Dropdown.Toggle>

              <Dropdown.Menu
                className="dropdown-user-profile pc-h-dropdown p-0 overflow-hidden"
                style={{
                  minWidth: "280px",
                  borderRadius: "18px",
                  boxShadow: "0 20px 60px rgba(0,0,0,0.15), 0 4px 20px rgba(0,0,0,0.05)",
                  border: "none",
                  marginTop: "8px",
                  animation: "slideDown 0.25s ease",
                  padding: "0"
                }}
              >
                {/* ✅ Gradient Header */}
                <div
                  style={{
                    background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                    padding: "24px 24px 40px 24px",
                    position: "relative",
                    borderRadius: "18px 18px 0 0"
                  }}
                >
                  <div
                    style={{
                      position: "absolute",
                      bottom: "-20px",
                      left: "50%",
                      transform: "translateX(-50%)",
                      zIndex: 1
                    }}
                  >
                    {profilePic ? (
                      <img
                        src={profilePic}
                        alt="Profile"
                        style={{
                          width: "72px",
                          height: "72px",
                          borderRadius: "50%",
                          objectFit: "cover",
                          border: "4px solid white",
                          boxShadow: "0 8px 30px rgba(0,0,0,0.2)",
                          display: "block"
                        }}
                      />
                    ) : (
                      <div
                        style={{
                          width: "72px",
                          height: "72px",
                          borderRadius: "50%",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          fontSize: "28px",
                          fontWeight: "700",
                          background: "white",
                          color: "#667eea",
                          border: "4px solid white",
                          boxShadow: "0 8px 30px rgba(0,0,0,0.2)"
                        }}
                      >
                        {avatarText}
                      </div>
                    )}
                  </div>
                </div>

                {/* ✅ User Info Section */}
                <div style={{ padding: "28px 20px 8px 20px", textAlign: "center" }}>
                  <h6
                    style={{
                      fontSize: "16px",
                      fontWeight: "600",
                      marginBottom: "2px",
                      color: "#1a1a2e",
                      whiteSpace: "nowrap",
                      overflow: "hidden",
                      textOverflow: "ellipsis"
                    }}
                  >
                    {userData?.firstName} {userData?.lastName || ""}
                  </h6>
                  <span
                    style={{
                      fontSize: "13px",
                      color: "#6c757d",
                      fontWeight: "400",
                      display: "block",
                      whiteSpace: "nowrap",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      maxWidth: "220px",
                      margin: "0 auto"
                    }}
                  >
                    {user?.email}
                  </span>
                  <div
                    style={{
                      display: "inline-block",
                      marginTop: "6px",
                      padding: "2px 12px",
                      fontSize: "11px",
                      fontWeight: "600",
                      color: "#28a745",
                      background: "#e8f5e9",
                      borderRadius: "20px"
                    }}
                  >
                    ● Active
                  </div>
                </div>

                <div style={{ padding: "8px 12px 16px 12px" }}>
                  {/* Settings */}
                  <Dropdown.Item
                    as={Link}
                    to="/settings"
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "12px",
                      padding: "10px 16px",
                      borderRadius: "10px",
                      fontSize: "14px",
                      fontWeight: "500",
                      color: "#333",
                      transition: "background 0.2s ease"
                    }}
                    onMouseEnter={(e) => e.target.style.background = "#f0f0f5"}
                    onMouseLeave={(e) => e.target.style.background = "transparent"}
                  >
                    <i className="ph ph-gear" style={{ fontSize: "18px", color: "#6c757d", width: "20px", textAlign: "center" }} />
                    <span>Settings</span>
                  </Dropdown.Item>

                  {/* Share */}
                  <Dropdown.Item
                    onClick={handleShare}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "12px",
                      padding: "10px 16px",
                      borderRadius: "10px",
                      fontSize: "14px",
                      fontWeight: "500",
                      color: "#333",
                      transition: "background 0.2s ease"
                    }}
                    onMouseEnter={(e) => e.target.style.background = "#f0f0f5"}
                    onMouseLeave={(e) => e.target.style.background = "transparent"}
                  >
                    <i className="ph ph-share-network" style={{ fontSize: "18px", color: "#6c757d", width: "20px", textAlign: "center" }} />
                    <span>Share</span>
                  </Dropdown.Item>

                  <div style={{ height: "1px", background: "#e9ecef", margin: "8px 0" }} />

                  {/* ✅ Logout Button */}
                  <Button
                    variant="danger"
                    onClick={handleLogout}
                    size="sm"
                    style={{
                      width: "100%",
                      borderRadius: "10px",
                      padding: "10px",
                      fontSize: "14px",
                      fontWeight: "600",
                      background: "linear-gradient(135deg, #dc3545, #c82333)",
                      border: "none",
                      boxShadow: "0 4px 12px rgba(220, 53, 69, 0.3)",
                      transition: "transform 0.2s ease, box-shadow 0.2s ease",
                      color: "white"
                    }}
                    onMouseEnter={(e) => {
                      e.target.style.transform = "scale(1.02)";
                      e.target.style.boxShadow = "0 6px 20px rgba(220, 53, 69, 0.4)";
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.transform = "scale(1)";
                      e.target.style.boxShadow = "0 4px 12px rgba(220, 53, 69, 0.3)";
                    }}
                  >
                    <i className="ph ph-sign-out me-2" />
                    Logout
                  </Button>
                </div>
              </Dropdown.Menu>
            </Dropdown>
          </Nav>
        </div>
      </div>

      {/* ✅ Animation Styles */}
      <style>{`
        @keyframes slideDown {
          from {
            opacity: 0;
            transform: translateY(-12px) scale(0.95);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }
        #user-profile-dropdown {
          transition: none !important;
          background-color: transparent !important;
        }
        #user-profile-dropdown:hover {
          background-color: transparent !important;
        }
        #user-profile-dropdown:focus {
          background-color: transparent !important;
        }
        #user-profile-dropdown:active {
          background-color: transparent !important;
        }
        .dropdown-user-profile .dropdown-item {
          background-color: transparent !important;
        }
        .dropdown-user-profile .dropdown-item:active {
          background-color: transparent !important;
        }
        .dropdown-user-profile .dropdown-item:focus {
          background-color: transparent !important;
        }
        .pc-head-link#user-profile-dropdown:hover {
          background-color: transparent !important;
        }
        @media (max-width: 576px) {
          .dropdown-user-profile {
            min-width: 260px !important;
            right: -10px !important;
          }
        }
      `}</style>
    </header>
  );
}