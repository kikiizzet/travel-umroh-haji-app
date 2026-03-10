import React, { useEffect, useState } from 'react';
import AdminLayout from '@/components/AdminLayout';
import Head from 'next/head';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';

const MySwal = withReactContent(Swal);

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

export default function AdminPembayaran() {
  const [payments, setPayments] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchPayments = async () => {
    setIsLoading(true);
    try {
      const token = localStorage.getItem('admin_token');
      const response = await fetch(`${API_URL}/pembayaran`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await response.json();
      setPayments(data);
    } catch (error) {
      console.error("Error fetching payments:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPayments();
  }, []);

  const handleUpdateStatus = async (id: number, status: string) => {
    const msg = status === 'LUNAS'
      ? 'Tandai pembayaran ini sebagai LUNAS? (Kuota paket akan berkurang otomatis)'
      : `Ubah status pembayaran menjadi ${status}?`;

    const result = await MySwal.fire({
      title: 'Ubah Status?',
      text: msg,
      icon: status === 'LUNAS' ? 'question' : 'warning',
      showCancelButton: true,
      confirmButtonColor: status === 'LUNAS' ? '#10b981' : '#f59e0b',
      cancelButtonColor: '#334155',
      confirmButtonText: 'Ya, Lanjutkan!',
      cancelButtonText: 'Batal',
      background: '#0f172a',
      color: '#fff'
    });

    if (!result.isConfirmed) return;

    try {
      const token = localStorage.getItem('admin_token');
      const res = await fetch(`${API_URL}/pembayaran/${id}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ status })
      });

      if (res.ok) {
        MySwal.fire({
          icon: 'success',
          title: 'Berhasil!',
          text: 'Status pembayaran berhasil diperbarui',
          background: '#0f172a',
          color: '#fff',
          timer: 1500,
          showConfirmButton: false
        });
        fetchPayments();
      } else {
        const err = await res.json();
        MySwal.fire({
          icon: 'error',
          title: 'Opss...',
          text: err.message || 'Gagal memperbarui status',
          background: '#0f172a',
          color: '#fff',
          confirmButtonColor: '#fbbf24'
        });
      }
    } catch (error) {
      console.error("Error updating status:", error);
      MySwal.fire({
        icon: 'error',
        title: 'Error',
        background: '#0f172a',
        color: '#fff'
      });
    }
  };

  return (
    <AdminLayout title="Kelola Data Pembayaran">
      <Head>
        <title>Pembayaran | Admin Al Anshor</title>
      </Head>

      <div className="bg-slate-900 border border-white/5 rounded-[2.5rem] overflow-hidden shadow-2xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-white/5 border-b border-white/5">
                <th className="px-8 py-6 text-xs font-bold text-slate-400 uppercase tracking-widest">ID / Tgl Booking</th>
                <th className="px-8 py-6 text-xs font-bold text-slate-400 uppercase tracking-widest">Jamaah</th>
                <th className="px-8 py-6 text-xs font-bold text-slate-400 uppercase tracking-widest">Paket</th>
                <th className="px-8 py-6 text-xs font-bold text-slate-400 uppercase tracking-widest text-center">Jumlah</th>
                <th className="px-8 py-6 text-xs font-bold text-slate-400 uppercase tracking-widest text-center">Status</th>
                <th className="px-8 py-6 text-xs font-bold text-slate-400 uppercase tracking-widest text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {isLoading ? (
                [1, 2, 3].map(n => (
                  <tr key={n} className="animate-pulse">
                    <td colSpan={6} className="px-8 py-8 h-20 bg-white/2" />
                  </tr>
                ))
              ) : payments.length > 0 ? (
                payments.map((p) => (
                  <tr key={p.id} className="hover:bg-white/5 transition-colors group">
                    <td className="px-8 py-6">
                      <p className="text-white font-bold opacity-60">#TRX-{p.id}</p>
                      <p className="text-[10px] text-slate-500">{new Date(p.createdAt).toLocaleDateString('id-ID', { dateStyle: 'medium' })}</p>
                    </td>
                    <td className="px-8 py-6">
                      <p className="text-white font-bold">{p.jamaah?.nama || 'N/A'}</p>
                      <p className="text-xs text-slate-500">{p.jamaah?.nik || '-'}</p>
                    </td>
                    <td className="px-8 py-6">
                      <p className="text-white text-sm">{p.paket?.nama || 'Paket Terhapus'}</p>
                      <p className="text-[10px] text-amber-400 font-bold uppercase">{p.paket?.jenis}</p>
                    </td>
                    <td className="px-8 py-6 text-center text-white font-bold">
                      Rp {p.jumlah.toLocaleString('id-ID')}
                    </td>
                    <td className="px-8 py-6 text-center">
                      <span className={`px-3 py-1 rounded-full text-[10px] font-bold border ${p.status === 'LUNAS' ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20' :
                          p.status === 'PENDING' ? 'bg-amber-500/10 text-amber-500 border-amber-500/20' :
                            'bg-rose-500/10 text-rose-500 border-rose-500/20'
                        }`}>
                        {p.status}
                      </span>
                    </td>
                    <td className="px-8 py-6 text-right">
                      <div className="flex justify-end gap-2">
                        {p.status === 'PENDING' && (
                          <>
                            <button
                              onClick={() => handleUpdateStatus(p.id, 'LUNAS')}
                              className="px-4 py-2 rounded-xl bg-emerald-500 text-black text-xs font-bold hover:shadow-lg hover:shadow-emerald-500/20 transition-all active:scale-95"
                            >
                              Konfirmasi Lunas
                            </button>
                            <button
                              onClick={() => handleUpdateStatus(p.id, 'BATAL')}
                              className="px-4 py-2 rounded-xl bg-white/5 text-rose-400 text-xs font-bold hover:bg-rose-500/10 transition-all"
                            >
                              Batalkan
                            </button>
                          </>
                        )}
                        {p.status === 'LUNAS' && (
                          <button
                            onClick={() => handleUpdateStatus(p.id, 'BATAL')}
                            className="px-4 py-2 rounded-xl bg-white/5 text-slate-500 text-xs font-bold hover:bg-rose-500/10 hover:text-rose-500 transition-all"
                          >
                            Revert / Batal
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="px-8 py-20 text-center text-slate-500 italic">
                    Belum ada data pembayaran masuk.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </AdminLayout>
  );
}
