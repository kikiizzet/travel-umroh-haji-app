import React, { useEffect, useState, useRef } from 'react';
import AdminLayout from '@/components/AdminLayout';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { motion, AnimatePresence } from 'framer-motion';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';

const MySwal = withReactContent(Swal);

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

export default function EditPaket() {
  const router = useRouter();
  const { id } = router.query;
  const isNew = id === 'new';
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [isLoading, setIsLoading] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [formData, setFormData] = useState({
    nama: '',
    jenis: 'Umroh Reguler',
    harga: 0,
    deskripsi: '',
    tanggalBerangkat: '',
    durasi: '',
    maskapai: '',
    rute: '',
    kuotaTotal: '',
    gambarUrl: '',
    fasilitas: ''
  });

  const [displayHarga, setDisplayHarga] = useState('');

  useEffect(() => {
    if (id && !isNew) {
      const fetchPaket = async () => {
        try {
          const res = await fetch(`${API_URL}/paket/${id}`);
          const data = await res.json();
          setFormData({
            ...data,
            tanggalBerangkat: data.tanggalBerangkat.split('T')[0],
            fasilitas: data.fasilitas.join(', ')
          });
          const hargaString = data.harga.toString();
          setDisplayHarga(formatRupiah(hargaString));
        } catch (error) {
          console.error("Error fetching paket:", error);
        }
      };
      fetchPaket();
    }
  }, [id, isNew]);

  const formatRupiah = (value: string) => {
    const numberString = value.replace(/[^,\d]/g, '').toString();
    const split = numberString.split(',');
    const sisa = split[0].length % 3;
    let rupiah = split[0].substr(0, sisa);
    const ribuan = split[0].substr(sisa).match(/\d{3}/gi);

    if (ribuan) {
      const separator = sisa ? '.' : '';
      rupiah += separator + ribuan.join('.');
    }

    rupiah = split[1] !== undefined ? rupiah + ',' + split[1] : rupiah;
    return rupiah;
  };

  const handleHargaChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let rawValue = e.target.value.replace(/\./g, '');
    // Hapus angka 0 di depan
    rawValue = rawValue.replace(/^0+/, '');
    if (rawValue === '') rawValue = '0';

    if (isNaN(Number(rawValue))) return;

    setFormData({ ...formData, harga: Number(rawValue) });
    setDisplayHarga(formatRupiah(rawValue));
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
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

      if (res.ok) {
        const data = await res.json();
        // Pastikan URL lengkap jika backend kirim relative path
        const fullUrl = data.url.startsWith('http') ? data.url : `${API_URL}${data.url}`;
        setFormData({ ...formData, gambarUrl: fullUrl });
      } else {
        MySwal.fire({
          icon: 'error',
          title: 'Gagal',
          text: 'Gagal mengunggah gambar ke server',
          background: '#0f172a',
          color: '#fff',
          confirmButtonColor: '#fbbf24'
        });
      }
    } catch (error) {
      console.error(error);
      MySwal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Terjadi kesalahan saat mengunggah',
        background: '#0f172a',
        color: '#fff'
      });
    } finally {
      setIsUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    const payload = {
      ...formData,
      harga: Number(formData.harga),
      durasi: Number(formData.durasi) || 0,
      kuotaTotal: Number(formData.kuotaTotal) || 0,
      fasilitas: formData.fasilitas.split(',').map(f => f.trim()).filter(f => f),
      tanggalBerangkat: new Date(formData.tanggalBerangkat).toISOString()
    };

    try {
      const token = localStorage.getItem('admin_token');
      const url = isNew ? `${API_URL}/paket` : `${API_URL}/paket/${id}`;
      const method = isNew ? 'POST' : 'PATCH';

      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      });

      if (res.ok) {
        MySwal.fire({
          icon: 'success',
          title: 'Berhasil!',
          text: isNew ? 'Paket perjalanan baru telah dibuat' : 'Data paket telah diperbarui',
          background: '#0f172a',
          color: '#fff',
          confirmButtonColor: '#fbbf24',
          timer: 2000
        });
        router.push('/admin/paket');
      } else {
        const err = await res.json();
        MySwal.fire({
          icon: 'error',
          title: 'Gagal Simpan',
          text: err.message || 'Gagal menyimpan data paket',
          background: '#0f172a',
          color: '#fff',
          confirmButtonColor: '#fbbf24'
        });
      }
    } catch (error) {
      console.error("Error saving paket:", error);
      MySwal.fire({
        icon: 'error',
        title: 'Network Error',
        text: 'Terjadi kesalahan jaringan atau server',
        background: '#0f172a',
        color: '#fff'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const inputClass = "w-full h-14 bg-white/5 border border-white/10 rounded-2xl px-5 text-white outline-none focus:ring-2 focus:ring-amber-400/50 transition-all text-sm placeholder:text-slate-600";
  const labelClass = "block text-[10px] font-bold text-slate-500 mb-2 uppercase tracking-[0.2em] pl-1";

  return (
    <AdminLayout title={isNew ? 'Tambah Paket Baru' : 'Edit Paket Perjalanan'}>
      <Head>
        <title>{isNew ? 'Tambah' : 'Edit'} Paket | Admin Al Anshor</title>
      </Head>

      <div className="max-w-5xl mx-auto pb-20">
        <form onSubmit={handleSubmit} className="bg-slate-900 border border-white/5 p-8 md:p-12 rounded-[3rem] shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-amber-400/5 blur-[100px] -translate-y-1/2 translate-x-1/2" />

          <div className="relative z-10 grid grid-cols-1 md:grid-cols-12 gap-x-8 gap-y-10">
            {/* Image Preview & Upload */}
            <div className="md:col-span-4 space-y-4">
              <label className={labelClass}>Foto Paket</label>
              <div
                onClick={() => fileInputRef.current?.click()}
                className="group relative aspect-[4/5] rounded-[2rem] bg-slate-800 border-2 border-dashed border-white/10 overflow-hidden cursor-pointer hover:border-amber-400/50 transition-all flex flex-col items-center justify-center text-center p-6"
              >
                {formData.gambarUrl ? (
                  <>
                    <img src={formData.gambarUrl} alt="Preview" className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <span className="bg-white/20 backdrop-blur-md px-4 py-2 rounded-full text-white text-xs font-bold border border-white/30">Ganti Foto</span>
                    </div>
                  </>
                ) : (
                  <div className="space-y-4">
                    <div className="w-16 h-16 rounded-2xl bg-white/5 flex items-center justify-center text-3xl mx-auto">📸</div>
                    <div>
                      <p className="text-white font-bold text-sm">Upload Gambar</p>
                      <p className="text-slate-500 text-[10px] mt-1">Klik untuk pilih file</p>
                    </div>
                  </div>
                )}

                {isUploading && (
                  <div className="absolute inset-0 bg-slate-900/80 backdrop-blur-sm flex items-center justify-center z-20">
                    <div className="w-8 h-8 border-4 border-amber-400 border-t-transparent rounded-full animate-spin" />
                  </div>
                )}
              </div>
              <input
                type="file"
                ref={fileInputRef}
                className="hidden"
                accept="image/*"
                onChange={handleFileUpload}
              />
              <p className="text-[10px] text-slate-500 italic text-center">Rekomendasi ukuran: 800x1000px</p>
            </div>

            {/* Form Fields */}
            <div className="md:col-span-8 grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-8">
              <div className="md:col-span-2">
                <label className={labelClass}>Nama Paket Perjalanan</label>
                <input
                  type="text" required className={inputClass}
                  value={formData.nama} onChange={e => setFormData({ ...formData, nama: e.target.value })}
                  placeholder="Contoh: Paket Umroh Syawal Premium"
                />
              </div>

              <div>
                <label className={labelClass}>Jenis Paket</label>
                <select
                  className={inputClass}
                  value={formData.jenis} onChange={e => setFormData({ ...formData, jenis: e.target.value })}
                >
                  <option value="Umroh Reguler">Umroh Reguler</option>
                  <option value="Umroh Plus">Umroh Plus</option>
                  <option value="Haji Furoda">Haji Furoda</option>
                </select>
              </div>

              <div>
                <label className={labelClass}>Harga Paket (Rp)</label>
                <div className="relative">
                  <span className="absolute left-5 top-1/2 -translate-y-1/2 text-amber-400 font-bold">Rp</span>
                  <input
                    type="text" required className={`${inputClass} pl-12 font-bold text-amber-400`}
                    value={displayHarga}
                    onChange={handleHargaChange}
                  />
                </div>
              </div>

              <div>
                <label className={labelClass}>Tanggal Keberangkatan</label>
                <input
                  type="date" required className={inputClass}
                  value={formData.tanggalBerangkat} onChange={e => setFormData({ ...formData, tanggalBerangkat: e.target.value })}
                />
              </div>

              <div>
                <label className={labelClass}>Durasi (Hari)</label>
                <div className="relative">
                  <input
                    type="text" required className={inputClass}
                    value={formData.durasi}
                    onChange={e => {
                      const val = e.target.value.replace(/\D/g, '').replace(/^0+/, '');
                      setFormData({ ...formData, durasi: val });
                    }}
                    placeholder="Contoh: 9"
                  />
                  <span className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-500 text-xs font-bold">HARI</span>
                </div>
              </div>

              <div>
                <label className={labelClass}>Maskapai Penerbangan</label>
                <input
                  type="text" required className={inputClass}
                  value={formData.maskapai} onChange={e => setFormData({ ...formData, maskapai: e.target.value })}
                  placeholder="Contoh: Garuda Indonesia"
                />
              </div>

              <div>
                <label className={labelClass}>Rute Perjalanan</label>
                <input
                  type="text" required className={inputClass}
                  value={formData.rute} onChange={e => setFormData({ ...formData, rute: e.target.value })}
                  placeholder="Contoh: JOG-MED-JED-JOG"
                />
              </div>

              <div>
                <label className={labelClass}>Total Kuota (Seat)</label>
                <input
                  type="text" required className={inputClass}
                  value={formData.kuotaTotal}
                  onChange={e => {
                    const val = e.target.value.replace(/\D/g, '').replace(/^0+/, '');
                    setFormData({ ...formData, kuotaTotal: val });
                  }}
                  placeholder="Contoh: 40"
                />
              </div>

              <div className="md:col-span-2">
                <label className={labelClass}>Fasilitas (Pisahkan dengan koma)</label>
                <input
                  type="text" className={inputClass}
                  value={formData.fasilitas} onChange={e => setFormData({ ...formData, fasilitas: e.target.value })}
                  placeholder="Hotel Bintang 5, Handling, Zam-zam"
                />
              </div>

              <div className="md:col-span-2">
                <label className={labelClass}>Deskripsi Detail</label>
                <textarea
                  rows={4} className={`${inputClass} h-auto py-4`}
                  value={formData.deskripsi} onChange={e => setFormData({ ...formData, deskripsi: e.target.value })}
                  placeholder="Jelaskan detail fasilitas dan agenda perjalanan..."
                />
              </div>
            </div>
          </div>

          <div className="mt-12 pt-10 border-t border-white/5 flex gap-4 justify-end items-center">
            <button
              type="button" onClick={() => router.back()}
              className="px-10 py-4 rounded-2xl text-slate-500 font-bold hover:text-white transition-all text-sm"
            >
              Batal
            </button>
            <button
              type="submit" disabled={isLoading || isUploading}
              className="px-12 py-4 rounded-2xl bg-gradient-to-r from-amber-400 to-orange-500 text-black font-bold hover:shadow-2xl hover:shadow-amber-500/30 transition-all active:scale-95 text-sm disabled:opacity-50"
            >
              {isLoading ? 'Menyimpan...' : (isNew ? 'Buat Paket Sekarang' : 'Update Paket')}
            </button>
          </div>
        </form>
      </div>
    </AdminLayout>
  );
}
