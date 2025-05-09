import React, { useState, useEffect, useRef } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBell } from '@fortawesome/free-regular-svg-icons';
import { detectLanguage } from '../data/notifications';

const NotificationBell = ({ notifications }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [notificationList, setNotificationList] = useState([]);
  const [currentLanguage, setCurrentLanguage] = useState('en');
  const dropdownRef = useRef(null);
  const wrapperRef = useRef(null);

  // Set the current language in the component.
  useEffect(() => {
    setCurrentLanguage(detectLanguage());
  }, []);

  // Toggle dropdown visibility and prevent the event from bubbling up to the outside click handler.
  const toggleDropdown = (event) => {
    event.stopPropagation(); // Prevent outside click handler from immediately reopening dropdown.
    setIsOpen((prev) => !prev);
  };

  // Load notifications from localStorage and update it if there are new notifications.
  useEffect(() => {
    // Retrieve seen notifications from localStorage.
    const seenNotificationsJSON = localStorage.getItem('seenNotifications');
    // Update the data structure to store both the ID and the version.
    const seenNotifications = seenNotificationsJSON ? JSON.parse(seenNotificationsJSON) : [];

    // Map the notifications to add read status based on seenNotifications.
    const updatedNotifications = notifications.map(notification => {
      // Find if this notification was seen
      const seenNotification = seenNotifications.find(item => item.id === notification.id);
      
      // Mark as read only if both the ID and the version match.
      const isRead = seenNotification && seenNotification.version === notification.version;
      
      return {
        ...notification,
        read: isRead,
      };
    });

    // Set the updated notifications in state.
    setNotificationList(updatedNotifications);
  }, [notifications]); // Dependency ensures rerun if notifications change.

  // Save changes to localStorage when notifications are clicked.
  const handleNotificationClick = (notification, event) => {
    // If it's an internal link, prevent default behavior and use history to navigate.
    if (!notification.isExternal) {
      event.preventDefault();
      window.location.href = notification.url;
    }

    const updatedList = notificationList.map(notif =>
      notif.id === notification.id ? { ...notif, read: true } : notif
    );

    // Save the seen notifications in localStorage with their version.
    const seenNotifications = updatedList
      .filter(notif => notif.read)
      .map(notif => ({ 
        id: notif.id, 
        version: notif.version || 1 
      }));

    localStorage.setItem('seenNotifications', JSON.stringify(seenNotifications));
    setNotificationList(updatedList); // Update the notification list with a read status.
  };

  // Count unread notifications.
  const unreadCount = notificationList.filter(notification => !notification.read).length;

  // Close the dropdown when clicking outside.
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="notification-wrapper" onClick={toggleDropdown} ref={wrapperRef}>
      <FontAwesomeIcon icon={faBell} size="lg" />
      {unreadCount > 0 && <span className="notification-count">{unreadCount}</span>}
      {isOpen && (
        <div className="notification-dropdown" ref={dropdownRef}>
          {notificationList.map(notification => (
            <a
              key={notification.id}
              href={notification.url}
              className={`notification-item ${!notification.read ? 'unread' : ''}`}
              onClick={(e) => handleNotificationClick(notification, e)}
              target={notification.isExternal ? '_blank' : '_self'}
              rel={notification.isExternal ? 'noopener noreferrer' : undefined}
            >
              {notification.message}
            </a>
          ))}
        </div>
      )}
    </div>
  );
};

export default NotificationBell;
