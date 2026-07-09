import React from "react";
import {
  Row,
  Col,
  Card,
  Form
} from "react-bootstrap";

export default function PurchaseOrderHeader() {
  return (
    <>
      <Card className="mb-4">
        <Card.Header>
          <h5 className="mb-0">From</h5>
        </Card.Header>

        <Card.Body>
          <Row>
            <Col md={4}>
              <Form.Group className="mb-3">
                <Form.Label>Company Name</Form.Label>
                <Form.Control placeholder="Company Name" />
              </Form.Group>
            </Col>

            <Col md={4}>
              <Form.Group className="mb-3">
                <Form.Label>Phone Number</Form.Label>
                <Form.Control placeholder="Phone Number" />
              </Form.Group>
            </Col>

            <Col md={4}>
              <Form.Group className="mb-3">
                <Form.Label>Email Address</Form.Label>
                <Form.Control placeholder="Email Address" />
              </Form.Group>
            </Col>

            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Address</Form.Label>
                <Form.Control placeholder="Address" />
              </Form.Group>
            </Col>

            <Col md={3}>
              <Form.Group className="mb-3">
                <Form.Label>City</Form.Label>
                <Form.Control placeholder="City" />
              </Form.Group>
            </Col>

            <Col md={3}>
              <Form.Group className="mb-3">
                <Form.Label>Country</Form.Label>
                <Form.Control placeholder="Country" />
              </Form.Group>
            </Col>

          </Row>
        </Card.Body>
      </Card>


      <Card className="mb-4">
        <Card.Header>
          <h5 className="mb-0">To</h5>
        </Card.Header>

        <Card.Body>

          <Row>

            <Col md={4}>
              <Form.Group className="mb-3">
                <Form.Label>Client Name</Form.Label>
                <Form.Control placeholder="Client Name" />
              </Form.Group>
            </Col>

            <Col md={4}>
              <Form.Group className="mb-3">
                <Form.Label>Phone Number</Form.Label>
                <Form.Control placeholder="Phone Number" />
              </Form.Group>
            </Col>

            <Col md={4}>
              <Form.Group className="mb-3">
                <Form.Label>Email Address</Form.Label>
                <Form.Control placeholder="Email Address" />
              </Form.Group>
            </Col>

            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Address</Form.Label>
                <Form.Control placeholder="Address" />
              </Form.Group>
            </Col>


            <Col md={3}>
              <Form.Group className="mb-3">
                <Form.Label>City</Form.Label>
                <Form.Control placeholder="City" />
              </Form.Group>
            </Col>


            <Col md={3}>
              <Form.Group className="mb-3">
                <Form.Label>Country</Form.Label>
                <Form.Control placeholder="Country" />
              </Form.Group>
            </Col>


          </Row>

        </Card.Body>
      </Card>



      <Card className="mb-4">

        <Card.Header>
          <h5 className="mb-0">Ship To</h5>
        </Card.Header>


        <Card.Body>

          <Row>

            <Col md={4}>
              <Form.Group className="mb-3">
                <Form.Label>Warehouse Name</Form.Label>
                <Form.Control placeholder="Warehouse Name" />
              </Form.Group>
            </Col>


            <Col md={4}>
              <Form.Group className="mb-3">
                <Form.Label>Phone Number</Form.Label>
                <Form.Control placeholder="Phone Number" />
              </Form.Group>
            </Col>


            <Col md={4}>
              <Form.Group className="mb-3">
                <Form.Label>Email Address</Form.Label>
                <Form.Control placeholder="Email Address" />
              </Form.Group>
            </Col>


            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Address</Form.Label>
                <Form.Control placeholder="Address" />
              </Form.Group>
            </Col>


            <Col md={3}>
              <Form.Group className="mb-3">
                <Form.Label>City</Form.Label>
                <Form.Control placeholder="City" />
              </Form.Group>
            </Col>


            <Col md={3}>
              <Form.Group className="mb-3">
                <Form.Label>Country</Form.Label>
                <Form.Control placeholder="Country" />
              </Form.Group>
            </Col>


          </Row>

        </Card.Body>

      </Card>

    </>
  );
}