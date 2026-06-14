/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Menu, Search, User, ChevronRight, Hourglass, Target, Lightbulb, Info, ArrowLeft, Triangle, Square, Circle, X, Home, BookOpen, LogIn, LogOut } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { auth, googleProvider, signInWithPopup, signOut } from './firebase';
import { onAuthStateChanged } from 'firebase/auth';

type BodyShape = 'hourglass' | 'pear' | 'apple' | 'rectangle' | 'inverted_triangle';

interface ShapeInfo {
  name: string;
  enName: string;
  icon: React.ReactNode;
  description: string;
  strengths: string;
  focus: string;
  characteristics: string[];
  stylistNote: string;
  recommendations: {
    tag: string;
    name: string;
    desc: string;
    img: string;
  }[];
}

const SHAPE_DATA: Record<BodyShape, ShapeInfo> = {
  hourglass: {
    name: "Jam Pasir",
    enName: "Hourglass Shape",
    icon: <Hourglass size={64} className="text-brand-primary mb-4" strokeWidth={1.5} />,
    description: "Proporsi seimbang antara bahu dan pinggul dengan garis pinggang yang terdefinisi dengan jelas.",
    strengths: "Siluet proporsional dan garis pinggang yang menarik.",
    focus: "Tonjolkan lekuk tubuh alami tanpa berlebihan.",
    characteristics: [
      "Bahu dan pinggul memiliki lebar yang hampir sama.",
      "Garis pinggang terlihat sangat jelas (terdefinisi).",
      "Lekukan tubuh yang mengalir lembut."
    ],
    stylistNote: "Untuk bentuk tubuh Jam Pasir, kuncinya adalah **keseimbangan**. Hindari pakaian yang terlalu longgar (boxy) karena akan menyembunyikan garis pinggang Anda yang indah. Pilihlah bahan yang memiliki *drape* yang baik seperti sutra atau katun berkualitas tinggi.",
    recommendations: [
      {
        tag: "Atasan",
        name: "V-Neck Blouse",
        desc: "Kerah V memanjangkan garis leher dan mengimbangi lebar bahu dengan elegan.",
        img: "/assets/images/regenerated_image_1778855504791.png"
      },
      {
        tag: "Bawahan",
        name: "Celana Kulot",
        desc: "Potongan high-waist mengikuti lekuk pinggul dan memberikan kesan kaki lebih jenjang.",
        img: "/assets/images/regenerated_image_1778855509479.png"
      },
      {
        tag: "Luaran",
        name: "Tailored Blazer",
        desc: "Gunakan blazer yang terstruktur di pinggang untuk mempertahankan siluet jam pasir Anda.",
        img: "/assets/images/regenerated_image_1778855513111.png"
      }
    ]
  },
  pear: {
    name: "Pir",
    enName: "Pear Shape",
    icon: <Triangle size={64} className="text-brand-primary mb-4" strokeWidth={1.5} />,
    description: "Pinggul lebih lebar daripada bahu, menciptakan fokus visual pada bagian bawah tubuh.",
    strengths: "Pinggul yang feminin dan bahu yang cenderung mungil.",
    focus: "Seimbangkan proporsi dengan menambahkan volume pada bagian atas.",
    characteristics: [
      "Pinggul merupakan bagian terlebar dari tubuh.",
      "Pinggang terdefinisi dengan baik.",
      "Bahu lebih sempit dibanding pinggul."
    ],
    stylistNote: "Untuk bentuk Pir, gunakan atasan dengan detail (ruffles, pola, atau warna cerah) untuk menarik perhatian ke atas. Hindari celana yang terlalu ketat dengan detail berlebih di pinggul. Celana model *wide-leg* atau *straight* sangat cocok untuk Anda.",
    recommendations: [
      {
        tag: "Atasan",
        name: "Ruffle Shoulder Top",
        desc: "Detail pada bahu memberikan volume untuk menyeimbangkan pinggul yang lebar.",
        img: "/assets/images/regenerated_image_1778918657196.png"
      },
      {
        tag: "Bawahan",
        name: "A-Line Skirt",
        desc: "Rok potongan A menyamarkan bagian pinggul dan memberikan siluet yang mengalir.",
        img: "/assets/images/regenerated_image_1778918481712.png"
      },
      {
        tag: "Luaran",
        name: "Structured Jacket",
        desc: "Jaket yang berhenti tepat di atas pinggul membantu menciptakan struktur pada tubuh bagian atas.",
        img: "/assets/images/regenerated_image_1778995082058.png"
      }
    ]
  },
  apple: {
    name: "Apel",
    enName: "Apple Shape",
    icon: <Circle size={64} className="text-brand-primary mb-4" strokeWidth={1.5} />,
    description: "Bagian tengah tubuh (pinggang) cenderung lebih lebar dengan kaki yang biasanya ramping.",
    strengths: "Kaki yang indah dan proporsi dada yang biasanya berisi.",
    focus: "Alihkan perhatian dari bagian tengah ke arah wajah dan kaki.",
    characteristics: [
      "Bahu dan pinggul mungkin lebih sempit dari pinggang.",
      "Garis pinggang tidak terlalu terdefinisi.",
      "Cenderung membesarkan bagian tengah saat berat badan naik."
    ],
    stylistNote: "Fokus pada pakaian dengan potongan *empire waist* atau *tunic style*. Gunakan garis leher rendah seperti kerah V untuk memperpanjang tubuh. Pamerkan kaki Anda dengan rok atau celana yang pas untuk menarik mata ke bagian tubuh terbaik Anda.",
    recommendations: [
      {
        tag: "Atasan",
        name: "Empire Waist Tunic",
        desc: "Potongan di bawah dada memberikan ruang pada bagian perut dengan nyaman.",
        img: "/assets/images/regenerated_image_1778995086412.png"
      },
      {
        tag: "Bawahan",
        name: "Straight Leg Trousers",
        desc: "Menonjolkan kaki yang ramping tanpa membuat bagian tengah terlihat berat.",
        img: "/assets/images/regenerated_image_1778995089984.png"
      },
      {
        tag: "Luaran",
        name: "Long Cardigan",
        desc: "Siluet panjang vertikal menciptakan kesan tubuh yang lebih langsing dan jenjang.",
        img: "https://images.unsplash.com/photo-1434389677669-e08b4cac3105?auto=format&fit=crop&q=80&w=800"
      }
    ]
  },
  rectangle: {
    name: "Persegi Panjang",
    enName: "Rectangle Shape",
    icon: <Square size={64} className="text-brand-primary mb-4" strokeWidth={1.5} />,
    description: "Bahu, pinggang, dan pinggul memiliki lebar yang hampir sama, menciptakan siluet lurus.",
    strengths: "Proporsi yang seimbang dan tampilan yang atletis.",
    focus: "Ciptakan ilusi lekukan tubuh dan garis pinggang.",
    characteristics: [
      "Lebar bahu dan pinggul hampir identik.",
      "Pinggang tidak terlalu masuk (lurus).",
      "Tampilan siluet tampak 'kotak' atau atletis."
    ],
    stylistNote: "Gunakan sabuk untuk menciptakan garis pinggang secara artifisial. Potongan pakaian dengan volume di bagian atas dan bawah secara bersamaan akan membuat pinggang Anda tampak lebih kecil. Cobalah atasan *peplum* atau rok yang bervolume.",
    recommendations: [
      {
        tag: "Atasan",
        name: "Peplum Top",
        desc: "Memberikan volume pada pinggul sehingga menciptakan ilusi pinggang kecil.",
        img: "/assets/images/regenerated_image_1778995093632.png"
      },
      {
        tag: "Bawahan",
        name: "Paperbag Pants",
        desc: "Detail kerut di pinggang dengan sabuk sangat efektif menciptakan lekukan.",
        img: "/assets/images/regenerated_image_1778918500627.png"
      },
      {
        tag: "Luaran",
        name: "Belted Trench Coat",
        desc: "Gunakan ikat pinggang untuk menegaskan struktur tubuh dan siluet yang lebih feminin.",
        img: "/assets/images/regenerated_image_1778918503801.png"
      }
    ]
  },
  inverted_triangle: {
    name: "Segitiga Terbalik",
    enName: "Inverted Triangle",
    icon: <Triangle size={64} className="text-brand-primary mb-4 rotate-180" strokeWidth={1.5} />,
    description: "Bahu lebih lebar daripada pinggul, memberikan kesan atletis dan kuat pada tubuh bagian atas.",
    strengths: "Bahu yang tegas dan biasanya memiliki kaki yang ramping.",
    focus: "Tambahkan volume pada bagian bawah untuk menyeimbangkan bahu.",
    characteristics: [
      "Bahu atau dada secara signifikan lebih lebar dari pinggul.",
      "Pinggul cenderung sempit dan lurus.",
      "Proporsi tubuh mengecil ke arah bawah."
    ],
    stylistNote: "Hindari detail berlebih pada bahu (seperti padding atau epaulet). Gunakan bawahan yang melebar seperti rok *pleated* atau celana *flared* untuk menciptakan keseimbangan dengan bahu Anda. Kerah V atau leher rendah juga membantu menyempitkan bahu secara visual.",
    recommendations: [
      {
        tag: "Atasan",
        name: "Halter Neck Top",
        desc: "Memecah garis bahu yang lebar dan menciptakan tampilan yang lebih ramping di atas.",
        img: "/assets/images/regenerated_image_1778918507070.png"
      },
      {
        tag: "Bawahan",
        name: "Wide Leg Jeans",
        desc: "Volume ekstra di bawah mengimbangi lebarnya bahu secara instan.",
        img: "/assets/images/regenerated_image_1778918511172.png"
      },
      {
        tag: "Luaran",
        name: "Unstructured Cardigan",
        desc: "Potongan yang lemas menyamarkan garis bahu yang tajam tanpa menambah volume.",
        img: "/assets/images/regenerated_image_1778918514985.png"
      }
    ]
  }
};

export default function App() {
  const isIframe = typeof window !== 'undefined' && window.self !== window.top;
  const [measurements, setMeasurements] = useState({
    shoulder: '',
    waist: '',
    hips: ''
  });
  const [resultShape, setResultShape] = useState<BodyShape | null>(null);
  const [isCatalogView, setIsCatalogView] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [loginForm, setLoginForm] = useState({ name: '', email: '' });
  const [userName, setUserName] = useState('');
  const [userEmail, setUserEmail] = useState('');
  const [googleStep, setGoogleStep] = useState<'form' | 'chooser' | 'custom' | 'loading'>('form');
  const [customGoogleAccount, setCustomGoogleAccount] = useState({ name: '', email: '' });
  const [authError, setAuthError] = useState<string | null>(null);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Synchronise state with Firebase Authentication Automatically
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setIsLoggedIn(true);
        setUserName(user.displayName || user.email?.split('@')[0] || 'User');
        setUserEmail(user.email || '');
      } else {
        setIsLoggedIn(false);
        setUserName('');
        setUserEmail('');
      }
    });
    return () => unsubscribe();
  }, []);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (loginForm.name && loginForm.email) {
      setUserName(loginForm.name);
      setUserEmail(loginForm.email);
      setIsLoggedIn(true);
      setShowLoginModal(false);
      setLoginForm({ name: '', email: '' });
    }
  };

  const handleGoogleSignIn = async () => {
    setGoogleStep('loading');
    setAuthError(null);
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;
      setUserName(user.displayName || user.email?.split('@')[0] || 'User');
      setUserEmail(user.email || '');
      setIsLoggedIn(true);
      setShowLoginModal(false);
      setGoogleStep('form');
    } catch (error: any) {
      console.error("Firebase Auth Error: ", error);
      let errorMsg = "Gagal menghubungkan Google.";
      if (error.code === 'auth/popup-blocked') {
        errorMsg = "Pop-up login diblokir browser Anda. Silakan izinkan pop-up / cookie pihak ketiga di browser Anda, atau klik tombol 'Gunakan Demo Simulator' di bawah untuk verifikasi cepat.";
      } else if (error.code === 'auth/cancelled-popup-request') {
        errorMsg = "Koneksi Google dibatalkan atau terhalang oleh frame preview. Silakan buka aplikasi di Tab Baru (ikon di kanan atas layar preview) lalu coba login kembali, atau pakai Demo Simulator di bawah.";
      } else {
        errorMsg = `Gagal login (${error.code || 'Error'}): ${error.message || String(error)}. Silakan gunakan Demo Simulator atau buka di Tab Baru.`;
      }
      setAuthError(errorMsg);
      setGoogleStep('form');
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error("Error signing out: ", error);
    }
    setIsLoggedIn(false);
    setUserName('');
    setUserEmail('');
    setIsSidebarOpen(false);
  };

  const handleSelectGoogleAccount = (name: string, email: string) => {
    setGoogleStep('loading');
    setTimeout(() => {
      setUserName(name);
      setUserEmail(email);
      setIsLoggedIn(true);
      setShowLoginModal(false);
      setGoogleStep('form');
    }, 1200);
  };

  const handleCustomGoogleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (customGoogleAccount.name && customGoogleAccount.email) {
      setGoogleStep('loading');
      setTimeout(() => {
        setUserName(customGoogleAccount.name);
        setUserEmail(customGoogleAccount.email);
        setIsLoggedIn(true);
        setShowLoginModal(false);
        setCustomGoogleAccount({ name: '', email: '' });
        setGoogleStep('form');
      }, 1200);
    }
  };

  const handleViewCatalog = () => {
    setIsCatalogView(true);
    window.scrollTo({ top: 0, behavior: 'instant' });
  };

  const handleCalculate = () => {
    const s = parseFloat(measurements.shoulder);
    const w = parseFloat(measurements.waist);
    const h = parseFloat(measurements.hips);

    if (isNaN(s) || isNaN(w) || isNaN(h)) return;

    let shape: BodyShape = 'rectangle';

    // Industry standard ratio analysis
    if (s > 1.05 * h) {
      shape = 'inverted_triangle';
    } else if (h > 1.05 * s) {
      shape = 'pear';
    } else if (Math.abs(s - h) / Math.max(s, h) < 0.05) {
      if (w < 0.8 * s && w < 0.8 * h) {
        shape = 'hourglass';
      } else if (w >= 0.95 * s || w >= 0.95 * h) {
        shape = 'apple';
      } else {
        shape = 'rectangle';
      }
    } else {
      if (w >= 0.9 * s && w >= 0.9 * h) {
        shape = 'apple';
      } else {
        shape = 'rectangle';
      }
    }

    setResultShape(shape);
    // Scroll to result
    setTimeout(() => {
      document.getElementById('result-section')?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen flex flex-col bg-brand-surface justify-center items-center p-4 relative overflow-hidden">
        {/* Background Decorative */}
        <div className="absolute inset-0 z-0 pointer-events-none">
          <img 
            src="https://images.unsplash.com/photo-1554189097-ffe88e998a2b?auto=format&fit=crop&q=80&w=1920" 
            alt="Silk Background" 
            className="w-full h-full object-cover opacity-15"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-brand-surface via-brand-surface/70 to-brand-surface"></div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="relative z-10 w-full max-w-md bg-white border border-brand-outline-variant/30 px-6 py-10 sm:p-10 rounded-3xl shadow-xl flex flex-col"
        >
          {/* Logo / Header */}
          <div className="text-center mb-8">
            <span className="text-[11px] font-sans font-bold tracking-[0.3em] text-brand-primary uppercase mb-3 block">
              Selamat datang di
            </span>
            <h1 className="text-4xl font-serif text-brand-on-surface tracking-widest font-semibold mb-2">
              VELOURA
            </h1>
            <p className="text-xs text-brand-on-surface-variant leading-relaxed">
              Analisis Bentuk Tubuh & Panduan Gaya Busana Berkelas. Silakan masuk terlebih dahulu untuk memulai perjalanan gaya Anda.
            </p>
          </div>

          <AnimatePresence mode="wait">
            {googleStep === 'form' && (
              <motion.div
                key="form"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-6"
              >
                <form onSubmit={handleLogin} className="space-y-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold tracking-widest text-brand-on-surface uppercase block">Nama Lengkap</label>
                    <input 
                      required
                      type="text" 
                      placeholder="Masukkan nama Anda"
                      className="w-full h-12 bg-brand-surface-container border border-brand-outline-variant/30 rounded-xl px-4 focus:outline-none focus:border-brand-primary transition-colors text-sm"
                      value={loginForm.name}
                      onChange={(e) => setLoginForm({ ...loginForm, name: e.target.value })}
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold tracking-widest text-brand-on-surface uppercase block">Email</label>
                    <input 
                      required
                      type="email" 
                      placeholder="contoh@email.com"
                      className="w-full h-12 bg-brand-surface-container border border-brand-outline-variant/30 rounded-xl px-4 focus:outline-none focus:border-brand-primary transition-colors text-sm"
                      value={loginForm.email}
                      onChange={(e) => setLoginForm({ ...loginForm, email: e.target.value })}
                    />
                  </div>
                  <button 
                    type="submit"
                    className="w-full py-3.5 bg-brand-primary text-white font-bold rounded-xl tracking-widest uppercase hover:bg-opacity-90 transition-all active:scale-[0.98] shadow-lg shadow-brand-primary/20 text-xs mt-2 cursor-pointer"
                  >
                    Masuk
                  </button>
                </form>

                <div className="relative flex items-center justify-center my-6">
                  <div className="border-t border-brand-outline-variant/30 w-full absolute"></div>
                  <span className="bg-white px-4 text-[10px] text-brand-on-surface-variant uppercase tracking-widest font-bold z-10">atau</span>
                </div>

                <button 
                  type="button"
                  onClick={handleGoogleSignIn}
                  className="w-full py-3.5 bg-white border border-brand-outline-variant/50 text-brand-on-surface font-semibold rounded-xl hover:bg-gray-50 hover:border-brand-primary/50 transition-all active:scale-[0.98] shadow-sm flex items-center justify-center gap-3 text-xs cursor-pointer focus:ring-2 focus:ring-brand-primary"
                >
                  <svg className="w-5 h-5 shrink-0" viewBox="0 0 24 24">
                    <path fill="#EA4335" d="M12 5.04c1.55 0 2.94.53 4.04 1.58l3.01-3.01C17.22 1.95 14.83 1 12 1 7.35 1 3.39 3.67 1.41 7.56l3.65 2.83C5.9 7.42 8.7 5.04 12 5.04z" />
                    <path fill="#4285F4" d="M23.49 12.27c0-.82-.07-1.61-.21-2.39H12v4.51h6.46c-.28 1.48-1.12 2.73-2.38 3.58l3.65 2.83c2.14-1.97 3.38-4.87 3.38-8.53z" />
                    <path fill="#FBBC05" d="M5.06 10.39c-.24-.71-.38-1.47-.38-2.27s.14-1.56.38-2.27L1.41 4.54C.51 6.34 0 8.35 0 10.51s.51 4.17 1.41 5.97l3.65-2.83c-.24-.71-.38-1.47-.38-2.27z" />
                    <path fill="#34A853" d="M12 22.88c3.24 0 5.97-1.07 7.96-2.91l-3.65-2.83c-1.1.74-2.5 1.18-4.31 1.18-3.3 0-6.1-2.38-6.94-5.35l-3.65 2.83C3.39 19.21 7.35 22.88 12 22.88z" />
                  </svg>
                  Masuk dengan Google
                </button>

                {authError && (
                  <div className="p-3 bg-red-500/10 border border-red-500/20 text-red-600 rounded-xl text-xs leading-relaxed text-center font-sans">
                    {authError}
                  </div>
                )}
              </motion.div>
            )}

            {googleStep === 'chooser' && (
              <motion.div
                key="chooser"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-6"
              >
                <div className="text-center">
                  <h3 className="text-lg font-bold text-brand-on-surface">Pilih Akun Google (Simulasi)</h3>
                  <p className="text-xs text-brand-on-surface-variant mt-1">untuk login instan tanpa pop-up</p>
                </div>

                <div className="space-y-3 mt-4">
                  <button
                    type="button"
                    onClick={() => handleSelectGoogleAccount('Aprilia PH', 'apriliaph13@gmail.com')}
                    className="w-full flex items-center justify-between p-4 bg-brand-surface-container border border-brand-outline-variant/20 rounded-2xl hover:border-brand-primary hover:bg-brand-primary/5 transition-all text-left group cursor-pointer"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-brand-primary/10 flex items-center justify-center text-brand-primary font-bold text-sm border border-brand-primary/20">
                        A
                      </div>
                      <div>
                        <p className="text-sm font-bold text-brand-on-surface">Aprilia PH</p>
                        <p className="text-xs text-brand-on-surface-variant">apriliaph13@gmail.com</p>
                      </div>
                    </div>
                    <span className="text-[10px] bg-brand-primary/10 text-brand-primary px-3 py-1 rounded-full font-bold uppercase tracking-wider scale-95 group-hover:scale-100 transition-transform">Developer</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleSelectGoogleAccount('Tamu Veloura', 'tamu.veloura@gmail.com')}
                    className="w-full flex items-center justify-between p-4 bg-brand-surface-container border border-brand-outline-variant/20 rounded-2xl hover:border-brand-primary hover:bg-brand-primary/5 transition-all text-left group cursor-pointer"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-brand-on-surface-variant/10 flex items-center justify-center text-brand-on-surface-variant font-bold text-sm border border-brand-outline-variant/30">
                        T
                      </div>
                      <div>
                        <p className="text-sm font-bold text-brand-on-surface">Tamu Veloura</p>
                        <p className="text-xs text-brand-on-surface-variant">tamu.veloura@gmail.com</p>
                      </div>
                    </div>
                    <span className="text-[10px] bg-brand-surface text-brand-on-surface-variant px-3 py-1 rounded-full font-bold uppercase tracking-wider border border-brand-outline-variant/30 opacity-70 group-hover:opacity-100 transition-all">Demo</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setGoogleStep('custom')}
                    className="w-full flex items-center gap-3 p-4 bg-brand-surface-container/50 border border-dashed border-brand-outline-variant/30 rounded-2xl hover:border-brand-primary hover:bg-brand-primary/5 transition-colors text-left text-sm font-semibold text-brand-on-surface-variant hover:text-brand-primary cursor-pointer"
                  >
                    <div className="w-10 h-10 rounded-full border border-dashed border-brand-outline-variant/40 flex items-center justify-center">
                      <User size={18} />
                    </div>
                    <span>Gunakan akun Google lain...</span>
                  </button>
                </div>

                <button
                  type="button"
                  onClick={() => setGoogleStep('form')}
                  className="w-full py-3 bg-brand-surface-container border border-brand-outline-variant/20 text-brand-on-surface-variant text-xs font-bold tracking-widest uppercase rounded-xl hover:bg-brand-surface-container-high transition-colors cursor-pointer"
                >
                  Kembali ke login biasa
                </button>
              </motion.div>
            )}

            {googleStep === 'custom' && (
              <motion.div
                key="custom"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-6"
              >
                <div className="text-center">
                  <h3 className="text-lg font-bold text-brand-on-surface">Akun Google Lain</h3>
                  <p className="text-xs text-brand-on-surface-variant mt-1">Masukkan kredensial Google Anda</p>
                </div>

                <form onSubmit={handleCustomGoogleSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-xs font-bold tracking-widest text-brand-on-surface uppercase">Nama Google</label>
                    <input 
                      required
                      type="text" 
                      placeholder="Masukkan nama Google Anda"
                      className="w-full h-12 bg-brand-surface-container border border-brand-outline-variant/30 rounded-xl px-4 focus:outline-none focus:border-brand-primary transition-colors text-sm"
                      value={customGoogleAccount.name}
                      onChange={(e) => setCustomGoogleAccount({ ...customGoogleAccount, name: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold tracking-widest text-[#1f2937] dark:text-[#f3f4f6] uppercase">Alamat Gmail (@gmail.com)</label>
                    <input 
                      required
                      type="email" 
                      placeholder="contoh@gmail.com"
                      className="w-full h-12 bg-brand-surface-container border border-brand-outline-variant/30 rounded-xl px-4 focus:outline-none focus:border-brand-primary transition-colors text-sm"
                      value={customGoogleAccount.email}
                      onChange={(e) => setCustomGoogleAccount({ ...customGoogleAccount, email: e.target.value })}
                    />
                  </div>
                  <button 
                    type="submit"
                    className="w-full py-4 bg-brand-primary text-white font-bold rounded-xl tracking-widest uppercase hover:bg-opacity-90 transition-all active:scale-[0.98] shadow-lg text-xs cursor-pointer"
                  >
                    Hubungkan Akun (Simulasi)
                  </button>
                </form>

                <button
                  type="button"
                  onClick={() => setGoogleStep('chooser')}
                  className="w-full py-3 bg-brand-surface-container border border-brand-outline-variant/20 text-brand-on-surface-variant text-xs font-bold tracking-widest uppercase rounded-xl hover:bg-brand-surface-container-high transition-colors cursor-pointer"
                >
                  Kembali ke Pilihan Akun
                </button>
              </motion.div>
            )}

            {googleStep === 'loading' && (
              <motion.div
                key="loading"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="py-12 flex flex-col items-center justify-center gap-6"
              >
                <div className="relative w-16 h-16">
                  <div className="absolute inset-0 rounded-full border-4 border-brand-surface-container"></div>
                  <div className="absolute inset-0 rounded-full border-4 border-t-red-500 border-r-blue-500 border-b-yellow-500 border-l-green-500 animate-spin"></div>
                </div>
                <div className="text-center space-y-2">
                  <p className="text-sm font-semibold text-brand-on-surface animate-pulse font-sans">Menghubungkan Akun...</p>
                  <p className="text-xs text-brand-on-surface-variant font-sans">Memproses verifikasi dengan aman</p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <p className="mt-8 text-center text-[10px] text-brand-on-surface-variant leading-relaxed uppercase tracking-widest opacity-60">
            Design & Technology by Veloura. <br /> © 2026 VELOURA. Elevating Personal Elegance.
          </p>
        </motion.div>
      </div>
    );
  }

  if (isCatalogView) {
    return (
      <div className="min-h-screen bg-brand-surface">
        <nav className="sticky top-0 z-50 bg-brand-surface/80 backdrop-blur-md border-b border-brand-outline-variant/30">
            <div className="max-w-7xl mx-auto px-4 h-16 flex justify-between items-center gap-4">
              <div className="flex items-center gap-6 overflow-hidden">
                <button 
                  onClick={() => setIsSidebarOpen(true)}
                  className="p-2 -ml-2 hover:bg-brand-surface-container rounded-full transition-colors shrink-0"
                >
                  <Menu size={20} className="text-brand-on-surface" />
                </button>
                <button 
                  onClick={() => setIsCatalogView(false)}
                  className="hidden sm:flex items-center gap-2 text-sm font-bold tracking-widest uppercase hover:text-brand-primary transition-colors shrink-0"
                >
                  <ArrowLeft size={16} /> Kembali
                </button>
              </div>

              <AnimatePresence mode="wait">
                {isSearchOpen ? (
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="flex-grow max-w-xl mx-4 relative"
                  >
                    <input 
                      autoFocus
                      type="text"
                      placeholder="Cari gaya, item, atau bentuk tubuh..."
                      className="w-full h-10 bg-brand-surface-container border border-brand-outline-variant/30 rounded-full px-10 text-sm focus:outline-none focus:border-brand-primary transition-all"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                    <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-brand-on-surface-variant" />
                    <button 
                      onClick={() => {
                        setIsSearchOpen(false);
                        setSearchQuery('');
                      }}
                      className="absolute right-3 top-1/2 -translate-y-1/2 p-1 hover:bg-brand-surface-container-high rounded-full transition-colors"
                    >
                      <X size={14} />
                    </button>
                  </motion.div>
                ) : (
                  <motion.span 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="text-xl font-serif tracking-widest font-semibold text-brand-on-surface absolute left-1/2 -translate-x-1/2"
                  >
                    VELOURA
                  </motion.span>
                )}
              </AnimatePresence>

              <div className="flex items-center gap-2">
                {!isSearchOpen && (
                  <button 
                    onClick={() => setIsSearchOpen(true)}
                    className="p-2 hover:bg-brand-surface-container rounded-full transition-colors"
                  >
                    <Search size={20} />
                  </button>
                )}
              </div>
            </div>
        </nav>

        <main className="max-w-7xl mx-auto px-4 py-20">
          <header className="text-center mb-24">
            <span className="text-xs font-sans font-semibold tracking-[0.3em] text-brand-primary uppercase mb-6 block">the veloura catalog</span>
            <h1 className="text-4xl md:text-6xl font-serif mb-6">Panduan Gaya Semua Bentuk Tubuh</h1>
            <p className="max-w-2xl mx-auto text-brand-on-surface-variant leading-relaxed">
              Temukan karakter dan rekomendasi pakaian terbaik untuk setiap jenis siluet tubuh. Elegansi dimulai dari pemahaman diri.
            </p>
          </header>
          
          <div className="space-y-40">
            {(Object.entries(SHAPE_DATA) as [BodyShape, ShapeInfo][])
              .filter(([_, data]) => {
                if (!searchQuery) return true;
                const query = searchQuery.toLowerCase();
                return (
                  data.name.toLowerCase().includes(query) ||
                  data.enName.toLowerCase().includes(query) ||
                  data.description.toLowerCase().includes(query) ||
                  data.recommendations.some(r => r.name.toLowerCase().includes(query) || r.tag.toLowerCase().includes(query))
                );
              })
              .map(([key, data]) => {
                const filteredRecs = data.recommendations.filter(r => {
                  if (!searchQuery) return true;
                  const query = searchQuery.toLowerCase();
                  return r.name.toLowerCase().includes(query) || r.tag.toLowerCase().includes(query);
                });

                if (searchQuery && filteredRecs.length === 0 && !data.name.toLowerCase().includes(searchQuery.toLowerCase())) return null;

                return (
                  <section key={key} className="relative">
                    <div className="flex flex-col md:flex-row items-baseline gap-4 border-b border-brand-outline-variant/30 pb-10 mb-16">
                      <h2 className="text-4xl md:text-5xl font-serif">{data.name}</h2>
                      <span className="text-sm font-bold tracking-widest text-brand-on-surface-variant/40 uppercase font-sans">/ {data.enName}</span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
                      <div className="lg:col-span-1 space-y-6">
                        <div className="w-16 h-16 rounded-full bg-brand-surface-container flex items-center justify-center text-brand-primary">
                          {React.cloneElement(data.icon as React.ReactElement, { size: 32 })}
                        </div>
                        <p className="text-lg leading-relaxed">{data.description}</p>
                        <div className="bg-white p-6 rounded-xl border border-brand-outline-variant/20">
                          <h4 className="text-xs font-bold tracking-widest uppercase mb-4 text-brand-primary">Kunci Penataan</h4>
                          <p className="text-sm text-brand-on-surface-variant leading-loose">{data.focus}</p>
                        </div>
                      </div>

                      <div className="lg:col-span-2 relative">
                        {!isLoggedIn && (
                          <div className="absolute inset-0 z-10 flex items-center justify-center bg-brand-surface/40 backdrop-blur-sm rounded-2xl">
                            <div className="text-center p-8 bg-white/90 backdrop-blur-md rounded-2xl shadow-xl border border-brand-outline-variant/30 max-w-sm mx-4">
                              <LogIn size={40} className="mx-auto mb-4 text-brand-primary" />
                              <h4 className="text-xl font-serif mb-2">Akses Terbatas</h4>
                              <p className="text-sm text-brand-on-surface-variant mb-6">Silakan login untuk melihat detail rekomendasi gaya lengkap.</p>
                              <button 
                                onClick={() => setShowLoginModal(true)}
                                className="w-full py-3 bg-brand-primary text-white text-xs font-bold tracking-widest uppercase rounded-lg hover:bg-opacity-90 transition-all"
                              >
                                Login Sekarang
                              </button>
                            </div>
                          </div>
                        )}
                        <div className={`grid grid-cols-1 sm:grid-cols-3 gap-6 ${!isLoggedIn ? 'blur-md pointer-events-none select-none' : ''}`}>
                          {filteredRecs.map((rec, i) => (
                            <motion.div 
                              key={i} 
                              initial={{ opacity: 0, y: 20 }}
                              whileInView={{ opacity: 1, y: 0 }}
                              viewport={{ once: true }}
                              transition={{ delay: i * 0.1 }}
                              className="space-y-4 group"
                            >
                              <div className="aspect-[3/4] rounded-xl overflow-hidden shadow-sm relative">
                                <img src={rec.img} alt={rec.name} referrerPolicy="no-referrer" className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                                <div className="absolute top-4 left-4">
                                  <span className="px-3 py-1 bg-white/90 backdrop-blur-sm text-[10px] font-bold tracking-widest uppercase rounded-full shadow-sm">
                                    {rec.tag}
                                  </span>
                                </div>
                              </div>
                              <h3 className="text-lg font-bold group-hover:text-brand-primary transition-colors">{rec.name}</h3>
                              <p className="text-sm text-brand-on-surface-variant leading-relaxed italic">"{rec.desc}"</p>
                            </motion.div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </section>
                );
              })}
            {searchQuery && (Object.entries(SHAPE_DATA) as [BodyShape, ShapeInfo][]).filter(([_, data]) => {
              const query = searchQuery.toLowerCase();
              return data.name.toLowerCase().includes(query) || data.enName.toLowerCase().includes(query) || data.description.toLowerCase().includes(query) || data.recommendations.some(r => r.name.toLowerCase().includes(query));
            }).length === 0 && (
              <div className="text-center py-20">
                <p className="text-brand-on-surface-variant">Tidak ada hasil ditemukan untuk "{searchQuery}"</p>
              </div>
            )}
          </div>
        </main>

        <footer className="py-20 bg-brand-surface-container text-center mt-40">
          <p className="text-sm font-bold tracking-widest uppercase text-brand-on-surface-variant opacity-60">
            © 2026 VELOURA. Elevating Personal Elegance.
          </p>
        </footer>

        {/* Sidebar for Catalog View */}
        <AnimatePresence>
          {isSidebarOpen && (
            <>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setIsSidebarOpen(false)}
                className="fixed inset-0 z-[60] bg-black/40 backdrop-blur-sm"
              />
              <motion.aside
                initial={{ x: '-100%' }}
                animate={{ x: 0 }}
                exit={{ x: '-100%' }}
                transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                className="fixed top-0 left-0 bottom-0 w-80 z-[70] bg-brand-surface shadow-2xl flex flex-col"
              >
                <div className="p-6 flex justify-between items-center border-b border-brand-outline-variant/20">
                  <span className="text-xl font-serif tracking-widest font-semibold text-brand-on-surface">VELOURA</span>
                  <button 
                    onClick={() => setIsSidebarOpen(false)}
                    className="p-2 hover:bg-brand-surface-container rounded-full transition-colors"
                  >
                    <X size={20} />
                  </button>
                </div>

                <nav className="flex-grow py-8 px-6 space-y-6">
                  <button 
                    onClick={() => {
                      setIsCatalogView(false);
                      setIsSidebarOpen(false);
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    className="flex items-center gap-4 w-full text-left p-4 rounded-xl hover:bg-brand-surface-container transition-all group"
                  >
                    <div className="w-10 h-10 rounded-full bg-brand-surface-container flex items-center justify-center text-brand-on-surface-variant group-hover:text-brand-primary group-hover:bg-brand-primary/10 transition-colors">
                      <Home size={20} />
                    </div>
                    <div>
                      <p className="font-bold text-brand-on-surface">Home</p>
                      <p className="text-xs text-brand-on-surface-variant">Discover our world</p>
                    </div>
                  </button>

                  <button 
                    onClick={() => {
                      setIsCatalogView(true);
                      setIsSidebarOpen(false);
                      window.scrollTo({ top: 0, behavior: 'instant' });
                    }}
                    className="flex items-center gap-4 w-full text-left p-4 rounded-xl hover:bg-brand-surface-container transition-all group"
                  >
                    <div className="w-10 h-10 rounded-full bg-brand-surface-container flex items-center justify-center text-brand-on-surface-variant group-hover:text-brand-primary group-hover:bg-brand-primary/10 transition-colors">
                      <BookOpen size={20} />
                    </div>
                    <div>
                      <p className="font-bold text-brand-on-surface">Katalog</p>
                      <p className="text-xs text-brand-on-surface-variant">View all styles</p>
                    </div>
                  </button>
                </nav>

                <div className="p-8 border-t border-brand-outline-variant/20">
                  {isLoggedIn ? (
                    <div className="space-y-4">
                      <div className="flex items-center gap-4 p-4 bg-brand-surface-container rounded-xl border border-brand-outline-variant/20">
                        <div className="w-10 h-10 rounded-full bg-brand-primary/10 flex items-center justify-center text-brand-primary font-bold">
                          {userName.charAt(0).toUpperCase()}
                        </div>
                        <div className="overflow-hidden">
                          <p className="text-sm font-bold text-brand-on-surface truncate">{userName}</p>
                          <p className="text-[10px] text-brand-on-surface-variant uppercase tracking-wider truncate">{userEmail || 'Member'}</p>
                        </div>
                      </div>
                      <button 
                        onClick={handleLogout}
                        className="flex items-center justify-center gap-2 w-full py-4 text-brand-on-surface-variant font-bold text-xs uppercase tracking-widest hover:text-red-500 transition-colors"
                      >
                        <LogOut size={16} /> Logout
                      </button>
                    </div>
                  ) : (
                    <button 
                      onClick={() => {
                        setIsSidebarOpen(false);
                        setShowLoginModal(true);
                      }}
                      className="flex items-center justify-center gap-2 w-full py-4 bg-brand-primary text-white font-bold rounded-xl hover:bg-opacity-90 transition-all shadow-lg shadow-brand-primary/20"
                    >
                      <LogIn size={18} /> Login
                    </button>
                  )}
                </div>
              </motion.aside>
            </>
          )}
        </AnimatePresence>
      </div>
    );
  }

  const currentData = resultShape ? SHAPE_DATA[resultShape] : null;

  return (
    <div className="min-h-screen flex flex-col">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 bg-brand-surface/80 backdrop-blur-md border-b border-brand-outline-variant/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16 gap-4">
            <div className="flex items-center gap-6 overflow-hidden">
              <button 
                onClick={() => setIsSidebarOpen(true)}
                className="p-2 -ml-2 hover:bg-brand-surface-container rounded-full transition-colors shrink-0"
              >
                <Menu size={20} className="text-brand-on-surface" />
              </button>
              <AnimatePresence mode="wait">
                {!isSearchOpen && (
                  <motion.span 
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="text-2xl font-serif tracking-widest font-semibold text-brand-on-surface shrink-0"
                  >
                    VELOURA
                  </motion.span>
                )}
              </AnimatePresence>
            </div>
            
            <AnimatePresence mode="wait">
              {!isSearchOpen ? (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="hidden md:flex items-center space-x-12"
                >
                  <a href="#" className="text-sm font-medium tracking-wider hover:text-brand-primary transition-colors">DISCOVER</a>
                  <a href="#analyze-section" className="text-sm font-medium tracking-wider hover:text-brand-primary transition-colors">ANALYZE</a>
                  <a href="#outfit-section" className="text-sm font-medium tracking-wider hover:text-brand-primary transition-colors">STYLE</a>
                </motion.div>
              ) : (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.98 }}
                  className="flex-grow max-w-2xl mx-4 relative"
                >
                  <input 
                    autoFocus
                    type="text"
                    placeholder="Cari gaya atau item pakaian..."
                    className="w-full h-10 bg-brand-surface-container border border-brand-outline-variant/30 rounded-full px-10 text-sm focus:outline-none focus:border-brand-primary transition-all"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                  <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-brand-on-surface-variant" />
                  <button 
                    onClick={() => {
                      setIsSearchOpen(false);
                      setSearchQuery('');
                    }}
                    className="absolute right-3 top-1/2 -translate-y-1/2 p-1 hover:bg-brand-surface-container-high rounded-full transition-colors"
                  >
                    <X size={14} />
                  </button>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="flex items-center gap-4">
              {!isSearchOpen && (
                <button 
                  onClick={() => setIsSearchOpen(true)}
                  className="p-2 hover:bg-brand-surface-container rounded-full transition-colors"
                >
                  <Search size={20} />
                </button>
              )}
              <button 
                onClick={() => isLoggedIn ? setIsSidebarOpen(true) : setShowLoginModal(true)}
                className="w-8 h-8 rounded-full bg-brand-surface-container border border-brand-outline-variant flex items-center justify-center overflow-hidden hover:border-brand-primary transition-colors shrink-0"
              >
                {isLoggedIn ? (
                  <div className="w-full h-full bg-brand-primary/10 flex items-center justify-center text-brand-primary text-xs font-bold">
                    {userName.charAt(0).toUpperCase()}
                  </div>
                ) : (
                  <User size={18} className="text-brand-on-surface-variant" />
                )}
              </button>
            </div>
          </div>
        </div>
      </nav>

      <main className="flex-grow">
        {/* Hero Section */}
        <section className="relative pt-20 pb-32 px-4 text-center overflow-hidden">
          <div className="absolute inset-0 z-0 pointer-events-none">
            <img 
              src="https://images.unsplash.com/photo-1554189097-ffe88e998a2b?auto=format&fit=crop&q=80&w=1920" 
              alt="Silk Background" 
              className="w-full h-full object-cover opacity-20 transition-opacity duration-1000"
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-brand-surface via-brand-surface/40 to-brand-surface"></div>
          </div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="relative z-10 max-w-3xl mx-auto"
          >
            <span className="text-xs font-sans font-semibold tracking-[0.3em] text-brand-primary uppercase mb-6 block">
              Personalized Style Journey
            </span>
            <h1 className="text-5xl md:text-6xl font-serif text-brand-on-surface mb-8 leading-tight">
              Temukan Gaya Terbaikmu
            </h1>
            <p className="text-lg text-brand-on-surface-variant leading-relaxed mb-10 max-w-2xl mx-auto">
              Kami membantu Anda memahami proporsi tubuh unik Anda untuk menciptakan lemari pakaian yang memancarkan kepercayaan diri dan keanggunan abadi.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <a 
                href="#analyze-section"
                className="w-full sm:w-auto px-10 py-4 bg-brand-primary text-white font-medium rounded-lg hover:bg-opacity-90 transition-all active:scale-[0.98] inline-block"
              >
                Mulai Analisis
              </a>
              <button 
                onClick={handleViewCatalog}
                className="w-full sm:w-auto px-10 py-4 border border-brand-outline text-brand-on-surface font-medium rounded-lg hover:bg-brand-surface-container transition-all"
              >
                Pelajari Lebih Lanjut
              </button>
            </div>
          </motion.div>
        </section>

        {/* Measurement Tool Section */}
        <section id="analyze-section" className="py-24 bg-brand-surface-container/50">
          <div className="max-w-5xl mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-serif mb-4">Kenali Bentuk Tubuhmu</h2>
              <p className="text-brand-on-surface-variant">Langkah pertama menuju gaya yang sempurna adalah pengukuran yang akurat.</p>
            </div>

            <div className="bg-white rounded-2xl overflow-hidden shadow-sm border border-brand-outline-variant/30 flex flex-col md:flex-row">
              {/* Image side */}
              <div className="md:w-1/2 p-1 bg-brand-surface-container">
                <div className="relative aspect-[3/4] rounded-xl overflow-hidden group">
                  <img 
                    src="/assets/images/regenerated_image_1778854561406.png" 
                    alt="Body Measurement Guide" 
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-black/5"></div>
                  {/* Measurement overlays removed */}

                  <div className="absolute bottom-6 left-6 right-6 bg-white/90 backdrop-blur-md p-4 rounded-lg border border-brand-outline-variant/30">
                    <div className="flex gap-3">
                      <div className="shrink-0 text-brand-primary pt-1">
                        <Info size={16} />
                      </div>
                      <div>
                        <p className="text-[10px] font-bold text-brand-primary tracking-wider uppercase mb-1">Tips Pengukuran</p>
                        <p className="text-xs text-brand-on-surface-variant">Gunakan meteran kain dan ukur secara mendatar untuk hasil terbaik (cm).</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Form side */}
              <div className="md:w-1/2 p-10 flex flex-col justify-center">
                <div className="space-y-8">
                  <div className="space-y-2">
                    <label className="text-xs font-bold tracking-widest text-brand-on-surface uppercase">LINGKAR BAHU (CM)</label>
                    <div className="relative">
                      <input 
                        type="number" 
                        placeholder="Contoh: 38"
                        className="w-full h-14 bg-brand-surface border border-brand-outline-variant/40 rounded-lg px-4 focus:outline-none focus:border-brand-primary transition-colors text-lg"
                        value={measurements.shoulder}
                        onChange={(e) => setMeasurements({...measurements, shoulder: e.target.value})}
                      />
                      <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-medium text-brand-on-surface-variant">CM</span>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-bold tracking-widest text-brand-on-surface uppercase">Lingkar Pinggang (cm)</label>
                    <div className="relative">
                      <input 
                        type="number" 
                        placeholder="Contoh: 70"
                        className="w-full h-14 bg-brand-surface border border-brand-outline-variant/40 rounded-lg px-4 focus:outline-none focus:border-brand-primary transition-colors text-lg"
                        value={measurements.waist}
                        onChange={(e) => setMeasurements({...measurements, waist: e.target.value})}
                      />
                      <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-medium text-brand-on-surface-variant">CM</span>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-bold tracking-widest text-brand-on-surface uppercase">Lingkar Pinggul (cm)</label>
                    <div className="relative">
                      <input 
                        type="number" 
                        placeholder="Contoh: 95"
                        className="w-full h-14 bg-brand-surface border border-brand-outline-variant/40 rounded-lg px-4 focus:outline-none focus:border-brand-primary transition-colors text-lg"
                        value={measurements.hips}
                        onChange={(e) => setMeasurements({...measurements, hips: e.target.value})}
                      />
                      <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-medium text-brand-on-surface-variant">CM</span>
                    </div>
                  </div>

                  <button 
                    onClick={handleCalculate}
                    className="w-full py-4 bg-brand-primary text-white font-semibold rounded-lg tracking-widest uppercase hover:bg-opacity-90 transition-all active:scale-[0.98]"
                  >
                    Lihat Hasil
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Result Section */}
        <AnimatePresence>
          {resultShape && currentData && (
            <motion.section 
              id="result-section"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="py-24"
            >
              <div className="max-w-5xl mx-auto px-4">
                <div className="text-center mb-16">
                  <h2 className="text-3xl md:text-4xl font-serif">Hasil Analisis Anda</h2>
                </div>

                <div className="flex flex-col lg:flex-row gap-10">
                  {/* Shape Card */}
                  <div className="lg:w-5/12 bg-brand-surface-container rounded-2xl p-8 border border-brand-outline-variant/30 flex flex-col items-center text-center">
                    <div className="w-48 h-64 bg-white rounded-full flex items-center justify-center mb-6 shadow-inner ring-8 ring-brand-surface-container-high/50">
                      <div className="flex flex-col items-center">
                        {currentData.icon}
                        <h3 className="text-2xl font-serif">{currentData.name}</h3>
                        <p className="text-[10px] font-bold tracking-[0.2em] text-brand-on-surface-variant uppercase">{currentData.enName}</p>
                      </div>
                    </div>
                    <div className="mt-auto border-t border-brand-outline-variant/30 pt-6">
                      <p className="text-sm italic text-brand-on-surface-variant leading-relaxed">
                        "{currentData.description}"
                      </p>
                    </div>
                  </div>

                  {/* Details */}
                  <div className="lg:w-7/12 space-y-8">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="p-6 bg-white rounded-xl border border-brand-outline-variant/30 flex items-start gap-4">
                        <div className="shrink-0 w-10 h-10 rounded-full bg-brand-surface-container flex items-center justify-center text-brand-primary">
                          <Target size={20} />
                        </div>
                        <div>
                          <p className="text-sm font-bold mb-1">Kekuatan</p>
                          <p className="text-xs text-brand-on-surface-variant leading-relaxed">{currentData.strengths}</p>
                        </div>
                      </div>
                      <div className="p-6 bg-white rounded-xl border border-brand-outline-variant/30 flex items-start gap-4">
                        <div className="shrink-0 w-10 h-10 rounded-full bg-brand-surface-container flex items-center justify-center text-brand-primary">
                          <Lightbulb size={20} />
                        </div>
                        <div>
                          <p className="text-sm font-bold mb-1">Fokus Gaya</p>
                          <p className="text-xs text-brand-on-surface-variant leading-relaxed">{currentData.focus}</p>
                        </div>
                      </div>
                    </div>

                    <div className="bg-white rounded-xl border border-brand-outline-variant/30 p-8">
                      <h4 className="text-xs font-bold tracking-[0.2em] text-brand-on-surface-variant uppercase mb-6 border-b border-brand-outline-variant/30 pb-4">Karakteristik Kunci</h4>
                      <ul className="space-y-4">
                        {currentData.characteristics.map((item, i) => (
                          <li key={i} className="flex items-center gap-3 text-sm text-brand-on-surface">
                            <div className="w-1.5 h-1.5 rounded-full bg-brand-primary"></div>
                            {item}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </motion.section>
          )}
        </AnimatePresence>

        {/* Outfit Recommendations */}
        <section id="outfit-section" className="py-24 bg-brand-surface-container/30">
          <div className="max-w-7xl mx-auto px-4">
            <div className="flex justify-between items-end mb-12">
              <div>
                <h2 className="text-3xl md:text-4xl font-serif mb-4">Rekomendasi Outfit</h2>
                <p className="text-brand-on-surface-variant">Pilihan kurasi untuk menonjolkan bentuk tubuh {currentData ? currentData.name : 'Anda'}.</p>
              </div>
              <button 
                onClick={handleViewCatalog}
                className="hidden sm:flex items-center gap-2 text-sm font-bold tracking-wider uppercase text-brand-on-surface border-b border-brand-on-surface pb-1 group"
              >
                Lihat Semua Katalog
                <ChevronRight size={16} className="group-hover:translate-x-1 transition-transform" />
              </button>
            </div>

            <div className="relative">
              {!isLoggedIn && (
                <div className="absolute inset-0 z-10 flex items-center justify-center bg-brand-surface/20 backdrop-blur-sm rounded-3xl">
                  <div className="text-center p-12 bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl border border-brand-outline-variant/30 max-w-md mx-4">
                    <div className="w-20 h-20 bg-brand-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
                      <LogIn size={40} className="text-brand-primary" />
                    </div>
                    <h4 className="text-2xl font-serif mb-3 text-brand-on-surface">Eksklusif untuk Member</h4>
                    <p className="text-brand-on-surface-variant mb-8 leading-relaxed">
                      Dapatkan akses penuh ke rekomendasi pakaian yang disesuaikan khusus untuk bentuk tubuh Anda dengan masuk ke akun Veloura Anda.
                    </p>
                    <button 
                      onClick={() => setShowLoginModal(true)}
                      className="w-full py-4 bg-brand-primary text-white font-bold tracking-[0.2em] uppercase rounded-xl hover:bg-opacity-90 transition-all shadow-lg shadow-brand-primary/20"
                    >
                      Login Untuk Melihat
                    </button>
                    <p className="mt-6 text-[10px] text-brand-on-surface-variant uppercase tracking-widest opacity-60">GRATIS DAN CEPAT . VELOURA</p>
                  </div>
                </div>
              )}
              <div className={`grid grid-cols-1 md:grid-cols-3 gap-8 ${!isLoggedIn ? 'blur-xl pointer-events-none select-none' : ''}`}>
                {(currentData || SHAPE_DATA.hourglass).recommendations
                  .filter(item => {
                    if (!searchQuery) return true;
                    const query = searchQuery.toLowerCase();
                    return item.name.toLowerCase().includes(query) || item.tag.toLowerCase().includes(query);
                  })
                  .map((item, i) => (
                    <motion.div 
                      key={i}
                      whileHover={{ y: -8 }}
                      className="group cursor-pointer"
                    >
                      <div className="aspect-[3/4] rounded-2xl overflow-hidden mb-6 relative shadow-lg shadow-brand-on-surface/5">
                        <img 
                          src={item.img} 
                          alt={item.name} 
                          referrerPolicy="no-referrer"
                          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
                        <span className="absolute bottom-6 left-6 px-4 py-1 bg-white/90 backdrop-blur text-[10px] font-bold tracking-widest uppercase rounded-full">
                          {item.tag}
                        </span>
                      </div>
                      <h3 className="text-xl font-bold mb-2 group-hover:text-brand-primary transition-colors">{item.name}</h3>
                      <p className="text-sm text-brand-on-surface-variant leading-relaxed font-italic italic">"{item.desc}"</p>
                    </motion.div>
                  ))}
              </div>
              {searchQuery && (currentData || SHAPE_DATA.hourglass).recommendations.filter(item => {
                const query = searchQuery.toLowerCase();
                return item.name.toLowerCase().includes(query) || item.tag.toLowerCase().includes(query);
              }).length === 0 && (
                <div className="text-center py-20">
                  <p className="text-brand-on-surface-variant">Tidak ada rekomendasi outfit ditemukan untuk "{searchQuery}"</p>
                </div>
              )}
            </div>
            
            <button 
              onClick={handleViewCatalog}
              className="flex sm:hidden items-center justify-center gap-2 text-sm font-bold tracking-wider uppercase text-brand-on-surface border border-brand-outline-variant mt-10 py-4 rounded-lg w-full"
            >
              Lihat Semua Katalog
            </button>
          </div>
        </section>

        {/* Stylist Note */}
        <section className="pb-32 pt-12">
          <div className="max-w-7xl mx-auto px-4">
            <div className="bg-brand-surface-container/60 rounded-2xl p-10 flex flex-col md:flex-row items-center gap-10 border border-brand-outline-variant/20 italic">
              <div className="shrink-0 w-20 h-20 rounded-full bg-brand-primary flex items-center justify-center text-white shadow-xl shadow-brand-primary/20">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-8 h-8">
                  <path d="M12 19l7-7 3 3-7 7-3-3z"></path>
                  <path d="M18 13l-1.5-7.5L2 2l3.5 14.5L13 18l5-5z"></path>
                  <path d="M2 2l7.586 7.586"></path>
                  <circle cx="11" cy="11" r="2"></circle>
                </svg>
              </div>
              <div className="space-y-4">
                <p className="text-[10px] font-bold tracking-[0.3em] text-brand-primary uppercase not-italic">Catatan Stylist</p>
                <div 
                  className="text-brand-on-surface leading-loose text-lg" 
                  dangerouslySetInnerHTML={{ 
                    __html: (currentData || SHAPE_DATA.hourglass).stylistNote.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') 
                  }}
                ></div>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="py-12 bg-brand-surface-container border-t border-brand-outline-variant/30 text-center">
        <p className="text-sm font-bold tracking-widest uppercase text-brand-on-surface-variant opacity-60">
          © 2026 VELOURA. Elevating Personal Elegance.
        </p>
      </footer>

      {/* Sidebar */}
      <AnimatePresence>
        {isSidebarOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsSidebarOpen(false)}
              className="fixed inset-0 z-[60] bg-black/40 backdrop-blur-sm"
            />
            <motion.aside
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed top-0 left-0 bottom-0 w-80 z-[70] bg-brand-surface shadow-2xl flex flex-col"
            >
              <div className="p-6 flex justify-between items-center border-b border-brand-outline-variant/20">
                <span className="text-xl font-serif tracking-widest font-semibold text-brand-on-surface">VELOURA</span>
                <button 
                  onClick={() => setIsSidebarOpen(false)}
                  className="p-2 hover:bg-brand-surface-container rounded-full transition-colors"
                >
                  <X size={20} />
                </button>
              </div>

              <nav className="flex-grow py-8 px-6 space-y-6">
                <button 
                  onClick={() => {
                    setIsCatalogView(false);
                    setIsSidebarOpen(false);
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="flex items-center gap-4 w-full text-left p-4 rounded-xl hover:bg-brand-surface-container transition-all group"
                >
                  <div className="w-10 h-10 rounded-full bg-brand-surface-container flex items-center justify-center text-brand-on-surface-variant group-hover:text-brand-primary group-hover:bg-brand-primary/10 transition-colors">
                    <Home size={20} />
                  </div>
                  <div>
                    <p className="font-bold text-brand-on-surface">Home</p>
                    <p className="text-xs text-brand-on-surface-variant">Discover our world</p>
                  </div>
                </button>

                <button 
                  onClick={() => {
                    setIsCatalogView(true);
                    setIsSidebarOpen(false);
                    window.scrollTo({ top: 0, behavior: 'instant' });
                  }}
                  className="flex items-center gap-4 w-full text-left p-4 rounded-xl hover:bg-brand-surface-container transition-all group"
                >
                  <div className="w-10 h-10 rounded-full bg-brand-surface-container flex items-center justify-center text-brand-on-surface-variant group-hover:text-brand-primary group-hover:bg-brand-primary/10 transition-colors">
                    <BookOpen size={20} />
                  </div>
                  <div>
                    <p className="font-bold text-brand-on-surface">Katalog</p>
                    <p className="text-xs text-brand-on-surface-variant">View all styles</p>
                  </div>
                </button>
              </nav>

              <div className="p-8 border-t border-brand-outline-variant/20">
                {isLoggedIn ? (
                  <div className="space-y-4">
                    <div className="flex items-center gap-4 p-4 bg-brand-surface-container rounded-xl border border-brand-outline-variant/20">
                      <div className="w-10 h-10 rounded-full bg-brand-primary/10 flex items-center justify-center text-brand-primary font-bold">
                        {userName.charAt(0).toUpperCase()}
                      </div>
                      <div className="overflow-hidden">
                        <p className="text-sm font-bold text-brand-on-surface truncate">{userName}</p>
                        <p className="text-[10px] text-brand-on-surface-variant uppercase tracking-wider truncate">{userEmail || 'Member'}</p>
                      </div>
                    </div>
                    <button 
                      onClick={handleLogout}
                      className="flex items-center justify-center gap-2 w-full py-4 text-brand-on-surface-variant font-bold text-xs uppercase tracking-widest hover:text-red-500 transition-colors"
                    >
                      <LogOut size={16} /> Logout
                    </button>
                  </div>
                ) : (
                  <button 
                    onClick={() => {
                      setIsSidebarOpen(false);
                      setShowLoginModal(true);
                    }}
                    className="flex items-center justify-center gap-2 w-full py-4 bg-brand-primary text-white font-bold rounded-xl hover:bg-opacity-90 transition-all shadow-lg shadow-brand-primary/20"
                  >
                    <LogIn size={18} /> Login
                  </button>
                )}
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Login Modal */}
      <AnimatePresence>
        {showLoginModal && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => {
                setShowLoginModal(false);
                setGoogleStep('form');
              }}
              className="fixed inset-0 z-[80] bg-black/60 backdrop-blur-md"
            />
            <div className="fixed inset-0 z-[90] flex items-center justify-center p-4 pointer-events-none">
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                className="bg-brand-surface w-full max-w-md rounded-3xl shadow-2xl overflow-hidden pointer-events-auto"
              >
                <div className="p-8">
                  <div className="flex justify-between items-center mb-8">
                    <div>
                      {googleStep === 'form' ? (
                        <>
                          <h2 className="text-2xl font-serif text-brand-on-surface">Welcome</h2>
                          <p className="text-sm text-brand-on-surface-variant">Sign in to your Veloura account</p>
                        </>
                      ) : (
                        <div className="flex items-center gap-2">
                          <svg className="w-5 h-5 shrink-0" viewBox="0 0 24 24">
                            <path fill="#EA4335" d="M12 5.04c1.55 0 2.94.53 4.04 1.58l3.01-3.01C17.22 1.95 14.83 1 12 1 7.35 1 3.39 3.67 1.41 7.56l3.65 2.83C5.9 7.42 8.7 5.04 12 5.04z" />
                            <path fill="#4285F4" d="M23.49 12.27c0-.82-.07-1.61-.21-2.39H12v4.51h6.46c-.28 1.48-1.12 2.73-2.38 3.58l3.65 2.83c2.14-1.97 3.38-4.87 3.38-8.53z" />
                            <path fill="#FBBC05" d="M5.06 10.39c-.24-.71-.38-1.47-.38-2.27s.14-1.56.38-2.27L1.41 4.54C.51 6.34 0 8.35 0 10.51s.51 4.17 1.41 5.97l3.65-2.83c-.24-.71-.38-1.47-.38-2.27z" />
                            <path fill="#34A853" d="M12 22.88c3.24 0 5.97-1.07 7.96-2.91l-3.65-2.83c-1.1.74-2.5 1.18-4.31 1.18-3.3 0-6.1-2.38-6.94-5.35l-3.65 2.83C3.39 19.21 7.35 22.88 12 22.88z" />
                          </svg>
                          <span className="text-xs font-bold tracking-widest text-[#5f6368] uppercase font-sans">Google Connection</span>
                        </div>
                      )}
                    </div>
                    <button 
                      onClick={() => {
                        setShowLoginModal(false);
                        setGoogleStep('form');
                      }}
                      className="p-2 hover:bg-brand-surface-container rounded-full transition-colors"
                    >
                      <X size={24} />
                    </button>
                  </div>

                  <AnimatePresence mode="wait">
                    {googleStep === 'form' && (
                      <motion.div
                        key="form"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="space-y-6"
                      >
                        {isIframe && (
                          <div className="p-3 bg-brand-primary/5 border border-brand-primary/15 rounded-2xl text-[11px] leading-relaxed text-brand-on-surface-variant flex items-start gap-2">
                            <Info size={15} className="text-brand-primary shrink-0 mt-0.5" />
                            <div>
                              Kami mendeteksi Anda berada di <strong>Frame Preview</strong>. Google Sign-In terhambat batasan sandboxed frame. Silakan klik <strong>Gunakan Demo Simulator</strong> di bawah untuk visual atau buka aplikasi di <strong>Tab Baru</strong> lewat ikon kanan atas preview.
                            </div>
                          </div>
                        )}

                        <form onSubmit={handleLogin} className="space-y-6">
                          <div className="space-y-2">
                            <label className="text-xs font-bold tracking-widest text-brand-on-surface uppercase">Nama Lengkap</label>
                            <input 
                              required
                              type="text" 
                              placeholder="Masukkan nama Anda"
                              className="w-full h-14 bg-brand-surface-container border border-brand-outline-variant/30 rounded-xl px-4 focus:outline-none focus:border-brand-primary transition-colors text-sm"
                              value={loginForm.name}
                              onChange={(e) => setLoginForm({ ...loginForm, name: e.target.value })}
                            />
                          </div>
                          <div className="space-y-2">
                            <label className="text-xs font-bold tracking-widest text-brand-on-surface uppercase">Email</label>
                            <input 
                              required
                              type="email" 
                              placeholder="contoh@email.com"
                              className="w-full h-14 bg-brand-surface-container border border-brand-outline-variant/30 rounded-xl px-4 focus:outline-none focus:border-brand-primary transition-colors text-sm"
                              value={loginForm.email}
                              onChange={(e) => setLoginForm({ ...loginForm, email: e.target.value })}
                            />
                          </div>
                          <button 
                            type="submit"
                            className="w-full py-4 bg-brand-primary text-white font-bold rounded-xl tracking-widest uppercase hover:bg-opacity-90 transition-all active:scale-[0.98] shadow-lg shadow-brand-primary/20 text-xs"
                          >
                            Sign In
                          </button>
                        </form>

                        <div className="relative flex items-center justify-center my-6">
                          <div className="border-t border-brand-outline-variant/30 w-full absolute"></div>
                          <span className="bg-brand-surface px-4 text-[10px] text-brand-on-surface-variant uppercase tracking-widest font-bold z-10">atau</span>
                        </div>

                        <button 
                          type="button"
                          onClick={handleGoogleSignIn}
                          className="w-full py-4 bg-white border border-brand-outline-variant/50 text-brand-on-surface font-semibold rounded-xl hover:bg-gray-50 hover:border-brand-primary/50 transition-all active:scale-[0.98] shadow-sm flex items-center justify-center gap-3 text-xs cursor-pointer focus:ring-2 focus:ring-brand-primary"
                        >
                          <svg className="w-5 h-5 shrink-0" viewBox="0 0 24 24">
                            <path fill="#EA4335" d="M12 5.04c1.55 0 2.94.53 4.04 1.58l3.01-3.01C17.22 1.95 14.83 1 12 1 7.35 1 3.39 3.67 1.41 7.56l3.65 2.83C5.9 7.42 8.7 5.04 12 5.04z" />
                            <path fill="#4285F4" d="M23.49 12.27c0-.82-.07-1.61-.21-2.39H12v4.51h6.46c-.28 1.48-1.12 2.73-2.38 3.58l3.65 2.83c2.14-1.97 3.38-4.87 3.38-8.53z" />
                            <path fill="#FBBC05" d="M5.06 10.39c-.24-.71-.38-1.47-.38-2.27s.14-1.56.38-2.27L1.41 4.54C.51 6.34 0 8.35 0 10.51s.51 4.17 1.41 5.97l3.65-2.83c-.24-.71-.38-1.47-.38-2.27z" />
                            <path fill="#34A853" d="M12 22.88c3.24 0 5.97-1.07 7.96-2.91l-3.65-2.83c-1.1.74-2.5 1.18-4.31 1.18-3.3 0-6.1-2.38-6.94-5.35l-3.65 2.83C3.39 19.21 7.35 22.88 12 22.88z" />
                          </svg>
                          Sign In dengan Google
                        </button>

                        {authError && (
                          <div className="p-3 bg-red-500/10 border border-red-500/20 text-red-600 rounded-xl text-xs leading-relaxed text-center">
                            {authError}
                          </div>
                        )}

                        <div className="text-center pt-2">
                          <button
                            type="button"
                            onClick={() => {
                              setGoogleStep('chooser');
                              setAuthError(null);
                            }}
                            className="text-[10px] text-brand-primary tracking-widest font-bold uppercase hover:underline cursor-pointer"
                          >
                            Mengalami kendala? Gunakan Demo Simulator
                          </button>
                        </div>
                      </motion.div>
                    )}

                    {googleStep === 'chooser' && (
                      <motion.div
                        key="chooser"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="space-y-6"
                      >
                        <div className="text-center">
                          <h3 className="text-lg font-bold text-brand-on-surface">Pilih Akun Google</h3>
                          <p className="text-xs text-brand-on-surface-variant mt-1">untuk melanjutkan ke Veloura</p>
                        </div>

                        <div className="space-y-3 mt-4">
                          {/* Option 1: Developer Account */}
                          <button
                            type="button"
                            onClick={() => handleSelectGoogleAccount('Aprilia PH', 'apriliaph13@gmail.com')}
                            className="w-full flex items-center justify-between p-4 bg-brand-surface-container border border-brand-outline-variant/20 rounded-2xl hover:border-brand-primary hover:bg-brand-primary/5 transition-all text-left group cursor-pointer"
                          >
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 rounded-full bg-brand-primary/10 flex items-center justify-center text-brand-primary font-bold text-sm border border-brand-primary/20">
                                A
                              </div>
                              <div>
                                <p className="text-sm font-bold text-brand-on-surface">Aprilia PH</p>
                                <p className="text-xs text-brand-on-surface-variant">apriliaph13@gmail.com</p>
                              </div>
                            </div>
                            <span className="text-[10px] bg-brand-primary/10 text-brand-primary px-3 py-1 rounded-full font-bold uppercase tracking-wider scale-95 group-hover:scale-100 transition-transform">Developer</span>
                          </button>

                          {/* Option 2: Demo/Guest Account */}
                          <button
                            type="button"
                            onClick={() => handleSelectGoogleAccount('Tamu Veloura', 'tamu.veloura@gmail.com')}
                            className="w-full flex items-center justify-between p-4 bg-brand-surface-container border border-brand-outline-variant/20 rounded-2xl hover:border-brand-primary hover:bg-brand-primary/5 transition-all text-left group cursor-pointer"
                          >
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 rounded-full bg-brand-on-surface-variant/10 flex items-center justify-center text-brand-on-surface-variant font-bold text-sm border border-brand-outline-variant/30">
                                T
                              </div>
                              <div>
                                <p className="text-sm font-bold text-brand-on-surface">Tamu Veloura</p>
                                <p className="text-xs text-brand-on-surface-variant">tamu.veloura@gmail.com</p>
                              </div>
                            </div>
                            <span className="text-[10px] bg-brand-surface text-brand-on-surface-variant px-3 py-1 rounded-full font-bold uppercase tracking-wider border border-brand-outline-variant/30 opacity-70 group-hover:opacity-100 transition-all">Demo</span>
                          </button>

                          {/* Option 3: Custom account login */}
                          <button
                            type="button"
                            onClick={() => setGoogleStep('custom')}
                            className="w-full flex items-center gap-3 p-4 bg-brand-surface-container/50 border border-dashed border-brand-outline-variant/30 rounded-2xl hover:border-brand-primary hover:bg-brand-primary/5 transition-colors text-left text-sm font-semibold text-brand-on-surface-variant hover:text-brand-primary cursor-pointer"
                          >
                            <div className="w-10 h-10 rounded-full border border-dashed border-brand-outline-variant/40 flex items-center justify-center">
                              <User size={18} />
                            </div>
                            <span>Gunakan akun Google lain...</span>
                          </button>
                        </div>

                        <button
                          type="button"
                          onClick={() => setGoogleStep('form')}
                          className="w-full py-3 bg-brand-surface-container border border-brand-outline-variant/20 text-brand-on-surface-variant text-xs font-bold tracking-widest uppercase rounded-xl hover:bg-brand-surface-container-high transition-colors"
                        >
                          Kembali ke login biasa
                        </button>
                      </motion.div>
                    )}

                    {googleStep === 'custom' && (
                      <motion.div
                        key="custom"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="space-y-6"
                      >
                        <div className="text-center">
                          <h3 className="text-lg font-bold text-brand-on-surface">Akun Google Lain</h3>
                          <p className="text-xs text-brand-on-surface-variant mt-1">Masukkan kredensial Google Anda</p>
                        </div>

                        <form onSubmit={handleCustomGoogleSubmit} className="space-y-4">
                          <div className="space-y-2">
                            <label className="text-xs font-bold tracking-widest text-brand-on-surface uppercase">Nama Google</label>
                            <input 
                              required
                              type="text" 
                              placeholder="Masukkan nama Google Anda"
                              className="w-full h-12 bg-brand-surface-container border border-brand-outline-variant/30 rounded-xl px-4 focus:outline-none focus:border-brand-primary transition-colors text-sm"
                              value={customGoogleAccount.name}
                              onChange={(e) => setCustomGoogleAccount({ ...customGoogleAccount, name: e.target.value })}
                            />
                          </div>
                          <div className="space-y-2">
                            <label className="text-xs font-bold tracking-widest text-[#1f2937] dark:text-[#f3f4f6] uppercase">Alamat Gmail (@gmail.com)</label>
                            <input 
                              required
                              type="email" 
                              placeholder="contoh@gmail.com"
                              className="w-full h-12 bg-brand-surface-container border border-brand-outline-variant/30 rounded-xl px-4 focus:outline-none focus:border-brand-primary transition-colors text-sm"
                              value={customGoogleAccount.email}
                              onChange={(e) => setCustomGoogleAccount({ ...customGoogleAccount, email: e.target.value })}
                            />
                          </div>
                          <button 
                            type="submit"
                            className="w-full py-4 bg-brand-primary text-white font-bold rounded-xl tracking-widest uppercase hover:bg-opacity-90 transition-all active:scale-[0.98] shadow-lg text-xs"
                          >
                            Hubungkan Akun
                          </button>
                        </form>

                        <button
                          type="button"
                          onClick={() => setGoogleStep('chooser')}
                          className="w-full py-3 bg-brand-surface-container border border-brand-outline-variant/20 text-brand-on-surface-variant text-xs font-bold tracking-widest uppercase rounded-xl hover:bg-brand-surface-container-high transition-colors"
                        >
                          Kembali ke Pilihan Akun
                        </button>
                      </motion.div>
                    )}

                    {googleStep === 'loading' && (
                      <motion.div
                        key="loading"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="py-12 flex flex-col items-center justify-center gap-6"
                      >
                        <div className="relative w-16 h-16">
                          <div className="absolute inset-0 rounded-full border-4 border-brand-surface-container"></div>
                          <div className="absolute inset-0 rounded-full border-4 border-t-red-500 border-r-blue-500 border-b-yellow-500 border-l-green-500 animate-spin"></div>
                        </div>
                        <div className="text-center space-y-2">
                          <p className="text-sm font-semibold text-brand-on-surface animate-pulse">Menghubungkan Akun Google...</p>
                          <p className="text-xs text-brand-on-surface-variant">Memverifikasi kredensial secara aman</p>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  <p className="mt-8 text-center text-[10px] text-brand-on-surface-variant leading-relaxed uppercase tracking-widest opacity-60">
                    By signing in, you agree to Veloura's <br /> Terms of Service and Privacy Policy.
                  </p>
                </div>
              </motion.div>
            </div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
