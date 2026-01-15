const fs = require("fs");
const path = require("path");

// Paths
const logFile = "brokenLinks.log";
const unsupportedVersionsFile = path.join(process.cwd(), "src", "pages");

// Read unsupported versions from the MDX file.
let unsupportedVersions = [];
try {
  const mdxContent = fs.readFileSync(unsupportedVersionsFile, "utf8");
  // Extract unsupported version numbers (like 3.7, 3.6, etc.).
  unsupportedVersions = Array.from(mdxContent.matchAll(/ScalarDL (\d+\.\d+)/g), match => match[1]);
} catch (err) {
  console.error("Error reading unsupported versions file:", err);
  process.exit(1);
}

if (unsupportedVersions.length === 0) {
  console.log("No unsupported versions found. Exiting.");
  process.exit(0);
}

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
      prefixes.some((prefix) => line.startsWith(prefix)) &&
      !unsupportedVersions.some((version) => line.includes(`/docs/${version}/`)) // Exclude unsupported versions.
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
