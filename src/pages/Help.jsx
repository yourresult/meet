import React, { useEffect, useState, useRef } from "react";
import { db } from "../firebase";
import {
  addDoc,
  collection,
  onSnapshot,
  query,
  orderBy,
  serverTimestamp,
  doc,
  setDoc,
  updateDoc
} from "firebase/firestore";
import "../styles/help.css";

export default function Help() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [typingStatus, setTypingStatus] = useState("");
  const endRef = useRef(null);
  const [role, setRole] = useState("");

  useEffect(() => {
    const storedRole = localStorage.getItem("role") || "user";
    setRole(storedRole);

    // Messages Listener
    const messagesRef = collection(db, "messages");
    const q = query(messagesRef, orderBy("timestamp"));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const msgs = snapshot.docs.map((doc) => {
        const data = doc.data();
        return {
          id: doc.id,
          ...data
        };
      });

      setMessages(msgs);

      // Update "seen" if it's from opposite party
      msgs.forEach(async (msg) => {
        if (msg.sender !== storedRole && !msg.seen) {
          const msgRef = doc(db, "messages", msg.id);
          await updateDoc(msgRef, { seen: true });
        }
      });

      endRef.current?.scrollIntoView({ behavior: "smooth" });
    });

    // Typing Status Listener
    const typingRef = doc(db, "config", "typing");
    const unsubscribeTyping = onSnapshot(typingRef, (docSnap) => {
      if (docSnap.exists()) {
        const typingUser = docSnap.data().typing;
        if (typingUser && typingUser !== storedRole) {
          setTypingStatus(`${typingUser === "admin" ? "Admin" : "User"} is typing...`);
        } else {
          setTypingStatus("");
        }
      }
    });

    return () => {
      unsubscribe();
      unsubscribeTyping();
    };
  }, []);

//   const handleSendMessage = async () => {
//     if (input.trim()) {
//       await addDoc(collection(db, "messages"), {
//         text: input,
//         sender: role,
//         seen: false,
//         timestamp: serverTimestamp()
//       });
//       setInput("");

//       // Reset typing status
//       await setDoc(doc(db, "config", "typing"), { typing: "" });
//     }
//   };

  const handleKeyDown = async (e) => {
    if (e.key === "Enter") {
      handleSendMessage();
    } else {
      // Set typing status in Firestore
      await setDoc(doc(db, "config", "typing"), { typing: role });
    }
  };

  const handleBlur = async () => {
    await setDoc(doc(db, "config", "typing"), { typing: "" });
  };

  const handleSendMessage = async () => {
    if (input.trim()) {
      const messageText = input;
  
      await addDoc(collection(db, "messages"), {
        text: messageText,
        sender: role,
        seen: false,
        timestamp: serverTimestamp()
      });
  
      // If user sends message, notify admin
      if (role === "user") {
        sendWhatsAppNotification(messageText);
      }
  
      setInput("");
      await setDoc(doc(db, "config", "typing"), { typing: "" });
    }
  };

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


  return (
    <div className="container d-flex flex-column vh-100">
      <div className="bg-primary text-white p-3 text-center fs-4">🛠 {role} Help Center</div>

      <div className="flex-grow-1 overflow-auto p-3">
        {messages.map((msg) => {
          const isOwnMessage = msg.sender === role;
          return (
            <div
              key={msg.id}
              className={`d-flex mb-2 ${isOwnMessage ? "justify-content-end" : "justify-content-start"}`}
            >
              <div className={`p-2 rounded text-white ${isOwnMessage ? "bg-primary" : "bg-secondary"}`}>
                <div> {msg.text}</div>
                {isOwnMessage && (
                  <small className="d-block text-end" style={{ fontSize: "0.7rem" }}>
                    {msg.seen ? "Seen" : "Delivered"}
                  </small>
                )}
              </div>
            </div>
          );
        })}
        <div ref={endRef}></div>
        {typingStatus && <div className="text-muted">{typingStatus}</div>}
      </div>

      <div className="input-group p-2 border-top">
        <input
          className="form-control"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          onBlur={handleBlur}
          placeholder="Type your message..."
        />
        <button className="btn btn-primary" onClick={handleSendMessage}>Send</button>
      </div>
    </div>
  );
  
}
