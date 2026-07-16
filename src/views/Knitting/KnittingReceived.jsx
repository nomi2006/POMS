import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { collection, getDocs, deleteDoc, doc } from "firebase/firestore";
import { db } from "config/firebase";
import { toast } from "react-toastify";
import {
  Card,
  Table,
  Button,
  Form
} from "react-bootstrap";

export default function KnittingReceived() {
  const navigate = useNavigate();
  const [data, setData] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const querySnapshot = await getDocs(collection(db, "knittingSent"));
      
      const data = querySnapshot.docs.map((doc) => {
        const docData = doc.data();
        
        // 🔍 Check if tableItems exists and has data
        let style = "-", color = "#ddd", colorName = "-", qty = "-", date = "-";
        
        if (docData.tableItems && docData.tableItems.length > 0) {
          const item = docData.tableItems[0];
          style = item.style || "-";
          color = item.color || "#ddd";
          colorName = item.colorName || item.color || "-";
          qty = item.qtyRequired || item.quantity || "-";
          date = item.date || "-";
        } else {
          // Fallback to top-level fields
          style = docData.style || "-";
          color = docData.color || "#ddd";
          colorName = docData.colorName || docData.color || "-";
          qty = docData.quantity || docData.qtyRequired || "-";
          date = docData.date || "-";
        }
        
        return {
          id: doc.id,
          style: style,
          color: color,
          colorName: colorName,
          quantity: qty,
          date: date
        };
      });
      
      console.log("Final Processed Data:", data);
      setData(data);
      setFiltered(data);
      
    } catch (error) {
      console.error("Error loading:", error);
      toast.error("Failed to load data");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this record?")) return;
    try {
      await deleteDoc(doc(db, "knittingSent", id));
      toast.success("Record Deleted Successfully");
      loadData();
    } catch (error) {
      console.error(error);
      toast.error("Failed to delete");
    }
  };

  const handleSearch = (e) => {
    const value = e.target.value.toLowerCase();
    setSearch(value);
    const filteredData = data.filter((item) =>
      item.style?.toLowerCase().includes(value) ||
      item.colorName?.toLowerCase().includes(value)
    );
    setFiltered(filteredData);
  };

  return (
    <div className="container-fluid p-4">
      <Card className="shadow-sm border-0">
        <Card.Header className="bg-white border-0 d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3 py-3">
          <h4 className="fw-bold mb-0">Knitting Received</h4>
          <div className="d-flex gap-2 w-100 w-md-auto">
            <Form.Control
              type="text"
              placeholder="Search by Style, Color..."
              value={search}
              onChange={handleSearch}
              className="border-1"
              style={{ minWidth: "250px", borderRadius: "8px" }}
            />
            <Button
              variant="primary"
              onClick={() => navigate("/knitting/sent")}
              className="px-3"
              style={{ whiteSpace: "nowrap" }}
            >
              + New Knitting
            </Button>
          </div>
        </Card.Header>
        <Card.Body className="p-0">
          {loading ? (
            <div className="text-center py-5">
              <h5>Loading...</h5>
            </div>
          ) : (
            <div className="table-responsive">
              <Table hover className="mb-0 align-middle" style={{ fontSize: "0.9rem" }}>
                <thead className="table-light">
                  <tr>
                    <th className="text-center">Style</th>
                    <th className="text-center">Color</th>
                    <th className="text-center">Quantity</th>
                    <th className="text-center">Date</th>
                    <th className="text-center">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.length > 0 ? (
                    filtered.map((item) => (
                      <tr key={item.id}>
                        <td className="text-center">{item.style || "-"}</td>
                        <td className="text-center">
                          <span 
                            className="d-inline-block me-1" 
                            style={{ 
                              width: "18px", 
                              height: "18px", 
                              backgroundColor: item.color || "#ddd", 
                              borderRadius: "50%", 
                              border: "2px solid #ccc",
                              display: "inline-block",
                              verticalAlign: "middle"
                            }}
                          />
                          {item.colorName || item.color || "-"}
                        </td>
                        <td className="text-center">{item.quantity || "-"}</td>
                        <td className="text-center">{item.date || "-"}</td>
                        <td className="text-center">
                          <div className="d-flex gap-1 justify-content-center">
                            <Button
                              size="sm"
                              variant="outline-warning"
                              onClick={() => navigate(`/knitting/edit/${item.id}`)}
                            >
                              Edit
                            </Button>
                            <Button
                              size="sm"
                              variant="outline-danger"
                              onClick={() => handleDelete(item.id)}
                            >
                              Delete
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="5" className="text-center py-4 text-muted">
                        No records found.{" "}
                        <Button variant="link" onClick={() => navigate("/knitting/sent")}>
                          Create one now
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
            Total: {filtered.length} record{filtered.length !== 1 ? "s" : ""}
          </div>
        </Card.Footer>
      </Card>
    </div>
  );
}