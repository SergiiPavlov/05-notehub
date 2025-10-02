import ReactPaginate from 'react-paginate';
import css from './Pagination.module.css';
import { useQuery } from '@tanstack/react-query';
import { fetchNotes } from '../../services/noteService';

interface PaginationProps {
  currentPage: number;
  onPageChange: (page: number) => void;
  search: string; // ← добавлено
}

export default function Pagination({ currentPage, onPageChange, search }: PaginationProps) {
  // Получаем актуальное количество страниц под текущий фильтр
  const { data } = useQuery({
    queryKey: ['notes', { page: currentPage, search }], // ← учитываем search
    queryFn: () => fetchNotes({ page: currentPage, perPage: 12, search }), // ← передаём search
    keepPreviousData: true,
    staleTime: 1000,
  });

  const pageCount = Math.max(1, data?.totalPages ?? 1);
  if (!data || pageCount <= 1) return null; // ← рендерим, только если > 1 страниц

  return (
    <ReactPaginate
      containerClassName={css.pagination}
      pageClassName={css.pageItem}
      pageLinkClassName={css.pageLink}
      activeLinkClassName={css.active}
      previousLabel="<"
      nextLabel=">"
      breakLabel="..."
      pageCount={pageCount}
      forcePage={currentPage - 1}
      onPageChange={(sel: { selected: number }) => onPageChange(sel.selected + 1)}
    />
  );
}
