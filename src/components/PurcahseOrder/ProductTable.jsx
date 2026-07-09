import { useMemo, useState } from "react";
import {
    Card,
    Table,
    Button,
    Form,
    Row,
    Col
} from "react-bootstrap";

export default function ProductTable() {

    const emptyRow = {
        image: null,
        preview: "",
        style: "",
        description: "",
        color: "",
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

    const [products, setProducts] = useState([emptyRow]);

    const handleChange = (index, field, value) => {

        const updated = [...products];

        updated[index][field] = value;

        setProducts(updated);

    };

    const addRow = () => {

        setProducts([
            ...products,
            { ...emptyRow }
        ]);

    };

    const removeRow = (index) => {

        if (products.length === 1) return;

        const updated = [...products];

        updated.splice(index, 1);

        setProducts(updated);

    };

    const handleImage = (index, file) => {

        if (!file) return;

        const updated = [...products];

        updated[index].image = file;

        updated[index].preview = URL.createObjectURL(file);

        setProducts(updated);

    };

    const totalProducts = products.length;

    const totalUnits = useMemo(() => {

        return products.reduce((sum, item) => {

            return sum + Number(item.totalUnits || 0);

        }, 0);

    }, [products]);

    const grandTotal = useMemo(() => {

        return products.reduce((sum, item) => {

            return sum + Number(item.totalCost || 0);

        }, 0);

    }, [products]);

    return (

        <Card className="mb-4">

            <Card.Header>

                <div className="d-flex justify-content-between">

                    <h5 className="mb-0">
                        Products
                    </h5>

                    <Button onClick={addRow}>
                        + Add Product
                    </Button>

                </div>

            </Card.Header>

            <Card.Body className="p-0">

                <Table
                    responsive
                    bordered
                    hover
                    className="mb-0"
                >

                    <thead>

                        <tr>

                            <th>Image</th>

                            <th>Style</th>

                            <th>Description</th>

                            <th>Color</th>

                            <th>Ship Date</th>

                            <th>PPK</th>

                            <th>12M</th>

                            <th>18M</th>

                            <th>24M</th>

                            <th>Per CTN</th>

                            <th>Total Units</th>

                            <th>Cost</th>

                            <th>Total Cost</th>

                            <th width="120">
                                Action
                            </th>

                        </tr>

                    </thead>

                    <tbody>

                        {products.map((product, index) => (

                            <tr key={index}>

                                <td>

                                    <div
                                        style={{
                                            width: 80,
                                            height: 80,
                                            border: "1px solid #ddd",
                                            borderRadius: 8,
                                            overflow: "hidden",
                                            marginBottom: 10
                                        }}
                                    >

                                        {product.preview ? (

                                            <img
                                                src={product.preview}
                                                alt=""
                                                style={{
                                                    width: "100%",
                                                    height: "100%",
                                                    objectFit: "cover"
                                                }}
                                            />

                                        ) : (

                                            <div
                                                style={{
                                                    display: "flex",
                                                    justifyContent: "center",
                                                    alignItems: "center",
                                                    height: "100%"
                                                }}
                                            >
                                                No Image
                                            </div>

                                        )}

                                    </div>

                                    <Form.Control
                                        type="file"
                                        accept="image/*"
                                        onChange={(e) =>
                                            handleImage(index, e.target.files[0])
                                        }
                                    />

                                </td>

                                <td>

                                    <Form.Control
                                        value={product.style}
                                        onChange={(e) =>
                                            handleChange(
                                                index,
                                                "style",
                                                e.target.value
                                            )
                                        }
                                    />

                                </td>

                                <td>

                                    <Form.Control
                                        value={product.description}
                                        onChange={(e) =>
                                            handleChange(
                                                index,
                                                "description",
                                                e.target.value
                                            )
                                        }
                                    />

                                </td>

                                <td>

                                    <Form.Control
                                        value={product.color}
                                        onChange={(e) =>
                                            handleChange(
                                                index,
                                                "color",
                                                e.target.value
                                            )
                                        }
                                    />

                                </td>

                                <td>

                                    <Form.Control
                                        type="date"
                                        value={product.shipDate}
                                        onChange={(e) =>
                                            handleChange(
                                                index,
                                                "shipDate",
                                                e.target.value
                                            )
                                        }
                                    />

                                </td>

                                <td>

                                    <Form.Control
                                        value={product.ppk}
                                        onChange={(e) =>
                                            handleChange(
                                                index,
                                                "ppk",
                                                e.target.value
                                            )
                                        }
                                    />

                                </td>

                                <td>

                                    <Form.Control
                                        value={product.size12}
                                        onChange={(e) =>
                                            handleChange(
                                                index,
                                                "size12",
                                                e.target.value
                                            )
                                        }
                                    />

                                </td>

                                <td>

                                    <Form.Control
                                        value={product.size18}
                                        onChange={(e) =>
                                            handleChange(
                                                index,
                                                "size18",
                                                e.target.value
                                            )
                                        }
                                    />

                                </td>

                                <td>

                                    <Form.Control
                                        value={product.size24}
                                        onChange={(e) =>
                                            handleChange(
                                                index,
                                                "size24",
                                                e.target.value
                                            )
                                        }
                                    />

                                </td>

                                <td>

                                    <Form.Control
                                        value={product.perCtn}
                                        onChange={(e) =>
                                            handleChange(
                                                index,
                                                "perCtn",
                                                e.target.value
                                            )
                                        }
                                    />

                                </td>

                                <td>

                                    <Form.Control
                                        value={product.totalUnits}
                                        onChange={(e) =>
                                            handleChange(
                                                index,
                                                "totalUnits",
                                                e.target.value
                                            )
                                        }
                                    />

                                </td>

                                <td>

                                    <Form.Control
                                        value={product.cost}
                                        onChange={(e) =>
                                            handleChange(
                                                index,
                                                "cost",
                                                e.target.value
                                            )
                                        }
                                    />

                                </td>

                                <td>

                                    <Form.Control
                                        value={product.totalCost}
                                        onChange={(e) =>
                                            handleChange(
                                                index,
                                                "totalCost",
                                                e.target.value
                                            )
                                        }
                                    />

                                </td>

                                <td>

                                    <div className="d-flex gap-2">

                                        <Button
                                            size="sm"
                                            onClick={addRow}
                                        >
                                            +
                                        </Button>

                                        <Button
                                            size="sm"
                                            variant="danger"
                                            onClick={() =>
                                                removeRow(index)
                                            }
                                        >
                                            −
                                        </Button>

                                    </div>

                                </td>

                            </tr>

                        ))}

                    </tbody>

                </Table>

                <hr />

                <Row className="px-3 pb-3">

                    <Col md={4}>

                        <Card>

                            <Card.Body>

                                <h6>Total Products</h6>

                                <h3>{totalProducts}</h3>

                            </Card.Body>

                        </Card>

                    </Col>

                    <Col md={4}>

                        <Card>

                            <Card.Body>

                                <h6>Total Units</h6>

                                <h3>{totalUnits}</h3>

                            </Card.Body>

                        </Card>

                    </Col>

                    <Col md={4}>

                        <Card>

                            <Card.Body>

                                <h6>Grand Total</h6>

                                <h3>${grandTotal}</h3>

                            </Card.Body>

                        </Card>

                    </Col>

                </Row>

            </Card.Body>

        </Card>

    );

}