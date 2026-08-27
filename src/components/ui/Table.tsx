import {
  type ReactNode,
  type ThHTMLAttributes,
  type TdHTMLAttributes,
  type HTMLAttributes,
} from 'react';
import { ArrowUpDown } from 'lucide-react';
import { cn } from '@/lib/cn';

/* ------------------------------------------------------------------ */
/*  Root                                                               */
/* ------------------------------------------------------------------ */

interface TableRootProps extends HTMLAttributes<HTMLTableElement> {
  children: ReactNode;
}

function TableRoot({ className, children, ...props }: TableRootProps) {
  return (
    <div className="w-full overflow-hidden radius-md bg-white shadow-card">
      <table className={cn('w-full border-collapse', className)} {...props}>
        {children}
      </table>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Header                                                             */
/* ------------------------------------------------------------------ */

interface TableHeaderProps {
  children: ReactNode;
  className?: string;
}

function Header({ className, children }: TableHeaderProps) {
  return (
    <thead
      className={cn(
        'bg-beige text-xs uppercase tracking-wider text-muted',
        className,
      )}
    >
      <tr>{children}</tr>
    </thead>
  );
}

/* ------------------------------------------------------------------ */
/*  Body                                                               */
/* ------------------------------------------------------------------ */

interface TableBodyProps {
  children: ReactNode;
  className?: string;
}

function Body({ className, children }: TableBodyProps) {
  return (
    <tbody className={cn('divide-y divide-gray-200', className)}>
      {children}
    </tbody>
  );
}

/* ------------------------------------------------------------------ */
/*  Row                                                                */
/* ------------------------------------------------------------------ */

interface TableRowProps extends HTMLAttributes<HTMLTableRowElement> {
  clickable?: boolean;
  children: ReactNode;
}

function Row({ clickable = false, className, children, ...props }: TableRowProps) {
  return (
    <tr
      className={cn(
        'border-b border-gray-200 transition-colors hover:bg-cream',
        clickable && 'cursor-pointer',
        className,
      )}
      {...props}
    >
      {children}
    </tr>
  );
}

/* ------------------------------------------------------------------ */
/*  Cell                                                               */
/* ------------------------------------------------------------------ */

interface TableCellProps extends TdHTMLAttributes<HTMLTableCellElement> {
  children?: ReactNode;
}

function Cell({ className, children, ...props }: TableCellProps) {
  return (
    <td className={cn('px-4 py-3 text-sm', className)} {...props}>
      {children}
    </td>
  );
}

/* ------------------------------------------------------------------ */
/*  SortHeader                                                         */
/* ------------------------------------------------------------------ */

type SortDirection = 'asc' | 'desc' | null;

interface SortHeaderProps extends ThHTMLAttributes<HTMLTableCellElement> {
  children: ReactNode;
  sortDirection?: SortDirection;
  onSort?: () => void;
}

function SortHeader({
  children,
  sortDirection,
  onSort,
  className,
  ...props
}: SortHeaderProps) {
  return (
    <th
      className={cn(
        'cursor-pointer select-none px-4 py-3 text-left text-xs font-medium uppercase tracking-wider',
        'transition-colors hover:text-brown',
        className,
      )}
      onClick={onSort}
      {...props}
    >
      <span className="inline-flex items-center gap-1">
        {children}
        <ArrowUpDown
          size={14}
          className={cn(
            'text-muted-light',
            sortDirection === 'asc' && 'rotate-180 text-rose',
            sortDirection === 'desc' && 'text-rose',
          )}
        />
      </span>
    </th>
  );
}

/* ------------------------------------------------------------------ */
/*  Compound export                                                    */
/* ------------------------------------------------------------------ */

export const Table = Object.assign(TableRoot, {
  Header,
  Body,
  Row,
  Cell,
  SortHeader,
});
