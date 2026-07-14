import { toast } from "react-toastify";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  addDoc,
  updateDoc,
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  where,
  deleteDoc
} from "firebase/firestore";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { db } from "config/firebase";
import {
  Row,
  Col,
  Card,
  Form,
  Button,
  Table
} from "react-bootstrap";

export default function AddYarnPurchase() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(false);
  const [poList, setPoList] = useState([]);
  const [showPoDropdown, setShowPoDropdown] = useState(false);

  const emptyYarnItem = {
    style: "",
    yarnCount: "",
    fabricRequired: "",
    yarnBase: "",
    topFabric: "",
    bottomFabric: ""
  };

  const [yarnItems, setYarnItems] = useState([{ ...emptyYarnItem }]);

  const [formData, setFormData] = useState({
    poNumber: "",
    clientId: "",
    clientName: "",
    style: "",
    orderDate: "",
    deliveryDate: "",
    millName: "",
    yarnType: "",
    currency: "USD",
    stage: "Draft",
    remarks: ""
  });
  // ---------- LOAD PO NUMBERS ----------
  const loadPONumbers = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, "purchaseOrders"));
      const data = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        po: doc.data().po || "",
        clientName: doc.data().clientName || "",
        clientId: doc.data().clientId || "",
        style: doc.data().products?.[0]?.style || "",
        shipDate: doc.data().shipDate || ""
      }));
      setPoList(data);
    } catch (error) {
      console.error("Error loading PO numbers:", error);
    }
  };
  // ---------- LOAD CLIENTS ----------
  const loadClients = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, "clients"));
      const data = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data()
      }));
      setClients(data);
    } catch (error) {
      console.error("Error loading clients:", error);
    }
  };

  // ---------- AUTH CHECK ----------
  useEffect(() => {
    const auth = getAuth();
    onAuthStateChanged(auth, (user) => {
      if (user) {
        console.log("✅ User is logged in:", user.email);
      } else {
        console.warn("❌ No user logged in!");
      }
    });
  }, []);

  // ---------- LOAD DATA ON MOUNT ----------
  useEffect(() => {
    loadClients();
    loadPONumbers();
    if (id) {
      loadYarnPurchase();
    }
  }, [id]);

  // ---------- HANDLERS ----------
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleYarnItemChange = (index, field, value) => {
    const rows = [...yarnItems];
    rows[index][field] = value;
    setYarnItems(rows);
  };

  const addRow = () => {
    setYarnItems([...yarnItems, { ...emptyYarnItem }]);
  };

  const removeRow = (index) => {
    if (yarnItems.length === 1) return;
    const rows = [...yarnItems];
    rows.splice(index, 1);
    setYarnItems(rows);
  };

  // ---------- LOAD YARN PURCHASE FOR EDIT ----------
  const loadYarnPurchase = async () => {
    try {
      const docRef = doc(db, "yarnPurchases", id);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const data = docSnap.data();
        setFormData({
          ...formData,
          ...data
        });
        if (data.yarnItems && data.yarnItems.length > 0) {
          setYarnItems(data.yarnItems);
        }
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to load Yarn Purchase");
    }
  };

  // ---------- CALCULATIONS ----------
  const totalItems = yarnItems.length;

  // ---------- SUBMIT ----------
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.poNumber) {
      toast.error("Please enter PO Number");
      return;
    }

    if (!formData.clientId) {
      toast.error("Please select a client");
      return;
    }

    const hasValidItem = yarnItems.some(item =>
      item.style || item.yarnCount || item.fabricRequired ||
      item.yarnBase || item.topFabric || item.bottomFabric
    );

    if (!hasValidItem) {
      toast.error("Please add at least one yarn item");
      return;
    }

    try {
      setLoading(true);

      const selectedClient = clients.find(c => c.id === formData.clientId);
      const clientName = selectedClient?.name || "";

      const data = {
        poNumber: formData.poNumber.trim(),
        clientId: formData.clientId,
        clientName: clientName,
        style: formData.style || "",
        orderDate: formData.orderDate || "",
        deliveryDate: formData.deliveryDate || "",
        millName: formData.millName || "",
        yarnType: formData.yarnType || "",
        currency: formData.currency || "USD",
        stage: formData.stage || "Draft",
        remarks: formData.remarks || "",
        yarnItems: yarnItems,
        totalItems: yarnItems.length,
        updatedAt: new Date().toISOString()
      };

      console.log("📝 Saving data to Firebase:", data);

      if (id) {
        await updateDoc(doc(db, "yarnPurchases", id), data);
        toast.success("Yarn Purchase Updated Successfully!");
      } else {
        const docRef = await addDoc(collection(db, "yarnPurchases"), {
          ...data,
          createdAt: new Date().toISOString()
        });
        console.log("✅ Document written with ID:", docRef.id);
        toast.success("Yarn Purchase Added Successfully!");
      }

      navigate("/yarn-purchase/list");

    } catch (error) {
      console.error("❌ Error saving:", error);

      if (error.code === "permission-denied") {
        toast.error("Permission denied! Please check Firebase Security Rules");
      } else {
        toast.error("Failed to save: " + error.message);
      }
    } finally {
      setLoading(false);
    }
  };

  // ---------- RENDER ----------
  return (
    <div className="container-fluid p-4">
      {/* HEADER */}
      <div className="text-center py-4 border-bottom mb-4">
        <h2 className="fw-bold text-uppercase mb-0" style={{ letterSpacing: "2px", fontSize: "2rem" }}>
          {id ? "EDIT" : "ADD"} YARN PURCHASE
        </h2>
      </div>

      <form onSubmit={handleSubmit}>

        {/* ROW 1: PO SEARCH + CLIENT + DETAILS */}
        <Row className="mb-4 g-3">
          {/* LEFT CARD: PO SEARCH & CLIENT */}
          <Col lg={5}>
            <Card className="border-2 shadow-sm h-100">
              <Card.Header className="bg-light border-bottom-2 py-2">
                <h6 className="mb-0 fw-bold text-uppercase" style={{ fontSize: "0.85rem", letterSpacing: "1px" }}>
                  PO SEARCH & CLIENT
                </h6>
              </Card.Header>
              <Card.Body className="p-3">
                {/* PO NUMBER SEARCH WITH DROPDOWN */}
                {/* PO NUMBER SEARCH WITH DROPDOWN */}
                <Form.Group className="mb-3">
                  <Form.Label className="small fw-bold text-uppercase text-muted" style={{ fontSize: "0.75rem" }}>
                    PO Number <span className="text-danger">*</span>
                  </Form.Label>
                  <div className="position-relative">
                    <Form.Control
                      name="poNumber"
                      value={formData.poNumber}
                      onChange={handleChange}
                      onFocus={() => setShowPoDropdown(true)}
                      onBlur={() => setTimeout(() => setShowPoDropdown(false), 200)}
                      placeholder="Select or type PO #"
                      className="border-1"
                      style={{ borderRadius: "8px" }}
                      required
                      autoComplete="off"
                    />

                    {/* DROPDOWN LIST */}
                    {showPoDropdown && poList.length > 0 && (
                      <div
                        className="position-absolute w-100 mt-1 border rounded shadow-sm"
                        style={{
                          maxHeight: "200px",
                          overflowY: "auto",
                          backgroundColor: "#fff",
                          zIndex: 1000,
                          borderRadius: "8px"
                        }}
                      >
                        {poList
                          .filter(po =>
                            po.po?.toLowerCase().includes(formData.poNumber?.toLowerCase() || "")
                          )
                          .map((po) => (
                            <div
                              key={po.id}
                              className="px-3 py-2 border-bottom"
                              style={{ cursor: "pointer" }}
                              onMouseDown={(e) => {
                                e.preventDefault();
                                // Auto-fill form with selected PO data
                                setFormData(prev => ({
                                  ...prev,
                                  poNumber: po.po,
                                  clientId: po.clientId || "",
                                  clientName: po.clientName || "",
                                  style: po.style || "",
                                  orderDate: po.shipDate || ""
                                }));
                                setShowPoDropdown(false);
                                toast.success(`PO #${po.po} selected!`);
                              }}
                              onMouseEnter={(e) => e.target.style.backgroundColor = "#f0f0f0"}
                              onMouseLeave={(e) => e.target.style.backgroundColor = "transparent"}
                            >
                              <div className="fw-bold">{po.po}</div>
                              <div className="text-muted small">
                                {po.clientName || "No Client"} {po.style ? `| ${po.style}` : ""}
                              </div>
                            </div>
                          ))}
                      </div>
                    )}

                    {showPoDropdown && poList.length === 0 && (
                      <div
                        className="position-absolute w-100 mt-1 border rounded shadow-sm p-3 text-center"
                        style={{ backgroundColor: "#fff", zIndex: 1000, borderRadius: "8px" }}
                      >
                        <span className="text-muted">No Purchase Orders found</span>
                      </div>
                    )}
                  </div>
                </Form.Group>

                {/* CLIENT SELECT */}
                <Form.Group className="mb-3">
                  <Form.Label className="small fw-bold text-uppercase text-muted" style={{ fontSize: "0.75rem" }}>
                    Client <span className="text-danger">*</span>
                  </Form.Label>
                  <Form.Select
                    name="clientId"
                    value={formData.clientId}
                    onChange={handleChange}
                    className="border-1"
                    style={{ borderRadius: "8px" }}
                    required
                  >
                    <option value="">Select Client</option>
                    {clients.map((client) => (
                      <option key={client.id} value={client.id}>
                        {client.name}
                      </option>
                    ))}
                  </Form.Select>
                </Form.Group>
              </Card.Body>
            </Card>
          </Col>
        </Row>

        {/* YARN ITEMS TABLE */}
        <Card className="border-2 shadow-sm mb-4">
          <Card.Header className="bg-light border-bottom-2 py-3 d-flex justify-content-between align-items-center">
            <h6 className="mb-0 fw-bold text-uppercase" style={{ fontSize: "0.85rem", letterSpacing: "1px" }}>
              YARN ITEMS
            </h6>
            <Button type="button" size="sm" variant="primary" onClick={addRow} className="px-3" style={{ fontSize: "0.9rem", fontWeight: "600" }}>
              + Add Yarn
            </Button>
          </Card.Header>
          <Card.Body className="p-0">
            <div className="table-responsive">
              <Table borderless className="mb-0" style={{ fontSize: "0.85rem" }}>
                <thead>
                  <tr className="border-top border-bottom" style={{ backgroundColor: "#d9dcdf" }}>
                    <th className="px-2 py-2 text-center fw-bold align-middle" style={{ width: "100px" }}>STYLE</th>
                    <th className="px-2 py-2 text-center fw-bold align-middle" style={{ width: "100px" }}>YARN COUNT</th>
                    <th className="px-2 py-2 text-center fw-bold align-middle" style={{ width: "130px" }}>FABRIC REQUIRED</th>
                    <th className="px-2 py-2 text-center fw-bold align-middle" style={{ width: "120px" }}>YARN BASE</th>
                    <th className="px-2 py-2 text-center fw-bold align-middle" style={{ width: "150px" }}>TOP FABRIC</th>
                    <th className="px-2 py-2 text-center fw-bold align-middle" style={{ width: "150px" }}>BOTTOM FABRIC</th>
                    <th className="px-2 py-2 text-center fw-bold align-middle" style={{ width: "80px" }}>ACTION</th>
                  </tr>
                </thead>
                <tbody>
                  {yarnItems.map((item, index) => (
                    <tr key={index} className="border-bottom" style={{ backgroundColor: index % 2 === 0 ? "#fff" : "#f9f9f9" }}>
                      <td className="px-2 py-2 align-middle">
                        <Form.Control
                          size="sm"
                          value={item.style}
                          onChange={(e) => handleYarnItemChange(index, "style", e.target.value)}
                          placeholder="Style #"
                          className="text-center"
                          style={{ height: "36px", fontSize: "0.85rem", padding: "6px 4px" }}
                        />
                      </td>
                      <td className="px-2 py-2 align-middle">
                        <Form.Control
                          size="sm"
                          type="number"
                          value={item.yarnCount}
                          onChange={(e) => handleYarnItemChange(index, "yarnCount", e.target.value)}
                          placeholder="Count"
                          className="text-center"
                          style={{ height: "36px", fontSize: "0.85rem", padding: "6px 4px" }}
                        />
                      </td>
                      <td className="px-2 py-2 align-middle">
                        <Form.Control
                          size="sm"
                          type="number"
                          value={item.fabricRequired}
                          onChange={(e) => handleYarnItemChange(index, "fabricRequired", e.target.value)}
                          placeholder="Required"
                          className="text-center"
                          style={{ height: "36px", fontSize: "0.85rem", padding: "6px 4px" }}
                        />
                      </td>
                      <td className="px-2 py-2 align-middle">
                        <Form.Control
                          size="sm"
                          value={item.yarnBase}
                          onChange={(e) => handleYarnItemChange(index, "yarnBase", e.target.value)}
                          placeholder="Base"
                          className="text-center"
                          style={{ height: "36px", fontSize: "0.85rem", padding: "6px 4px" }}
                        />
                      </td>
                      <td className="px-2 py-2 align-middle">
                        <Form.Control
                          size="sm"
                          value={item.topFabric}
                          onChange={(e) => handleYarnItemChange(index, "topFabric", e.target.value)}
                          placeholder="Top Fabric"
                          className="text-center"
                          style={{ height: "36px", fontSize: "0.85rem", padding: "6px 4px" }}
                        />
                      </td>
                      <td className="px-2 py-2 align-middle">
                        <Form.Control
                          size="sm"
                          value={item.bottomFabric}
                          onChange={(e) => handleYarnItemChange(index, "bottomFabric", e.target.value)}
                          placeholder="Bottom Fabric"
                          className="text-center"
                          style={{ height: "36px", fontSize: "0.85rem", padding: "6px 4px" }}
                        />
                      </td>
                      <td className="px-2 py-2 text-center align-middle">
                        <div className="d-flex gap-1 justify-content-center">
                          <Button type="button" size="sm" variant="success" onClick={addRow} style={{ minWidth: "28px", height: "28px", padding: "0", fontSize: "0.9rem" }}>
                            +
                          </Button>
                          <Button type="button" size="sm" variant="danger" onClick={() => removeRow(index)} style={{ minWidth: "28px", height: "28px", padding: "0", fontSize: "0.9rem" }}>
                            −
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </div>
          </Card.Body>
        </Card>
        {/* SUMMARY + BUTTONS */}
        <div className="d-flex flex-column flex-md-row align-items-start align-items-md-center justify-content-between gap-3 mb-4">
          <div className="d-flex gap-3 flex-wrap">
            <Card className="border-1 shadow-sm" style={{ minWidth: "130px" }}>
              <Card.Body className="p-3 text-center">
                <div className="text-muted small text-uppercase fw-bold mb-2">Total Items</div>
                <div className="fw-bold" style={{ fontSize: "1.25rem" }}>{totalItems}</div>
              </Card.Body>
            </Card>
          </div>

          <div className="d-flex gap-2">
            <Button type="button" variant="outline-secondary" onClick={() => navigate("/yarn-purchase/list")}>
              Cancel
            </Button>
            <Button type="submit" variant="primary" className="px-4" disabled={loading}>
              {loading ? "Saving..." : (id ? "Update Yarn Purchase" : "Save Yarn Purchase")}
            </Button>
          </div>
        </div>

      </form>
    </div>
  );
}