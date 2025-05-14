import React, { useState } from "react";
import { db } from "../firebase";
import { doc, getDoc } from "firebase/firestore";

export default function PinPopup({ onAuthenticated }) {
  const [pin, setPin] = useState("");
  const [error, setError] = useState("");

  const checkPin = async () => {
    const pinRef = doc(db, "config", "access");
    const snap = await getDoc(pinRef);
    
    if (snap.exists()) {
      if (snap.data().adminPin === pin) {
        // If Admin PIN is entered, set role to "admin"
        localStorage.setItem("authenticated", "true");
        localStorage.setItem("role", "admin");
        onAuthenticated();
      } else if (snap.data().userPin === pin) {
        // If User PIN is entered, set role to "user"
        localStorage.setItem("authenticated", "true");
        localStorage.setItem("role", "user");
        onAuthenticated();
      } else {
        setError("Incorrect PIN");
      }
    }
  };

  return (
    <div className="position-fixed top-0 start-0 w-100 h-100 bg-dark bg-opacity-75 d-flex justify-content-center align-items-center">
      <div className="bg-white p-4 rounded shadow" style={{ maxWidth: "400px", width: "100%" }}>
        <h4 className="mb-3">Enter Access PIN</h4>
        <p>Shreya Your pin is: 1234</p>
        <input
          type="password"
          className="form-control mb-2"
          placeholder="Enter PIN"
          value={pin}
          onChange={(e) => setPin(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
                checkPin(e.target.value);
            }
          }}
        />
        {error && <div className="text-danger mb-2">{error}</div>}
        <button className="btn btn-primary w-100" onClick={checkPin}>Submit</button>
      </div>
    </div>
  );
}
