import { useQuery, useQueryClient, useMutation, keepPreviousData } from '@tanstack/react-query';
import css from './NoteList.module.css';
import { fetchNotes, deleteNote, type FetchNotesResponse } from '../../services/noteService';
import type { Note } from '../../types/note';
import { useEffect, useRef } from 'react';
import Loader from '../Loader/Loader';
import ErrorMessage from '../ErrorMessage/ErrorMessage';
import { toast } from 'react-hot-toast';
import { getErrorMessage } from '../../utils/errors';

export interface NoteListProps {
  page: number;
  search: string;
  onPageCount?: (totalPages: number) => void;
  enterTick?: number; // сигнал, что нажали Enter в поле поиска
}

export default function NoteList({ page, search, onPageCount, enterTick }: NoteListProps) {
  const qc = useQueryClient();

  const {
    data,
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery<FetchNotesResponse, Error>({
    queryKey: ['notes', { page, search }],
    queryFn: () => fetchNotes({ page, perPage: 12, search }),
    placeholderData: keepPreviousData, // v5-замена keepPreviousData: true
  });

  useEffect(() => {
    if (data && onPageCount) onPageCount(data.totalPages);
  }, [data, onPageCount]);

  const del = useMutation({
    mutationFn: (id: string) => deleteNote(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['notes'] });
      toast.success('Note deleted');
    },
    onError: (err) => {
      toast.error(getErrorMessage(err, 'Failed to delete note'));
    },
  });

  
  const prevTick = useRef<number | undefined>(undefined);
  useEffect(() => {
    if (enterTick !== undefined && prevTick.current !== enterTick) {
      prevTick.current = enterTick;
      if (data && Array.isArray(data.notes) && data.notes.length === 0) {
        toast.error('Ничего не найдено по запросу');
      }
    }
  }, [enterTick, data]);

  if (isLoading) return <Loader message="Loading notes…" />;

  if (isError)
    return (
      <ErrorMessage
        message={getErrorMessage(error, 'Failed to load notes')}
        onRetry={() => {
          refetch();
        }}
      />
    );

  if (!data || data.notes.length === 0) return null;

  const notes = data.notes as Note[];

  return (
    <ul className={css.list}>
      {notes.map((n) => {
        const id = (n as any)._id ?? (n as any).id;
        return (
          <li key={id} className={css.listItem}>
            <h2 className={css.title}>{n.title}</h2>
            {n.content && <p className={css.content}>{n.content}</p>}
            <div className={css.footer}>
              <span className={css.tag}>{n.tag}</span>
              <button
                className={css.button}
                onClick={() => del.mutate(id as string)}
                disabled={del.isPending}
              >
                Delete
              </button>
            </div>
          </li>
        );
      })}
    </ul>
  );
}
