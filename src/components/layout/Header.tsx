interface HeaderProps {
  title: string;
  subtitle?: string;
}

export function Header({ title, subtitle }: HeaderProps) {
  return (
    <header className="px-8 py-5 border-b border-gray-200">
      <h1 className="font-heading text-2xl text-brown font-semibold">{title}</h1>
      {subtitle && (
        <p className="text-sm text-muted mt-0.5">{subtitle}</p>
      )}
    </header>
  );
}
