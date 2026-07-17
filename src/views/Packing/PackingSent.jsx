import { toast } from "react-toastify";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  addDoc,
  collection,
  doc,
  getDoc,
  getDocs,
  updateDoc
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

export default function PackingSent() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [loading, setLoading] = useState(false);
  const [poList, setPoList] = useState([]);
  const [showPoDropdown, setShowPoDropdown] = useState(false);
  const [showColorDropdown, setShowColorDropdown] = useState(false);
  const [currentColorIndex, setCurrentColorIndex] = useState(null);

  const styleOptions = ["Salween", "Indus", "Medway", "Nox", "Aire", "Tennessee", "Calder"];

  const colorOptions = [
    { name: "Red", code: "#FF0000" },
    { name: "Blue", code: "#0000FF" },
    { name: "Green", code: "#008000" },
    { name: "Yellow", code: "#FFFF00" },
    { name: "Black", code: "#000000" },
    { name: "White", code: "#FFFFFF" },
    { name: "Orange", code: "#FFA500" },
    { name: "Purple", code: "#800080" },
    { name: "Pink", code: "#FFC0CB" },
    { name: "Brown", code: "#A52A2A" },
    { name: "Grey", code: "#808080" },
    { name: "Navy", code: "#000080" }
  ];

  const packingTypeOptions = ["Standard", "Export", "Custom"];

  const emptyItem = {
    style: "",
    color: "",
    colorName: "",
    quantity: "",
    cartons: "",
    packingType: "",
    remarks: ""
  };

  const [formData, setFormData] = useState({
    poNumber: "",
    type: "packing"
  });

  const [tableItems, setTableItems] = useState([{ ...emptyItem }]);

  // ---------- LOAD PO NUMBERS ----------
  const loadPONumbers = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, "purchaseOrders"));
      const data = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        po: doc.data().po || "",
        clientName: doc.data().clientName || ""
      }));
      setPoList(data);
    } catch (error) {
      console.error("Error loading PO numbers:", error);
    }
  };

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

  useEffect(() => {
    loadPONumbers();
    if (id) {
      loadPackingData();
    }
  }, [id]);

  // ---------- LOAD EDIT DATA ----------
  const loadPackingData = async () => {
    try {
      const docRef = doc(db, "packingSent", id);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        const data = docSnap.data();
        setFormData({
          poNumber: data.poNumber || "",
          type: data.type || "packing"
        });
        if (data.tableItems && data.tableItems.length > 0) {
          setTableItems(data.tableItems);
        }
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to load data");
    }
  };

  // ---------- HANDLERS ----------
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleTableItemChange = (index, field, value) => {
    const rows = [...tableItems];
    rows[index][field] = value;
    setTableItems(rows);
  };

  const handleColorSelect = (index, color) => {
    const rows = [...tableItems];
    rows[index].color = color.code;
    rows[index].colorName = color.name;
    setTableItems(rows);
    setShowColorDropdown(false);
    setCurrentColorIndex(null);
  };

  const addRow = () => {
    setTableItems([...tableItems, { ...emptyItem }]);
  };

  const removeRow = (index) => {
    if (tableItems.length === 1) return;
    const rows = [...tableItems];
    rows.splice(index, 1);
    setTableItems(rows);
  };

  // ---------- CALCULATIONS ----------
  const totalItems = tableItems.length;

  // ---------- SUBMIT ----------
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.poNumber) {
      toast.error("Please select PO Number");
      return;
    }

    const hasValidItem = tableItems.some(item =>
      item.style || item.color || item.quantity || item.cartons
    );

    if (!hasValidItem) {
      toast.error("Please add at least one item in the table");
      return;
    }

    try {
      setLoading(true);

      const data = {
        ...formData,
        tableItems: tableItems,
        totalItems: totalItems,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      console.log("📝 Saving data:", data);

      if (id) {
        await updateDoc(doc(db, "packingSent", id), data);
        toast.success("Packing Updated Successfully!");
      } else {
        const docRef = await addDoc(collection(db, "packingSent"), data);
        console.log("✅ Document written with ID:", docRef.id);
        toast.success("Packing Sent Successfully!");
      }

      navigate("/packing/received");

    } catch (error) {
      console.error("❌ Error saving:", error);
      toast.error("Failed to save: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container-fluid p-4">
      {/* HEADER */}
      <div className="text-center py-4 border-bottom mb-4">
        <h2 className="fw-bold text-uppercase mb-0" style={{ letterSpacing: "2px", fontSize: "2rem" }}>
          {id ? "EDIT" : "ADD"} PACKING SENT
        </h2>
      </div>

      <form onSubmit={handleSubmit}>
        {/* TOP SECTION - PO# */}
        <Row className="g-3 mb-4">
          <Col md={4}>
            <Form.Group>
              <Form.Label className="fw-bold">PO# <span className="text-danger">*</span></Form.Label>
              <div className="position-relative">
                <Form.Control
                  name="poNumber"
                  value={formData.poNumber}
                  onChange={handleChange}
                  onFocus={() => setShowPoDropdown(true)}
                  onBlur={() => setTimeout(() => setShowPoDropdown(false), 200)}
                  placeholder="Select PO #"
                  required
                  autoComplete="off"
                />
                {showPoDropdown && poList.length > 0 && (
                  <div 
                    className="position-absolute w-100 mt-1 border rounded shadow-sm"
                    style={{ 
                      maxHeight: "200px", 
                      overflowY: "auto", 
                      backgroundColor: "#fff", 
                      zIndex: 1000 
                    }}
                  >
                    {poList.map((po) => (
                      <div
                        key={po.id}
                        className="px-3 py-2 border-bottom"
                        style={{ cursor: "pointer" }}
                        onMouseDown={() => {
                          setFormData(prev => ({ 
                            ...prev, 
                            poNumber: po.po
                          }));
                          setShowPoDropdown(false);
                        }}
                      >
                        <div className="fw-bold">{po.po}</div>
                        <div className="text-muted small">{po.clientName}</div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </Form.Group>
          </Col>
        </Row>

        {/* ITEMS TABLE */}
        <Card className="border-2 shadow-sm mb-4">
          <Card.Header className="bg-light border-bottom-2 py-3 d-flex justify-content-between align-items-center">
            <h6 className="mb-0 fw-bold text-uppercase">ITEMS</h6>
            <Button type="button" size="sm" variant="primary" onClick={addRow}>
              + Add
            </Button>
          </Card.Header>
          <Card.Body className="p-0">
            <div className="table-responsive">
              <Table borderless className="mb-0" style={{ fontSize: "0.85rem" }}>
                <thead>
                  <tr className="border-top border-bottom" style={{ backgroundColor: "#d9dcdf" }}>
                    <th className="px-2 py-2 text-center fw-bold align-middle" style={{ width: "50px" }}>#</th>
                    <th className="px-2 py-2 text-center fw-bold align-middle" style={{ width: "12%" }}>STYLE</th>
                    <th className="px-2 py-2 text-center fw-bold align-middle" style={{ width: "12%" }}>COLOR</th>
                    <th className="px-2 py-2 text-center fw-bold align-middle" style={{ width: "12%" }}>QUANTITY</th>
                    <th className="px-2 py-2 text-center fw-bold align-middle" style={{ width: "12%" }}>CARTONS</th>
                    <th className="px-2 py-2 text-center fw-bold align-middle" style={{ width: "14%" }}>PACKING TYPE</th>
                    <th className="px-2 py-2 text-center fw-bold align-middle" style={{ width: "14%" }}>REMARKS</th>
                    <th className="px-2 py-2 text-center fw-bold align-middle" style={{ width: "80px" }}>ACTION</th>
                  </tr>
                </thead>
                <tbody>
                  {tableItems.map((item, index) => (
                    <tr key={index} className="border-bottom" style={{ backgroundColor: index % 2 === 0 ? "#fff" : "#f9f9f9" }}>
                      <td className="text-center align-middle">{index + 1}</td>

                      {/* STYLE */}
                      <td className="px-2 py-2 align-middle">
                        <Form.Select
                          size="sm"
                          value={item.style}
                          onChange={(e) => handleTableItemChange(index, "style", e.target.value)}
                          style={{ height: "36px", fontSize: "0.85rem" }}
                        >
                          <option value="">Select</option>
                          {styleOptions.map((style) => (
                            <option key={style} value={style}>{style}</option>
                          ))}
                        </Form.Select>
                      </td>

                      {/* COLOR */}
                      <td className="px-2 py-2 align-middle">
                        <div className="position-relative">
                          <Form.Control
                            size="sm"
                            value={item.colorName || item.color || ""}
                            onClick={() => {
                              setCurrentColorIndex(index);
                              setShowColorDropdown(!showColorDropdown);
                            }}
                            placeholder="Select Color"
                            style={{ 
                              height: "36px", 
                              fontSize: "0.85rem", 
                              cursor: "pointer",
                              backgroundColor: item.color ? item.color : "#fff",
                              color: item.color ? "#fff" : "#000"
                            }}
                            readOnly
                          />
                          {showColorDropdown && currentColorIndex === index && (
                            <div 
                              className="position-absolute w-100 mt-1 border rounded shadow-sm"
                              style={{ 
                                maxHeight: "150px", 
                                overflowY: "auto", 
                                backgroundColor: "#fff", 
                                zIndex: 9999,
                                borderRadius: "8px"
                              }}
                            >
                              {colorOptions.map((color, idx) => (
                                <div
                                  key={idx}
                                  className="px-3 py-2 border-bottom d-flex align-items-center gap-2"
                                  style={{ cursor: "pointer" }}
                                  onMouseDown={(e) => {
                                    e.preventDefault();
                                    handleColorSelect(index, color);
                                  }}
                                  onMouseEnter={(e) => e.target.style.backgroundColor = "#f0f0f0"}
                                  onMouseLeave={(e) => e.target.style.backgroundColor = "transparent"}
                                >
                                  <span style={{ 
                                    width: "20px", 
                                    height: "20px", 
                                    backgroundColor: color.code, 
                                    borderRadius: "50%", 
                                    border: "1px solid #ddd",
                                    display: "inline-block",
                                    flexShrink: 0
                                  }} />
                                  {color.name}
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      </td>

                      {/* QUANTITY */}
                      <td className="px-2 py-2 align-middle">
                        <Form.Control
                          size="sm"
                          type="number"
                          value={item.quantity}
                          onChange={(e) => handleTableItemChange(index, "quantity", e.target.value)}
                          placeholder="Qty"
                          className="text-center"
                          style={{ height: "36px", fontSize: "0.85rem" }}
                        />
                      </td>

                      {/* CARTONS */}
                      <td className="px-2 py-2 align-middle">
                        <Form.Control
                          size="sm"
                          type="number"
                          value={item.cartons}
                          onChange={(e) => handleTableItemChange(index, "cartons", e.target.value)}
                          placeholder="Cartons"
                          className="text-center"
                          style={{ height: "36px", fontSize: "0.85rem" }}
                        />
                      </td>

                      {/* PACKING TYPE */}
                      <td className="px-2 py-2 align-middle">
                        <Form.Select
                          size="sm"
                          value={item.packingType}
                          onChange={(e) => handleTableItemChange(index, "packingType", e.target.value)}
                          style={{ height: "36px", fontSize: "0.85rem" }}
                        >
                          <option value="">Select</option>
                          {packingTypeOptions.map((type) => (
                            <option key={type} value={type}>{type}</option>
                          ))}
                        </Form.Select>
                      </td>

                      {/* REMARKS */}
                      <td className="px-2 py-2 align-middle">
                        <Form.Control
                          size="sm"
                          value={item.remarks}
                          onChange={(e) => handleTableItemChange(index, "remarks", e.target.value)}
                          placeholder="Remarks"
                          className="text-center"
                          style={{ height: "36px", fontSize: "0.85rem" }}
                        />
                      </td>

                      {/* ACTION */}
                      <td className="px-2 py-2 text-center align-middle">
                        <div className="d-flex gap-1 justify-content-center">
                          <Button
                            type="button"
                            size="sm"
                            variant="success"
                            onClick={addRow}
                            style={{
                              width: "30px",
                              height: "30px",
                              padding: "0",
                              fontSize: "1rem",
                              display: "inline-flex",
                              alignItems: "center",
                              justifyContent: "center"
                            }}
                          >
                            +
                          </Button>
                          <Button
                            type="button"
                            size="sm"
                            variant="danger"
                            onClick={() => removeRow(index)}
                            style={{
                              width: "30px",
                              height: "30px",
                              padding: "0",
                              fontSize: "1rem",
                              display: "inline-flex",
                              alignItems: "center",
                              justifyContent: "center"
                            }}
                          >
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

        {/* TOTAL ITEMS + BUTTONS */}
        <div className="d-flex flex-column flex-md-row align-items-start align-items-md-center justify-content-between gap-3 mb-4">
          <div>
            <Card className="border-1 shadow-sm" style={{ minWidth: "130px" }}>
              <Card.Body className="p-3 text-center">
                <div className="text-muted small text-uppercase fw-bold mb-2">Total Items</div>
                <div className="fw-bold" style={{ fontSize: "1.25rem" }}>{totalItems}</div>
              </Card.Body>
            </Card>
          </div>

          <div className="d-flex gap-2">
            <Button type="button" variant="outline-secondary" onClick={() => navigate("/packing/received")}>
              Cancel
            </Button>
            <Button type="submit" variant="primary" className="px-4" disabled={loading}>
              {loading ? "Saving..." : "Save"}
            </Button>
          </div>
        </div>

      </form>
    </div>
  );
}