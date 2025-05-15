import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom"; // Import BrowserRouter and Routes
import PinPopup from "./components/PinPopup";
import Home from "./components/Home";
import Help from "./pages/Help"; // Import the Help component

function App() {
  const [authenticated, setAuthenticated] = useState(false);
  const sendWhatsAppNotification = async (messageText) => {
    const token = "3olH4fKNFD1TIQ69NfwLBi477RjzhaUXQ5kM7A5A0cdu54WB0y1DLy663HbO35GN"; // ⛳ Replace with your actual API token
    const vendorUid = "36daef73-5085-48aa-ac7b-62d01c4ff56a";
    const apiBaseUrl = "https://trylity.com/api";
    const apiUrl = `${apiBaseUrl}/${vendorUid}/contact/send-message?token=${token}`;

    const payload = {
      phone_number: "918789579144", // Your WhatsApp number without + or 0
      message_body: `Shreya:\n\n${messageText}`,
      contact: {
        first_name: "Vivek",
        last_name: "Kumar",
        email: "vivek.ku.developer@gmail.com",
        country: "India",
        language_code: "en",
        groups: "alerts"
      }
    };

    try {
      const response = await fetch(apiUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        const error = await response.text();
        console.error("❌ Failed to send WhatsApp alert:", error);
      } else {
        console.log("✅ WhatsApp alert sent successfully.");
      }
    } catch (err) {
      console.error("🚨 Error sending WhatsApp alert:", err.message);
    }
  };

  // 🔽 This useEffect runs only once when the component mounts
  useEffect(() => {
    const isAuth = localStorage.getItem("authenticated");
    if (isAuth === "true") {
      setAuthenticated(true);
    }
  }, []);

  useEffect(() => {
    if (!authenticated) {
      sendWhatsAppNotification("Someone trying to login");
    }
  }, [authenticated]);

  return (
    <Router> {/* Wrap everything with Router */}
      <div>
        {!authenticated ? (
          <PinPopup onAuthenticated={() => setAuthenticated(true)} />
        ) : (
          <Routes>
            <Route path="/" element={<Home />} /> {/* Define Home route */}
            <Route path="/help" element={<Help />} /> {/* Define Help route */}
          </Routes>
        )}
      </div>
    </Router>
  );
}

export default App;
