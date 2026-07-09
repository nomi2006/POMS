import React from "react";
import { Card, Row, Col, Form } from "react-bootstrap";

export default function PurchaseOrderDetails() {
  return (
    <Card className="mb-4">

      <Card.Header>
        <h5 className="mb-0">Purchase Order Details</h5>
      </Card.Header>

      <Card.Body>

        {/* Row 1 */}

        <Row>

          <Col md={4}>
            <Form.Group className="mb-3">
              <Form.Label>PO Number</Form.Label>
              <Form.Control placeholder="PO Number" />
            </Form.Group>
          </Col>

          <Col md={4}>
            <Form.Group className="mb-3">
              <Form.Label>Ship Date</Form.Label>
              <Form.Control type="date" />
            </Form.Group>
          </Col>

          <Col md={4}>
            <Form.Group className="mb-3">
              <Form.Label>Ship Via</Form.Label>

              <Form.Select>
                <option>Select</option>
                <option>Sea</option>
                <option>Air</option>
                <option>Courier</option>
              </Form.Select>

            </Form.Group>
          </Col>

        </Row>

        {/* Row 2 */}

        <Row>

          <Col md={4}>
            <Form.Group className="mb-3">
              <Form.Label>Stage</Form.Label>

              <Form.Select>
                <option>Select Stage</option>
                <option>Draft</option>
                <option>Pending</option>
                <option>Approved</option>
                <option>Completed</option>
              </Form.Select>

            </Form.Group>
          </Col>

          <Col md={4}>
            <Form.Group className="mb-3">
              <Form.Label>Reference Number</Form.Label>
              <Form.Control placeholder="Reference Number" />
            </Form.Group>
          </Col>

          <Col md={4}>
            <Form.Group className="mb-3">
              <Form.Label>Terms</Form.Label>

              <Form.Select>
                <option>Select Terms</option>
                <option>FOB</option>
                <option>CIF</option>
                <option>EXW</option>
              </Form.Select>

            </Form.Group>
          </Col>

        </Row>

        {/* Row 3 */}

        <Row>

          <Col md={4}>
            <Form.Group className="mb-3">
              <Form.Label>Division</Form.Label>

              <Form.Select>
                <option>Select Division</option>
                <option>Men</option>
                <option>Women</option>
                <option>Kids</option>
              </Form.Select>

            </Form.Group>
          </Col>

          <Col md={4}>
            <Form.Group className="mb-3">
              <Form.Label>Season</Form.Label>

              <Form.Select>
                <option>Select Season</option>
                <option>Summer</option>
                <option>Winter</option>
                <option>Spring</option>
                <option>Autumn</option>
              </Form.Select>

            </Form.Group>
          </Col>

          <Col md={4}>
            <Form.Group className="mb-3">
              <Form.Label>Last Revised</Form.Label>
              <Form.Control type="date" />
            </Form.Group>
          </Col>

        </Row>

        {/* Row 4 */}

        <Row>

          <Col md={6}>
            <Form.Group className="mb-3">
              <Form.Label>Currency</Form.Label>

              <Form.Select>
                <option>USD</option>
                <option>PKR</option>
                <option>EUR</option>
                <option>AED</option>
              </Form.Select>

            </Form.Group>
          </Col>

          <Col md={6}>
            <Form.Group className="mb-3">
              <Form.Label>Expected Delivery Date</Form.Label>
              <Form.Control type="date" />
            </Form.Group>
          </Col>

        </Row>

      </Card.Body>

    </Card>
  );
}