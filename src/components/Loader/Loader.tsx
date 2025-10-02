import css from './Loader.module.css';

export interface LoaderProps {}

export default function Loader({}: LoaderProps) {
  return <p className={css.text}>Loading movies, please wait...</p>;
}
