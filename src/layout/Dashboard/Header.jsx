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

            <Dropdown className="pc-h-item" align="end">
              <Dropdown.Toggle
                as="div"
                className="pc-head-link arrow-none me-0"
                id="user-profile-dropdown"
                style={{
                  backgroundColor: 'transparent !important',
                  border: 'none !important',
                  padding: '8px 10px',
                  borderRadius: '8px',
                  boxShadow: 'none !important',
                  outline: 'none !important',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  transition: 'none !important'
                }}
              >
                <div className="d-flex align-items-center gap-2">
                  {profilePic ? (
                    <img
                      src={profilePic}
                      alt="Profile"
                      style={{
                        width: "32px",
                        height: "32px",
                        borderRadius: "50%",
                        objectFit: "cover",
                        border: "2px solid #e0e0e0",
                        pointerEvents: "none",
                        userSelect: "none"
                      }}
                      onError={(e) => {
                        e.target.style.display = 'none';
                      }}
                    />
                  ) : (
                    <div
                      className="d-flex align-items-center justify-content-center rounded-circle bg-primary text-white"
                      style={{ width: "32px", height: "32px", fontSize: "14px", fontWeight: "600" }}
                    >
                      {avatarText}
                    </div>
                  )}
                  <i className="ph ph-caret-down" style={{ fontSize: "12px", color: "#6c757d" }} />
                </div>
              </Dropdown.Toggle>

              <Dropdown.Menu className="dropdown-user-profile pc-h-dropdown p-0 overflow-hidden" style={{ minWidth: "220px" }}>
                <Dropdown.Header className="bg-primary" style={{ padding: "16px 20px" }}>
                  <Stack direction="horizontal" gap={3} className="my-2">
                    <div className="flex-shrink-0">
                      {profilePic ? (
                        <img
                          src={profilePic}
                          alt="Profile"
                          style={{
                            width: "45px",
                            height: "45px",
                            borderRadius: "50%",
                            objectFit: "cover",
                            border: "2px solid white"
                          }}
                        />
                      ) : (
                        <div
                          className="d-flex align-items-center justify-content-center rounded-circle bg-white text-primary"
                          style={{ width: "45px", height: "45px", fontSize: "18px", fontWeight: "600" }}
                        >
                          {avatarText}
                        </div>
                      )}
                    </div>
                    <Stack gap={0}>
                      <h6 className="text-white mb-0" style={{ fontSize: "14px", fontWeight: "600" }}>
                        {userData?.firstName} {userData?.lastName || ""}
                      </h6>
                      <span className="text-white text-opacity-75" style={{ fontSize: "12px" }}>
                        {user?.email}
                      </span>
                    </Stack>
                  </Stack>
                </Dropdown.Header>

                <div className="dropdown-body" style={{ padding: "8px 0" }}>
                  <div className="profile-notification-scroll position-relative" style={{ maxHeight: 'calc(100vh - 225px)' }}>
                    <Dropdown.Item as={Link} to="/settings" className="justify-content-start px-4 py-2">
                      <i className="ph ph-gear me-2" style={{ fontSize: "16px" }} />
                      Settings
                    </Dropdown.Item>
                    <Dropdown.Item onClick={handleShare} className="justify-content-start px-4 py-2">
                      <i className="ph ph-share-network me-2" style={{ fontSize: "16px" }} />
                      Share
                    </Dropdown.Item>
                    <div className="d-grid px-3 my-2">
                      <Button variant="danger" onClick={handleLogout} size="sm">
                        <i className="ph ph-sign-out align-middle me-2" />
                        Logout
                      </Button>
                    </div>
                  </div>
                </div>
              </Dropdown.Menu>
            </Dropdown>
          </Nav>
        </div>
      </div>
    </header>
  );
}