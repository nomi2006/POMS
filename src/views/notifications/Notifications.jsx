import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, Table, Button, Badge, Form, Row, Col } from 'react-bootstrap';
import { useNotifications } from 'context/NotificationContext';
import { formatDistanceToNow } from 'date-fns';

export default function Notifications() {
  const navigate = useNavigate();
  const { notifications, markAsRead, markAllAsRead, deleteNotification } = useNotifications();
  const [filter, setFilter] = useState('all');

  const getIconByType = (type) => {
    switch (type) {
      case 'order': return 'ph ph-shopping-cart';
      case 'user': return 'ph ph-user';
      case 'alert': return 'ph ph-warning';
      case 'success': return 'ph ph-check-circle';
      default: return 'ph ph-bell';
    }
  };

  const getColorByType = (type) => {
    switch (type) {
      case 'order': return 'primary';
      case 'user': return 'info';
      case 'alert': return 'danger';
      case 'success': return 'success';
      default: return 'secondary';
    }
  };

  const filteredNotifications = notifications.filter((n) => {
    if (filter === 'unread') return !n.read;
    if (filter === 'read') return n.read;
    return true;
  });

  const formatTime = (timestamp) => {
    try {
      return formatDistanceToNow(new Date(timestamp), { addSuffix: true });
    } catch {
      return 'recently';
    }
  };

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <div className="container-fluid p-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2 className="fw-bold mb-0">Notifications</h2>
          <p className="text-muted mb-0">
            {unreadCount > 0 ? `You have ${unreadCount} unread notifications` : 'All caught up!'}
          </p>
        </div>
        <div className="d-flex gap-2">
          {unreadCount > 0 && (
            <Button variant="primary" onClick={markAllAsRead}>
              <i className="ph ph-check-all me-1" />
              Mark all read
            </Button>
          )}
          <Button variant="outline-secondary" onClick={() => navigate('/dashboard')}>
            <i className="ph ph-arrow-left me-1" />
            Back
          </Button>
        </div>
      </div>

      <Card className="shadow-sm border-0">
        <Card.Body>
          <Row className="mb-3">
            <Col>
              <div className="d-flex gap-2">
                <Button
                  variant={filter === 'all' ? 'primary' : 'outline-secondary'}
                  size="sm"
                  onClick={() => setFilter('all')}
                >
                  All ({notifications.length})
                </Button>
                <Button
                  variant={filter === 'unread' ? 'primary' : 'outline-secondary'}
                  size="sm"
                  onClick={() => setFilter('unread')}
                >
                  Unread ({unreadCount})
                </Button>
                <Button
                  variant={filter === 'read' ? 'primary' : 'outline-secondary'}
                  size="sm"
                  onClick={() => setFilter('read')}
                >
                  Read ({notifications.length - unreadCount})
                </Button>
              </div>
            </Col>
          </Row>

          <div className="table-responsive">
            <Table hover className="mb-0">
              <thead className="table-light">
                <tr>
                  <th>Type</th>
                  <th>Notification</th>
                  <th>Time</th>
                  <th>Status</th>
                  <th className="text-center">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredNotifications.length > 0 ? (
                  filteredNotifications.map((notification) => (
                    <tr key={notification.id} className={!notification.read ? 'fw-semibold' : ''}>
                      <td>
                        <span className={`text-${getColorByType(notification.type)}`}>
                          <i className={getIconByType(notification.type)} style={{ fontSize: '18px' }} />
                        </span>
                      </td>
                      <td>
                        <div>
                          <div>{notification.title}</div>
                          <small className="text-muted">{notification.message}</small>
                        </div>
                      </td>
                      <td style={{ fontSize: '0.85rem' }}>{formatTime(notification.createdAt)}</td>
                      <td>
                        {notification.read ? (
                          <Badge bg="secondary">Read</Badge>
                        ) : (
                          <Badge bg="primary">Unread</Badge>
                        )}
                      </td>
                      <td className="text-center">
                        <div className="d-flex gap-1 justify-content-center">
                          {!notification.read && (
                            <Button
                              size="sm"
                              variant="outline-primary"
                              onClick={() => markAsRead(notification.id)}
                            >
                              <i className="ph ph-check" />
                            </Button>
                          )}
                          <Button
                            size="sm"
                            variant="outline-danger"
                            onClick={() => deleteNotification(notification.id)}
                          >
                            <i className="ph ph-trash" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5" className="text-center py-5 text-muted">
                      <i className="ph ph-bell" style={{ fontSize: '40px' }} />
                      <p className="mt-2">No notifications found</p>
                    </td>
                  </tr>
                )}
              </tbody>
            </Table>
          </div>
        </Card.Body>
      </Card>
    </div>
  );
}