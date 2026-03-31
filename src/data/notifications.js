// This file contains the notifications data and a function to retrieve it.
// The notifications are stored in an array of objects, each containing a message in multiple languages and URLs for those messages.
const notificationsList = [
  {
    message: {
      en: 'Find out about how to manage namespaces in ScalarDL 3.13',
      ja: 'ScalarDL 3.13 での名前空間管理について知る'
    },
    url: {
      en: 'manage-namespaces?utm_source=docs-site&utm_medium=notifications',
      ja: 'manage-namespaces?utm_source=docs-site&utm_medium=notifications'
    },
    unread: true
  },
  {
    message: {
      en: 'Learn how to access namespaces in a restricted manner in ScalarDL 3.13',
      ja: 'ScalarDL 3.13 で名前空間に制限付きでアクセスする方法を学ぶ'
    },
    url: {
      en: 'access-namespaces-in-a-restricted-manner?utm_source=docs-site&utm_medium=notifications',
      ja: 'access-namespaces-in-a-restricted-manner?utm_source=docs-site&utm_medium=notifications'
    },
    unread: true
  },
  {
    message: {
      en: 'Blog post: Simplifying tamper-evident applications by using ScalarDL HashStore and TableStore',
      ja: 'ブログ記事: ScalarDL HashStore と TableStore を使用した改ざん検知アプリケーションの簡素化'
    },
    url: {
      en: 'https://medium.com/scalar-engineering/simplifying-tamper-evident-applications-by-using-scalardl-hashstore-and-tablestore-b6bdf0f60400?utm_source=docs-site&utm_medium=notifications',
      ja: 'https://medium.com/scalar-engineering-ja/scalardl-hashstore-%E3%81%A8-tablestore-%E3%82%92%E4%BD%BF%E7%94%A8%E3%81%97%E3%81%9F%E6%94%B9%E3%81%96%E3%82%93%E6%A4%9C%E7%9F%A5%E3%82%A2%E3%83%97%E3%83%AA%E3%82%B1%E3%83%BC%E3%82%B7%E3%83%A7%E3%83%B3%E3%81%AE%E7%B0%A1%E7%B4%A0%E5%8C%96-9ad3fb4a4c05?utm_source=docs-site&utm_medium=notifications'
    },
    unread: true
  }
];

// Helper function to generate a simple hash for notification content.
const generateContentHash = (notification) => {
  // Create a string representing the notification content.
  const contentString = JSON.stringify({
    message: notification.message,
    url: notification.url
  });

  // Generate a simple hash.
  let hash = 0;
  for (let i = 0; i < contentString.length; i++) {
    const char = contentString.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32-bit integer.
  }

  return hash.toString();
};

// Update the getNotifications function to handle both single URL and language-specific URLs, and prepend the correct base URL for relative paths.
export const getNotifications = (language = 'en') => {
  const totalNotifications = notificationsList.length;

  // Define base URLs for different languages.
  const baseUrls = {
    en: '/docs/latest/',
    ja: '/ja-jp/docs/latest/'
  };

  const currentDomain = 'scalardl.scalar-labs.com';

  // Get stored content hashes, if any.
  let storedHashes = {};
  let storedVersions = {};

  if (typeof window !== 'undefined') {
    try {
      const hashesJson = localStorage.getItem('notificationContentHashes');
      if (hashesJson) {
        storedHashes = JSON.parse(hashesJson);
      }

      const versionsJson = localStorage.getItem('notificationVersions');
      if (versionsJson) {
        storedVersions = JSON.parse(versionsJson);
      }
    } catch (e) {
      console.error('Error retrieving notification metadata:', e);
    }
  }

  // Calculate current hashes and check for changes.
  const currentHashes = {};
  const currentVersions = {};

  notificationsList.forEach((notification, index) => {
    const id = totalNotifications - index;
    const contentHash = generateContentHash(notification);
    currentHashes[id] = contentHash;

    // This if is for if a stored hash is stored for this notification ID.
    if (id in storedHashes) {
      // If the content has changed, increment the version.
      if (storedHashes[id] !== contentHash) {
        currentVersions[id] = (storedVersions[id] || 1) + 1;
      } else {
        // Otherwise, if the content hasn't changed, keep the same version.
        currentVersions[id] = storedVersions[id] || 1;
      }
    } else {
      // If this is the first tirst time seeing this notification, use the default version 1.
      currentVersions[id] = 1;
    }
  });
  
  // Store the current hashes and versions for future comparison.
  if (typeof window !== 'undefined') {
    localStorage.setItem('notificationContentHashes', JSON.stringify(currentHashes));
    localStorage.setItem('notificationVersions', JSON.stringify(currentVersions));
  }

  return notificationsList
    .map((notification, index) => {
      const id = totalNotifications - index;

      // Get the appropriate URL for the language.
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
        id: id,
        message: notification.message[language] || notification.message.en,
        url: url,
        isExternal: isExternal,
        unread: notification.unread,
        // Use the dynamically determined version.
        version: currentVersions[id] || 1
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
