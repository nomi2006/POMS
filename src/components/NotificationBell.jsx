import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Dropdown, Badge, Button, ListGroup } from 'react-bootstrap';
import { useNotifications } from 'context/NotificationContext';
import { formatDistanceToNow } from 'date-fns';

export default function NotificationBell() {
  const navigate = useNavigate();
  const { notifications, unreadCount, markAsRead, markAllAsRead } = useNotifications();
  const [showDropdown, setShowDropdown] = useState(false);

  const getIconByType = (type) => {
    switch (type) {
      case 'order':
        return 'ph ph-shopping-cart';
      case 'user':
        return 'ph ph-user';
      case 'alert':
        return 'ph ph-warning';
      case 'success':
        return 'ph ph-check-circle';
      default:
        return 'ph ph-bell';
    }
  };

  const getColorByType = (type) => {
    switch (type) {
      case 'order':
        return 'primary';
      case 'user':
        return 'info';
      case 'alert':
        return 'danger';
      case 'success':
        return 'success';
      default:
        return 'secondary';
    }
  };

  const handleNotificationClick = (notification) => {
    if (!notification.read) {
      markAsRead(notification.id);
    }
    if (notification.link) {
      navigate(notification.link);
    }
    setShowDropdown(false);
  };

  const formatTime = (timestamp) => {
    try {
      return formatDistanceToNow(new Date(timestamp), { addSuffix: true });
    } catch {
      return 'recently';
    }
  };

  return (
    <Dropdown
      show={showDropdown}
      onToggle={() => setShowDropdown(!showDropdown)}
      align="end"
    >
      <Dropdown.Toggle
        as="button"
        variant="link"
        className="pc-head-link me-0 position-relative"
        style={{ textDecoration: 'none', color: 'inherit' }}
      >
        <i className="ph ph-bell" style={{ fontSize: '20px' }} />
        {unreadCount > 0 && (
          <Badge
            bg="danger"
            pill
            className="position-absolute top-0 start-100 translate-middle"
            style={{ fontSize: '10px', padding: '2px 6px' }}
          >
            {unreadCount > 99 ? '99+' : unreadCount}
          </Badge>
        )}
      </Dropdown.Toggle>

      <Dropdown.Menu
        className="p-0 overflow-hidden"
        style={{
          width: '380px',
          maxHeight: '480px',
          borderRadius: '12px',
          boxShadow: '0 10px 40px rgba(0,0,0,0.12)'
        }}
      >
        <div className="d-flex justify-content-between align-items-center p-3 border-bottom">
          <h6 className="mb-0 fw-bold">Notifications</h6>
          {unreadCount > 0 && (
            <Button
              variant="link"
              size="sm"
              className="text-primary text-decoration-none p-0"
              onClick={markAllAsRead}
            >
              Mark all read
            </Button>
          )}
        </div>

        <div style={{ maxHeight: '360px', overflowY: 'auto' }}>
          {notifications.length > 0 ? (
            notifications.slice(0, 20).map((notification) => (
              <div
                key={notification.id}
                className={`d-flex align-items-start p-3 border-bottom ${!notification.read ? 'bg-light' : ''}`}
                style={{ cursor: 'pointer' }}
                onClick={() => handleNotificationClick(notification)}
                onMouseEnter={(e) => e.target.style.backgroundColor = '#f8f9fa'}
                onMouseLeave={(e) => {
                  if (!notification.read) {
                    e.target.style.backgroundColor = '#f8f9fa';
                  } else {
                    e.target.style.backgroundColor = 'transparent';
                  }
                }}
              >
                <div
                  className={`bg-${getColorByType(notification.type)} bg-opacity-10 p-2 rounded-circle me-3`}
                  style={{ width: '36px', height: '36px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                >
                  <i
                    className={`${getIconByType(notification.type)} text-${getColorByType(notification.type)}`}
                    style={{ fontSize: '16px' }}
                  />
                </div>
                <div className="flex-1 min-width-0">
                  <div className="d-flex justify-content-between align-items-start">
                    <h6 className="mb-0 small fw-semibold">{notification.title}</h6>
                    {!notification.read && (
                      <span className="bg-primary rounded-circle" style={{ width: '6px', height: '6px', minWidth: '6px', marginTop: '6px' }} />
                    )}
                  </div>
                  <p className="mb-0 small text-muted" style={{ fontSize: '0.8rem' }}>
                    {notification.message}
                  </p>
                  <small className="text-muted" style={{ fontSize: '0.7rem' }}>
                    {formatTime(notification.createdAt)}
                  </small>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-5">
              <i className="ph ph-bell" style={{ fontSize: '40px', color: '#ccc' }} />
              <p className="text-muted mt-2">No notifications</p>
            </div>
          )}
        </div>

        <div className="text-center py-2 border-top">
          <Button
            variant="link"
            size="sm"
            className="text-muted text-decoration-none"
            onClick={() => {
              setShowDropdown(false);
              navigate('/notifications');
            }}
          >
            View all notifications
          </Button>
        </div>
      </Dropdown.Menu>
    </Dropdown>
  );
}