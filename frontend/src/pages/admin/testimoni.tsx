import React, { useEffect, useState } from 'react';
import AdminLayout from '@/components/AdminLayout';
import Head from 'next/head';
import Image from 'next/image';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';

const MySwal = withReactContent(Swal);

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

export default function AdminTestimoni() {
    const [testimonis, setTestimonis] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [formData, setFormData] = useState({
        nama: '',
        peran: '',
        pesan: '',
        rating: 5,
        gambarUrl: ''
    });
    const [uploading, setUploading] = useState(false);

    const fetchTestimonis = async () => {
        setIsLoading(true);
        try {
            const response = await fetch(`${API_URL}/testimoni`);
            const data = await response.json();
            if (Array.isArray(data)) {
                setTestimonis(data);
            } else {
                console.error("Data received is not an array:", data);
                setTestimonis([]);
            }
        } catch (error) {
            console.error("Error fetching testimonis:", error);
            setTestimonis([]);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchTestimonis();
    }, []);

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setUploading(true);
        const formDataUpload = new FormData();
        formDataUpload.append('file', file);

        try {
            const token = localStorage.getItem('admin_token');
            const res = await fetch(`${API_URL}/upload`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`
                },
                body: formDataUpload
            });
            const data = await res.json();
            setFormData({ ...formData, gambarUrl: data.url });
        } catch (error) {
            MySwal.fire({
                icon: 'error',
                title: 'Upload Gagal',
                text: 'Gagal mengunggah gambar jamaah',
                background: '#0f172a',
                color: '#fff',
                confirmButtonColor: '#fbbf24'
            });
        } finally {
            setUploading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        try {
            const token = localStorage.getItem('admin_token');
            const res = await fetch(`${API_URL}/testimoni`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(formData)
            });

            if (res.ok) {
                setIsModalOpen(false);
                setFormData({ nama: '', peran: '', pesan: '', rating: 5, gambarUrl: '' });
                fetchTestimonis();

                MySwal.fire({
                    icon: 'success',
                    title: 'Berhasil!',
                    text: 'Testimoni jamaah telah ditambahkan',
                    background: '#0f172a',
                    color: '#fff',
                    confirmButtonColor: '#fbbf24',
                    timer: 2000
                });
            } else {
                MySwal.fire({
                    icon: 'error',
                    title: 'Opss...',
                    text: 'Gagal menambahkan testimoni. Coba lagi nanti.',
                    background: '#0f172a',
                    color: '#fff',
                    confirmButtonColor: '#fbbf24'
                });
            }
        } catch (error) {
            console.error(error);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDelete = async (id: number) => {
        const result = await MySwal.fire({
            title: 'Hapus Testimoni?',
            text: "Data yang dihapus tidak dapat dikembalikan!",
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
            const res = await fetch(`${API_URL}/testimoni/${id}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (res.ok) {
                setTestimonis(testimonis.filter(t => t.id !== id));
                MySwal.fire({
                    icon: 'success',
                    title: 'Terhapus!',
                    text: 'Testimoni berhasil dihapus',
                    background: '#0f172a',
                    color: '#fff',
                    timer: 1500,
                    showConfirmButton: false
                });
            }
        } catch (error) {
            console.error(error);
            MySwal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Terjadi kesalahan saat menghapus data',
                background: '#0f172a',
                color: '#fff'
            });
        }
    };

    return (
        <AdminLayout title="Kelola Testimoni">
            <Head>
                <title>Kelola Testimoni | Admin Al Anshor</title>
            </Head>

            <div className="flex justify-between items-center mb-10">
                <div>
                    <p className="text-slate-400 text-sm">Total {testimonis.length} testimoni</p>
                </div>
                <button
                    onClick={() => setIsModalOpen(true)}
                    className="bg-amber-400 text-black px-6 py-3 rounded-2xl font-bold flex items-center gap-2 hover:shadow-lg hover:shadow-amber-400/20 transition-all active:scale-95"
                >
                    <span>➕</span> Tambah Testimoni
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {isLoading ? (
                    [1, 2, 3].map(n => (
                        <div key={n} className="h-64 bg-slate-900 animate-pulse rounded-[2rem] border border-white/5" />
                    ))
                ) : testimonis.map((t) => (
                    <div key={t.id} className="bg-slate-900 border border-white/5 p-8 rounded-[2rem] relative group hover:border-amber-400/30 transition-all">
                        <button
                            onClick={() => handleDelete(t.id)}
                            className="absolute top-6 right-6 w-8 h-8 rounded-lg bg-rose-500/10 text-rose-500 opacity-0 group-hover:opacity-100 transition-all flex items-center justify-center hover:bg-rose-500 hover:text-white"
                        >
                            🗑️
                        </button>

                        <div className="flex items-center gap-4 mb-6">
                            <div className="w-14 h-14 rounded-full bg-slate-800 relative overflow-hidden border-2 border-amber-400/20">
                                {t.gambarUrl ? (
                                    <Image src={`${API_URL}${t.gambarUrl}`} alt={t.nama} fill className="object-cover" />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center text-xl font-bold text-amber-400">
                                        {t.nama.charAt(0)}
                                    </div>
                                )}
                            </div>
                            <div>
                                <h4 className="font-bold text-white text-lg">{t.nama}</h4>
                                <p className="text-xs text-amber-400 font-bold uppercase tracking-widest">{t.peran}</p>
                            </div>
                        </div>

                        <div className="flex gap-1 mb-4 text-amber-400">
                            {[...Array(t.rating)].map((_, i) => <span key={i}>⭐</span>)}
                        </div>

                        <p className="text-slate-400 text-sm italic leading-relaxed">"{t.pesan}"</p>
                    </div>
                ))}
            </div>

            {isModalOpen && (
                <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-[100] flex items-center justify-center p-4">
                    <div className="bg-slate-900 border border-white/10 w-full max-w-xl rounded-[2.5rem] overflow-hidden shadow-2xl">
                        <div className="p-8 md:p-10">
                            <div className="flex justify-between items-center mb-8">
                                <h2 className="text-2xl font-bold text-white">Tambah Testimoni</h2>
                                <button onClick={() => setIsModalOpen(false)} className="text-slate-500 hover:text-white">✕</button>
                            </div>

                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div className="flex gap-6 items-center mb-4">
                                    <div className="w-20 h-20 rounded-full bg-white/5 border border-white/10 relative overflow-hidden flex-shrink-0 flex items-center justify-center">
                                        {formData.gambarUrl ? (
                                            <Image src={`${API_URL}${formData.gambarUrl}`} alt="Preview" fill className="object-cover" />
                                        ) : (
                                            <span className="text-3xl">👤</span>
                                        )}
                                        {uploading && <div className="absolute inset-0 bg-black/50 flex items-center justify-center"><div className="w-5 h-5 border-2 border-amber-400 border-t-transparent animate-spin rounded-full" /></div>}
                                    </div>
                                    <div className="flex-1">
                                        <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2 block">Foto Jamaah</label>
                                        <input
                                            type="file"
                                            accept="image/*"
                                            onChange={handleImageUpload}
                                            className="text-xs text-slate-400 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-bold file:bg-amber-400 file:text-black hover:file:bg-amber-500 transition-all"
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2 block">Nama Lengkap</label>
                                        <input
                                            required
                                            type="text"
                                            className="w-full h-12 px-5 rounded-2xl bg-white/5 border border-white/10 text-white focus:border-amber-400 outline-none"
                                            value={formData.nama}
                                            onChange={(e) => setFormData({ ...formData, nama: e.target.value })}
                                        />
                                    </div>
                                    <div>
                                        <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2 block">Peran / Titel</label>
                                        <input
                                            required
                                            placeholder="Contoh: Jamaah Umroh 2024"
                                            type="text"
                                            className="w-full h-12 px-5 rounded-2xl bg-white/5 border border-white/10 text-white focus:border-amber-400 outline-none"
                                            value={formData.peran}
                                            onChange={(e) => setFormData({ ...formData, peran: e.target.value })}
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2 block">Rating</label>
                                    <select
                                        className="w-full h-12 px-5 rounded-2xl bg-white/5 border border-white/10 text-white focus:border-amber-400 outline-none appearance-none"
                                        value={formData.rating}
                                        onChange={(e) => setFormData({ ...formData, rating: +e.target.value })}
                                    >
                                        {[5, 4, 3, 2, 1].map(n => <option key={n} value={n} className="bg-slate-900">{n} Bintang</option>)}
                                    </select>
                                </div>

                                <div>
                                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2 block">Pesan Testimoni</label>
                                    <textarea
                                        required
                                        rows={4}
                                        className="w-full p-5 rounded-2xl bg-white/5 border border-white/10 text-white focus:border-amber-400 outline-none resize-none"
                                        value={formData.pesan}
                                        onChange={(e) => setFormData({ ...formData, pesan: e.target.value })}
                                    />
                                </div>

                                <button
                                    disabled={isSubmitting || uploading}
                                    className="w-full py-4 rounded-2xl bg-amber-400 text-black font-bold hover:shadow-lg hover:shadow-amber-400/20 transition-all disabled:opacity-50"
                                >
                                    {isSubmitting ? 'Menyimpan...' : 'Simpan Testimoni'}
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            )}
        </AdminLayout>
    );
}
