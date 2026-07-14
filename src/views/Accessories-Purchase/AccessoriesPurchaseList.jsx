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

export default function AccessoriesPurchaseList() {
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
            const querySnapshot = await getDocs(collection(db, "accessoriesPurchases"));
            const data = querySnapshot.docs.map((doc) => ({
                id: doc.id,
                ...doc.data()
            }));
            console.log("Loaded purchases:", data);
            setPurchases(data);
            setFiltered(data);
        } catch (error) {
            console.error("Error loading:", error);
            toast.error("Failed to load Accessories Purchases");
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure you want to delete this Accessories Purchase?")) return;
        try {
            await deleteDoc(doc(db, "accessoriesPurchases", id));
            toast.success("Accessories Purchase Deleted Successfully");
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
            item.clientName?.toLowerCase().includes(value)
        );
        setFiltered(filteredData);
    };

    return (
        <div className="container-fluid p-4">
            <Card className="shadow-sm border-0">
                <Card.Header className="bg-white border-0 d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3 py-3">
                    <h4 className="fw-bold mb-0">Accessories Purchases</h4>
                    <div className="d-flex gap-2 w-100 w-md-auto">
                        <Form.Control
                            type="text"
                            placeholder="Search by PO, Client..."
                            value={search}
                            onChange={handleSearch}
                            className="border-1"
                            style={{ minWidth: "250px", borderRadius: "8px" }}
                        />
                        <Button
                            variant="primary"
                            onClick={() => navigate("/accessories-purchase/add")}
                            className="px-3"
                            style={{ whiteSpace: "nowrap" }}
                        >
                            + New Accessories Purchase
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
                                        <th className="text-center">Description</th>
                                        <th className="text-center">Quantity</th>
                                        <th className="text-center">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filtered.length > 0 ? (
                                        filtered.map((item) => (
                                            <tr key={item.id}>
                                                <td className="text-center fw-bold">{item.poNumber || "-"}</td>
                                                <td className="text-center">{item.clientName || "-"}</td>

                                                {/* Style */}
                                                <td className="text-center">
                                                    {item.accessoryItems && item.accessoryItems.length > 0 ? (
                                                        item.accessoryItems.map((acc, idx) => (
                                                            <div key={idx}>{acc.style || "-"}</div>
                                                        ))
                                                    ) : "-"}
                                                </td>

                                                {/* Description */}
                                                <td className="text-center">
                                                    {item.accessoryItems && item.accessoryItems.length > 0 ? (
                                                        item.accessoryItems.map((acc, idx) => (
                                                            <div key={idx}>{acc.description || "-"}</div>
                                                        ))
                                                    ) : "-"}
                                                </td>

                                                {/* Quantity */}
                                                <td className="text-center">
                                                    {item.accessoryItems && item.accessoryItems.length > 0 ? (
                                                        item.accessoryItems.map((acc, idx) => (
                                                            <div key={idx}>{acc.quantity || "-"}</div>
                                                        ))
                                                    ) : "-"}
                                                </td>

                                                {/* Actions - View, Edit, Delete */}
                                                <td className="text-center">
                                                    <div className="d-flex gap-1 justify-content-center">
                                                        <Button
                                                            size="sm"
                                                            variant="outline-primary"
                                                            onClick={() => navigate(`/accessories-purchase/view/${item.id}`)}
                                                        >
                                                            View
                                                        </Button>
                                                        <Button
                                                            size="sm"
                                                            variant="outline-warning"
                                                            onClick={() => navigate(`/accessories-purchase/edit/${item.id}`)}
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
                                            <td colSpan="6" className="text-center py-4 text-muted">
                                                No Accessories Purchases found.{" "}
                                                <Button variant="link" onClick={() => navigate("/accessories-purchase/add")}>
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