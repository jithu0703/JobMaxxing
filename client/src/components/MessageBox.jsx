// MessageBox.jsx
import React, { useEffect } from "react";
import "../styles//MessageBox.css";

const MessageBox = ({ message, type, onClose }) => {
  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => {
        onClose && onClose();
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [message, onClose]);

  if (!message) return null;

  return (
    <div className={`message-box message-box--${type}`}>
      <span>{message}</span>
      {onClose && (
        <button className="message-box__close" onClick={onClose}>
          ×
        </button>
      )}
    </div>
  );
};

export default MessageBox;
