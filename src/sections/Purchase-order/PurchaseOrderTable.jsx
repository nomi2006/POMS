import Table from 'react-bootstrap/Table';
import MainCard from 'components/MainCard';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import { useEffect, useState } from "react";
import { db } from "config/firebase";
import { collection, getDocs, deleteDoc, doc } from "firebase/firestore";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";

export default function PurchaseOrderTable() {
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [search, setSearch] = useState("");
  const [pending, setPending] = useState(0);
  const [today, setToday] = useState(0);
  const [yesterday, setYesterday] = useState(0);
  const [thisMonth, setThisMonth] = useState(0);

  const loadOrders = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, "purchaseOrders"));

      const data = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data()
      }));

      setOrders(data);
      setFilteredOrders(data);

      const now = new Date();
      const todayDate = now.toDateString();
      const yesterdayDate = new Date();
      yesterdayDate.setDate(now.getDate() - 1);
      const month = now.getMonth();
      const year = now.getFullYear();

      let pendingCount = 0;
      let todayCount = 0;
      let yesterdayCount = 0;
      let monthCount = 0;

      data.forEach((order) => {
        // Agar published field nahi hai to condition hata do
        if (order.published === false) {
          pendingCount++;
        }

        if (order.createdAt) {
          const date = order.createdAt.toDate();

          if (date.toDateString() === todayDate) {
            todayCount++;
          }

          if (date.toDateString() === yesterdayDate.toDateString()) {
            yesterdayCount++;
          }

          if (
            date.getMonth() === month &&
            date.getFullYear() === year
          ) {
            monthCount++;
          }
        }
      });
      setPending(pendingCount);
      setToday(todayCount);
      setYesterday(yesterdayCount);
      setThisMonth(monthCount);
    } catch (error) {
      console.log(error);
    }
  };

  const handleSearch = (e) => {
    const value = e.target.value;
    setSearch(value);
    const filtered = orders.filter((order) =>
      `${order.clientName || ""} ${order.po || ""} ${order.pid || ""} ${order.stage || ""}`
        .toLowerCase()
        .includes(value.toLowerCase())
    );
    setFilteredOrders(filtered);
  };
  const handleDelete = async (id) => {
    if (!window.confirm("Delete this Purchase Order?")) return;

    try {
      await deleteDoc(doc(db, "purchaseOrders", id));

      toast.success("Purchase Order deleted successfully");

      loadOrders();
    } catch (error) {
      console.error(error);

      toast.error("Failed to delete Purchase Order");
    }
  };
  
  useEffect(() => {
    loadOrders();
  }, []);

  return (
    <>
      <Row className="mb-3">
        <Col md={3}>
          <MainCard>
            <h2 className="text-primary">{pending}</h2>
            <p>Pending</p>
          </MainCard>
        </Col>

        <Col md={3}>
          <MainCard>
            <h2>{today}</h2>
            <p>Today</p>
          </MainCard>
        </Col>

        <Col md={3}>
          <MainCard>
            <h2>{yesterday}</h2>
            <p>Yesterday</p>
          </MainCard>
        </Col>

        <Col md={3}>
          <MainCard>
            <h2>{thisMonth}</h2>
            <p>This Month</p>
          </MainCard>
        </Col>
      </Row>

      <MainCard
        title="ALL ORDERS"
        secondary={<Button variant="light">Filters ▼</Button>}
      >
        <Row className="mb-3">
          <Col md={12}>
            <div className="position-relative">
              <Form.Control
                placeholder="Search by Client, PO#, PID or Name..."
                value={search}
                onChange={handleSearch}
              />
              <span
                style={{
                  position: 'absolute',
                  right: '15px',
                  top: '8px'
                }}
              >
                🔍
              </span>
            </div>
          </Col>
        </Row>

        <Table responsive hover>
          <thead>
            <tr>
              <th>Image</th>
              <th>PO #</th>
              <th>Client</th>
              <th>PID</th>
              <th>Stage</th>
              <th>Ship Date</th>
              <th>Total Units</th>
              <th>Grand Total</th>
              <th>Action</th>
            </tr>
          </thead>

          <tbody>
            {filteredOrders.map((order) => (
              <tr key={order.id}>
                <td>
                  {order.products?.length > 0 &&
                    (order.products[0].preview || order.products[0].image) ? (
                    <img
                      src={order.products[0].preview || order.products[0].image}
                      alt="Product"
                      style={{
                        width: 60,
                        height: 60,
                        objectFit: "cover",
                        borderRadius: 8
                      }}
                    />
                  ) : (
                    "No Image"
                  )}
                </td>
                <td>{order.po || "-"}</td>
                <td>{order.clientName || "-"}</td>
                <td>{order.pid || "-"}</td>
                <td>{order.stage || "-"}</td>
                <td>{order.shipDate || "-"}</td>
                <td>{order.totalUnits || 0}</td>
                <td>
                  ${Number(order.grandTotal || 0).toFixed(2)}
                </td>
                <td>
                  <Link
                    to={`/purchase-order/view/${order.id}`}
                    className="btn btn-sm btn-info me-2"
                  >
                    👁
                  </Link>
                  <Link
                    to={`/purchase-order/edit/${order.id}`}
                    className="btn btn-sm btn-primary me-2"
                  >
                    ✏
                  </Link>
                  <button
                    className="btn btn-sm btn-danger"
                    onClick={() => handleDelete(order.id)}
                  >
                    ❌
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </MainCard>
    </>
  );
}