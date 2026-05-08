// Plugin to parse [NEW] markers in sidebar labels and convert them to badge metadata
module.exports = function sidebarBadgePlugin(context, options) {
  return {
    name: 'sidebar-badge-plugin',
    async loadSidebars({ sidebarFilePath, sidebarData }) {
      // Recursively process sidebar items to extract [BADGE] markers
      function processSidebarItems(items) {
        return items.map(item => {
          if (item.label && typeof item.label === 'string') {
            const match = item.label.match(/^(.+?)\s*\[([A-Z]+)\]$/);
            if (match) {
              return {
                ...item,
                label: match[1], // Original label without the marker
                badgeText: match[2].toLowerCase(), // Extract badge text
              };
            }
          }
          if (item.items) {
            return {
              ...item,
              items: processSidebarItems(item.items),
            };
          }
          return item;
        });
      }

      // Process all sidebars
      Object.keys(sidebarData).forEach(sidebarName => {
        sidebarData[sidebarName] = processSidebarItems(sidebarData[sidebarName]);
      });

      return sidebarData;
    },
  };
};
