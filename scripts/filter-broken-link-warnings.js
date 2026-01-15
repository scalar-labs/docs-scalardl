const fs = require("fs");
const path = require("path");

// Paths
const logFile = "brokenLinks.log";

// Define the prefixes to filter for broken links.
const prefixes = [
  "- Broken link on source page path",
  "   -> linking to "
];

// Read the log file and filter lines based on unsupported versions.
fs.readFile(logFile, "utf8", (err, data) => {
  if (err) {
    console.error("Error reading log file:", err);
    process.exit(1);
  }

  const filteredLines = data
    .split("\n")
    .filter((line) =>
      prefixes.some((prefix) => line.startsWith(prefix))
    );

  // Overwrite the log file with filtered lines.
  fs.writeFile(logFile, filteredLines.join("\n"), "utf8", (err) => {
    if (err) {
      console.error("Error writing filtered log file:", err);
      process.exit(1);
    }
    console.log(`Filtered broken link warnings saved to ${logFile}`);
  });
});
