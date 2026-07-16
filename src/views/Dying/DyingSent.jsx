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

export default function DyingSent() {
    const navigate = useNavigate();
    const { id } = useParams();
    const [loading, setLoading] = useState(false);
    const [poList, setPoList] = useState([]);
    const [showPoDropdown, setShowPoDropdown] = useState(false);
    const [itemsList, setItemsList] = useState([]);
    const [showItemsDropdown, setShowItemsDropdown] = useState(false);
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

    // Empty item for the table
    const emptyItem = {
        style: "",
        color: "",
        colorName: "",
        qtyRequired: "",
        yarnQty: "",
        fabric: "",
        accessories: "",
        date: ""
    };

    // Form state - PO#, ITEM, QUANTITY
    const [formData, setFormData] = useState({
        poNumber: "",
        item: "",
        quantity: "",
        type: "dying"
    });

    // Table items state
    const [tableItems, setTableItems] = useState([{ ...emptyItem }]);

    // ---------- LOAD PO NUMBERS ----------
    const loadPONumbers = async () => {
        try {
            const querySnapshot = await getDocs(collection(db, "purchaseOrders"));
            const data = querySnapshot.docs.map((doc) => ({
                id: doc.id,
                po: doc.data().po || "",
                clientName: doc.data().clientName || "",
                totalUnits: doc.data().totalUnits || 0
            }));
            setPoList(data);
        } catch (error) {
            console.error("Error loading PO numbers:", error);
        }
    };

    // ---------- LOAD ITEMS ----------
    const loadItems = async () => {
        try {
            const sampleItems = ["Cotton Yarn", "Polyester Yarn", "Viscose Yarn", "Blended Yarn", "Accessories"];
            setItemsList(sampleItems);
        } catch (error) {
            console.error("Error loading items:", error);
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
        loadItems();
        if (id) {
            loadDyingData();
        }
    }, [id]);

    // ---------- LOAD EDIT DATA ----------
    const loadDyingData = async () => {
        try {
            const docRef = doc(db, "dyingSent", id);
            const docSnap = await getDoc(docRef);
            if (docSnap.exists()) {
                const data = docSnap.data();
                setFormData({
                    poNumber: data.poNumber || "",
                    item: data.item || "",
                    quantity: data.quantity || "",
                    type: data.type || "dying"
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

        if (!formData.item) {
            toast.error("Please select Item");
            return;
        }

        const hasValidItem = tableItems.some(item =>
            item.style || item.color || item.qtyRequired
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
                await updateDoc(doc(db, "dyingSent", id), data);
                toast.success("Dying Updated Successfully!");
            } else {
                const docRef = await addDoc(collection(db, "dyingSent"), data);
                console.log("✅ Document written with ID:", docRef.id);
                toast.success("Dying Sent Successfully!");
            }

            navigate("/dying/received");

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
                    {id ? "EDIT" : "ADD"} DYING SENT
                </h2>
            </div>

            <form onSubmit={handleSubmit}>
                {/* TOP SECTION - PO#, ITEM, QUANTITY */}
                <Row className="g-3 mb-4">
                    {/* PO# */}
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
                                                        poNumber: po.po,
                                                        quantity: po.totalUnits || ""  // ✅ Total Units auto-fill
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

                    {/* ITEM */}
                    <Col md={4}>
                        <Form.Group>
                            <Form.Label className="fw-bold">ITEM <span className="text-danger">*</span></Form.Label>
                            <div className="position-relative">
                                <Form.Control
                                    name="item"
                                    value={formData.item}
                                    onChange={handleChange}
                                    onFocus={() => setShowItemsDropdown(true)}
                                    onBlur={() => setTimeout(() => setShowItemsDropdown(false), 200)}
                                    placeholder="Select Item"
                                    required
                                    autoComplete="off"
                                />
                                {showItemsDropdown && itemsList.length > 0 && (
                                    <div
                                        className="position-absolute w-100 mt-1 border rounded shadow-sm"
                                        style={{
                                            maxHeight: "200px",
                                            overflowY: "auto",
                                            backgroundColor: "#fff",
                                            zIndex: 1000
                                        }}
                                    >
                                        {itemsList.map((item, idx) => (
                                            <div
                                                key={idx}
                                                className="px-3 py-2 border-bottom"
                                                style={{ cursor: "pointer" }}
                                                onMouseDown={() => {
                                                    setFormData(prev => ({ ...prev, item: item }));
                                                    setShowItemsDropdown(false);
                                                }}
                                            >
                                                {item}
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </Form.Group>
                    </Col>

                    {/* QUANTITY */}
                    <Col md={4}>
                        <Form.Group>
                            <Form.Label className="fw-bold">QUANTITY <span className="text-danger">*</span></Form.Label>
                            <Form.Control
                                type="number"
                                name="quantity"
                                value={formData.quantity}
                                onChange={handleChange}
                                placeholder="Auto-filled from PO"
                                required
                                style={{ backgroundColor: "#f8f9fa" }}
                            />
                            <Form.Text className="text-muted">
                                Auto-filled from PO Total Units
                            </Form.Text>
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
                                        <th className="px-2 py-2 text-center fw-bold align-middle" style={{ width: "12%" }}>QTY REQUIRED</th>
                                        <th className="px-2 py-2 text-center fw-bold align-middle" style={{ width: "12%" }}>YARN QTY</th>
                                        <th className="px-2 py-2 text-center fw-bold align-middle" style={{ width: "12%" }}>FABRIC</th>
                                        <th className="px-2 py-2 text-center fw-bold align-middle" style={{ width: "12%" }}>ACCESSORIES</th>
                                        <th className="px-2 py-2 text-center fw-bold align-middle" style={{ width: "12%" }}>DATE</th>
                                        <th className="px-2 py-2 text-center fw-bold align-middle" style={{ width: "100px" }}>ACTION</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {tableItems.map((item, index) => (
                                        <tr key={index} className="border-bottom" style={{ backgroundColor: index % 2 === 0 ? "#fff" : "#f9f9f9" }}>
                                            <td className="text-center align-middle">{index + 1}</td>

                                            {/* STYLE - Dropdown */}
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
                                            {/* COLOR - Dropdown */}
                                            <td className="px-2 py-2 align-middle">
                                                <Form.Select
                                                    size="sm"
                                                    value={item.color}
                                                    onChange={(e) =>
                                                        handleTableItemChange(index, "color", e.target.value)
                                                    }
                                                    style={{ height: "36px", fontSize: "0.85rem" }}
                                                >
                                                    <option value="">Select</option>
                                                    {colorOptions.map((color, index) => (
                                                        <option key={index} value={color.name}>
                                                            {color.name}
                                                        </option>
                                                    ))}
                                                </Form.Select>
                                            </td>
                                            {/* QTY REQUIRED */}
                                            <td className="px-2 py-2 align-middle">
                                                <Form.Control
                                                    size="sm"
                                                    type="number"
                                                    value={item.qtyRequired}
                                                    onChange={(e) => handleTableItemChange(index, "qtyRequired", e.target.value)}
                                                    placeholder="Qty"
                                                    className="text-center"
                                                    style={{ height: "36px", fontSize: "0.85rem" }}
                                                />
                                            </td>

                                            {/* YARN QTY */}
                                            <td className="px-2 py-2 align-middle">
                                                <Form.Control
                                                    size="sm"
                                                    type="number"
                                                    value={item.yarnQty}
                                                    onChange={(e) => handleTableItemChange(index, "yarnQty", e.target.value)}
                                                    placeholder="Yarn"
                                                    className="text-center"
                                                    style={{ height: "36px", fontSize: "0.85rem" }}
                                                />
                                            </td>

                                            {/* FABRIC */}
                                            <td className="px-2 py-2 align-middle">
                                                <Form.Control
                                                    size="sm"
                                                    type="number"
                                                    value={item.fabric}
                                                    onChange={(e) => handleTableItemChange(index, "fabric", e.target.value)}
                                                    placeholder="Fabric"
                                                    className="text-center"
                                                    style={{ height: "36px", fontSize: "0.85rem" }}
                                                />
                                            </td>

                                            {/* ACCESSORIES */}
                                            <td className="px-2 py-2 align-middle">
                                                <Form.Control
                                                    size="sm"
                                                    type="number"
                                                    value={item.accessories}
                                                    onChange={(e) => handleTableItemChange(index, "accessories", e.target.value)}
                                                    placeholder="Access."
                                                    className="text-center"
                                                    style={{ height: "36px", fontSize: "0.85rem" }}
                                                />
                                            </td>

                                            {/* DATE */}
                                            <td className="px-2 py-2 align-middle">
                                                <Form.Control
                                                    size="sm"
                                                    type="date"
                                                    value={item.date}
                                                    onChange={(e) => handleTableItemChange(index, "date", e.target.value)}
                                                    style={{ height: "36px", fontSize: "0.85rem" }}
                                                />
                                            </td>

                                            {/* ACTION - + and - Buttons */}
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
                        <Button type="button" variant="outline-secondary" onClick={() => navigate("/dying/received")}>
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