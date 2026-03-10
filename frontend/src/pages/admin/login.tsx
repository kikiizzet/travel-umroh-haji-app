import React, { useState } from 'react';
import { useRouter } from 'next/router';
import { motion } from 'framer-motion';
import Head from 'next/head';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';

const MySwal = withReactContent(Swal);

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

export default function AdminLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const res = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || 'Login gagal. Cek kembali email dan password Anda.');
      }

      // Save token
      if (rememberMe) {
        localStorage.setItem('admin_token', data.access_token);
        localStorage.setItem('admin_user', JSON.stringify(data.admin));
      } else {
        // Jika tidak ingat saya, gunakan sessionStorage
        sessionStorage.setItem('admin_token', data.access_token);
        sessionStorage.setItem('admin_user', JSON.stringify(data.admin));
      }

      // Redirect to dashboard
      MySwal.fire({
        icon: 'success',
        title: 'Login Berhasil',
        text: 'Selamat datang di panel admin Al Anshor',
        background: '#0f172a',
        color: '#fff',
        timer: 1500,
        showConfirmButton: false,
        toast: true,
        position: 'top-end'
      });
      router.push('/admin/dashboard');
    } catch (err: any) {
      setError(err.message);
      MySwal.fire({
        icon: 'error',
        title: 'Login Gagal',
        text: err.message,
        background: '#0f172a',
        color: '#fff',
        confirmButtonColor: '#fbbf24'
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-6 relative overflow-hidden">
      <Head>
        <title>Login Admin | Al Anshor Tours</title>
      </Head>

      {/* Background Decor */}
      <div className="absolute top-0 left-0 w-full h-full">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-indigo-600/20 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-amber-500/10 rounded-full blur-[120px]" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md relative z-10"
      >
        <div className="bg-slate-900/50 backdrop-blur-xl border border-white/10 rounded-[2.5rem] p-10 shadow-2xl">
          <div className="text-center mb-10">
            <div className="w-20 h-20 bg-gradient-to-br from-amber-400 to-orange-500 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-lg shadow-amber-500/20">
              <span className="text-4xl text-black">🕋</span>
            </div>
            <h1 className="text-3xl font-bold text-white mb-2">Admin Portal</h1>
            <p className="text-slate-400">Silakan masuk untuk mengelola paket & jamaah</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label className="block text-sm font-semibold text-slate-300 mb-2 pl-1">Email Address</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full h-14 bg-white/5 border border-white/10 rounded-2xl px-6 text-white outline-none focus:ring-2 focus:ring-amber-400/50 transition-all"
                placeholder="name@alanshor.com"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-300 mb-2 pl-1">Password</label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full h-14 bg-white/5 border border-white/10 rounded-2xl px-6 text-white outline-none focus:ring-2 focus:ring-amber-400/50 transition-all"
                placeholder="••••••••"
              />
            </div>

            <div className="flex items-center justify-between px-1">
              <label className="flex items-center gap-3 cursor-pointer group">
                <div className="relative">
                  <input
                    type="checkbox"
                    className="sr-only peer"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                  />
                  <div className="w-5 h-5 bg-white/5 border border-white/10 rounded-md peer-checked:bg-amber-400 peer-checked:border-amber-400 transition-all" />
                  <svg className="absolute top-0.5 left-0.5 w-4 h-4 text-black opacity-0 peer-checked:opacity-100 transition-opacity" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="4">
                    <path d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <span className="text-sm text-slate-400 group-hover:text-slate-300 transition-colors">Ingat Saya</span>
              </label>
              <button type="button" className="text-sm text-amber-400/80 hover:text-amber-400 font-semibold transition-colors">
                Lupa Password?
              </button>
            </div>

            {error && (
              <motion.div
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                className="p-4 bg-rose-500/10 border border-rose-500/20 rounded-xl text-rose-400 text-sm text-center"
              >
                {error}
              </motion.div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full h-14 bg-gradient-to-r from-amber-400 to-orange-500 text-black font-bold rounded-2xl shadow-lg shadow-amber-500/20 hover:shadow-amber-500/40 transition-all active:scale-95 disabled:opacity-50 disabled:scale-100 mt-4 flex items-center justify-center gap-3"
            >
              {isLoading ? (
                <>
                  <div className="w-5 h-5 border-2 border-black/30 border-t-black rounded-full animate-spin" />
                  Memproses...
                </>
              ) : (
                'Masuk Sekarang'
              )}
            </button>
          </form>

          <p className="mt-10 text-center text-slate-500 text-xs">
            © 2025 Al Anshor Tours & Travel. <br /> Keamanan data adalah prioritas kami.
          </p>
        </div>
      </motion.div>
    </div>
  );
}
