// This file contains the notifications data and a function to retrieve it.
// The notifications are stored in an array of objects, each containing a message in multiple languages and a URL. 
// Ideal number of notifications: 3 to 5
const notificationsList = [
  {
    languages: {
      en: '<NOTIFICATION>',
      ja: '<通知>'
    },
    url: '<URL>',
    unread: true
  },
  {
    languages: {
      en: '<NOTIFICATION>',
      ja: '<通知>'
    },
    url: '<URL>',
    unread: true
  },
  {
    languages: {
      en: '<NOTIFICATION>',
      ja: '<通知>'
    },
    url: '<URL>',
    unread: true
  }
];

export const getNotifications = (language = 'en') => {
  const totalNotifications = notificationsList.length;
  return notificationsList
    .map((notification, index) => ({
      id: totalNotifications - index, // Auto-increment the ID based on array position.
      message: notification.languages[language] || notification.languages.en, // Fall back to English if the language is not available.
      url: notification.url,
      unread: notification.unread
    }))
    .sort((a, b) => b.id - a.id);
};

// Utility function that detects the language from the URL path.
export const detectLanguage = () => {
  if (typeof window !== 'undefined') {
    return window.location.pathname.includes('ja-jp') ? 'ja' : 'en';
  }
  return 'en'; // Default notifications to English if Japanese is not detected for some reason.
};
