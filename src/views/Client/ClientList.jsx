import { useEffect, useState } from "react";
import { collection, getDocs, deleteDoc, doc } from "firebase/firestore";
import { Link } from "react-router-dom";
import { db } from "config/firebase";

import MainCard from "components/MainCard";
import Table from "react-bootstrap/Table";
import Button from "react-bootstrap/Button";

export default function ClientList() {
    const [clients, setClients] = useState([]);

    const loadClients = async () => {
        const querySnapshot = await getDocs(collection(db, "clients"));

        const data = querySnapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data()
        }));

        setClients(data);
    };

    useEffect(() => {
        loadClients();
    }, []);

    const handleDelete = async (id) => {
        const confirmDelete = window.confirm(
            "Are you sure you want to delete this client?"
        );

        if (!confirmDelete) return;

        await deleteDoc(doc(db, "clients", id));

        loadClients();
    };

    return (
        <MainCard
            title="Client List"
            secondary={
                <Link to="/client/add">
                    <Button>Add Client</Button>
                </Link>
            }
        >
            <Table hover responsive>
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Company</th>
                        <th>Email</th>
                        <th>Phone</th>
                        <th>Action</th>
                    </tr>
                </thead>

                <tbody>
                    {clients.map((client) => (
                        <tr key={client.id}>
                            <td>{client.name}</td>
                            <td>{client.company}</td>
                            <td>{client.email}</td>
                            <td>{client.phone}</td>
                            <td>
                                <Link to={`/client/view/${client.id}`}>
                                    <Button
                                        variant="info"
                                        size="sm"
                                        className="me-2"
                                    >
                                        👁
                                    </Button>
                                </Link>

                                <Link to={`/client/edit/${client.id}`}>
                                    <Button
                                        variant="primary"
                                        size="sm"
                                        className="me-2"
                                    >
                                        ✏
                                    </Button>
                                </Link>

                                <Button
                                    variant="danger"
                                    size="sm"
                                    onClick={() => handleDelete(client.id)}
                                >
                                    ❌
                                </Button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </Table>
        </MainCard>
    );
}