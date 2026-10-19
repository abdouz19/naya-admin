import { ArrowLeft, ArrowRight } from '@/components/icons';
import { cn } from '@/lib/cn';

interface PaginationProps {
  page: number;
  pageSize: number;
  total: number;
  onPageChange: (page: number) => void;
  className?: string;
}

/** Pages to show: first, last, current ± 1, with gaps in between. */
function pagesToShow(page: number, pageCount: number): (number | 'gap')[] {
  const pages = new Set([1, pageCount, page - 1, page, page + 1]);
  const sorted = [...pages]
    .filter((p) => p >= 1 && p <= pageCount)
    .sort((a, b) => a - b);
  const result: (number | 'gap')[] = [];
  sorted.forEach((p, index) => {
    if (index > 0 && p - sorted[index - 1] > 1) result.push('gap');
    result.push(p);
  });
  return result;
}

export function Pagination({
  page,
  pageSize,
  total,
  onPageChange,
  className,
}: PaginationProps) {
  const pageCount = Math.max(1, Math.ceil(total / pageSize));
  if (total === 0) return null;

  const first = (page - 1) * pageSize + 1;
  const last = Math.min(page * pageSize, total);
  const button =
    'flex h-9 min-w-9 items-center justify-center rounded-xl px-3 text-sm transition-colors';

  return (
    <div
      className={cn(
        'flex flex-wrap items-center justify-between gap-3 px-1',
        className,
      )}
    >
      <p className="text-sm text-muted">
        {first}–{last} sur {total}
      </p>

      {pageCount > 1 && (
        <div className="flex items-center gap-1">
          <button
            type="button"
            className={cn(button, 'text-ink-soft hover:bg-white disabled:opacity-40 disabled:hover:bg-transparent')}
            disabled={page <= 1}
            onClick={() => onPageChange(page - 1)}
            aria-label="Page précédente"
          >
            <ArrowLeft size={16} />
          </button>
          {pagesToShow(page, pageCount).map((p, index) =>
            p === 'gap' ? (
              <span key={`gap-${index}`} className="px-1 text-muted">
                …
              </span>
            ) : (
              <button
                key={p}
                type="button"
                onClick={() => onPageChange(p)}
                aria-current={p === page ? 'page' : undefined}
                className={cn(
                  button,
                  p === page
                    ? 'bg-rose font-semibold text-white'
                    : 'text-ink-soft hover:bg-white',
                )}
              >
                {p}
              </button>
            ),
          )}
          <button
            type="button"
            className={cn(button, 'text-ink-soft hover:bg-white disabled:opacity-40 disabled:hover:bg-transparent')}
            disabled={page >= pageCount}
            onClick={() => onPageChange(page + 1)}
            aria-label="Page suivante"
          >
            <ArrowRight size={16} />
          </button>
        </div>
      )}
    </div>
  );
}
