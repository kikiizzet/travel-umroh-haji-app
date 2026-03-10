import React, { useEffect, useState } from 'react';
import AdminLayout from '@/components/AdminLayout';
import Head from 'next/head';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    totalPaket: 0,
    totalLunas: 0,
    pendapatan: 0,
    waitingPayments: 0
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const token = localStorage.getItem('admin_token');
        const [paketRes, paymentRes] = await Promise.all([
          fetch(`${API_URL}/paket`),
          fetch(`${API_URL}/pembayaran`, {
            headers: { 'Authorization': `Bearer ${token}` }
          })
        ]);

        const paketsJson = await paketRes.json();
        const pakets = Array.isArray(paketsJson) ? paketsJson : [];
        const paymentsJson = await paymentRes.json();
        const payments = Array.isArray(paymentsJson) ? paymentsJson : [];

        const lunasPayments = payments.filter((p: any) => p.status === 'LUNAS');
        const waitingPayments = payments.filter((p: any) => p.status === 'PENDING');
        const pendapatan = lunasPayments.reduce((acc: number, curr: any) => acc + curr.jumlah, 0);

        setStats({
          totalPaket: pakets.length,
          totalLunas: lunasPayments.length,
          pendapatan: pendapatan,
          waitingPayments: waitingPayments.length
        });
      } catch (error) {
        console.error("Error fetching stats:", error);
      }
    };

    fetchStats();
  }, []);

  const cardData = [
    { label: 'Total Paket', value: stats.totalPaket, icon: '🕋', color: 'from-blue-500 to-indigo-600' },
    { label: 'Pembayaran Lunas', value: stats.totalLunas, icon: '✅', color: 'from-emerald-500 to-teal-600' },
    { label: 'Menunggu Konfirmasi', value: stats.waitingPayments, icon: '⏳', color: 'from-amber-500 to-orange-600' },
    { label: 'Total Pendapatan', value: `Rp ${stats.pendapatan.toLocaleString('id-ID')}`, icon: '💰', color: 'from-purple-500 to-pink-600' },
  ];

  return (
    <AdminLayout title="Dashboard Overview">
      <Head>
        <title>Dashboard | Admin Al Anshor</title>
      </Head>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        {cardData.map((card, i) => (
          <div key={i} className="bg-slate-900 border border-white/5 p-6 rounded-3xl relative overflow-hidden group">
            <div className={`absolute top-0 right-0 w-24 h-24 bg-gradient-to-br ${card.color} opacity-10 rounded-bl-full translate-x-4 -translate-y-4 group-hover:scale-110 transition-transform`} />
            
            <div className="flex items-center gap-4 mb-4">
              <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${card.color} flex items-center justify-center text-2xl shadow-lg`}>
                {card.icon}
              </div>
              <span className="text-slate-400 text-sm font-semibold">{card.label}</span>
            </div>
            
            <div className="text-2xl font-bold text-white">
              {card.value}
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-slate-900 border border-white/5 rounded-3xl p-8">
          <h3 className="text-lg font-bold text-white mb-6">Informasi Sistem</h3>
          <div className="space-y-4">
            <div className="p-6 rounded-2xl bg-white/5 border border-white/5 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <span className="text-2xl">✨</span>
                <div>
                   <p className="text-white font-bold">Status Server</p>
                   <p className="text-xs text-slate-500">Koneksi Database Neon PostgreSQL</p>
                </div>
              </div>
              <span className="px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-500 text-xs font-bold border border-emerald-500/20">Aktif</span>
            </div>
            <div className="p-6 rounded-2xl bg-white/5 border border-white/5 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <span className="text-2xl">🛡️</span>
                <div>
                   <p className="text-white font-bold">Keamanan</p>
                   <p className="text-xs text-slate-500">JWT Authentication Protected</p>
                </div>
              </div>
              <span className="px-3 py-1 rounded-full bg-blue-500/10 text-blue-500 text-xs font-bold border border-blue-500/20">Verified</span>
            </div>
          </div>
        </div>

        <div className="bg-slate-900 border border-white/5 rounded-3xl p-8 flex flex-col items-center justify-center text-center">
            <div className="w-20 h-20 bg-amber-400/10 rounded-full flex items-center justify-center text-4xl mb-6">
                🕋
            </div>
            <h3 className="text-lg font-bold text-white mb-2">Pusat Bantuan</h3>
            <p className="text-slate-400 text-sm mb-6">Butuh bantuan mengelola dashboard? Hubungi tim support teknis.</p>
            <button className="w-full py-3 rounded-2xl bg-white/5 border border-white/10 text-white font-bold hover:bg-white/10 transition-all">
                Hubungi Support
            </button>
        </div>
      </div>
    </AdminLayout>
  );
}
