import React, { useEffect } from 'react';
import Clarity from '@microsoft/clarity';
import CookieConsent from "react-cookie-consent";

// Initialize Clarity with the given project ID
const projectId = "p90xsfjq8f";

export default function Root({ children }) {
  useEffect(() => {
    if (typeof window !== "undefined") {
      // Initialize Clarity only on the client-side
      Clarity.init(projectId);

      // Add an event listener for the consent event
      window.addEventListener("CookieConsent", () => {
        if (window.clarity) {
          window.clarity('consent');
          console.log("Clarity consent event triggered.");
        }
      });
    }
  }, []);

  const handleConsentAccept = () => {
    // Dispatch a custom "CookieConsent" event when the user accepts cookies
    const consentEvent = new Event("CookieConsent");
    window.dispatchEvent(consentEvent);
    console.log("CookieConsent event dispatched.");
  };

  return (
    <>
      {children}
      <div>
        <CookieConsent
          location="bottom"
          buttonText="I understand"
          style={{
            backgroundColor: "#2673bb",
            padding: "20px",
          }}
          buttonStyle={{
            backgroundColor: "#fff",
            color: "#000",
            fontWeight: "500",
            fontSize: "15px",
            fontFamily:
              "system-ui, -apple-system, Segoe UI, Roboto, Ubuntu, Cantarell, Noto Sans, sans-serif, BlinkMacSystemFont, 'Segoe UI', Helvetica, Arial, sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol'",
          }}
          expires={150}
          onAccept={handleConsentAccept}
        >
          This website uses cookies to enhance the visitor experience. By continuing to use this website, you acknowledge that you have read and understood our <a href="https://www.scalar-labs.com/privacy-policy" style={{color: "white", textDecorationLine: "underline"}} target="_blank">privacy policy</a> and consent to the use of cookies to help improve your browsing experience and provide you with personalized content.
        </CookieConsent>
      </div>
    </>
  );
}