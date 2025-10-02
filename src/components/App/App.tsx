import { useState, useEffect } from 'react';
import css from './App.module.css';
import SearchBox from '../SearchBox/SearchBox';
import Pagination from '../Pagination/Pagination';
import NoteList from '../NoteList/NoteList';
import Modal from '../Modal/Modal';
import NoteForm from '../NoteForm/NoteForm';
import { useDebounce } from 'use-debounce';

export default function App() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [debouncedSearch] = useDebounce(search, 400);
  useEffect(() => { setPage(1); }, [debouncedSearch]);

  return (
    <div className={css.app}>
      <header className={css.toolbar}>
        <SearchBox value={search} onChange={setSearch} />
        <Pagination currentPage={page} onPageChange={setPage} search={debouncedSearch} />
        <button className={css.button} onClick={() => setModalOpen(true)}>
          Create note +
        </button>
      </header>

      <NoteList page={page} search={debouncedSearch} onPageCount={(count) => {
        // Keep page within bounds when filters change
        if (page > count) setPage(count || 1);
      }}/>

      {modalOpen && (
        <Modal onClose={() => setModalOpen(false)}>
          <NoteForm onCreated={() => { setModalOpen(false); setPage(1); }} onCancel={() => setModalOpen(false)} />
        </Modal>
      )}
    </div>
  );
}
