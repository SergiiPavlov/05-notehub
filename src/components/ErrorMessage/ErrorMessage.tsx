import css from './ErrorMessage.module.css';

export interface ErrorMessageProps {}

export default function ErrorMessage({}: ErrorMessageProps) {
  return <p className={css.text}>There was an error, please try again...</p>;
}
