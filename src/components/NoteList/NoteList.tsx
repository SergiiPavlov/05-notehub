import { useQuery, useQueryClient, useMutation } from '@tanstack/react-query';
import css from './NoteList.module.css';
import { fetchNotes, deleteNote } from '../../services/noteService';
import type { Note } from '../../types/note';
import { useEffect } from 'react';

interface NoteListProps {
  page: number;
  search: string;
  onPageCount?: (totalPages: number) => void;
}

export default function NoteList({ page, search, onPageCount }: NoteListProps) {
  const qc = useQueryClient();
  const { data, isLoading, isError } = useQuery({
    queryKey: ['notes', { page, search }],
    queryFn: () => fetchNotes({ page, perPage: 12, search }),
    keepPreviousData: true,
  });

  useEffect(() => {
    if (data && onPageCount) onPageCount(data.totalPages);
  }, [data, onPageCount]);

  const del = useMutation({
    mutationFn: (id: string) => deleteNote(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['notes'] });
    },
  });

  if (isLoading) return null;
  if (isError) return null;
  if (!data || data.notes.length === 0) return null;

  const notes = data.notes as Note[];

  return (
    <ul className={css.list}>
      {notes.map((n) => (
        <li key={(n as any)._id ?? (n as any).id} className={css.listItem}>
          <h2 className={css.title}>{n.title}</h2>
          {n.content && <p className={css.content}>{n.content}</p>}
          <div className={css.footer}>
            <span className={css.tag}>{n.tag}</span>
            <button className={css.button} onClick={() => del.mutate(((n as any)._id ?? (n as any).id) as string)} disabled={del.isPending}>
              Delete
            </button>
          </div>
        </li>
      ))}
    </ul>
  );
}
