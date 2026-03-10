import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";

interface Paket {
  id: number;
  nama: string;
  jenis: string;
  harga: number;
  deskripsi: string;
  tanggalBerangkat: string;
  durasi: number;
  maskapai: string;
  rute: string;
  kuotaTotal: number;
  kuotaTerisi: number;
  gambarUrl?: string;
  fasilitas: string[];
}

interface PaketModalProps {
  paket: Paket | null;
  isOpen: boolean;
  onClose: () => void;
}

const PaketModal: React.FC<PaketModalProps> = ({ paket, isOpen, onClose }) => {
  const [step, setStep] = useState<'detail' | 'form' | 'success'>('detail');
  const [loading, setLoading] = useState(false);
  const [bookingData, setBookingData] = useState<any>(null);
  const [formData, setFormData] = useState({
    nama: '',
    email: '',
    noHp: ''
  });

  if (!paket) return null;

  const sisaSeat = paket.kuotaTotal - paket.kuotaTerisi;
  const progressPercent = (paket.kuotaTerisi / paket.kuotaTotal) * 100;

  const handleBooking = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/jamaah/booking`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          paketId: paket.id
        })
      });
      
      if (response.ok) {
        const data = await response.json();
        setBookingData(data);
        setStep('success');
      } else {
        const err = await response.json();
        alert(err.message || 'Gagal mengirim pesanan');
      }
    } catch (error) {
      console.error(error);
      alert('Terjadi kesalahan koneksi');
    } finally {
      setLoading(false);
    }
  };

  const handleWhatsApp = () => {
    if (!bookingData) return;
    const phone = "6281234567890"; // Ganti dengan nomor asli Admin
    const text = `Assalamu'alaikum Admin,\n\nSaya ingin konfirmasi pembayaran untuk:\n*Nama:* ${formData.nama}\n*Paket:* ${paket.nama}\n*ID Booking:* #TRX-${bookingData.id}\n*Total:* Rp ${paket.harga.toLocaleString('id-ID')}\n\nMohon instruksi selanjutnya untuk pembayarannya. Terima kasih.`;
    window.open(`https://wa.me/${phone}?text=${encodeURIComponent(text)}`, '_blank');
  };

  const resetModal = () => {
    setStep('detail');
    setFormData({ nama: '', email: '', noHp: '' });
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={resetModal}
            className="fixed inset-0 bg-black/80 backdrop-blur-md z-[100]"
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[95%] max-w-4xl max-h-[90vh] overflow-y-auto bg-slate-900 border border-white/10 rounded-3xl z-[101] shadow-2xl"
          >
            <div className="flex flex-col md:flex-row min-h-[500px]">
              {/* Image Section */}
              <div className="w-full md:w-2/5 h-64 md:h-auto relative bg-slate-800">
                <Image
                  src={paket.gambarUrl || '/images/kabah.jpg'}
                  alt={paket.nama}
                  fill
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900 to-transparent" />
                
                <button 
                  onClick={resetModal}
                  className="absolute top-4 right-4 md:hidden w-10 h-10 rounded-full bg-black/50 backdrop-blur-md text-white flex items-center justify-center"
                >
                  ✕
                </button>

                <div className="absolute bottom-8 left-8 right-8 text-white hidden md:block">
                  <h3 className="text-2xl font-bold mb-2">{paket.nama}</h3>
                  <div className="flex items-center gap-2 text-amber-400 font-bold">
                    <span>Rp {paket.harga.toLocaleString('id-ID')}</span>
                  </div>
                </div>
              </div>

              {/* Detail / Form Section */}
              <div className="w-full md:w-3/5 p-8 md:p-10 flex flex-col">
                <div className="hidden md:flex justify-end mb-4">
                  <button 
                    onClick={resetModal}
                    className="w-10 h-10 rounded-full bg-white/5 text-white flex items-center justify-center hover:bg-white/10 transition-colors border border-white/10"
                  >
                    ✕
                  </button>
                </div>

                {step === 'detail' && (
                  <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
                    <div className="inline-flex px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-semibold mb-4 w-fit">
                      {paket.jenis}
                    </div>
                    <h2 className="text-3xl font-bold text-white mb-2">{paket.nama}</h2>
                    <p className="text-slate-400 text-sm mb-6 leading-relaxed">{paket.deskripsi}</p>

                    <div className="grid grid-cols-2 gap-4 mb-8">
                      <div className="p-4 rounded-2xl bg-white/5 border border-white/5">
                        <span className="text-slate-500 text-xs block mb-1 uppercase tracking-wider">Durasi</span>
                        <span className="text-white font-semibold">{paket.durasi} Hari</span>
                      </div>
                      <div className="p-4 rounded-2xl bg-white/5 border border-white/5">
                        <span className="text-slate-500 text-xs block mb-1 uppercase tracking-wider">Maskapai</span>
                        <span className="text-white font-semibold">{paket.maskapai}</span>
                      </div>
                    </div>

                    <div className="mb-8">
                      <span className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-4 block">Fasilitas Utama</span>
                      <div className="flex flex-wrap gap-2">
                        {paket.fasilitas.map((f, i) => (
                          <span key={i} className="px-3 py-1.5 rounded-lg bg-white/5 text-slate-300 text-xs flex items-center gap-2">
                            <span className="text-amber-400">✓</span> {f}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="mb-10">
                      <span className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-4 block">Rencana Perjalanan (Itinerary)</span>
                      <div className="space-y-4 border-l-2 border-white/5 ml-2 pl-6 relative">
                        {[
                          { day: 1, title: 'Keberangkatan', desc: 'Berkumpul di Bandara Soekarno Hatta dan terbang menuju Jeddah.' },
                          { day: 2, title: 'Ibadah Umroh', desc: 'Check-in hotel Makkah dan melaksanakan rangkaian Ibadah Umroh.' },
                          { day: 3, title: 'Ziarah Makkah', desc: 'Mengunjungi Jabal Nur, Jabal Tsur, dan Arafah.' },
                          { day: '...', title: 'Kegiatan Harian', desc: 'Ibadah mandiri dan ziarah rutin di Makkah & Madinah.' },
                        ].map((step, i) => (
                          <div key={i} className="relative">
                            <div className="absolute -left-[31px] top-1 w-4 h-4 rounded-full bg-slate-900 border-2 border-amber-400" />
                            <h4 className="text-sm font-bold text-white mb-1">Hari {step.day}: {step.title}</h4>
                            <p className="text-xs text-slate-400 leading-relaxed">{step.desc}</p>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="mt-auto pt-6 border-t border-white/10 flex items-center justify-between">
                      <div>
                        <span className="text-slate-500 text-xs block mb-1 font-bold uppercase tracking-widest">Sisa Kuota</span>
                        <span className="text-xl font-bold text-amber-400">{sisaSeat} Seat</span>
                      </div>
                      <button 
                        onClick={() => setStep('form')}
                        className="px-8 py-3.5 rounded-2xl bg-gradient-to-r from-amber-500 to-orange-600 text-white font-bold hover:shadow-lg transition-all"
                      >
                        Pesan Sekarang
                      </button>
                    </div>
                  </motion.div>
                )}

                {step === 'form' && (
                  <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
                    <button onClick={() => setStep('detail')} className="text-indigo-400 text-sm font-bold mb-6 flex items-center gap-2">
                      ← Kembali ke Detail
                    </button>
                    <h2 className="text-2xl font-bold text-white mb-2">Lengkapi Data Pesanan</h2>
                    <p className="text-slate-400 text-sm mb-8">Mohon isi data diri Anda dengan benar untuk proses pendaftaran.</p>
                    
                    <form onSubmit={handleBooking} className="space-y-4">
                      <div>
                        <label className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-2 block">Nama Lengkap</label>
                        <input 
                          required
                          type="text" 
                          className="w-full h-12 px-4 rounded-xl bg-white/5 border border-white/10 text-white outline-none focus:border-indigo-500"
                          value={formData.nama}
                          onChange={(e) => setFormData({...formData, nama: e.target.value})}
                        />
                      </div>
                      <div>
                        <label className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-2 block">Email Aktif</label>
                        <input 
                          required
                          type="email" 
                          className="w-full h-12 px-4 rounded-xl bg-white/5 border border-white/10 text-white outline-none focus:border-indigo-500"
                          value={formData.email}
                          onChange={(e) => setFormData({...formData, email: e.target.value})}
                        />
                      </div>
                      <div>
                        <label className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-2 block">Nomor WhatsApp</label>
                        <input 
                          required
                          type="tel" 
                          className="w-full h-12 px-4 rounded-xl bg-white/5 border border-white/10 text-white outline-none focus:border-indigo-500"
                          value={formData.noHp}
                          onChange={(e) => setFormData({...formData, noHp: e.target.value})}
                          placeholder="Mis: 081234..."
                        />
                      </div>
                      
                      <button 
                        disabled={loading}
                        className={`w-full py-4 mt-8 rounded-2xl bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-bold flex items-center justify-center gap-2 ${loading ? 'opacity-50' : 'hover:shadow-lg hover:shadow-indigo-500/20'}`}
                      >
                        {loading ? 'Sabar ya...' : 'Konfirmasi Pesanan →'}
                      </button>
                    </form>
                  </motion.div>
                )}

                {step === 'success' && (
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.9 }} 
                    animate={{ opacity: 1, scale: 1 }}
                    className="flex flex-col items-center justify-center text-center py-10"
                  >
                    <div className="w-20 h-20 bg-emerald-500/20 text-emerald-500 rounded-full flex items-center justify-center text-4xl mb-6">✓</div>
                    <h2 className="text-3xl font-bold text-white mb-2">Pesanan Tersimpan!</h2>
                    <p className="text-slate-400 text-sm mb-10 max-w-sm">
                      Pendaftaran Anda untuk *{paket.nama}* telah berhasil. Silakan klik tombol di bawah untuk konfirmasi pembayaran melalui WhatsApp.
                    </p>
                    
                    <button 
                      onClick={handleWhatsApp}
                      className="w-full py-4 rounded-2xl bg-[#25D366] text-white font-bold flex items-center justify-center gap-3 hover:shadow-lg transition-all"
                    >
                      <span className="text-xl">💬</span> Hubungi Admin via WhatsApp
                    </button>
                    
                    <button 
                      onClick={resetModal}
                      className="mt-6 text-slate-500 font-bold hover:text-white transition-colors"
                    >
                      Selesai
                    </button>
                  </motion.div>
                )}
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default PaketModal;
