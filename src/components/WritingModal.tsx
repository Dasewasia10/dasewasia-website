import React, { useEffect, useState } from "react";

interface WritingDetail {
  id: number;
  title: string;
  fullContent: string;
  imageUrl?: string; // Opsional: URL gambar untuk tulisan
  date: string;
}

interface WritingModalProps {
  writingId: number;
  onClose: () => void;
}

const API_BASE_URL = "https://dasewasia.my.id/api/"; // Sesuaikan dengan URL backend Anda

const WritingModal: React.FC<WritingModalProps> = ({ writingId, onClose }) => {
  const [writingDetail, setWritingDetail] = useState<WritingDetail | null>(
    null
  );
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchWritingDetail = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch(`${API_BASE_URL}writings/${writingId}`);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data: WritingDetail = await response.json();
        setWritingDetail(data);
      } catch (err) {
        console.error("Gagal memuat detail tulisan:", err);
        setError("Gagal memuat konten tulisan. Silakan coba lagi.");
      } finally {
        setLoading(false);
      }
    };

    if (writingId) {
      fetchWritingDetail();
    }
  }, [writingId]); // Panggil ulang saat writingId berubah

  if (loading) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-2xl p-8 max-w-2xl w-full text-center">
          <p className="text-lg text-gray-700 dark:text-gray-300">
            Memuat tulisan...
          </p>
          {/* Anda bisa menambahkan spinner loading di sini */}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-2xl p-8 max-w-2xl w-full text-center">
          <p className="text-lg text-red-500">{error}</p>
          <button
            onClick={onClose}
            className="mt-4 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md"
          >
            Tutup
          </button>
        </div>
      </div>
    );
  }

  if (!writingDetail) {
    return null; // Atau tampilkan pesan "Tulisan tidak ditemukan"
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4 overflow-y-auto">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-2xl p-6 md:p-8 max-w-3xl w-full relative transform transition-all duration-300 scale-95 opacity-0 animate-modal-in">
        {/* Tombol Tutup */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-800 dark:hover:text-gray-200 text-3xl font-bold"
          aria-label="Close modal"
        >
          &times;
        </button>

        {/* Header */}
        <h2 className="text-3xl font-bold mb-4 text-blue-600 dark:text-blue-400">
          {writingDetail.title}
        </h2>
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
          Tanggal: {writingDetail.date}
        </p>

        {/* Gambar (jika ada) */}
        {writingDetail.imageUrl && (
          <img
            src={writingDetail.imageUrl}
            alt={writingDetail.title}
            className="w-full h-24 object-cover rounded-lg mb-6 shadow-md"
            onError={(e) => {
              e.currentTarget.src = `https://placehold.co/600x400/cccccc/333333?text=Gambar+Gagal+Dimuat`;
            }}
          />
        )}

        {/* Isi Tulisan */}
        <div className="prose dark:prose-invert max-w-none text-gray-800 dark:text-gray-200 leading-relaxed">
          {/* Menggunakan dangerouslySetInnerHTML jika konten berasal dari HTML/Markdown */}
          <p>{writingDetail.fullContent}</p>
          {/* Atau jika konten adalah HTML yang aman, gunakan: */}
          {/* <div dangerouslySetInnerHTML={{ __html: writingDetail.fullContent }} /> */}
        </div>
      </div>
    </div>
  );
};

export default WritingModal;
