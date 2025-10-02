import { useEffect, useMemo, useState } from 'react';
import css from './App.module.css';
import SearchBox from '../SearchBox/SearchBox';
import Pagination from '../Pagination/Pagination';
import NoteList from '../NoteList/NoteList';
import Modal from '../Modal/Modal';
import NoteForm from '../NoteForm/NoteForm';
import { useDebounce } from 'use-debounce';
import { Toaster, toast } from 'react-hot-toast';
import { useQuery } from '@tanstack/react-query';
import { fetchNotes, type FetchNotesResponse } from '../../services/noteService';
import Loader from '../Loader/Loader';
import ErrorMessage from '../ErrorMessage/ErrorMessage';
import { getErrorMessage } from '../../utils/errors';

export default function App() {
  const [page, setPage] = useState<number>(1);
  const [search, setSearch] = useState<string>('');
  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const [debouncedSearch] = useDebounce(search, 400);
  const [searchSubmitTick, setSearchSubmitTick] = useState<number>(0);

  // Главный запрос — как требовал ментор, в App
  const { data, isLoading, isError, error } = useQuery<FetchNotesResponse, Error>({
    queryKey: ['notes', { page, search: debouncedSearch }],
    queryFn: () => fetchNotes({ page, perPage: 12, search: debouncedSearch }),
    placeholderData: (prev) => prev, // v5: оставить предыдущие данные
    staleTime: 1000,
  });

  const totalPages = data?.totalPages ?? 1;
  const notes = useMemo(() => data?.notes ?? [], [data]);

  // По нажатию Enter показать тост, если пусто
  useEffect(() => {
    if (searchSubmitTick > 0 && data && Array.isArray(data.notes) && data.notes.length === 0) {
      toast.error('Нічого не знайдено за запитом');
    }
  }, [searchSubmitTick, data]);

  return (
    <div className={css.app}>
      <Toaster position="top-right" />
      <header className={css.toolbar}>
        <SearchBox
          value={search}
          onChange={(v: string) => {
            setSearch(v);
            setPage(1);
          }}
          onEnter={() => setSearchSubmitTick((x) => x + 1)}
        />

        {totalPages > 1 && (
          <Pagination currentPage={page} onPageChange={setPage} totalPages={totalPages} />
        )}

        <button className={css.button} onClick={() => setModalOpen(true)}>
          Create note +
        </button>
      </header>

      {/* Статусы загрузки/ошибок — в App */}
      {isLoading && <Loader message="Loading notes…" />}
      {isError && (
        <ErrorMessage message={getErrorMessage(error, 'Failed to load notes')} />
      )}

      {!isLoading && !isError && notes.length > 0 && <NoteList notes={notes} />}

      {modalOpen && (
        <Modal onClose={() => setModalOpen(false)}>
          <NoteForm onCreated={() => setModalOpen(false)} onCancel={() => setModalOpen(false)} />
        </Modal>
      )}
    </div>
  );
}
