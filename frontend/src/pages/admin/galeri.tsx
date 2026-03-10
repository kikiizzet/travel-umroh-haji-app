import React, { useEffect, useState } from 'react';
import AdminLayout from '@/components/AdminLayout';
import Head from 'next/head';
import Image from 'next/image';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import Folder from '@/components/folder';

const MySwal = withReactContent(Swal);

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

const KATEGORI_LIST = ['Semua', 'Umroh', 'Haji', 'Wisata Hikmah', 'Kegiatan'];

const KATEGORI_COLORS: Record<string, string> = {
    'Umroh': '#f59e0b',
    'Haji': '#10b981',
    'Wisata Hikmah': '#6366f1',
    'Kegiatan': '#ec4899',
};

export default function AdminGaleri() {
    const [galeries, setGaleries] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [activeKategori, setActiveKategori] = useState<string>('Semua');
    const [formData, setFormData] = useState({
        judul: '',
        deskripsi: '',
        kategori: 'Umroh',
        gambarUrl: ''
    });
    const [uploading, setUploading] = useState(false);

    const fetchGaleries = async () => {
        setIsLoading(true);
        try {
            const response = await fetch(`${API_URL}/galeri`);
            const data = await response.json();
            if (Array.isArray(data)) {
                setGaleries(data);
            } else {
                console.error("Data received is not an array:", data);
                setGaleries([]);
            }
        } catch (error) {
            console.error("Error fetching galeri:", error);
            setGaleries([]);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchGaleries();
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
                text: 'Gagal mengunggah foto ke server',
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
        if (!formData.gambarUrl) {
            MySwal.fire({
                icon: 'warning',
                title: 'Foto Belum Terpilih',
                text: 'Mohon unggah gambar terlebih dahulu',
                background: '#0f172a',
                color: '#fff',
                confirmButtonColor: '#fbbf24'
            });
            return;
        }

        setIsSubmitting(true);
        try {
            const token = localStorage.getItem('admin_token');
            const res = await fetch(`${API_URL}/galeri`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(formData)
            });

            if (res.ok) {
                setIsModalOpen(false);
                setFormData({ judul: '', deskripsi: '', kategori: 'Umroh', gambarUrl: '' });
                fetchGaleries();

                MySwal.fire({
                    icon: 'success',
                    title: 'Berhasil!',
                    text: 'Foto telah berhasil disimpan ke galeri',
                    background: '#0f172a',
                    color: '#fff',
                    confirmButtonColor: '#fbbf24',
                    timer: 2000
                });
            } else {
                MySwal.fire({
                    icon: 'error',
                    title: 'Opss...',
                    text: 'Gagal menyimpan foto galeri',
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
            title: 'Hapus Foto?',
            text: "Foto ini akan dihapus permanen dari galeri!",
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
            const res = await fetch(`${API_URL}/galeri/${id}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (res.ok) {
                setGaleries(galeries.filter(g => g.id !== id));
                MySwal.fire({
                    icon: 'success',
                    title: 'Terhapus!',
                    text: 'Foto telah dihapus dari galeri',
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
                text: 'Terjadi kesalahan sistem',
                background: '#0f172a',
                color: '#fff'
            });
        }
    };

    // Filter galeries berdasarkan kategori aktif
    const filteredGaleries = activeKategori === 'Semua'
        ? galeries
        : galeries.filter(g => g.kategori === activeKategori);

    // Hitung jumlah foto per kategori
    const getCount = (kat: string) => {
        if (kat === 'Semua') return galeries.length;
        return galeries.filter(g => g.kategori === kat).length;
    };

    // Buat preview items untuk folder (ambil max 3 foto dari kategori tsb)
    const getFolderItems = (kat: string) => {
        const photos = kat === 'Semua' ? galeries : galeries.filter(g => g.kategori === kat);
        return photos.slice(0, 3).map((g, i) => (
            <div key={i} style={{
                width: '100%',
                height: '100%',
                position: 'relative',
                borderRadius: '4px',
                overflow: 'hidden'
            }}>
                <img
                    src={`${API_URL}${g.gambarUrl}`}
                    alt={g.judul}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
            </div>
        ));
    };

    return (
        <AdminLayout title="Kelola Galeri Perjalanan">
            <Head>
                <title>Kelola Galeri | Admin Al Anshor</title>
            </Head>

            {/* Header */}
            <div className="flex justify-between items-center mb-10">
                <div>
                    <p className="text-slate-400 text-sm">
                        {activeKategori === 'Semua'
                            ? `Total ${galeries.length} foto galeri`
                            : `${filteredGaleries.length} foto di kategori "${activeKategori}"`
                        }
                    </p>
                </div>
                <button
                    onClick={() => setIsModalOpen(true)}
                    className="bg-amber-400 text-black px-6 py-3 rounded-2xl font-bold flex items-center gap-2 hover:shadow-lg hover:shadow-amber-400/20 transition-all active:scale-95"
                >
                    <span>📸</span> Tambah Photo
                </button>
            </div>

            {/* === FOLDER CATEGORY ORGANIZER === */}
            <div className="mb-10">
                <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-6">
                    Filter Kategori
                </h3>
                <div className="flex flex-wrap gap-8 items-end">
                    {KATEGORI_LIST.map((kat) => {
                        const isActive = activeKategori === kat;
                        const color = kat === 'Semua' ? '#64748b' : (KATEGORI_COLORS[kat] || '#5227FF');
                        const count = getCount(kat);

                        return (
                            <div
                                key={kat}
                                onClick={() => setActiveKategori(kat)}
                                className="flex flex-col items-center gap-3 cursor-pointer group"
                                style={{ transition: 'all 0.2s ease' }}
                            >
                                {/* Wrapper dengan ring active */}
                                <div style={{
                                    padding: '12px',
                                    borderRadius: '20px',
                                    background: isActive
                                        ? `${color}18`
                                        : 'transparent',
                                    border: isActive
                                        ? `2px solid ${color}50`
                                        : '2px solid transparent',
                                    transition: 'all 0.3s ease',
                                    position: 'relative'
                                }}>
                                    {/* Badge count */}
                                    <div style={{
                                        position: 'absolute',
                                        top: '6px',
                                        right: '6px',
                                        background: color,
                                        color: '#fff',
                                        borderRadius: '999px',
                                        fontSize: '9px',
                                        fontWeight: 700,
                                        minWidth: '18px',
                                        height: '18px',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        zIndex: 20,
                                        padding: '0 4px',
                                        boxShadow: '0 2px 8px rgba(0,0,0,0.4)'
                                    }}>
                                        {count}
                                    </div>

                                    {/* Folder Component */}
                                    <div style={{
                                        opacity: count === 0 ? 0.35 : 1,
                                        transition: 'opacity 0.2s',
                                        pointerEvents: count === 0 ? 'none' : 'auto'
                                    }}>
                                        <Folder
                                            color={color}
                                            size={0.75}
                                            items={getFolderItems(kat)}
                                        />
                                    </div>
                                </div>

                                {/* Label kategori */}
                                <div className="text-center">
                                    <span style={{
                                        fontSize: '11px',
                                        fontWeight: isActive ? 700 : 500,
                                        color: isActive ? color : '#94a3b8',
                                        letterSpacing: '0.05em',
                                        transition: 'all 0.2s ease'
                                    }}>
                                        {kat}
                                    </span>
                                </div>
                            </div>
                        );
                    })}
                </div>

                {/* Divider animasi */}
                <div className="mt-8 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
            </div>

            {/* === GRID FOTO === */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {isLoading ? (
                    [1, 2, 3, 4].map(n => (
                        <div key={n} className="aspect-square bg-slate-900 animate-pulse rounded-[2rem] border border-white/5" />
                    ))
                ) : filteredGaleries.length === 0 ? (
                    <div className="col-span-full flex flex-col items-center justify-center py-20 text-slate-500">
                        <span className="text-5xl mb-4">📂</span>
                        <p className="text-sm font-medium">Belum ada foto di kategori ini</p>
                        <button
                            onClick={() => {
                                setFormData(prev => ({ ...prev, kategori: activeKategori === 'Semua' ? 'Umroh' : activeKategori }));
                                setIsModalOpen(true);
                            }}
                            className="mt-4 px-5 py-2 rounded-xl bg-amber-400/10 text-amber-400 text-xs font-bold hover:bg-amber-400/20 transition-all"
                        >
                            + Tambah Foto Pertama
                        </button>
                    </div>
                ) : filteredGaleries.map((g) => (
                    <div key={g.id} className="group relative aspect-square bg-slate-900 rounded-[2rem] overflow-hidden border border-white/5 hover:border-amber-400/30 transition-all shadow-xl">
                        <Image src={`${API_URL}${g.gambarUrl}`} alt={g.judul} fill className="object-cover group-hover:scale-110 transition-transform duration-700" />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-6">
                            <span className="text-[10px] font-bold text-amber-400 uppercase tracking-widest mb-1">{g.kategori}</span>
                            <h4 className="font-bold text-white text-base mb-1">{g.judul}</h4>
                            <p className="text-slate-400 text-[10px] line-clamp-2 mb-4">{g.deskripsi}</p>
                            <button
                                onClick={() => handleDelete(g.id)}
                                className="w-full py-2.5 rounded-xl bg-rose-500/20 text-rose-500 hover:bg-rose-500 hover:text-white transition-all font-bold text-xs"
                            >
                                Hapus Foto
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            {/* Modal Upload */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-[100] flex items-center justify-center p-4">
                    <div className="bg-slate-900 border border-white/10 w-full max-w-xl rounded-[2.5rem] overflow-hidden shadow-2xl">
                        <div className="p-8 md:p-10">
                            <div className="flex justify-between items-center mb-8">
                                <h2 className="text-2xl font-bold text-white">Upload ke Galeri</h2>
                                <button onClick={() => setIsModalOpen(false)} className="text-slate-500 hover:text-white">✕</button>
                            </div>

                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div className="mb-4">
                                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-3 block">Unggah Foto Perjalanan</label>
                                    <div className={`relative w-full aspect-video rounded-[2rem] border-2 border-dashed ${formData.gambarUrl ? 'border-amber-400/50' : 'border-white/10'} bg-white/5 overflow-hidden group`}>
                                        {formData.gambarUrl ? (
                                            <>
                                                <Image src={`${API_URL}${formData.gambarUrl}`} alt="Preview" fill className="object-cover" />
                                                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                                    <label className="cursor-pointer bg-white text-black px-4 py-2 rounded-xl text-xs font-bold">Ubah Foto</label>
                                                </div>
                                            </>
                                        ) : (
                                            <div className="absolute inset-0 flex flex-col items-center justify-center text-slate-500">
                                                <span className="text-4xl mb-2">🖼️</span>
                                                <span className="text-xs font-bold uppercase tracking-wider">Pilih Gambar</span>
                                            </div>
                                        )}
                                        <input
                                            type="file"
                                            accept="image/*"
                                            onChange={handleImageUpload}
                                            className="absolute inset-0 opacity-0 cursor-pointer"
                                        />
                                        {uploading && <div className="absolute inset-0 bg-black/50 flex items-center justify-center"><div className="w-8 h-8 border-4 border-amber-400 border-t-transparent animate-spin rounded-full" /></div>}
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2 block">Judul Foto</label>
                                        <input
                                            required
                                            type="text"
                                            placeholder="Mis: Tawaf di Masjidil Haram"
                                            className="w-full h-12 px-5 rounded-2xl bg-white/5 border border-white/10 text-white focus:border-amber-400 outline-none"
                                            value={formData.judul}
                                            onChange={(e) => setFormData({ ...formData, judul: e.target.value })}
                                        />
                                    </div>
                                    <div>
                                        <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2 block">Kategori</label>
                                        <select
                                            className="w-full h-12 px-5 rounded-2xl bg-white/5 border border-white/10 text-white focus:border-amber-400 outline-none appearance-none"
                                            value={formData.kategori}
                                            onChange={(e) => setFormData({ ...formData, kategori: e.target.value })}
                                        >
                                            {['Umroh', 'Haji', 'Wisata Hikmah', 'Kegiatan'].map(c => <option key={c} value={c} className="bg-slate-900">{c}</option>)}
                                        </select>
                                    </div>
                                </div>

                                <div>
                                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2 block">Deskripsi Singkat</label>
                                    <textarea
                                        rows={3}
                                        placeholder="Ceritakan sedikit tentang foto ini..."
                                        className="w-full p-5 rounded-2xl bg-white/5 border border-white/10 text-white focus:border-amber-400 outline-none resize-none"
                                        value={formData.deskripsi}
                                        onChange={(e) => setFormData({ ...formData, deskripsi: e.target.value })}
                                    />
                                </div>

                                <button
                                    disabled={isSubmitting || uploading}
                                    className="w-full py-4 rounded-2xl bg-amber-400 text-black font-bold hover:shadow-lg hover:shadow-amber-400/20 transition-all disabled:opacity-50"
                                >
                                    {isSubmitting ? 'Mengunggah...' : 'Simpan ke Galeri'}
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            )}
        </AdminLayout>
    );
}
