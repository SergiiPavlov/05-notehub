import { useEffect, useState } from 'react';
import css from './App.module.css';
import SearchBox from '../SearchBox/SearchBox';
import Pagination from '../Pagination/Pagination';
import NoteList from '../NoteList/NoteList';
import Modal from '../Modal/Modal';
import NoteForm from '../NoteForm/NoteForm';
import { useDebounce } from 'use-debounce';
import { Toaster } from 'react-hot-toast';

export default function App() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [debouncedSearch] = useDebounce(search, 400);

  // ← тик (счётчик) отправки поиска по Enter
  const [searchSubmitTick, setSearchSubmitTick] = useState(0);

  useEffect(() => {
    setPage(1);
  }, [debouncedSearch]);

  return (
    <div className={css.app}>
      <Toaster position="top-right" />
      <header className={css.toolbar}>
        <SearchBox
          value={search}
          onChange={setSearch}
          onEnter={() => setSearchSubmitTick((n) => n + 1)} // ← фикс Enter
        />
        <Pagination currentPage={page} onPageChange={setPage} search={debouncedSearch} />
        <button className={css.button} onClick={() => setModalOpen(true)}>
          Create note +
        </button>
      </header>

      <NoteList
        page={page}
        search={debouncedSearch}
        enterTick={searchSubmitTick}         // ← сообщаем списку, что был Enter
        onPageCount={(count) => {
          if (page > count) setPage(count || 1);
        }}
      />

      {modalOpen && (
        <Modal onClose={() => setModalOpen(false)}>
          <NoteForm onCreated={() => setModalOpen(false)} onCancel={() => setModalOpen(false)} />
        </Modal>
      )}
    </div>
  );
}
