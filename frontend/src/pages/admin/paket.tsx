import React, { useEffect, useState } from 'react';
import AdminLayout from '@/components/AdminLayout';
import Head from 'next/head';
import Link from 'next/link';
import Image from 'next/image';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';

const MySwal = withReactContent(Swal);

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

export default function AdminPaket() {
  const [pakets, setPakets] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchPakets = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`${API_URL}/paket`);
      const data = await response.json();
      setPakets(data);
    } catch (error) {
      console.error("Error fetching pakets:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPakets();
  }, []);

  const handleDelete = async (id: number) => {
    const result = await MySwal.fire({
      title: 'Hapus Paket?',
      text: "Seluruh data paket ini akan dihapus permanen!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#ef4444',
      cancelButtonColor: '#334155',
      confirmButtonText: 'Ya, Hapus!',
      cancelButtonText: 'Batal',
      background: '#0f172a',
      color: '#fff'
    });

    if (!result.isConfirmed) return;

    try {
      const token = localStorage.getItem('admin_token');
      const res = await fetch(`${API_URL}/paket/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (res.ok) {
        setPakets(pakets.filter(p => p.id !== id));
        MySwal.fire({
          icon: 'success',
          title: 'Terhapus!',
          text: 'Paket perjalanan berhasil dihapus',
          background: '#0f172a',
          color: '#fff',
          timer: 1500,
          showConfirmButton: false
        });
      } else {
        MySwal.fire({
          icon: 'error',
          title: 'Gagal',
          text: 'Gagal menghapus paket perjalanan',
          background: '#0f172a',
          color: '#fff',
          confirmButtonColor: '#fbbf24'
        });
      }
    } catch (error) {
      console.error("Error deleting paket:", error);
      MySwal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Terjadi kesalahan pada server',
        background: '#0f172a',
        color: '#fff'
      });
    }
  };

  return (
    <AdminLayout title="Kelola Paket Perjalanan">
      <Head>
        <title>Kelola Paket | Admin Al Anshor</title>
      </Head>

      <div className="flex justify-between items-center mb-10">
        <div>
          <p className="text-slate-400 text-sm">Total {pakets.length} paket tersedia</p>
        </div>
        <Link
          href="/admin/paket/new"
          className="bg-amber-400 text-black px-6 py-3 rounded-2xl font-bold flex items-center gap-2 hover:shadow-lg hover:shadow-amber-400/20 transition-all active:scale-95"
        >
          <span>➕</span> Tambah Paket Baru
        </Link>
      </div>

      <div className="bg-slate-900 border border-white/5 rounded-[2.5rem] overflow-hidden shadow-2xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-white/5 border-b border-white/5">
                <th className="px-8 py-6 text-xs font-bold text-slate-400 uppercase tracking-widest">Detail Paket</th>
                <th className="px-8 py-6 text-xs font-bold text-slate-400 uppercase tracking-widest text-center">Jenis</th>
                <th className="px-8 py-6 text-xs font-bold text-slate-400 uppercase tracking-widest text-center">Status Quota</th>
                <th className="px-8 py-6 text-xs font-bold text-slate-400 uppercase tracking-widest text-center">Harga</th>
                <th className="px-8 py-6 text-xs font-bold text-slate-400 uppercase tracking-widest text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {isLoading ? (
                [1, 2, 3].map(n => (
                  <tr key={n} className="animate-pulse">
                    <td colSpan={5} className="px-8 py-8 h-20 bg-white/2" />
                  </tr>
                ))
              ) : pakets.length > 0 ? (
                pakets.map((pkg) => (
                  <tr key={pkg.id} className="hover:bg-white/5 transition-colors group">
                    <td className="px-8 py-6 text-white font-medium">
                      <div className="flex items-center gap-4">
                        <div className="w-16 h-12 rounded-xl bg-slate-800 relative overflow-hidden flex-shrink-0">
                          <Image src={pkg.gambarUrl || '/images/kabah.jpg'} alt={pkg.nama} fill className="object-cover" />
                        </div>
                        <div>
                          <p className="font-bold text-base">{pkg.nama}</p>
                          <p className="text-xs text-slate-500 italic">📅 {new Date(pkg.tanggalBerangkat).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-6 text-center">
                      <span className={`px-3 py-1 rounded-full text-[10px] font-bold border ${pkg.jenis === 'Haji Furoda' ? 'bg-amber-500/10 text-amber-500 border-amber-500/20' :
                          pkg.jenis === 'Umroh Plus' ? 'bg-purple-500/10 text-purple-500 border-purple-500/20' :
                            'bg-blue-500/10 text-blue-500 border-blue-500/20'
                        }`}>
                        {pkg.jenis}
                      </span>
                    </td>
                    <td className="px-8 py-6">
                      <div className="flex flex-col items-center gap-1">
                        <div className="flex justify-between w-24 text-[10px] font-bold uppercase text-slate-500">
                          <span>Seat</span>
                          <span>{pkg.kuotaTerisi}/{pkg.kuotaTotal}</span>
                        </div>
                        <div className="w-24 h-1.5 bg-white/5 rounded-full overflow-hidden border border-white/5">
                          <div
                            className={`h-full rounded-full ${pkg.kuotaTotal - pkg.kuotaTerisi <= 5 ? 'bg-rose-500' : 'bg-emerald-500'}`}
                            style={{ width: `${(pkg.kuotaTerisi / pkg.kuotaTotal) * 100}%` }}
                          />
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-6 text-center text-white font-bold">
                      Rp {pkg.harga.toLocaleString('id-ID')}
                    </td>
                    <td className="px-8 py-6 text-right">
                      <div className="flex justify-end gap-2">
                        <Link
                          href={`/admin/paket/${pkg.id}`}
                          className="w-10 h-10 rounded-xl bg-blue-500/10 text-blue-500 flex items-center justify-center hover:bg-blue-500 hover:text-white transition-all"
                          title="Edit"
                        >
                          ✏️
                        </Link>
                        <button
                          onClick={() => handleDelete(pkg.id)}
                          className="w-10 h-10 rounded-xl bg-rose-500/10 text-rose-400 flex items-center justify-center hover:bg-rose-500 hover:text-white transition-all"
                          title="Hapus"
                        >
                          🗑️
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="px-8 py-20 text-center text-slate-500 italic">
                    Belum ada paket perjalanan yang tersedia.
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
