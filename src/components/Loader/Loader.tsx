// src/components/Loader/Loader.tsx
import css from './Loader.module.css';

export interface LoaderProps {
  message?: string;
}

export default function Loader({ message = 'Loading…' }: LoaderProps) {
  return (
    <div className={css.wrap} role="status" aria-live="polite" aria-busy="true">
      <div className={css.spinner} />
      <span className={css.text}>{message}</span>
    </div>
  );
}
