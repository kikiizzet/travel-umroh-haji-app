import React, { useState, useEffect } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import PaketModal from "@/components/PaketModal";

const MotionImage = motion(Image);

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";

// Data travel packages
const travelPackages = [
  {
    title: "Paket Umroh Reguler",
    price: "Rp 25.000.000",
    duration: "10 Hari",
    description: "Nikmati perjalanan spiritual dengan fasilitas lengkap dan nyaman bersama pembimbing berpengalaman.",
    image: "/images/kabah.jpg",
    badge: "Populer",
    color: "from-indigo-500 to-indigo-700",
    features: ["Hotel Bintang 4", "Tour Guide", "Visa Umroh"],
  },
  {
    title: "Paket Umroh Plus",
    price: "Rp 35.000.000",
    duration: "12 Hari",
    description: "Tambah destinasi ziarah dan wisata religi di sekitar Mekkah & Madinah dengan kenyamanan extra.",
    image: "/images/medina.jpeg",
    badge: "Terlaris",
    color: "from-indigo-500 to-purple-600",
    features: ["Hotel Bintang 5", "All-Inclusive", "Ziarah Extra"],
  },
  {
    title: "Paket Haji Furoda",
    price: "Starting From Rp 300.000.000",
    duration: "30 Hari",
    description: "Pengalaman haji eksklusif dengan layanan premium VIP dan prioritas di setiap langkah perjalanan.",
    image: "/images/hagiasophia.jpg",
    badge: "Premium",
    color: "from-amber-500 to-orange-600",
    features: ["Suite Hotel", "VIP Service", "Prioritas Khusus"],
  },
];

// Testimonials
const testimonials = [
  {
    name: "Ali Mahmud",
    initial: "A",
    role: "Jamaah Umroh 2024",
    location: "Jakarta Selatan",
    text: "Perjalanan spiritual yang luar biasa, pelayanan sangat ramah dan profesional! Saya merasa sangat terbimbing selama di Tanah Suci.",
    rating: 5,
    color: "from-slate-700 to-slate-800",
  },
  {
    name: "Fatimah Zahra",
    initial: "F",
    role: "Jamaah Umroh 2024",
    location: "Surabaya",
    text: "Pengalaman tak terlupakan, sangat nyaman dan terorganisir. Setiap detail perjalanan disiapkan dengan sangat sempurna dan profesional.",
    rating: 5,
    color: "from-slate-700 to-slate-800",
  },
  {
    name: "Siti Rahayu",
    initial: "S",
    role: "Jamaah Haji 2023",
    location: "Bandung",
    text: "Paket lengkap, guide profesional, benar-benar perjalanan spiritual terbaik dalam hidup saya. Sangat direkomendasikan untuk keluarga!",
    rating: 5,
    color: "from-slate-700 to-slate-800",
  },
  {
    name: "Budi Santoso",
    initial: "B",
    role: "Jamaah Umroh 2023",
    location: "Medan",
    text: "Alhamdulillah, semua berjalan lancar tanpa kendala. Tim Al Anshor Tours sangat sigap dan membantu di setiap langkah perjalanan.",
    rating: 5,
    color: "from-slate-700 to-slate-800",
  },
  {
    name: "Nur Hidayah",
    initial: "N",
    role: "Jamaah Umroh 2025",
    location: "Yogyakarta",
    text: "Pertama kali umroh dengan travel ini dan hasilnya memuaskan sekali. Akomodasi bagus, pembimbing ramah, dan ibadah makin khusyuk.",
    rating: 5,
    color: "from-slate-700 to-slate-800",
  },
  {
    name: "Hasan Basri",
    initial: "H",
    role: "Jamaah Haji 2024",
    location: "Makassar",
    text: "Layanan VIP benar-benar terasa dari awal hingga akhir. Tidak ada yang perlu dikhawatirkan, semuanya sudah diurus dengan amanah.",
    rating: 5,
    color: "from-slate-700 to-slate-800",
  },
];

// Stats
const stats = [
  { value: "5000+", label: "Jamaah Berangkat", icon: "🕋" },
  { value: "15+", label: "Tahun Pengalaman", icon: "⭐" },
  { value: "98%", label: "Kepuasan Pelanggan", icon: "💫" },
  { value: "50+", label: "Destinasi Ziarah", icon: "🌙" },
];

// FAQ
const faqs = [
  {
    question: "Bagaimana cara mendaftar paket umroh?",
    answer: "Anda bisa mendaftar langsung melalui website kami dengan mengisi formulir online, atau menghubungi tim kami via WhatsApp. Proses pendaftaran mudah dan cepat.",
  },
  {
    question: "Apakah ada fasilitas tambahan dalam paket?",
    answer: "Ya, kami menyediakan transportasi door-to-door, akomodasi hotel berbintang, tour guide profesional bersertifikat, dan asuransi perjalanan lengkap.",
  },
  {
    question: "Bagaimana sistem pembayaran yang tersedia?",
    answer: "Pembayaran bisa melalui transfer bank (BCA, Mandiri, BRI), kartu kredit, atau cash di kantor travel kami. Tersedia juga cicilan 0% untuk paket tertentu.",
  },
  {
    question: "Kapan sebaiknya mendaftar sebelum keberangkatan?",
    answer: "Kami menyarankan mendaftar minimal 3 bulan sebelum tanggal keberangkatan untuk memastikan ketersediaan kursi dan kelancaran proses visa.",
  },
];

export default function Home() {
  const [faqOpen, setFaqOpen] = useState<number | null>(null);
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Package States
  const [packages, setPackages] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedPaket, setSelectedPaket] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Testimoni & Galeri States
  const [testimonis, setTestimonis] = useState<any[]>([]);
  const [galeryItems, setGaleryItems] = useState<any[]>([]);

  // Filter States
  const [filterJenis, setFilterJenis] = useState("");
  const [filterMonth, setFilterMonth] = useState("");
  const [filterNama, setFilterNama] = useState("");

  const fetchPackages = async () => {
    setIsLoading(true);
    try {
      const queryParams = new URLSearchParams();
      if (filterJenis) queryParams.append('jenis', filterJenis);
      if (filterMonth) queryParams.append('month', filterMonth);
      if (filterNama) queryParams.append('nama', filterNama);

      const response = await fetch(`${API_URL}/paket?${queryParams.toString()}`);
      const data = await response.json();
      setPackages(data);
    } catch (error) {
      console.error("Error fetching packages:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchTestimonis = async () => {
    try {
      const response = await fetch(`${API_URL}/testimoni`);
      const data = await response.json();
      if (Array.isArray(data)) setTestimonis(data);
    } catch (error) {
      console.error("Error fetching testimonials:", error);
    }
  };

  const fetchGalery = async () => {
    try {
      const response = await fetch(`${API_URL}/galeri`);
      const data = await response.json();
      if (Array.isArray(data)) setGaleryItems(data);
    } catch (error) {
      console.error("Error fetching gallery:", error);
    }
  };

  useEffect(() => {
    fetchPackages();
    fetchTestimonis();
    fetchGalery();
  }, [filterJenis, filterMonth, filterNama]);

  // Navbar scroll effect
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);


  return (
    <main className="font-sans selection:bg-amber-400 selection:text-black overflow-x-hidden" style={{ fontFamily: "'Segoe UI', system-ui, sans-serif" }}>

      {/* ========== NAVBAR ========== */}
      <nav className={`fixed top-0 left-0 w-full z-50 transition-all duration-500 ${scrolled
        ? "bg-slate-900/95 backdrop-blur-xl shadow-2xl shadow-black/30 py-3"
        : "bg-transparent backdrop-blur-sm py-5"
        }`}>
        <div className="max-w-7xl mx-auto flex justify-between items-center px-6">
          {/* Logo */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="flex items-center gap-3"
          >
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center shadow-lg shadow-amber-500/30">
              <span className="text-lg">🕋</span>
            </div>
            <div>
              <h3 className="text-white font-bold text-lg leading-tight">Al Anshor Tours & Travel</h3>
              <p className="text-amber-400 text-xs font-medium tracking-wider">TRAVEL UMROH & HAJI</p>
            </div>
          </motion.div>

          {/* Desktop Nav Links */}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="space-x-1 hidden md:flex items-center"
          >
            {["Paket", "Testimoni", "Galeri", "FAQ", "Kontak"].map((item, i) => (
              <a
                key={i}
                href={item === "Admin" ? "/admin/login" : `#${item === "Paket" ? "packages" : item.toLowerCase()}`}
                className="text-white/80 hover:text-amber-400 px-4 py-2 rounded-lg hover:bg-white/10 transition-all duration-300 text-sm font-medium"
              >
                {item}
              </a>
            ))}
            <a
              href="#packages"
              className="ml-4 bg-gradient-to-r from-amber-400 to-orange-500 text-black px-5 py-2 rounded-full text-sm font-bold hover:shadow-lg hover:shadow-amber-500/40 transition-all duration-300 hover:scale-105"
            >
              Daftar Sekarang
            </a>
          </motion.div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden text-white p-2 rounded-lg hover:bg-white/10 transition"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            <div className={`w-6 h-0.5 bg-white transition-all duration-300 mb-1.5 ${mobileMenuOpen ? "rotate-45 translate-y-2" : ""}`}></div>
            <div className={`w-6 h-0.5 bg-white transition-all duration-300 mb-1.5 ${mobileMenuOpen ? "opacity-0" : ""}`}></div>
            <div className={`w-6 h-0.5 bg-white transition-all duration-300 ${mobileMenuOpen ? "-rotate-45 -translate-y-2" : ""}`}></div>
          </button>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden bg-slate-900/98 backdrop-blur-xl border-t border-white/10"
            >
              <div className="px-6 py-4 space-y-1">
                {["Paket", "Testimoni", "Galeri", "FAQ", "Kontak",].map((item, i) => (
                  <a
                    key={i}
                    href={item === "Admin" ? "/admin/login" : `#${item === "Paket" ? "packages" : item.toLowerCase()}`}
                    className="block text-white/80 hover:text-amber-400 px-4 py-2.5 rounded-lg hover:bg-white/10 transition-all"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {item}
                  </a>
                ))}
                <a
                  href="#packages"
                  className="block mt-3 bg-gradient-to-r from-amber-400 to-orange-500 text-black px-5 py-2.5 rounded-full text-center font-bold"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Daftar Sekarang
                </a>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      {/* ========== HERO SECTION ========== */}
      <section className="relative min-h-screen flex flex-col justify-center items-center text-center text-white overflow-hidden">
        {/* Background Image */}
        <MotionImage
          src="/images/kabah.jpg"
          alt="Kabah"
          fill
          priority
          className="absolute inset-0 object-cover brightness-40"
          initial={{ scale: 1.2 }}
          animate={{ scale: 1 }}
          transition={{ duration: 2.5 }}
        />

        {/* Multi-layer Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-black/40 to-black/90"></div>
        <div className="absolute inset-0 bg-gradient-to-r from-indigo-900/30 via-transparent to-purple-900/30"></div>

        {/* Animated glow at bottom */}
        <motion.div
          className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-amber-500/10 to-transparent"
          animate={{ opacity: [0.3, 0.7, 0.3] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        />

        {/* ====== AWAN (TIDAK DIUBAH) ====== */}
        <motion.div
          className="absolute top-20 right-[-200px] z-0"
          initial={{ x: 500, y: 0, opacity: 0.6, scale: 0.8 }}
          animate={{ x: -1600, y: 50 }}
          transition={{ duration: 60, ease: "linear", repeat: Infinity }}
        >
          <Image
            src="/images/cloud.png"
            alt="Cloud"
            width={280}
            height={100}
            className="opacity-40"
          />
        </motion.div>

        <motion.div
          className="absolute top-40 right-[-300px] z-0"
          initial={{ x: 600, y: -50, opacity: 0.5, scale: 0.6 }}
          animate={{ x: -1800, y: 0 }}
          transition={{ duration: 90, ease: "linear", repeat: Infinity }}
        >
          <Image
            src="/images/cloud.png"
            alt="Cloud"
            width={200}
            height={80}
            className="opacity-30"
          />
        </motion.div>

        {/* ====== PESAWAT (Desktop) ====== */}
        <motion.div
          className="absolute bottom-[-150px] right-[-400px] z-50 hidden md:block"
          initial={{ x: 600, y: 250, rotate: 12, opacity: 0, scale: 1 }}
          animate={{
            x: [-200, -700, -1100, -1500, -2000],
            y: [50, -200, -450, -750, -1100],
            rotate: [12, 10, 5, 0, -5],
            opacity: [0, 1, 1, 1, 0],
            scale: [1, 1.1, 1.3, 1.5, 1.7],
          }}
          transition={{
            duration: 14,
            ease: "linear",
            repeat: Infinity,
            repeatDelay: 2,
            times: [0, 0.2, 0.5, 0.8, 1],
          }}
        >
          <Image
            src="/images/garruda.png"
            alt="Pesawat Garuda"
            width={700}
            height={300}
            className="drop-shadow-2xl"
          />
        </motion.div>

        {/* ====== PESAWAT (Mobile) - Kanan ke Kiri ====== */}
        <motion.div
          className="absolute top-[30%] right-0 z-50 block md:hidden -translate-y-1/2"
          initial={{ x: 450, opacity: 0, rotate: -8, scale: 0.75 }}
          animate={{
            x: [450, 150, -100, -400, -750],
            opacity: [0, 1, 1, 1, 0],
            rotate: [-8, -6, -4, -3, -1],
            scale: [0.75, 0.9, 1, 1.05, 1.1],
          }}
          transition={{
            duration: 9,
            ease: "linear",
            repeat: Infinity,
            repeatDelay: 3,
            times: [0, 0.2, 0.45, 0.75, 1],
          }}
        >
          <Image
            src="/images/garruda.png"
            alt="Pesawat Garuda"
            width={280}
            height={120}
            className="drop-shadow-xl"
          />
        </motion.div>

        {/* Floating Particles — hidden on mobile, reduced to 6 for performance */}
        <div className="hidden md:block">
          {[...Array(6)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute rounded-full"
              style={{
                width: `${2 + (i % 3)}px`,
                height: `${2 + (i % 3)}px`,
                background: i % 3 === 0 ? "#fbbf24" : i % 3 === 1 ? "#a78bfa" : "#ffffff",
                top: `${15 + (i * 13) % 70}%`,
                left: `${8 + (i * 15) % 85}%`,
              }}
              animate={{ y: [-15, 15, -15], opacity: [0.2, 0.7, 0.2] }}
              transition={{
                duration: 4 + i,
                delay: i * 0.6,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />
          ))}
        </div>

        {/* Hero Content */}
        <motion.div
          className="relative z-10 px-4 max-w-5xl mx-auto"
          initial={{ opacity: 0, y: -60 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.3 }}
        >
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="inline-flex items-center gap-2 bg-amber-400/20 border border-amber-400/40 text-amber-300 px-4 py-1.5 rounded-full text-sm font-semibold mb-6 backdrop-blur-sm"
          >
            <span className="w-2 h-2 bg-amber-400 rounded-full animate-pulse"></span>
            Terpercaya Sejak 2002
          </motion.div>

          <h1 className="text-5xl md:text-7xl lg:text-8xl font-extrabold drop-shadow-2xl leading-tight">
            <span className="block bg-clip-text text-transparent bg-gradient-to-r from-amber-300 via-yellow-200 to-amber-400">
              Al Anshor
            </span>
            <span className="block text-white text-4xl md:text-5xl lg:text-6xl mt-2">
              Alfa Mulia
            </span>
          </h1>

          <motion.p
            className="mt-6 text-lg md:text-2xl text-gray-200/90 max-w-2xl mx-auto leading-relaxed"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.7 }}
          >
            Menyediakan perjalanan spiritual terbaik menuju{" "}
            <span className="text-amber-300 font-semibold">Tanah Suci</span> dengan
            layanan professional dan terpercaya ✨
          </motion.p>

          <motion.div
            className="mt-10 flex flex-col sm:flex-row justify-center gap-4"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.9 }}
          >
            <motion.a
              href="#packages"
              className="group relative bg-gradient-to-r from-amber-400 to-orange-500 text-black px-8 py-4 rounded-2xl font-bold text-lg shadow-2xl shadow-amber-500/30 overflow-hidden"
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.97 }}
            >
              <span className="relative z-10 flex items-center justify-center gap-2">
                🕋 Lihat Paket Perjalanan
              </span>
              <div className="absolute inset-0 bg-gradient-to-r from-yellow-300 to-amber-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </motion.a>
            <motion.a
              href="#kontak"
              className="border-2 border-white/40 text-white px-8 py-4 rounded-2xl font-bold text-lg hover:bg-white/10 hover:border-white/70 transition-all duration-300 backdrop-blur-sm"
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.97 }}
            >
              📱 Hubungi Kami
            </motion.a>
          </motion.div>

          {/* Scroll indicator */}
          <motion.div
            className="mt-16 flex flex-col items-center gap-2 text-white/50"
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <span className="text-xs tracking-widest uppercase">Scroll untuk explore</span>
            <div className="w-6 h-10 border-2 border-white/30 rounded-full flex justify-center pt-2">
              <div className="w-1.5 h-1.5 bg-white/60 rounded-full"></div>
            </div>
          </motion.div>
        </motion.div>
      </section>

      {/* ========== STATS SECTION ========== */}
      <section className="relative bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 py-16 overflow-hidden">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmZmZmYiIGZpbGwtb3BhY2l0eT0iMC4wMyI+PHBhdGggZD0iTTM2IDM0djZoNnYtNmgtNnptNiA2djZoNnYtNmgtNnptLTEyIDBoNnY2aC02di02em0xMiAwaDZ2Nmg2di02aC02eiIvPjwvZz48L2c+PC9zdmc+')] opacity-40"></div>
        <div className="max-w-6xl mx-auto px-6 relative z-10">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {stats.map((stat, idx) => (
              <motion.div
                key={idx}
                className="text-center group"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.15, duration: 0.6 }}
              >
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-amber-400/20 to-orange-500/20 border border-amber-400/20 mb-3 mx-auto group-hover:scale-110 transition-transform duration-300">
                  <span className="text-2xl">{stat.icon}</span>
                </div>
                <div className="text-3xl md:text-4xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-amber-300 to-orange-400">
                  {stat.value}
                </div>
                <p className="text-gray-400 text-sm mt-1 font-medium">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ========== PACKAGES SECTION ========== */}
      <section id="packages" className="py-24 px-4 md:px-20 bg-gradient-to-b from-slate-50 to-white relative overflow-hidden">
        {/* Decorative background */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-100 rounded-full blur-3xl opacity-50 -translate-y-1/2 translate-x-1/2"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-amber-100 rounded-full blur-3xl opacity-50 translate-y-1/2 -translate-x-1/2"></div>

        <div className="relative z-10">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
          >
            <span className="inline-block bg-indigo-100 text-indigo-700 px-4 py-1.5 rounded-full text-sm font-bold mb-4 tracking-wider uppercase">
              Pilihan Paket
            </span>
            <h2 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-4">
              Paket Perjalanan{" "}
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600">
                Spiritual
              </span>
            </h2>
            <p className="text-gray-500 text-lg max-w-2xl mx-auto">
              Temukan paket yang sesuai dengan kebutuhan dan anggaran Anda untuk perjalanan menuju Tanah Suci
            </p>

            {/* Category Tabs */}
            <div className="flex flex-wrap justify-center gap-2 mt-10">
              {["", "Umroh Reguler", "Umroh Plus", "Haji Furoda"].map((jenis) => (
                <button
                  key={jenis}
                  onClick={() => setFilterJenis(jenis)}
                  className={`px-6 py-3 rounded-2xl font-bold text-sm transition-all duration-300 ${filterJenis === jenis
                    ? "bg-indigo-600 text-white shadow-lg shadow-indigo-600/30 scale-105"
                    : "bg-white text-gray-500 border border-gray-100 hover:border-indigo-200"
                    }`}
                >
                  {jenis === "" ? "Semua Paket" : jenis}
                </button>
              ))}
            </div>

            {/* Filters */}
            <div className="flex flex-col md:flex-row gap-4 justify-center mt-10 max-w-5xl mx-auto">
              <div className="flex-[1.5]">
                <label className="block text-xs font-bold text-gray-400 mb-2 uppercase tracking-widest text-left pl-2">Cari Nama Paket</label>
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Contoh: Umroh Ramadhan..."
                    className="w-full h-14 px-12 rounded-2xl bg-white border border-gray-200 text-gray-700 font-medium focus:ring-2 focus:ring-indigo-500 transition-all outline-none"
                    value={filterNama}
                    onChange={(e) => setFilterNama(e.target.value)}
                  />
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">🔍</span>
                </div>
              </div>
              <div className="flex-1">
                <label className="block text-xs font-bold text-gray-400 mb-2 uppercase tracking-widest text-left pl-2">Jenis Paket</label>
                <select
                  className="w-full h-14 px-6 rounded-2xl bg-white border border-gray-200 text-gray-700 font-medium focus:ring-2 focus:ring-indigo-500 transition-all outline-none appearance-none"
                  value={filterJenis}
                  onChange={(e) => setFilterJenis(e.target.value)}
                >
                  <option value="">Semua Jenis Paket</option>
                  <option value="Umroh Reguler">Umroh Reguler</option>
                  <option value="Umroh Plus">Umroh Plus</option>
                  <option value="Haji Furoda">Haji Furoda</option>
                </select>
              </div>
              <div className="flex-1">
                <label className="block text-xs font-bold text-gray-400 mb-2 uppercase tracking-widest text-left pl-2">Bulan Keberangkatan</label>
                <select
                  className="w-full h-14 px-6 rounded-2xl bg-white border border-gray-200 text-gray-700 font-medium focus:ring-2 focus:ring-indigo-500 transition-all outline-none appearance-none"
                  value={filterMonth}
                  onChange={(e) => setFilterMonth(e.target.value)}
                >
                  <option value="">Semua Bulan</option>
                  {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map(m => (
                    <option key={m} value={m.toString()}>
                      {new Date(2025, m - 1).toLocaleString('id-ID', { month: 'long' })}
                    </option>
                  ))}
                </select>
              </div>
              <div className="flex items-end">
                <button
                  onClick={() => { setFilterJenis(""); setFilterMonth(""); setFilterNama(""); }}
                  className="h-14 px-8 rounded-2xl bg-slate-100 text-slate-600 font-bold text-sm hover:bg-slate-200 transition-colors"
                >
                  Reset
                </button>
              </div>
            </div>
          </motion.div>

          {/* Package Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {isLoading ? (
              // Loading Skeletons
              [1, 2, 3].map((n) => (
                <div key={n} className="h-[500px] rounded-3xl bg-gray-100 animate-pulse" />
              ))
            ) : packages.length > 0 ? (
              packages.map((pkg, idx) => (
                <motion.div
                  key={pkg.id}
                  className="relative bg-white rounded-3xl shadow-xl overflow-hidden cursor-pointer group border border-gray-100 flex flex-col h-full"
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.2 }}
                  transition={{ delay: idx * 0.1, duration: 0.7 }}
                  whileHover={{ y: -8, boxShadow: "0px 30px 60px rgba(0,0,0,0.15)" }}
                  onClick={() => { setSelectedPaket(pkg); setIsModalOpen(true); }}
                >
                  {/* Badge based on type */}
                  <div className={`absolute top-4 right-4 z-20 px-3 py-1 rounded-full text-xs font-bold shadow-lg text-white ${pkg.jenis === 'Haji Furoda' ? 'bg-gradient-to-r from-amber-500 to-orange-600' :
                    pkg.jenis === 'Umroh Plus' ? 'bg-gradient-to-r from-indigo-500 to-purple-600' :
                      'bg-gradient-to-r from-indigo-500 to-indigo-700'
                    }`}>
                    {pkg.jenis === 'Haji Furoda' ? 'Premium' : pkg.jenis === 'Umroh Plus' ? 'Terlaris' : 'Populer'}
                  </div>

                  {/* Image */}
                  <div className="overflow-hidden relative h-52">
                    <MotionImage
                      src={pkg.gambarUrl || "/images/kabah.jpg"}
                      alt={pkg.nama}
                      fill
                      className="object-cover group-hover:scale-110 transition-transform duration-700"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent"></div>
                    <div className="absolute top-4 left-4 bg-white/20 backdrop-blur-md px-2 py-1 rounded-lg text-white text-[10px] font-bold border border-white/30">
                      Sisa {pkg.kuotaTotal - pkg.kuotaTerisi} Seat
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-6 flex flex-col flex-1">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="text-xl font-bold text-gray-900 leading-tight flex-1">{pkg.nama}</h3>
                    </div>

                    <div className="flex items-center gap-2 mb-4">
                      <span className="text-2xl font-black text-indigo-600">Rp {(pkg.harga / 1000000).toFixed(1)}Jt</span>
                      <div className="flex gap-0.5 ml-auto">
                        {[...Array(5)].map((_, i) => (
                          <span key={i} className={`text-xs ${i < (pkg.jenis === 'Haji Furoda' ? 5 : 4) ? 'text-amber-400' : 'text-gray-200'}`}>★</span>
                        ))}
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-2 mb-5">
                      <div className="flex items-center gap-1.5 text-xs text-gray-500">
                        <span className="opacity-70">📅</span> {new Date(pkg.tanggalBerangkat).toLocaleDateString('id-ID', { month: 'short', year: 'numeric' })}
                      </div>
                      <div className="flex items-center gap-1.5 text-xs text-gray-500">
                        <span className="opacity-70">🕒</span> {pkg.durasi} Hari
                      </div>
                    </div>

                    <p className="text-gray-500 text-sm line-clamp-2 mb-6 flex-1">
                      {pkg.deskripsi}
                    </p>

                    <button
                      className={`w-full py-4 rounded-2xl font-bold text-sm shadow-md transition-all duration-300 ${pkg.jenis === 'Haji Furoda' ? 'bg-gradient-to-r from-amber-500 to-orange-600 text-white shadow-orange-500/20' :
                        'bg-slate-900 text-white shadow-black/20'
                        }`}
                    >
                      Lihat Detail →
                    </button>
                  </div>
                </motion.div>
              ))
            ) : (
              <div className="col-span-full py-20 text-center text-slate-500">
                <div className="text-6xl mb-4">🔍</div>
                <h3 className="text-2xl font-bold text-gray-900">Paket tidak ditemukan</h3>
                <p>Coba ubah filter atau bulan keberangkatan Anda</p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* ========== GALERI SECTION ========== */}
      <section id="galeri" className="py-24 px-4 md:px-20 bg-gradient-to-b from-slate-50 to-white relative overflow-hidden">
        {/* Decorative */}
        <div className="absolute top-0 right-0 w-72 h-72 bg-amber-100 rounded-full blur-3xl opacity-40 -translate-y-1/2 translate-x-1/3" />
        <div className="absolute bottom-0 left-0 w-72 h-72 bg-indigo-100 rounded-full blur-3xl opacity-40 translate-y-1/2 -translate-x-1/3" />

        <div className="relative z-10 max-w-7xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
          >
            <span className="inline-block bg-amber-100 text-amber-700 px-4 py-1.5 rounded-full text-sm font-bold mb-4 tracking-wider uppercase">
              Dokumentasi
            </span>
            <h2 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-4">
              Galeri <span className="bg-clip-text text-transparent bg-gradient-to-r from-amber-500 to-orange-600">Perjalanan</span>
            </h2>
            <p className="text-gray-500 text-lg max-w-xl mx-auto mb-12">
              Kenangan indah perjalanan spiritual jamaah bersama Al Anshor Alfa Mulia
            </p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {galeryItems.length > 0 ? (
              galeryItems.map((item, i) => (
                <motion.div
                  key={item.id}
                  className="group relative aspect-square bg-slate-900 rounded-[2rem] overflow-hidden border border-white/5 hover:border-amber-400/30 transition-all shadow-xl"
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1, duration: 0.5 }}
                >
                  <Image
                    src={`${API_URL}${item.gambarUrl}`}
                    alt={item.judul}
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-700 opacity-60 group-hover:opacity-100"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-6">
                    <span className="text-[10px] font-bold text-amber-400 uppercase tracking-widest mb-1">{item.kategori}</span>
                    <h4 className="font-bold text-white text-base mb-1">{item.judul}</h4>
                    <p className="text-slate-400 text-[10px] line-clamp-2">{item.deskripsi}</p>
                  </div>
                </motion.div>
              ))
            ) : (
              [
                { icon: "🕋", label: "Masjidil Haram", color: "from-amber-400/20 to-orange-400/20", border: "border-amber-200" },
                { icon: "🟢", label: "Masjid Nabawi", color: "from-emerald-400/20 to-teal-400/20", border: "border-emerald-200" },
                { icon: "🌙", label: "Jabal Nur", color: "from-indigo-400/20 to-purple-400/20", border: "border-indigo-200" },
                { icon: "⭐", label: "Miqat Bir Ali", color: "from-sky-400/20 to-blue-400/20", border: "border-sky-200" },
              ].map((item, i) => (
                <motion.div
                  key={i}
                  className={`aspect-square bg-gradient-to-br ${item.color} border-2 ${item.border} rounded-3xl flex flex-col items-center justify-center gap-3 group hover:scale-105 transition-transform duration-300 cursor-pointer`}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1, duration: 0.5 }}
                >
                  <span className="text-4xl md:text-5xl">{item.icon}</span>
                  <span className="text-gray-600 text-xs md:text-sm font-semibold text-center px-2">{item.label}</span>
                  <span className="text-xs text-gray-400 italic">Segera Hadir</span>
                </motion.div>
              ))
            )}
          </div>
          {galeryItems.length === 0 && (
            <p className="mt-8 text-gray-400 text-sm italic">📸 Segera hadir dokumentasi perjalanan terbaru kami...</p>
          )}
        </div>
      </section>

      {/* ========== TESTIMONIAL SECTION ========== */}
      <section id="testimoni" className="py-24 px-4 md:px-20 bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 text-white relative overflow-hidden">
        {/* Decorative blobs */}
        <div className="absolute top-0 left-1/4 w-80 h-80 bg-indigo-600/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-purple-600/10 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-amber-500/5 rounded-full blur-3xl"></div>

        <div className="relative z-10 max-w-7xl mx-auto">
          {/* Header */}
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <span className="inline-block bg-white/10 text-amber-300 px-4 py-1.5 rounded-full text-sm font-bold mb-4 tracking-wider uppercase border border-white/10">
              ★ Apa Kata Mereka
            </span>
            <h2 className="text-4xl md:text-5xl font-extrabold mb-4">
              Testimoni{" "}
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-amber-300 to-yellow-200">
                Pelanggan Kami
              </span>
            </h2>
            <p className="text-gray-400 max-w-xl mx-auto">
              Ribuan jamaah telah mempercayakan perjalanan spiritual mereka kepada kami
            </p>
          </motion.div>

          {/* Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {(testimonis.length > 0 ? testimonis : testimonials).map((t, idx) => (
              <motion.div
                key={idx}
                className="relative bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 rounded-3xl p-6 backdrop-blur-sm transition-all duration-300 group cursor-default h-full flex flex-col"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ delay: idx * 0.1, duration: 0.6 }}
                whileHover={{ y: -4 }}
              >
                {/* Big quote mark */}
                <div className="absolute top-4 right-5 text-5xl font-serif text-white/8 leading-none select-none">
                  &ldquo;
                </div>

                {/* Stars */}
                <div className="flex gap-0.5 mb-4">
                  {[...Array(t.rating)].map((_, i) => (
                    <span key={i} className="text-amber-400 text-base">★</span>
                  ))}
                </div>

                {/* Text */}
                <p className="text-gray-300 leading-relaxed text-sm mb-6 italic">
                  &ldquo;{t.pesan || t.text}&rdquo;
                </p>

                {/* Author */}
                <div className="flex items-center gap-3 mt-auto">
                  {/* Photo or initial avatar */}
                  <div className={`w-11 h-11 rounded-2xl ${t.gambarUrl ? '' : 'bg-gradient-to-br ' + (t.color || 'from-slate-700 to-slate-800')} flex items-center justify-center text-amber-400 font-extrabold text-lg shadow-lg flex-shrink-0 border border-white/10 relative overflow-hidden`}>
                    {t.gambarUrl ? (
                      <Image src={`${API_URL}${t.gambarUrl}`} alt={t.nama || t.name} fill className="object-cover" />
                    ) : (
                      (t.nama || t.name || "?").charAt(0)
                    )}
                  </div>
                  <div>
                    <h4 className="font-bold text-white text-sm">{t.nama || t.name}</h4>
                    <p className="text-amber-400/80 text-xs">{t.peran || t.role}</p>
                    {t.location && (
                      <p className="text-gray-500 text-xs flex items-center gap-1 mt-0.5">
                        <span>📍</span>{t.location}
                      </p>
                    )}
                  </div>
                  {/* Verified badge */}
                  <div className="ml-auto flex-shrink-0 bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 text-xs px-2 py-1 rounded-full font-medium">
                    ✓ Terverifikasi
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Bottom trust bar */}
          <motion.div
            className="mt-12 text-center"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.5 }}
          >
            <p className="text-gray-500 text-sm">
              Bergabung bersama{" "}
              <span className="text-amber-400 font-bold">5000+ jamaah</span>{" "}
              yang telah berangkat bersama kami 🕋
            </p>
          </motion.div>
        </div>
      </section>

      {/* ========== FAQ SECTION ========== */}
      <section id="faq" className="py-24 px-4 md:px-20 bg-gradient-to-b from-white to-slate-50 relative overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-indigo-50 rounded-full blur-3xl opacity-60"></div>

        <div className="relative z-10 max-w-3xl mx-auto">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <span className="inline-block bg-indigo-100 text-indigo-700 px-4 py-1.5 rounded-full text-sm font-bold mb-4 tracking-wider uppercase">
              Ada Pertanyaan?
            </span>
            <h2 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-4">
              Pertanyaan{" "}
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600">
                Umum
              </span>
            </h2>
            <p className="text-gray-500 max-w-xl mx-auto">
              Temukan jawaban dari pertanyaan yang paling sering ditanyakan calon jamaah kami
            </p>
          </motion.div>

          <div className="space-y-4">
            {faqs.map((faq, idx) => (
              <motion.div
                key={idx}
                className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow duration-300"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
              >
                <button
                  className="w-full flex justify-between items-center px-6 py-5 text-left"
                  onClick={() => setFaqOpen(faqOpen === idx ? null : idx)}
                >
                  <div className="flex items-center gap-4">
                    <div className={`w-8 h-8 rounded-xl flex items-center justify-center text-sm font-bold flex-shrink-0 transition-all duration-300 ${faqOpen === idx
                      ? "bg-gradient-to-r from-indigo-600 to-purple-600 text-white"
                      : "bg-indigo-50 text-indigo-600"
                      }`}>
                      {idx + 1}
                    </div>
                    <h3 className="font-semibold text-gray-800 text-base">{faq.question}</h3>
                  </div>
                  <motion.div
                    animate={{ rotate: faqOpen === idx ? 180 : 0 }}
                    transition={{ duration: 0.3 }}
                    className={`flex-shrink-0 ml-4 w-8 h-8 rounded-full flex items-center justify-center transition-colors duration-300 ${faqOpen === idx ? "bg-indigo-600 text-white" : "bg-gray-100 text-gray-500"
                      }`}
                  >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                    </svg>
                  </motion.div>
                </button>

                <AnimatePresence>
                  {faqOpen === idx && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.35, ease: "easeInOut" }}
                      className="overflow-hidden"
                    >
                      <div className="px-6 pb-5 pl-[4.5rem] text-gray-600 leading-relaxed border-t border-gray-50">
                        <div className="pt-4">{faq.answer}</div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ========== CTA SECTION ========== */}
      <section className="py-20 px-4 md:px-20 bg-gradient-to-br from-slate-900 via-indigo-900 to-slate-900 relative overflow-hidden">
        {/* Static decorative background — no animation for performance */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-[-80px] left-[-80px] w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl" />
          <div className="absolute bottom-[-80px] right-[-80px] w-80 h-80 bg-purple-500/10 rounded-full blur-3xl" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-amber-500/5 rounded-full blur-3xl" />
        </div>
        <div className="relative z-10 max-w-3xl mx-auto text-center text-white">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <span className="inline-block bg-amber-400/20 border border-amber-400/30 text-amber-300 px-4 py-1.5 rounded-full text-sm font-bold mb-6 tracking-wider uppercase">
              ✨ Mulai Perjalanan Anda
            </span>
            <h2 className="text-3xl md:text-5xl font-extrabold mb-4">
              Siap Memulai Perjalanan Spiritual Anda?
            </h2>
            <p className="text-white/70 text-lg mb-8 max-w-xl mx-auto">
              Bergabung bersama ribuan jamaah yang telah mempercayakan perjalanan suci mereka kepada kami
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <motion.a
                href="#packages"
                className="bg-gradient-to-r from-amber-400 to-orange-500 text-black px-8 py-4 rounded-2xl font-bold text-lg shadow-xl shadow-amber-500/20 hover:shadow-2xl hover:shadow-amber-500/30 transition-all duration-300"
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.97 }}
              >
                🕋 Lihat Paket Sekarang
              </motion.a>
              <motion.a
                href="https://wa.me/"
                className="border-2 border-white/30 text-white px-8 py-4 rounded-2xl font-bold text-lg hover:bg-white/10 hover:border-white/60 transition-all duration-300 backdrop-blur-sm"
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.97 }}
              >
                💬 Chat WhatsApp
              </motion.a>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ========== FOOTER ========== */}
      <footer id="kontak" className="bg-slate-950 text-white relative overflow-hidden">
        {/* Top gradient border */}
        <motion.div
          className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-indigo-500 via-amber-400 to-purple-500"
          animate={{ backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"] }}
          transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
          style={{ backgroundSize: "200% 200%" }}
        />

        {/* Main Footer Content */}
        <div className="max-w-7xl mx-auto px-6 pt-16 pb-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-12">
            {/* Brand Column */}
            <div className="md:col-span-2">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center shadow-lg shadow-amber-500/30">
                  <span className="text-2xl">🕋</span>
                </div>
                <div>
                  <h3 className="text-white font-bold text-xl leading-tight">Al Anshor Alfa Mulia</h3>
                  <p className="text-amber-400 text-xs font-medium tracking-wider">TRAVEL UMROH & HAJI</p>
                </div>
              </div>
              <p className="text-gray-400 leading-relaxed max-w-sm mb-6">
                Kami berkomitmen memberikan pengalaman perjalanan spiritual yang tak terlupakan menuju Tanah Suci dengan pelayanan terbaik dan amanah.
              </p>
              {/* Social Links */}
              <div className="flex gap-3">
                {[
                  { icon: "📘", label: "Facebook", href: "#" },
                  { icon: "📸", label: "Instagram", href: "#" },
                  { icon: "💬", label: "WhatsApp", href: "#" },
                ].map((social, i) => (
                  <a
                    key={i}
                    href={social.href}
                    className="flex items-center gap-2 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-amber-400/40 text-white/70 hover:text-amber-400 px-4 py-2 rounded-xl transition-all duration-300 text-sm"
                  >
                    <span>{social.icon}</span>
                    {social.label}
                  </a>
                ))}
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h4 className="font-bold text-white mb-4 text-base">Menu Cepat</h4>
              <ul className="space-y-2.5">
                {[
                  { name: "Paket Umroh", href: "#packages" },
                  { name: "Paket Haji", href: "#packages" },
                  { name: "Testimoni", href: "#testimoni" },
                  { name: "FAQ", href: "#faq" },
                  { name: "Hubungi Kami", href: "#kontak" },
                ].map((link, i) => (
                  <li key={i}>
                    <a href={link.href} className="text-gray-400 hover:text-amber-400 transition-colors text-sm flex items-center gap-2 group">
                      <span className="w-1.5 h-1.5 bg-amber-400 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></span>
                      {link.name}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Contact Info */}
            <div>
              <h4 className="font-bold text-white mb-4 text-base">Kontak Kami</h4>
              <ul className="space-y-3">
                {[
                  { icon: "📍", text: "No.24 A, Jl. Mojo, Baciro, Kec. Gondokusuman, Kota Yogyakarta, Daerah Istimewa Yogyakarta 55225" },
                  { icon: "📞", text: "(0274) 633180" },
                  { icon: "✉️", text: "info@alanshormulia.com" },
                  { icon: "🕐", text: "Senin - Sabtu: 08.00 - 17.00 WIB" },
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-3 text-gray-400 text-sm">
                    <span className="mt-0.5">{item.icon}</span>
                    {item.text}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="border-t border-white/10 pt-6 flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="text-gray-500 text-sm">
              <p>© 2025 Al Anshor Tours & Travel. All rights reserved.</p>
              <p className="text-amber-400 font-semibold mt-1">Developed By Izzetnity</p>
            </div>
            <div className="flex flex-col items-center md:items-end gap-2">
              <p className="text-gray-600 text-xs">
                Travel Umroh & Haji Terpercaya Sejak 2002
              </p>
              <Link href="/admin/login" className="text-gray-700 hover:text-amber-500 text-[10px] transition-colors border border-white/5 px-2 py-1 rounded-md">
                Portal Admin
              </Link>
            </div>
          </div>
        </div>
        {/* WhatsApp Floating Button */}
        <motion.a
          href="https://wa.me/6281234567890" // Ganti dengan nomor asli
          target="_blank"
          rel="noopener noreferrer"
          className="fixed bottom-8 right-8 z-[100] w-16 h-16 bg-[#25D366] rounded-full flex items-center justify-center shadow-2xl shadow-[#25D366]/40 group"
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          <span className="text-3xl text-white">💬</span>
          {/* Tooltip */}
          <div className="absolute right-20 bg-white text-slate-900 px-4 py-2 rounded-xl text-sm font-bold shadow-xl whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none border border-slate-100">
            Butuh Bantuan? Chat Kami!
          </div>
        </motion.a>

        {/* Modal Detail Paket */}
        <PaketModal
          paket={selectedPaket}
          isOpen={isModalOpen}
          onClose={() => { setIsModalOpen(false); setSelectedPaket(null); }}
        />
      </footer>
    </main>
  );
}
