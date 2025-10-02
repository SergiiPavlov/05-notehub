import ReactPaginate from 'react-paginate';
import css from './Pagination.module.css';

export interface PaginationProps {
  currentPage: number;
  onPageChange: (page: number) => void;
  totalPages: number;
}

export default function Pagination({ currentPage, onPageChange, totalPages }: PaginationProps) {
  if (!totalPages || totalPages <= 1) return null;

  return (
    <ReactPaginate
      containerClassName={css.pagination}
      pageClassName={css.pageItem}
      pageLinkClassName={css.pageLink}
      activeLinkClassName={css.active}
      previousLabel="<"
      nextLabel=">"
      breakLabel="..."
      pageCount={totalPages}
      forcePage={currentPage - 1}
      onPageChange={(sel: { selected: number }) => onPageChange(sel.selected + 1)}
    />
  );
}
