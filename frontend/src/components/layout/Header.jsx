import { Bell, Search } from 'lucide-react';

export default function Header({ title, subtitle }) {
  return (
    <header className="flex items-center justify-between h-16 px-8 border-b border-border-default bg-surface-secondary/50 backdrop-blur-sm shrink-0">
      <div>
        <h1 className="text-lg font-semibold text-text-primary">{title}</h1>
        {subtitle && (
          <p className="text-xs text-text-muted mt-0.5">{subtitle}</p>
        )}
      </div>
      <div className="flex items-center gap-3">
        {/* Search */}
        <div className="relative hidden md:block">
          <Search
            size={16}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted"
          />
          <input
            type="text"
            placeholder="Search…"
            className="w-56 pl-9 pr-4 py-2 text-sm rounded-lg
              bg-surface-tertiary/50 border border-border-default
              text-text-primary placeholder:text-text-muted
              focus:outline-none focus:border-brand-500/50 focus:ring-1 focus:ring-brand-500/30
              transition-default"
          />
        </div>

        {/* Notifications */}
        <button className="relative p-2 rounded-lg text-text-muted hover:text-text-primary hover:bg-white/5 transition-default">
          <Bell size={20} />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-brand-500 rounded-full" />
        </button>

        {/* Avatar */}
        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-brand-500 to-accent-500 flex items-center justify-center text-xs font-bold text-white cursor-pointer">
          U
        </div>
      </div>
    </header>
  );
}
