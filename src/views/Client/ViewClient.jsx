import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { doc, getDoc, collection, getDocs } from "firebase/firestore";
import { db } from "config/firebase";

import MainCard from "components/MainCard";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";

export default function ViewClient() {
  const { id } = useParams();

  const [client, setClient] = useState(null);
  const [orderCount, setOrderCount] = useState(0);

  useEffect(() => {
    loadClient();
  }, []);

  const loadClient = async () => {
    const snap = await getDoc(doc(db, "clients", id));

    if (!snap.exists()) return;

    const clientData = snap.data();
    setClient(clientData);

    const orderSnap = await getDocs(collection(db, "purchaseOrders"));

    const total = orderSnap.docs.filter(
      (doc) => doc.data().client === clientData.name
    ).length;

    setOrderCount(total);
  };

  if (!client) return <h3>Loading...</h3>;

  return (
    <MainCard title="Client Details">
      <Row>

        <Col md={6}>
          <h6>Client Name</h6>
          <p>{client.name}</p>

          <h6>Company</h6>
          <p>{client.company}</p>

          <h6>Email</h6>
          <p>{client.email}</p>

          <h6>Phone</h6>
          <p>{client.phone}</p>

          <h6>Address</h6>
          <p>{client.address}</p>

          <h6>Total Purchase Orders</h6>
          <p>{orderCount}</p>
        </Col>

      </Row>
    </MainCard>
  );
}