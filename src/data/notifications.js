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

// Update the getNotifications function to handle both single URL and language-specific URLs,
// Update the getNotifications function to handle both single URL and language-specific URLs, and prepend the correct base URL for relative paths.
export const getNotifications = (language = 'en') => {
  const totalNotifications = notificationsList.length;

  // Define base URLs for different languages.
  const baseUrls = {
    en: '/docs/latest/',
    ja: '/ja-jp/docs/latest/'
  };

  const currentDomain = 'scalardl.scalar-labs.com';

  return notificationsList
    .map((notification, index) => {
      // Get the appropriate URL for the language
      let url = typeof notification.url === 'object' 
        ? notification.url[language] || notification.url.en 
        : notification.url;

      // If the URL is relative (doesn't start with http), prepend the appropriate base URL.
      if (url && !url.startsWith('http')) {
        url = baseUrls[language] + url;
      }

      // Check if the link is external by checking the domain.
      const isExternal = url.startsWith('http') && !url.includes(currentDomain);

      return {
        id: totalNotifications - index,
        message: notification.languages[language] || notification.languages.en,
        url: url,
        isExternal: isExternal, // Add this flag for the component to use.
        unread: notification.unread
      };
    })
    .sort((a, b) => b.id - a.id);
};

// Utility function that detects the language from the URL path.
export const detectLanguage = () => {
  if (typeof window !== 'undefined') {
    return window.location.pathname.includes('ja-jp') ? 'ja' : 'en';
  }
  return 'en'; // Default notifications to English if Japanese is not detected for some reason.
};
