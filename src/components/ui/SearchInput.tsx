import { useState, useEffect, useRef } from 'react';
import { Search } from 'lucide-react';
import { cn } from '@/lib/cn';
import { Input } from './Input';

interface SearchInputProps {
  value?: string;
  onSearch: (query: string) => void;
  placeholder?: string;
  className?: string;
  /** Debounce delay in ms (default 300) */
  delay?: number;
}

export function SearchInput({
  value: controlledValue,
  onSearch,
  placeholder = 'Rechercher...',
  className,
  delay = 300,
}: SearchInputProps) {
  const [internal, setInternal] = useState(controlledValue ?? '');
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const isControlled = controlledValue !== undefined;
  const displayValue = isControlled ? controlledValue : internal;

  useEffect(() => {
    if (isControlled) setInternal(controlledValue);
  }, [controlledValue, isControlled]);

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const next = e.target.value;
    setInternal(next);

    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => onSearch(next), delay);
  }

  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  return (
    <Input
      icon={Search}
      placeholder={placeholder}
      value={displayValue}
      onChange={handleChange}
      className={cn(className)}
    />
  );
}
