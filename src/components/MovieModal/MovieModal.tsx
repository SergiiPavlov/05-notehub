import { useEffect } from 'react';
import { createPortal } from 'react-dom';
import type { Movie } from '../../types/movie';
import { getImageUrl } from '../../services/movieService';
import css from './MovieModal.module.css';

const portalRoot = document.getElementById('modal-root') || document.body;

export interface MovieModalProps {
  movie: Movie | null;
  onClose: () => void;
}

export default function MovieModal({ movie, onClose }: MovieModalProps) {
  useEffect(() => {
    if (!movie) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', onKeyDown);
    return () => {
      window.removeEventListener('keydown', onKeyDown);
      document.body.style.overflow = '';
    };
  }, [movie, onClose]);

  if (!movie) return null;

  // Если бэкдропа нет — не ставим src вовсе
  const backdropSrc: string | undefined = movie.backdrop_path
    ? getImageUrl(movie.backdrop_path, 'original')
    : undefined;

  const handleBackdrop = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) onClose();
  };

  return createPortal(
    <div className={css.backdrop} role="dialog" aria-modal="true" onClick={handleBackdrop}>
      <div className={css.modal}>
        <button className={css.closeButton} aria-label="Close modal" onClick={onClose}>
          &times;
        </button>
        <img
          src={backdropSrc}
          alt={movie.title}
          className={css.image}
        />
        <div className={css.content}>
          <h2>{movie.title}</h2>
          <p>{movie.overview}</p>
          <p>
            <strong>Release Date:</strong> {movie.release_date}
          </p>
          <p>
            <strong>Rating:</strong> {movie.vote_average}/10
          </p>
        </div>
      </div>
    </div>,
    portalRoot
  );
}
