import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Dropdown, Badge, Button } from 'react-bootstrap';
import { useNotifications } from 'context/NotificationContext';
import { formatDistanceToNow } from 'date-fns';

export default function NotificationBell() {
  const navigate = useNavigate();
  const { notifications, unreadCount, markAsRead, markAllAsRead } = useNotifications();
  const [showDropdown, setShowDropdown] = useState(false);

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

  const handleNotificationClick = (notification) => {
    if (!notification.read) markAsRead(notification.id);
    if (notification.link) navigate(notification.link);
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
      {/* 1. BUTTON STYLING (CLEAN TRANSPARENT + ICON HOVER) */}
      <Dropdown.Toggle
        as="button"
        className="position-relative d-flex align-items-center justify-content-center"
        style={{
          border: 'none',
          background: 'transparent',
          padding: '8px',
          color: '#64748b',            // Default icon color (Slate Grey)
          transition: 'color 0.2s ease', // Smooth color change on hover
          outline: 'none',
          boxShadow: 'none',
          cursor: 'pointer'
        }}
        // HOVER EFFECT: Sirf icon ka color change hoga, background transparent rahega
        onMouseEnter={(e) => {
          e.currentTarget.style.background = 'transparent';
          e.currentTarget.style.color = '#1e293b'; // Darker grey on hover
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.background = 'transparent';
          e.currentTarget.style.color = '#64748b'; // Back to original color
        }}
      >
        {/* 2. ONLY THE BELL ICON */}
        <i className="ph ph-bell" style={{ fontSize: '22px', lineHeight: 1 }} />

        {/* 3. BADGE (Perfectly aligned) */}
        {unreadCount > 0 && (
          <Badge
            bg="danger"
            pill
            className="position-absolute"
            style={{
              fontSize: '10px', 
              padding: '2px 6px',
              top: '-2px',
              right: '-2px',
              border: '2px solid #ffffff' 
            }}
          >
            {unreadCount > 99 ? '99+' : unreadCount}
          </Badge>
        )}
      </Dropdown.Toggle>

      {/* 4. DROPDOWN MENU (Classic Professional Look) */}
      <Dropdown.Menu
        className="p-0"
        style={{
          width: '380px',
          maxHeight: '480px',
          borderRadius: '10px',
          boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
          border: '1px solid #f1f5f9',
          marginTop: '6px'
        }}
      >
        {/* Header */}
        <div className="d-flex justify-content-between align-items-center p-3 border-bottom" style={{ borderColor: '#f1f5f9' }}>
          <h6 className="mb-0 fw-bold" style={{ fontSize: '14px' }}>Notifications</h6>
          {unreadCount > 0 && (
            <Button
              variant="link"
              size="sm"
              className="text-decoration-none p-0"
              style={{ fontSize: '12px', color: '#3b82f6' }}
              onClick={markAllAsRead}
            >
              Mark all read
            </Button>
          )}
        </div>

        {/* List Items */}
        <div style={{ maxHeight: '360px', overflowY: 'auto' }}>
          {notifications.length > 0 ? (
            notifications.slice(0, 20).map((notification) => (
              <div
                key={notification.id}
                className={`d-flex align-items-start p-3 border-bottom ${!notification.read ? 'bg-light' : ''}`}
                style={{ 
                  cursor: 'pointer', 
                  borderColor: '#f1f5f9',
                  transition: 'background 0.15s'
                }}
                onClick={() => handleNotificationClick(notification)}
              >
                {/* Icon Circle */}
                <div
                  className={`bg-${getColorByType(notification.type)} bg-opacity-10 p-2 rounded-circle me-3 flex-shrink-0`}
                  style={{ width: '38px', height: '38px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                >
                  <i
                    className={`${getIconByType(notification.type)} text-${getColorByType(notification.type)}`}
                    style={{ fontSize: '18px' }}
                  />
                </div>
                
                {/* Text Content */}
                <div className="flex-1 min-width-0">
                  <div className="d-flex justify-content-between align-items-start">
                    <h6 className="mb-0 small fw-semibold" style={{ color: '#334155' }}>{notification.title}</h6>
                    {!notification.read && (
                      <span className="bg-primary rounded-circle flex-shrink-0" style={{ width: '7px', height: '7px', marginTop: '6px' }} />
                    )}
                  </div>
                  <p className="mb-0 small text-muted" style={{ fontSize: '0.8rem', color: '#64748b' }}>
                    {notification.message}
                  </p>
                  <small className="text-muted" style={{ fontSize: '0.7rem', color: '#94a3b8' }}>
                    {formatTime(notification.createdAt)}
                  </small>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-5">
              <i className="ph ph-bell" style={{ fontSize: '40px', color: '#cbd5e1' }} />
              <p className="text-muted mt-2 mb-0" style={{ fontSize: '14px' }}>No notifications</p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="text-center py-2 border-top" style={{ borderColor: '#f1f5f9' }}>
          <Button
            variant="link"
            size="sm"
            className="text-decoration-none"
            style={{ fontSize: '13px', color: '#64748b' }}
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