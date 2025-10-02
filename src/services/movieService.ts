import axios from 'axios';
import type { Movie } from '../types/movie';

const TMDB_BASE = 'https://api.themoviedb.org/3';
const TOKEN = import.meta.env.VITE_TMDB_TOKEN as string;

export interface FetchMoviesParams {
  query: string;
  page?: number;
}

interface TMDBSearchResponse {
  page: number;
  results: Movie[];
  total_pages: number;
  total_results: number;
}

export function getImageUrl(
  path: string | null,
  size: 'w200' | 'w300' | 'w500' | 'original' = 'w300',
): string | undefined {
  return path ? `https://image.tmdb.org/t/p/${size}${path}` : undefined;
}

export async function fetchMovies({
  query,
  page = 1,
}: FetchMoviesParams): Promise<TMDBSearchResponse> {
  if (!TOKEN) {
    throw new Error('Missing TMDB token. Put it to .env as VITE_TMDB_TOKEN');
  }

  const { data } = await axios.get<TMDBSearchResponse>(`${TMDB_BASE}/search/movie`, {
    params: { query, page, include_adult: false, language: 'en-US' },
    headers: { Authorization: `Bearer ${TOKEN}` },
  });

  return data;
}
