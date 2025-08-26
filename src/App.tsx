// src/App.tsx
import { useState, useEffect } from "react"; // Tambahkan useEffect
import { Routes, Route, useLocation } from "react-router-dom"; // Import Routes, Route, useLocation
import Navbar from "./components/Navbar";
import HomePage from "./pages/Profile"; // Ubah nama Profile menjadi HomePage agar konsisten
import PortfolioPage from "./pages/PortfolioPage";
import GalleryPage from "./pages/GalleryPage";
import WritingsPage from "./pages/WritingsPage";
import ConnectPage from "./pages/ConnectPage";
import WritingModal from "./components/WritingModal";

// Tipe ActiveSection tetap relevan untuk styling navigasi
export type ActiveSection =
  | "home"
  | "portfolio"
  | "gallery"
  | "writings"
  | "connect";

function App() {
  const location = useLocation(); // Hook untuk mendapatkan informasi URL
  const [activeSection, setActiveSection] = useState<ActiveSection>("home");

  // Efek samping untuk memperbarui activeSection berdasarkan URL
  useEffect(() => {
    const currentPath = location.pathname;
    // Peta dari path ke ActiveSection
    const pathMap: Record<string, ActiveSection> = {
      "/": "home", // Default path
      "/home": "home",
      "/portfolio": "portfolio",
      "/gallery": "gallery",
      "/writings": "writings",
      "/connect": "connect",
    };

    // Temukan ActiveSection yang sesuai dengan path saat ini
    const foundSection = Object.keys(pathMap).find(
      (path) => currentPath === path
    );
    if (foundSection) {
      setActiveSection(pathMap[foundSection]);
    } else {
      // Handle jika path tidak dikenal, misal redirect ke home atau 404
      setActiveSection("home");
    }
  }, [location.pathname]); // Jalankan efek ini setiap kali path URL berubah

  return (
    // Tambahkan min-h-screen kembali ke div utama
    <div className="flex flex-col md:flex-row min-h-screen bg-gray-50 dark:bg-gray-900 font-sans">
      {/* Navbar Vertikal di Desktop, Horizontal di Mobile */}
      <Navbar
        activeSection={activeSection} // activeSection sekarang dari URL
        setActiveSection={setActiveSection} // Tetap kirim setter jika Navbar ingin mengubah URL secara internal
      />

      {/* Area Konten Utama - akan diisi oleh Routes/Route */}
      <main className="overflow-y-auto p-4 md:p-8 flex-1 md:w-[calc(100vw-17rem)]">
        <Routes>
          {" "}
          {/* Gunakan Routes untuk mendefinisikan rute */}
          <Route path="/" element={<HomePage />} /> {/* Rute default */}
          <Route path="/home" element={<HomePage />} />
          <Route path="/portfolio" element={<PortfolioPage />} />
          <Route path="/gallery" element={<GalleryPage />} />
          <Route path="/writings" element={<WritingsPage />} />
          <Route path="/connect" element={<ConnectPage />} />
          <Route path="/tulisan/:writingSlug" element={<WritingModal />} />
          {/* Tambahkan rute untuk halaman 404 jika diinginkan */}
          {/* <Route path="*" element={<NotFoundPage />} /> */}
        </Routes>
      </main>
    </div>
  );
}

export default App;
