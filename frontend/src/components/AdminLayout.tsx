import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { motion } from 'framer-motion';

interface AdminLayoutProps {
  children: React.ReactNode;
  title: string;
}

const AdminLayout: React.FC<AdminLayoutProps> = ({ children, title }) => {
  const router = useRouter();
  const [adminName, setAdminName] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('admin_token') || sessionStorage.getItem('admin_token');
    const user = localStorage.getItem('admin_user') || sessionStorage.getItem('admin_user');

    if (!token) {
      router.push('/admin/login');
    } else {
      if (user && user !== 'undefined') {
        try {
          setAdminName(JSON.parse(user).nama);
        } catch (e) {
          console.error('Error parsing admin user:', e);
          localStorage.removeItem('admin_user');
          sessionStorage.removeItem('admin_user');
        }
      }
      setIsLoading(false);
    }
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem('admin_token');
    localStorage.removeItem('admin_user');
    sessionStorage.removeItem('admin_token');
    sessionStorage.removeItem('admin_user');
    router.push('/admin/login');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center text-white">
        <div className="w-10 h-10 border-4 border-amber-400/20 border-t-amber-400 rounded-full animate-spin" />
      </div>
    );
  }

  const menuItems = [
    { name: 'Dashboard', path: '/admin/dashboard', icon: '📊' },
    { name: 'Kelola Paket', path: '/admin/paket', icon: '🕋' },
    { name: 'Data Pembayaran', path: '/admin/pembayaran', icon: '💳' },
    { name: 'Testimoni', path: '/admin/testimoni', icon: '💬' },
    { name: 'Galeri', path: '/admin/galeri', icon: '🖼️' },
    { name: 'Lihat Website', path: '/', icon: '🌐' },
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 font-sans">
      {/* Sidebar */}
      <aside className="fixed left-0 top-0 h-full w-72 bg-slate-900 border-r border-white/5 z-40 hidden lg:flex flex-col">
        <div className="p-8">
          <div className="flex items-center gap-3 mb-10">
            <div className="w-10 h-10 rounded-2xl bg-amber-400 flex items-center justify-center text-black font-bold">
              A
            </div>
            <div>
              <h3 className="font-bold text-white leading-tight">Admin Al Anshor</h3>
              <p className="text-[10px] text-amber-400 font-bold uppercase tracking-widest">Management System</p>
            </div>
          </div>

          <nav className="space-y-2">
            {menuItems.map((item) => (
              <Link
                key={item.path}
                href={item.path}
                className={`flex items-center gap-3 px-6 py-4 rounded-2xl transition-all duration-300 group ${router.pathname.startsWith(item.path)
                    ? 'bg-amber-400 text-black shadow-lg shadow-amber-400/20'
                    : 'text-slate-400 hover:bg-white/5 hover:text-white'
                  }`}
              >
                <span className="text-xl">{item.icon}</span>
                <span className="font-semibold text-sm">{item.name}</span>
              </Link>
            ))}
          </nav>
        </div>

        <div className="mt-auto p-8">
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-6 py-4 w-full rounded-2xl bg-rose-500/10 text-rose-400 hover:bg-rose-500 hover:text-white transition-all duration-300 font-bold text-sm"
          >
            <span>🚪</span>
            Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="lg:ml-72 min-h-screen">
        {/* Header */}
        <header className="h-20 border-b border-white/5 bg-slate-900/50 backdrop-blur-md flex items-center justify-between px-8 sticky top-0 z-30">
          <h2 className="text-xl font-bold text-white">{title}</h2>

          <div className="flex items-center gap-6">
            <button
              onClick={handleLogout}
              className="px-4 py-2 rounded-xl bg-rose-500/10 text-rose-400 hover:bg-rose-500 hover:text-white transition-all text-xs font-bold sm:hidden"
            >
              Logout
            </button>

            <div className="flex items-center gap-4">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-bold text-white">{adminName}</p>
                <p className="text-[10px] text-slate-500 uppercase font-bold tracking-tighter">Administrator</p>
              </div>
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 border border-white/10" />
            </div>
          </div>
        </header>

        {/* Content Area */}
        <div className="p-8">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            {children}
          </motion.div>
        </div>
      </main>
    </div>
  );
};

export default AdminLayout;
