import React, { useState, useEffect } from "react";
import WritingModal from "../components/WritingModal"; // Import komponen modal

interface Writing {
  id: number;
  title: string;
  excerpt: string;
  date: string;
  imageUrl?: string;
}

const API_BASE_URL = "https://dasewasia.my.id/api/";

const WritingsPage: React.FC = () => {
  const [writings, setWritings] = useState<Writing[]>([]);
  const [loadingList, setLoadingList] = useState<boolean>(true);
  const [errorList, setErrorList] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [selectedWritingId, setSelectedWritingId] = useState<number | null>(
    null
  );

  // useEffect hook untuk mengambil daftar tulisan saat komponen pertama kali di-mount
  useEffect(() => {
    const fetchWritingsList = async () => {
      setLoadingList(true); // Set loading menjadi true saat mulai fetch
      setErrorList(null); // Reset error sebelumnya

      try {
        // Lakukan fetch ke endpoint API yang mengembalikan daftar tulisan
        const response = await fetch(`${API_BASE_URL}writings`);

        // Periksa apakah respons berhasil (status code 2xx)
        if (!response.ok) {
          // Jika respons tidak OK, ambil teks error dari body respons
          const errorBody = await response.text();
          console.error(
            `Fetch failed with status ${response.status}: ${errorBody}`
          );
          throw new Error(
            `HTTP error! status: ${response.status} - ${errorBody}`
          );
        }

        // Parse respons JSON menjadi array objek Writing
        const data: Writing[] = await response.json();
        setWritings(data); // Simpan data tulisan ke state
      } catch (err) {
        // Tangani error jika fetch gagal
        console.error("Gagal memuat daftar tulisan:", err);
        setErrorList("Gagal memuat daftar tulisan. Silakan coba lagi.");
      } finally {
        // Set loading menjadi false setelah fetch selesai (baik berhasil maupun gagal)
        setLoadingList(false);
      }
    };

    fetchWritingsList(); // Panggil fungsi fetch saat komponen di-mount
  }, []); // Array dependensi kosong berarti efek ini hanya berjalan sekali (saat mount)

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
      {/* Kondisi rendering berdasarkan status loading dan error */}
      {loadingList ? (
        // Tampilkan pesan loading jika data masih dimuat
        <div className="text-center text-lg text-gray-600 dark:text-gray-400">
          Memuat daftar tulisan...
        </div>
      ) : errorList ? (
        // Tampilkan pesan error jika terjadi kesalahan
        <div className="text-center text-lg text-red-500">
          Error: {errorList}
        </div>
      ) : writings.length === 0 ? (
        // Tampilkan pesan jika tidak ada tulisan yang tersedia
        <div className="text-center text-lg text-gray-600 dark:text-gray-400">
          Tidak ada tulisan yang tersedia.
        </div>
      ) : (
        // Tampilkan daftar tulisan dalam grid jika data berhasil dimuat
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {writings.map((writing) => (
            <div
              key={writing.id}
              className="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-6 transform transition duration-300 hover:scale-105 hover:shadow-2xl cursor-pointer"
              onClick={() => openWritingModal(writing.id)} // Ketika kartu diklik, buka modal
            >
              {/* Tampilkan gambar jika ada */}
              {writing.imageUrl && (
                <img
                  src={writing.imageUrl}
                  alt={writing.title}
                  className="w-full h-40 object-cover rounded-md mb-4"
                  // Fallback gambar jika gagal dimuat
                  onError={(e) => {
                    e.currentTarget.src = `https://placehold.co/400x160/cccccc/333333?text=Gambar+Gagal`;
                  }}
                />
              )}
              {/* Judul tulisan */}
              <h3 className="text-xl font-semibold mb-2 text-gray-800 dark:text-gray-100">
                {writing.title}
              </h3>
              {/* Cuplikan tulisan */}
              <p className="text-gray-600 dark:text-gray-300 text-sm mb-4 line-clamp-3">
                {writing.excerpt}
              </p>
              {/* Tanggal tulisan */}
              <p className="text-gray-500 dark:text-gray-400 text-xs mb-4">
                {writing.date}
              </p>
            </div>
          ))}
        </div>
      )}

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
