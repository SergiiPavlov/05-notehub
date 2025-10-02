// src/components/ErrorMessage/ErrorMessage.tsx
import css from './ErrorMessage.module.css';

export interface ErrorMessageProps {
  message?: string;
}

export default function ErrorMessage({
  message = 'Something went wrong. Please try again.',
}: ErrorMessageProps) {
  return (
    <div className={css.box} role="alert">
      {message}
    </div>
  );
}
