import ReactPaginate from 'react-paginate';
import css from './Pagination.module.css';
import { useQuery, keepPreviousData } from '@tanstack/react-query';
import { fetchNotes, type FetchNotesResponse } from '../../services/noteService';

interface PaginationProps {
  currentPage: number;
  onPageChange: (page: number) => void;
  search: string;
}

export default function Pagination({ currentPage, onPageChange, search }: PaginationProps) {
  const { data } = useQuery<FetchNotesResponse, Error>({
    queryKey: ['notes', { page: currentPage, search }],
    queryFn: () => fetchNotes({ page: currentPage, perPage: 12, search }),
    placeholderData: keepPreviousData, // v5
    staleTime: 1000,
  });

  const pageCount = Math.max(1, data?.totalPages ?? 1);
  if (!data || pageCount <= 1) return null;

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
