import { useState } from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  FileText,
  MessageSquare,
  BarChart3,
  ChevronLeft,
  ChevronRight,
  Brain,
  Settings,
  HelpCircle,
} from 'lucide-react';

const navItems = [
  { to: '/', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/documents', icon: FileText, label: 'Documents' },
  { to: '/chat', icon: MessageSquare, label: 'Chat' },
  { to: '/evaluation', icon: BarChart3, label: 'Evaluation' },
];

const bottomItems = [
  { to: '#', icon: Settings, label: 'Settings' },
  { to: '#', icon: HelpCircle, label: 'Help' },
];

export default function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <aside
      className={`fixed left-0 top-0 h-screen flex flex-col z-50
        bg-surface-secondary border-r border-border-default
        transition-all duration-300 ease-in-out
        ${collapsed ? 'w-[72px]' : 'w-64'}`}
    >
      {/* Logo */}
      <div className="flex items-center gap-3 px-5 h-16 border-b border-border-default shrink-0">
        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-brand-500 to-accent-500 flex items-center justify-center shrink-0">
          <Brain size={18} className="text-white" />
        </div>
        {!collapsed && (
          <span className="text-sm font-semibold text-text-primary whitespace-nowrap tracking-tight">
            RAG Intelligence
          </span>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 py-4 px-3 space-y-1 overflow-y-auto">
        {navItems.map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            end={to === '/'}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium
               transition-default group
               ${
                 isActive
                   ? 'bg-brand-600/15 text-brand-400 shadow-[inset_0_0_0_1px_rgba(59,130,246,0.2)]'
                   : 'text-text-secondary hover:text-text-primary hover:bg-white/5'
               }`
            }
          >
            <Icon size={20} className="shrink-0" />
            {!collapsed && <span className="whitespace-nowrap">{label}</span>}
          </NavLink>
        ))}
      </nav>

      {/* Bottom section */}
      <div className="py-3 px-3 space-y-1 border-t border-border-default">
        {bottomItems.map(({ to, icon: Icon, label }) => (
          <a
            key={label}
            href={to}
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium
              text-text-muted hover:text-text-secondary hover:bg-white/5
              transition-default"
          >
            <Icon size={20} className="shrink-0" />
            {!collapsed && <span className="whitespace-nowrap">{label}</span>}
          </a>
        ))}
      </div>

      {/* Collapse toggle */}
      <button
        onClick={() => setCollapsed((c) => !c)}
        className="absolute -right-3 top-20 w-6 h-6 rounded-full
          bg-surface-tertiary border border-border-default
          flex items-center justify-center
          text-text-muted hover:text-text-primary hover:bg-surface-elevated
          transition-default shadow-md z-50"
        aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
      >
        {collapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
      </button>
    </aside>
  );
}
