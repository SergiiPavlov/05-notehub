import type { Movie } from '../../types/movie';
import { getImageUrl } from '../../services/movieService';
import css from './MovieGrid.module.css';

export interface MovieGridProps {
  movies: Movie[];
  onSelect: (movie: Movie) => void;
}

export default function MovieGrid({ movies, onSelect }: MovieGridProps) {
  if (!movies.length) return null;

  return (
    <ul className={css.grid}>
      {movies.map((m) => {
        // Если постера нет, src оставляем undefined — React просто не добавит атрибут
        const posterSrc: string | undefined = m.poster_path
          ? getImageUrl(m.poster_path, 'w500')
          : undefined;

        return (
          <li key={m.id}>
            <div className={css.card} onClick={() => onSelect(m)} role="button" tabIndex={0}>
              <img
                className={css.image}
                src={posterSrc}
                alt={m.title}
                loading="lazy"
              />
              <h2 className={css.title}>{m.title}</h2>
            </div>
          </li>
        );
      })}
    </ul>
  );
}
