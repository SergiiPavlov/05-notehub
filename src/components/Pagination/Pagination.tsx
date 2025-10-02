import ReactPaginate from 'react-paginate';
import css from './Pagination.module.css';
import { useQuery } from '@tanstack/react-query';
import { fetchNotes } from '../../services/noteService';

interface PaginationProps {
  currentPage: number;
  onPageChange: (page: number) => void;
}

export default function Pagination({ currentPage, onPageChange, search = '' }: PaginationProps) {
  // Peek the latest total pages for a pleasant UX
  const { data } = useQuery({
    queryKey: ['notes', { page: currentPage }],
    queryFn: () => fetchNotes({ page: currentPage, perPage: 12 }),
    staleTime: 1000, 
  });
  const pageCount = data?.totalPages ?? 0;
  if (!pageCount || pageCount <= 1) return null;

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
