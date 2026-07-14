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

export default function YarnPurchaseList() {
  const navigate = useNavigate();
  const [purchases, setPurchases] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadPurchases();
  }, []);

  const loadPurchases = async () => {
    try {
      setLoading(true);
      const querySnapshot = await getDocs(collection(db, "yarnPurchases"));
      const data = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data()
      }));
      console.log("Loaded purchases:", data);
      setPurchases(data);
      setFiltered(data);
    } catch (error) {
      console.error("Error loading:", error);
      toast.error("Failed to load Yarn Purchases");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this Yarn Purchase?")) return;
    try {
      await deleteDoc(doc(db, "yarnPurchases", id));
      toast.success("Yarn Purchase Deleted Successfully");
      loadPurchases();
    } catch (error) {
      console.error(error);
      toast.error("Failed to delete");
    }
  };

  const handleSearch = (e) => {
    const value = e.target.value.toLowerCase();
    setSearch(value);
    const filteredData = purchases.filter((item) =>
      item.poNumber?.toLowerCase().includes(value) ||
      item.clientName?.toLowerCase().includes(value) ||
      item.style?.toLowerCase().includes(value) ||
      item.millName?.toLowerCase().includes(value)
    );
    setFiltered(filteredData);
  };

  return (
    <div className="container-fluid p-4">
      <Card className="shadow-sm border-0">
        <Card.Header className="bg-white border-0 d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3 py-3">
          <h4 className="fw-bold mb-0">Yarn Purchases</h4>
          <div className="d-flex gap-2 w-100 w-md-auto">
            <Form.Control
              type="text"
              placeholder="Search by PO, Client, Style..."
              value={search}
              onChange={handleSearch}
              className="border-1"
              style={{ minWidth: "250px", borderRadius: "8px" }}
            />
            <Button
              variant="primary"
              onClick={() => navigate("/yarn-purchase/add")}
              className="px-3"
              style={{ whiteSpace: "nowrap" }}
            >
              + New Yarn Purchase
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
                    <th className="text-center">PO #</th>
                    <th className="text-center">Client</th>
                    <th className="text-center">Style</th>
                    <th className="text-center">Yarn Count</th>
                    <th className="text-center">Fabric Required</th>
                    <th className="text-center">Yarn Base</th>
                    <th className="text-center">Top Fabric</th>
                    <th className="text-center">Bottom Fabric</th>
                    <th className="text-center">Total Items</th>
                    <th className="text-center">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.length > 0 ? (
                    filtered.map((item) => (
                      <tr key={item.id}>
                        <td className="text-center fw-bold">{item.poNumber || "-"}</td>
                        <td className="text-center">{item.clientName || "-"}</td>
                        
                        {/* Style - Fixed to show from yarnItems */}
                        <td className="text-center">
                          {item.yarnItems && item.yarnItems.length > 0 ? (
                            item.yarnItems.map((yarn, idx) => (
                              <div key={idx}>{yarn.style || item.style || "-"}</div>
                            ))
                          ) : (item.style || "-")}
                        </td>
                        
                        {/* Yarn Count */}
                        <td className="text-center">
                          {item.yarnItems && item.yarnItems.length > 0 ? (
                            item.yarnItems.map((yarn, idx) => (
                              <div key={idx}>{yarn.yarnCount || "-"}</div>
                            ))
                          ) : "-"}
                        </td>
                        
                        {/* Fabric Required */}
                        <td className="text-center">
                          {item.yarnItems && item.yarnItems.length > 0 ? (
                            item.yarnItems.map((yarn, idx) => (
                              <div key={idx}>{yarn.fabricRequired || "-"}</div>
                            ))
                          ) : "-"}
                        </td>
                        
                        {/* Yarn Base */}
                        <td className="text-center">
                          {item.yarnItems && item.yarnItems.length > 0 ? (
                            item.yarnItems.map((yarn, idx) => (
                              <div key={idx}>{yarn.yarnBase || "-"}</div>
                            ))
                          ) : "-"}
                        </td>
                        
                        {/* Top Fabric */}
                        <td className="text-center">
                          {item.yarnItems && item.yarnItems.length > 0 ? (
                            item.yarnItems.map((yarn, idx) => (
                              <div key={idx}>{yarn.topFabric || "-"}</div>
                            ))
                          ) : "-"}
                        </td>
                        
                        {/* Bottom Fabric */}
                        <td className="text-center">
                          {item.yarnItems && item.yarnItems.length > 0 ? (
                            item.yarnItems.map((yarn, idx) => (
                              <div key={idx}>{yarn.bottomFabric || "-"}</div>
                            ))
                          ) : "-"}
                        </td>
                        
                        <td className="text-center">{item.totalItems || 0}</td>
                        
                        {/* Actions - View, Edit, Delete */}
                        <td className="text-center">
                          <div className="d-flex gap-1 justify-content-center">
                            <Button
                              size="sm"
                              variant="outline-primary"
                              onClick={() => navigate(`/yarn-purchase/view/${item.id}`)}
                            >
                              View
                            </Button>
                            <Button
                              size="sm"
                              variant="outline-warning"
                              onClick={() => navigate(`/yarn-purchase/edit/${item.id}`)}
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
                      <td colSpan="10" className="text-center py-4 text-muted">
                        No Yarn Purchases found.{" "}
                        <Button variant="link" onClick={() => navigate("/yarn-purchase/add")}>
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