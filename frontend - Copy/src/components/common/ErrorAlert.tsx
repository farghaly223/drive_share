interface ErrorAlertProps {
  message: string;
  onDismiss?: () => void;
}

const ErrorAlert = ({ message, onDismiss }: ErrorAlertProps) => (
  <div className="error-alert">
    <span>{message}</span>
    {onDismiss && <button onClick={onDismiss}>×</button>}
  </div>
);

export default ErrorAlert;