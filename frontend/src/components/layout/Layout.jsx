import { Outlet, useLocation } from 'react-router-dom';
import Sidebar from './Sidebar';
import Header from './Header';

const pageMeta = {
  '/': { title: 'Dashboard', subtitle: 'System overview and analytics' },
  '/documents': { title: 'Documents', subtitle: 'Manage your knowledge base' },
  '/chat': { title: 'Chat', subtitle: 'Ask questions about your documents' },
  '/evaluation': { title: 'Evaluation', subtitle: 'RAG pipeline performance metrics' },
};

export default function Layout() {
  const { pathname } = useLocation();
  const meta = pageMeta[pathname] || { title: 'RAG Intelligence', subtitle: '' };

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      {/* Main content area — offset matches sidebar width (w-64 default) */}
      <div className="flex-1 ml-64 flex flex-col min-h-screen transition-all duration-300">
        <Header title={meta.title} subtitle={meta.subtitle} />
        <main className="flex-1 p-8 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
