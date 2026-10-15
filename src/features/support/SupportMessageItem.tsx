import { cn } from '@/lib/cn';
import { formatDateTime } from '@/lib/format';
import type { SupportMessage } from '@/types/support';
import { eventLabel } from '@/types/support';

interface SupportMessageItemProps {
  message: SupportMessage;
  userName: string;
}

export function SupportMessageItem({ message, userName }: SupportMessageItemProps) {
  if (message.author === 'event') {
    return (
      <div className="flex justify-center py-1">
        <p className="text-center text-[11px] text-muted">
          {eventLabel(message.body)} · {formatDateTime(message.createdAt)}
        </p>
      </div>
    );
  }

  const isTeam = message.author === 'team';
  const name = isTeam ? message.authorName || 'Équipe NAYHA' : userName;

  return (
    <div className={cn('flex flex-col', isTeam ? 'items-end' : 'items-start')}>
      <span className="mb-1 px-1 text-[11px] font-medium text-muted">{name}</span>
      <div
        className={cn(
          'max-w-[80%] radius-md px-4 py-2.5 text-sm leading-relaxed shadow-card',
          isTeam
            ? 'bg-rose text-white rounded-br-sm'
            : 'bg-white text-ink rounded-bl-sm',
        )}
      >
        {message.body && <p className="whitespace-pre-wrap break-words">{message.body}</p>}
        {message.attachmentUrl && (
          <a
            href={message.attachmentUrl}
            target="_blank"
            rel="noopener noreferrer"
            className={cn('block', message.body && 'mt-2')}
            title="Ouvrir la pièce jointe en grand"
          >
            <img
              src={message.attachmentUrl}
              alt="Pièce jointe"
              loading="lazy"
              className="max-h-48 max-w-full rounded-lg object-cover"
            />
          </a>
        )}
      </div>
      <span className="mt-1 px-1 text-[10px] text-muted-light">
        {formatDateTime(message.createdAt)}
      </span>
    </div>
  );
}
