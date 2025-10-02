import { useEffect, useMemo, useState } from 'react';
import { Toaster, toast } from 'react-hot-toast';
import styles from './App.module.css';

import SearchBar from '../SearchBar/SearchBar';
import MovieGrid from '../MovieGrid/MovieGrid';
import Loader from '../Loader/Loader';
import ErrorMessage from '../ErrorMessage/ErrorMessage';
import MovieModal from '../MovieModal/MovieModal';

import type { Movie } from '../../types/movie';
import { fetchMovies } from '../../services/movieService';
import ReactPaginate from 'react-paginate';
import { useQuery, keepPreviousData } from '@tanstack/react-query';

export default function App() {
  const [query, setQuery] = useState('');
  const [page, setPage] = useState(1);
  const [selected, setSelected] = useState<Movie | null>(null);

  const isEnabled = query.trim().length > 0;

  const { data, isFetching, isError, isPending } = useQuery({
    queryKey: ['movies', query, page],
    queryFn: () => fetchMovies({ query, page }),
    enabled: isEnabled,
    staleTime: 60000,
    retry: 1,
    placeholderData: keepPreviousData,
  });

  useEffect(() => {
    if (!isFetching && isEnabled && data && data.results.length === 0) {
      toast.error('No movies found for your request.');
    }
  }, [isFetching, isEnabled, data]);

  const movies = data?.results ?? [];
  const totalPages = useMemo(() => {
    const backendTotal = data?.total_pages ?? 0;
    return Math.min(backendTotal, 500);
  }, [data?.total_pages]);

  function handleSearch(nextQuery: string) {
    if (nextQuery === query) return;
    setQuery(nextQuery);
    setPage(1);
    setSelected(null);
  }

  const showLoader = isEnabled && (isFetching || isPending);

  return (
    <>
      <SearchBar onSubmit={handleSearch} />

      <main className={styles.app}>
        {isEnabled && totalPages > 1 && (
          <nav aria-label="Pagination" className={styles.paginationTopWrap}>
            <ReactPaginate
              pageCount={totalPages}
              pageRangeDisplayed={5}
              marginPagesDisplayed={1}
              onPageChange={({ selected }) => setPage(selected + 1)}
              forcePage={page - 1}
              containerClassName={styles.pagination}
              activeClassName={styles.active}
              nextLabel="→"
              previousLabel="←"
            />
          </nav>
        )}

        {showLoader && <Loader />}
        {!showLoader && isError && <ErrorMessage />}
        {!showLoader && !isError && <MovieGrid movies={movies} onSelect={setSelected} />}
      </main>

      <MovieModal movie={selected} onClose={() => setSelected(null)} />
      <Toaster position="top-center" />
    </>
  );
}
