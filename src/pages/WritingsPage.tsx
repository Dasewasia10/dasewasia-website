import React, { useState } from "react";
import WritingModal from "../components/WritingModal"; // Import komponen modal

interface Writing {
  id: number;
  title: string;
  excerpt: string;
  date: string;
  // link: string; // Tidak lagi diperlukan karena akan dibuka di modal
}

// Data tulisan statis untuk tampilan kartu.
// ID di sini akan digunakan untuk memanggil API detail.
const writings: Writing[] = [
  {
    id: 1,
    title: "Memulai Belajar React Hooks",
    excerpt:
      "Panduan singkat untuk memahami dasar-dasar React Hooks dan bagaimana menggunakannya dalam proyek Anda.",
    date: "12 Mei 2024",
  },
  {
    id: 2,
    title: "Cerpen: Perjalanan ke Bulan",
    excerpt:
      "Kisah fiksi pendek tentang petualangan seorang astronot muda menjelajahi sisi gelap bulan.",
    date: "01 April 2024",
  },
  {
    id: 3,
    title: "Tips Optimalisasi Tailwind CSS",
    excerpt:
      "Beberapa trik untuk membuat proyek Tailwind Anda lebih ringan dan performa lebih baik.",
    date: "20 Maret 2024",
  },
];

const WritingsPage: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [selectedWritingId, setSelectedWritingId] = useState<number | null>(
    null
  );

  const openWritingModal = (id: number) => {
    setSelectedWritingId(id);
    setIsModalOpen(true);
  };

  const closeWritingModal = () => {
    setIsModalOpen(false);
    setSelectedWritingId(null); // Reset ID saat modal ditutup
  };

  return (
    <section className="py-8">
      <h2 className="text-4xl font-bold text-center mb-10 text-blue-600 dark:text-blue-400">
        Tulisan-Tulisan Saya
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {writings.map((writing) => (
          <div
            key={writing.id}
            className="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-6 transform transition duration-300 hover:scale-105 hover:shadow-2xl cursor-pointer"
            onClick={() => openWritingModal(writing.id)} // Klik kartu untuk membuka modal
          >
            <h3 className="text-xl font-semibold mb-2 text-gray-800 dark:text-gray-100">
              {writing.title}
            </h3>
            <p className="text-gray-600 dark:text-gray-300 text-sm mb-4 line-clamp-3">
              {writing.excerpt}
            </p>
            <p className="text-gray-500 dark:text-gray-400 text-xs mb-4">
              {writing.date}
            </p>
            {/* Tombol "Baca Selengkapnya" tidak lagi diperlukan di sini */}
          </div>
        ))}
      </div>

      {/* Render modal jika isModalOpen true dan ada selectedWritingId */}
      {isModalOpen && selectedWritingId !== null && (
        <WritingModal
          writingId={selectedWritingId}
          onClose={closeWritingModal}
        />
      )}
    </section>
  );
};

export default WritingsPage;
