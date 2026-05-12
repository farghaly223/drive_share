const ErrorAlert = ({ message, onDismiss }) => (
  <div className="error-alert">
    <span>{message}</span>
    {onDismiss && <button onClick={onDismiss}>×</button>}
  </div>
);
export default ErrorAlert;