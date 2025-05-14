import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom"; // Import BrowserRouter and Routes
import PinPopup from "./components/PinPopup";
import Home from "./components/Home";
import Help from "./pages/Help"; // Import the Help component

function App() {
  const [authenticated, setAuthenticated] = useState(false);

  useEffect(() => {
    const isAuth = localStorage.getItem("authenticated");
    if (isAuth === "true") {
      setAuthenticated(true);
    }
  }, []);

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
