import React from 'react';

const ErrorAlert = ({ message, onDismiss }) => (
  <div className="error-alert">
    <span>{message}</span>
    {onDismiss && (
      <button onClick={onDismiss} className="dismiss-btn" aria-label="Dismiss">
        ✕
      </button>
    )}
  </div>
);

export default ErrorAlert;
