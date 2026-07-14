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
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { db, storage } from "config/firebase";
import {
  Row,
  Col,
  Card,
  Form,
  Button,
  Table
} from "react-bootstrap";

export default function AddPurchaseOrder() {

  const navigate = useNavigate();
  const { id } = useParams();
  const [clients, setClients] = useState([]);
  // const [images, setImages] = useState([]);
  // const [previewImages, setPreviewImages] = useState([]);

  const emptyProduct = {
    image: null,
    preview: "",
    style: "",
    shipDate: "",
    ppk: "",
    size12: "",
    size18: "",
    size24: "",
    perCtn: "",
    totalUnits: "",
    cost: "",
    totalCost: ""
  };

  const [products, setProducts] = useState([emptyProduct]);

  const [formData, setFormData] = useState({
    po: "",
    pid: "",
    clientId: "",
    stage: "",
    shipVia: "",
    shipDate: "",
    referenceNo: "",
    terms: "",
    division: "",
    season: "",
    revised: "",
    currency: "USD",
    fromCompany: "",
    fromPhone: "",
    fromEmail: "",
    fromAddress: "",
    fromCity: "",
    fromCountry: "",
    toCompany: "",
    toPhone: "",
    toEmail: "",
    toAddress: "",
    toCity: "",
    toCountry: "",
    shipCompany: "",
    shipPhone: "",
    shipEmail: "",
    shipAddress: "",
    shipCity: "",
    shipCountry: "",
    remarks: ""
  });

  useEffect(() => {
    loadClients();
    if (id) {
      loadPurchaseOrder();
    }
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleProductChange = (index, field, value) => {
    const rows = [...products];
    rows[index][field] = value;
    const qty12 = Number(rows[index].size12 || 0);
    const qty18 = Number(rows[index].size18 || 0);
    const qty24 = Number(rows[index].size24 || 0);
    const totalUnits = qty12 + qty18 + qty24;
    rows[index].totalUnits = totalUnits;
    const cost = Number(rows[index].cost || 0);
    rows[index].totalCost = (totalUnits * cost).toFixed(2);
    setProducts(rows);
  };

  const addRow = () => {
    setProducts([...products, { ...emptyProduct }]);
  };

  const removeRow = (index) => {
    if (products.length === 1) return;
    const rows = [...products];
    rows.splice(index, 1);
    setProducts(rows);
  };

  const handleProductImage = (index, file) => {
    if (!file) return;
    const rows = [...products];
    rows[index].image = file;
    rows[index].preview = URL.createObjectURL(file);
    setProducts(rows);
  };

  const totalProducts = products.length;
  const totalUnits = products.reduce((sum, item) => {
    return sum + Number(item.totalUnits || 0);
  }, 0);

  const grandTotal = products.reduce((sum, item) => {
    return sum + Number(item.totalCost || 0);
  }, 0);

  const uploadProductImages = async () => {
    const updatedProducts = [];

    for (const product of products) {
      let imageUrl = product.preview || "";

      if (product.image instanceof File) {
        const imageRef = ref(
          storage,
          `purchaseOrders/${Date.now()}_${product.image.name}`
        );

        await uploadBytes(imageRef, product.image);
        imageUrl = await getDownloadURL(imageRef);
      }

      updatedProducts.push({
        ...product,
        image: imageUrl,
        preview: imageUrl
      });
    }

    return updatedProducts;
  };

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

  const loadPurchaseOrder = async () => {
    try {
      const docRef = doc(db, "purchaseOrders", id);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const data = docSnap.data();

        setFormData({
          ...formData,
          ...data
        });

        if (data.products && data.products.length > 0) {
          setProducts(
            data.products.map((product) => ({
              ...product,
              preview: product.image || "",
              image: product.image || ""
            }))
          );
        }
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to load Purchase Order");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const uploadedProducts = await uploadProductImages();
      const selectedClient = clients.find(
        (client) => client.id === formData.clientId
      );
      const data = {
        ...formData,
        clientName: selectedClient?.name || "",
        products: uploadedProducts,
        totalProducts,
        totalUnits,
        grandTotal,
        updatedAt: new Date()
      };
      if (id) {
        await updateDoc(doc(db, "purchaseOrders", id), data);
        toast.success("Purchase Order Updated Successfully");
      } else {
        await addDoc(collection(db, "purchaseOrders"), {
          ...data,
          createdAt: new Date()
        });
        toast.success("Purchase Order Added Successfully");
      }
      navigate("/purchase-order/list");
    } catch (error) {
      console.error(error);
      toast.error(error.message);
    }
  };

  return (
    <div className="container-fluid p-4">
      {/* HEADER */}
      <div className="text-center py-4 border-bottom mb-4">
        <h2 className="fw-bold text-uppercase mb-0" style={{ letterSpacing: "2px", fontSize: "2rem" }}>
          PURCHASE ORDER
        </h2>
      </div>

      {/* FORM */}
      <form onSubmit={handleSubmit}>

        {/* ROW 1: SELECT CLIENT + PO DETAILS */}
        <Row className="mb-4 g-3">
          {/* SELECT CLIENT + SHIP TO */}
          <Col lg={5}>
            <Card className="border-2 shadow-sm h-100">
              <Card.Header className="bg-light border-bottom-2 py-2">
                <h6 className="mb-0 fw-bold text-uppercase" style={{ fontSize: "0.85rem", letterSpacing: "1px" }}>
                  SELECT CLIENT
                </h6>
              </Card.Header>
              <Card.Body className="p-3 h-100">

                {/* EXISTING CLIENT */}
                <Form.Group className="mb-3">
                  <Form.Label className="small fw-bold text-uppercase text-muted" style={{ fontSize: "0.75rem" }}>
                    Existing Client
                  </Form.Label>
                  <Form.Select
                    name="clientId"
                    value={formData.clientId}
                    onChange={handleChange}
                    className="border-1"
                    style={{ borderRadius: "8px" }}
                  >
                    <option value="">Select Client</option>
                    {clients.map((client) => (
                      <option key={client.id} value={client.id}>
                        {client.name}
                      </option>
                    ))}
                  </Form.Select>
                </Form.Group>

                {/* ADD NEW CLIENT BUTTON */}
                <Button
                  variant="outline-primary"
                  size="sm"
                  onClick={() => navigate("/client/add")}
                  className="w-100 mb-3"
                >
                  + Add New Client
                </Button>
                <hr className="my-3" />

                {/* SHIP TO - Yaha shift kar diya */}
                <Form.Group>
                  <Form.Label className="small fw-bold text-uppercase text-muted" style={{ fontSize: "0.75rem" }}>
                    Shipping Address
                  </Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={2}
                    name="shipAddress"
                    value={formData.shipAddress}
                    onChange={handleChange}
                    placeholder="Enter complete address..."
                    style={{
                      resize: "none",
                      borderRadius: "10px",
                      border: "1.5px solid #d6dbe1",
                      padding: "10px 12px",
                      fontSize: "14px",
                      lineHeight: "1.6",
                      background: "#fff",
                      transition: "all.25s ease",
                    }}
                    onFocus={(e) => {
                      e.target.style.borderColor = "#0d6efd";
                      e.target.style.boxShadow = "0 0 0 0.15rem rgba(13,110,253,.15)";
                      e.target.style.background = "#fff";
                    }}
                    onBlur={(e) => {
                      e.target.style.borderColor = "#d6dbe1";
                      e.target.style.boxShadow = "none";
                      e.target.style.background = "#d6dbe1";
                    }}
                  />
                </Form.Group>

              </Card.Body>
            </Card>
          </Col>
          {/* PO DETAILS */}
          <Col lg={7}>
            <Card className="border-2 shadow-sm h-100">
              <Card.Header className="bg-light border-bottom-2 py-2">
                <h6 className="mb-0 fw-bold text-uppercase" style={{ fontSize: "0.85rem", letterSpacing: "1px" }}>
                  Purchase Order Details
                </h6>
              </Card.Header>
              <Card.Body className="p-3 h-100">
                <Row className="g-2">
                  <Col md={6} lg={4}>
                    <Form.Group>
                      <Form.Label className="small fw-bold text-uppercase text-muted" style={{ fontSize: "0.75rem" }}>
                        PO Number
                      </Form.Label>
                      <Form.Control
                        size="sm"
                        name="po"
                        value={formData.po}
                        onChange={handleChange}
                        className="border-1"
                      />
                    </Form.Group>
                  </Col>
                  <Col md={6} lg={4}>
                    <Form.Group>
                      <Form.Label className="small fw-bold text-uppercase text-muted" style={{ fontSize: "0.75rem" }}>
                        PID
                      </Form.Label>
                      <Form.Control
                        size="sm"
                        name="pid"
                        value={formData.pid}
                        onChange={handleChange}
                        className="border-1"
                      />
                    </Form.Group>
                  </Col>
                  <Col md={6} lg={4}>
                    <Form.Group>
                      <Form.Label className="small fw-bold text-uppercase text-muted" style={{ fontSize: "0.75rem" }}>
                        Ship Date
                      </Form.Label>
                      <Form.Control
                        size="sm"
                        type="date"
                        name="shipDate"
                        value={formData.shipDate}
                        onChange={handleChange}
                        className="border-1"
                      />
                    </Form.Group>
                  </Col>
                  <Col md={6} lg={4}>
                    <Form.Group>
                      <Form.Label className="small fw-bold text-uppercase text-muted" style={{ fontSize: "0.75rem" }}>
                        Ship Via
                      </Form.Label>
                      <Form.Select
                        size="sm"
                        name="shipVia"
                        value={formData.shipVia}
                        onChange={handleChange}
                        className="border-1"
                      >
                        <option value="">Select</option>
                        <option>Sea</option>
                        <option>Air</option>
                        <option>Courier</option>
                        <option>EV CARGO</option>
                      </Form.Select>
                    </Form.Group>
                  </Col>
                  <Col md={6} lg={4}>
                    <Form.Group>
                      <Form.Label className="small fw-bold text-uppercase text-muted" style={{ fontSize: "0.75rem" }}>
                        Stage
                      </Form.Label>
                      <Form.Select
                        size="sm"
                        name="stage"
                        value={formData.stage}
                        onChange={handleChange}
                        className="border-1"
                      >
                        <option value="">Select</option>
                        <option>Draft</option>
                        <option>Pending</option>
                        <option>Approved</option>
                        <option>Completed</option>
                        <option>Order Issued</option>
                      </Form.Select>
                    </Form.Group>
                  </Col>
                  <Col md={6} lg={4}>
                    <Form.Group>
                      <Form.Label className="small fw-bold text-uppercase text-muted" style={{ fontSize: "0.75rem" }}>
                        Reference No
                      </Form.Label>
                      <Form.Control
                        size="sm"
                        name="referenceNo"
                        value={formData.referenceNo}
                        onChange={handleChange}
                        className="border-1"
                      />
                    </Form.Group>
                  </Col>
                  <Col md={6} lg={3}>
                    <Form.Group>
                      <Form.Label className="small fw-bold text-uppercase text-muted" style={{ fontSize: "0.75rem" }}>
                        Terms
                      </Form.Label>
                      <Form.Control
                        size="sm"
                        name="terms"
                        value={formData.terms}
                        onChange={handleChange}
                        className="border-1"
                      />
                    </Form.Group>
                  </Col>
                  <Col md={6} lg={3}>
                    <Form.Group>
                      <Form.Label className="small fw-bold text-uppercase text-muted" style={{ fontSize: "0.75rem" }}>
                        Division
                      </Form.Label>
                      <Form.Control
                        size="sm"
                        name="division"
                        value={formData.division}
                        onChange={handleChange}
                        className="border-1"
                      />
                    </Form.Group>
                  </Col>
                  <Col md={6} lg={3}>
                    <Form.Group>
                      <Form.Label className="small fw-bold text-uppercase text-muted" style={{ fontSize: "0.75rem" }}>
                        Season
                      </Form.Label>
                      <Form.Control
                        size="sm"
                        name="season"
                        value={formData.season}
                        onChange={handleChange}
                        className="border-1"
                      />
                    </Form.Group>
                  </Col>
                  <Col md={6} lg={3}>
                    <Form.Group>
                      <Form.Label className="small fw-bold text-uppercase text-muted" style={{ fontSize: "0.75rem" }}>
                        Last Revised
                      </Form.Label>
                      <Form.Control
                        size="sm"
                        type="date"
                        name="revised"
                        value={formData.revised}
                        onChange={handleChange}
                        className="border-1"
                      />
                    </Form.Group>
                  </Col>
                </Row>
              </Card.Body>
            </Card>
          </Col>
        </Row>

        <Card className="border-2 shadow-sm mb-4">
          <Card.Header className="bg-light border-bottom-2 py-3 d-flex justify-content-between align-items-center">
            <h6 className="mb-0 fw-bold text-uppercase" style={{ fontSize: "0.85rem", letterSpacing: "1px" }}>
              PRODUCTS / ITEMS
            </h6>
            <Button type="button" size="sm" variant="primary" onClick={addRow} className="px-3" style={{ fontSize: "0.9rem", fontWeight: "600" }}>
              + Add Product
            </Button>
          </Card.Header>
          <Card.Body className="p-0">
            <div className="table-responsive">
              <Table borderless className="mb-0" style={{ fontSize: "0.85rem" }}>
                <thead>
                  <tr className="border-top border-bottom" style={{ backgroundColor: "#d9dcdf" }}>
                    <th className="px-2 py-2 text-center fw-bold align-middle" style={{ width: "90px" }}>IMAGE</th>
                    <th className="px-2 py-2 fw-bold align-middle" style={{ minWidth: "120px" }}>STYLE</th>
                    <th className="px-2 py-2 fw-bold align-middle" style={{ minWidth: "130px" }}>SHIP DATE</th>
                    <th className="px-2 py-2 text-center fw-bold align-middle" style={{ width: "70px" }}>PPK</th>
                    <th className="px-2 py-2 text-center fw-bold align-middle" style={{ width: "60px" }}>12M</th>
                    <th className="px-2 py-2 text-center fw-bold align-middle" style={{ width: "60px" }}>18M</th>
                    <th className="px-2 py-2 text-center fw-bold align-middle" style={{ width: "60px" }}>24M</th>
                    <th className="px-2 py-2 text-center fw-bold align-middle" style={{ width: "80px" }}>PER CTN</th>
                    <th className="px-2 py-2 text-center fw-bold align-middle" style={{ width: "90px" }}>TOTAL UNITS</th>
                    <th className="px-2 py-2 text-center fw-bold align-middle" style={{ width: "90px" }}>COST</th>
                    <th className="px-2 py-2 text-center fw-bold align-middle" style={{ width: "110px" }}>TOTAL COST</th>
                    <th className="px-2 py-2 text-center fw-bold align-middle" style={{ width: "70px" }}>ACTION</th>
                  </tr>
                </thead>
                <tbody>
                  {products.map((item, index) => (
                    <tr key={index} className="border-bottom" style={{ backgroundColor: index % 2 === 0 ? "#fff" : "#f9f9f9" }}>
                      {/* IMAGE */}
                      <td className="px-2 py-2 text-center align-middle">
                        <div className="d-flex flex-column align-items-center gap-1">
                          {item.preview ? (
                            <img src={item.preview || item.image} alt="preview" style={{ width: "60px", height: "60px", objectFit: "cover", border: "1px solid #ddd", borderRadius: "4px" }} />
                          ) : (
                            <div style={{ width: "60px", height: "60px", display: "flex", alignItems: "center", justifyContent: "center", border: "1px dashed #ddd", borderRadius: "4px", backgroundColor: "#f8f9fa", fontSize: "0.7rem", color: "#999" }}>
                              No Image
                            </div>
                          )}
                          <Form.Control type="file" accept="image/*" size="sm" onChange={(e) => handleProductImage(index, e.target.files[0])} style={{ fontSize: "0.7rem", padding: "2px 4px", width: "85px" }} />
                        </div>
                      </td>

                      {/* STYLE */}
                      <td className="px-2 py-2 align-middle">
                        <Form.Control size="sm" value={item.style} onChange={(e) => handleProductChange(index, "style", e.target.value)} placeholder="Style #" style={{ height: "36px", width: "100%", fontSize: "0.85rem", padding: "6px 8px" }} />
                      </td>

                      {/* SHIP DATE */}
                      <td className="px-2 py-2 align-middle">
                        <Form.Control size="sm" type="date" value={item.shipDate} onChange={(e) => handleProductChange(index, "shipDate", e.target.value)} style={{ height: "36px", width: "100%", fontSize: "0.85rem", padding: "6px 8px" }} />
                      </td>

                      {/* PPK, 12M, 18M, 24M, PER CTN */}
                      {["ppk", "size12", "size18", "size24", "perCtn"].map(field => (
                        <td key={field} className="px-2 py-2 align-middle">
                          <Form.Control size="sm" type="number" value={item[field]} onChange={(e) => handleProductChange(index, field, e.target.value)} className="text-center" placeholder="0" style={{ height: "36px", width: "100%", fontSize: "0.85rem", padding: "6px 4px" }} />
                        </td>
                      ))}

                      {/* TOTAL UNITS */}
                      <td className="px-2 py-2 align-middle">
                        <Form.Control
                          size="sm"
                          type="number"
                          value={item.totalUnits}
                          readOnly
                          className="text-center fw-bold" style={{ height: "36px", width: "100%", fontSize: "0.85rem", backgroundColor: "#f8f9fa", padding: "6px 4px" }} />
                      </td>

                      {/* COST */}
                      <td className="px-2 py-2 align-middle">
                        <Form.Control size="sm" type="number" step="0.01" value={item.cost} onChange={(e) => handleProductChange(index, "cost", e.target.value)} className="text-center" placeholder="0.00" style={{ height: "36px", width: "100%", fontSize: "0.85rem", padding: "6px 4px" }} />
                      </td>

                      {/* TOTAL COST */}
                      <td className="px-2 py-2 align-middle">
                        <Form.Control
                          size="sm"
                          type="number"
                          value={item.totalCost}
                          readOnly className="text-center fw-bold" style={{ height: "36px", width: "100%", fontSize: "0.85rem", backgroundColor: "#e7f3ff", color: "#0c63e4", padding: "6px 4px" }} />
                      </td>

                      {/* ACTION */}
                      <td className="px-2 py-2 text-center align-middle">
                        <div className="d-flex gap-1 justify-content-center">
                          <Button type="button" size="sm" variant="success" onClick={addRow} style={{ minWidth: "28px", height: "28px", padding: "0", fontSize: "0.9rem" }}>+</Button>
                          <Button type="button" size="sm" variant="danger" onClick={() => removeRow(index)} style={{ minWidth: "28px", height: "28px", padding: "0", fontSize: "0.9rem" }}>−</Button>
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
          {/* SUMMARY CARDS */}
          <div className="d-flex gap-3 flex-wrap">
            <Card className="border-1 shadow-sm" style={{ minWidth: "130px" }}>
              <Card.Body className="p-3 text-center">
                <div className="text-muted small text-uppercase fw-bold mb-2">
                  Total Products
                </div>
                <div className="fw-bold" style={{ fontSize: "1.25rem" }}>
                  {totalProducts}
                </div>
              </Card.Body>
            </Card>

            <Card className="border-1 shadow-sm" style={{ minWidth: "130px" }}>
              <Card.Body className="p-3 text-center">
                <div className="text-muted small text-uppercase fw-bold mb-2">
                  Total Units
                </div>
                <div className="fw-bold" style={{ fontSize: "1.25rem" }}>
                  {totalUnits.toLocaleString()}
                </div>
              </Card.Body>
            </Card>

            <Card className="border-1 shadow-sm" style={{ minWidth: "130px" }}>
              <Card.Body className="p-3 text-center">
                <div className="text-muted small text-uppercase fw-bold mb-2">
                  Grand Total
                </div>
                <div className="fw-bold text-success" style={{ fontSize: "1.25rem" }}>
                  ${grandTotal.toFixed(2)}
                </div>
              </Card.Body>
            </Card>
          </div>

          {/* ACTION BUTTONS */}
          <div className="d-flex gap-2">
            <Button
              type="button"
              variant="outline-secondary"
              onClick={() => navigate("/purchase-order/list")}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              className="px-4"
            >
              Save Purchase Order
            </Button>
          </div>
        </div>

      </form>
    </div>
  );
}
