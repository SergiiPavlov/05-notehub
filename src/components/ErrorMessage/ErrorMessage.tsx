import css from './ErrorMessage.module.css';

export interface ErrorMessageProps {
  message?: string;
  onRetry?: () => void; 
}

export default function ErrorMessage({
  message = 'Something went wrong. Please try again.',
  onRetry,
}: ErrorMessageProps) {
  return (
    <div className={css.box} role="alert" aria-live="assertive">
      <div className={css.text}>{message}</div>
      {onRetry && (
        <button type="button" className={css.retry} onClick={onRetry}>
          Retry
        </button>
      )}
    </div>
  );
}
