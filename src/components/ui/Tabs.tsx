import { cn } from '@/lib/cn';
import { Badge } from './Badge';

interface Tab {
  key: string;
  label: string;
  count?: number;
}

interface TabsProps {
  tabs: Tab[];
  activeKey: string;
  onChange: (key: string) => void;
  className?: string;
}

export function Tabs({ tabs, activeKey, onChange, className }: TabsProps) {
  return (
    <div
      className={cn('flex gap-1 border-b border-gray-200', className)}
      role="tablist"
    >
      {tabs.map((tab) => {
        const isActive = tab.key === activeKey;

        return (
          <button
            key={tab.key}
            type="button"
            role="tab"
            aria-selected={isActive}
            onClick={() => onChange(tab.key)}
            className={cn(
              '-mb-px px-4 py-2.5 text-sm font-medium transition-colors',
              isActive
                ? 'border-b-2 border-rose text-brown'
                : 'text-muted hover:text-brown',
            )}
          >
            <span className="inline-flex items-center gap-2">
              {tab.label}
              {tab.count !== undefined && (
                <Badge variant={isActive ? 'rose' : 'muted'}>
                  {tab.count}
                </Badge>
              )}
            </span>
          </button>
        );
      })}
    </div>
  );
}
