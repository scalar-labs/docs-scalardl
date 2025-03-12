import React from "react";
import { Standard } from "@typebot.io/react";

function AssistantModal({ isOpen, onClose }) {
  if (!isOpen) return null; // Prevent modal from rendering when isOpen is false.

  // Get the current page URL.
  const currentUrl = window.location.href;

  // Check if the user is on the Japanese documentation page.
  const isJapanese = currentUrl.includes("/ja-jp");

  return (
    <div className="modal" style={styles.modal}>
      <div className="modal-content" style={styles.modalContent}>
        {/* Close the button. */}
        <span className="close" onClick={onClose} style={styles.closeButton}>
          &times;
        </span>

        {/* Conditionally render the Typebot based on language. */}
        <Standard
          typebot={isJapanese
            ? "ja-jp-scalar-docs-ai-assistant-for-scalar-membership-program-members-201712"
            : "en-us-scalar-docs-ai-assistant-for-scalar-membership-program-members-201712"
          }
          style={{ width: "100%", height: "600px" }}
          prefilledVariables={{
            "Current page URL": `${currentUrl}`, // Pass page URL as a query parameter.
          }}
        />
      </div>
    </div>
  );
}

const styles = {
  modal: {
    display: "block",
    position: "fixed",
    zIndex: 1000,
    left: 0,
    top: 0,
    width: "100%",
    height: "100%",
    backgroundColor: "rgba(0, 0, 0, 0.7)",
  },
  modalContent: {
    backgroundColor: "#fff",
    margin: "10% auto",
    padding: "20px",
    borderRadius: "10px",
    width: "90%",
    maxWidth: "900px",
    position: "relative", // Allow absolute positioning of the close button.
  },
  closeButton: {
    position: "absolute",
    top: "10px",
    right: "20px",
    fontSize: "30px",
    fontWeight: "bold",
    cursor: "pointer",
    color: "#333",
    backgroundColor: "transparent",
    border: "none",
    padding: "0",
    zIndex: 1100, // Ensure the close button is above the modal content.
  },
};

export default AssistantModal;
