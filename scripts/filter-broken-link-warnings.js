const fs = require("fs");

const logFile = "brokenMarkdownLinks.log";

// Read the full log file
fs.readFile(logFile, "utf8", (err, data) => {
  if (err) {
    console.error("Error reading log file:", err);
    process.exit(1);
  }

  // Define the prefixes to filter
  const prefixes = [
    "- Broken link on source page path",
    "   -> linking to "
  ];

  // Filter lines that start with any of the specified prefixes
  const filteredLines = data
    .split("\n")
    .filter((line) => prefixes.some((prefix) => line.startsWith(prefix)));

  // Overwrite the log file with only the filtered lines
  fs.writeFile(logFile, filteredLines.join("\n"), "utf8", (err) => {
    if (err) {
      console.error("Error writing filtered log file:", err);
      process.exit(1);
    }
    console.log(`Filtered broken link warnings saved to ${logFile}`);
  });
});
