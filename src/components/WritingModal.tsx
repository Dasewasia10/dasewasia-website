import React, { useEffect, useState } from "react";
import sanityClient from "../sanityClient";
import { PortableText } from "@portabletext/react";

// interface WritingDetail {
//   id: number;
//   title: string;
//   fullContent: string;
//   imageUrl?: string; // Opsional: URL gambar untuk tulisan
//   date: string;
// }

// interface WritingModalProps {
//   writingId: number;
//   onClose: () => void;
// }

interface WritingDetail {
  _id: string;
  title: string;
  body: any[]; // Sanity Portable Text
  mainImage: {
    asset: {
      _ref: string;
      url: string;
    };
  };
  publishedAt: string;
  slug: {
    current: string;
  };
}

interface WritingModalProps {
  writingSlug: string; // Ganti ID dengan slug agar URL lebih bersih
  onClose: () => void;
}

// const API_BASE_URL = "https://dasewasia.my.id/api/"; // Sesuaikan dengan URL backend Anda

const WritingModal: React.FC<WritingModalProps> = ({
  writingSlug,
  onClose,
}) => {
  const [writingDetail, setWritingDetail] = useState<WritingDetail | null>(
    null
  );
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // useEffect(() => {
  //   // Log untuk melacak kapan useEffect ini berjalan dan untuk ID apa
  //   console.log("WritingModal useEffect: fetching for ID", writingId);

  //   const fetchWritingDetail = async () => {
  //     setLoading(true);
  //     setError(null);
  //     setWritingDetail(null); // Reset detail sebelum fetch baru dimulai

  //     try {
  //       const response = await fetch(`${API_BASE_URL}writings/${writingId}`);
  //       if (!response.ok) {
  //         // Tangkap respons teks untuk informasi error yang lebih detail
  //         const errorBody = await response.text();
  //         console.error(
  //           `Fetch failed with status ${response.status}: ${errorBody}`
  //         );
  //         throw new Error(
  //           `HTTP error! status: ${response.status} - ${errorBody}`
  //         );
  //       }
  //       const data: WritingDetail = await response.json();
  //       setWritingDetail(data);
  //     } catch (err) {
  //       console.error("Gagal memuat detail tulisan:", err);
  //       setError("Gagal memuat konten tulisan. Silakan coba lagi.");
  //     } finally {
  //       setLoading(false);
  //       // Log status akhir setelah fetch selesai
  //       // Perhatikan: 'error' di sini mungkin masih nilai dari closure sebelumnya jika error baru saja di-set
  //       console.log(
  //         "WritingModal fetch finished. Loading:",
  //         false,
  //         "Error state after fetch:",
  //         error
  //       );
  //     }
  //   };

  //   if (writingId) {
  //     fetchWritingDetail();
  //   }
  // }, [writingId]);

  // Log di setiap render untuk melacak status komponen

  useEffect(() => {
    const fetchWritingDetail = async () => {
      // ... (loading state)
      try {
        // Query berdasarkan slug untuk mendapatkan detail tulisan
        const query = `*[_type == "writing" && slug.current == $writingSlug][0]{
                    _id,
                    title,
                    body,
                    publishedAt,
                    mainImage{
                        asset->{
                            _id,
                            url
                        }
                    },
                    "fullContent": body // Sanity Portable Text
                }`;
        const params = { writingSlug };
        const data: WritingDetail = await sanityClient.fetch(query, params);
        setWritingDetail(data);
      } catch (err) {
        console.error("Gagal memuat detail tulisan:", err);
        setError("Gagal memuat konten tulisan. Silakan coba lagi.");
      } finally {
        setLoading(false);
        // Log status akhir setelah fetch selesai
        // Perhatikan: 'error' di sini mungkin masih nilai dari closure sebelumnya jika error baru saja di-set
        console.log(
          "WritingModal fetch finished. Loading:",
          false,
          "Error state after fetch:",
          error
        );
      }
    };

    if (writingSlug) {
      fetchWritingDetail();
    }
  }, [writingSlug]);

  console.log(
    "WritingModal render: loading=",
    loading,
    "error=",
    error,
    "writingDetail=",
    writingDetail
  );

  if (loading) {
    console.log("WritingModal: Rendering loading state");
    return (
      <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-2xl p-8 max-w-2xl w-full text-center">
          <p className="text-lg text-gray-700 dark:text-gray-300">
            Memuat tulisan...
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    console.log("WritingModal: Rendering error state");
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
    console.log(
      "WritingModal: writingDetail is null, returning null (This indicates fetch failed silently or data is empty)"
    );
    return null;
  }

  console.log(
    "WritingModal: Rendering actual modal content for",
    writingDetail.title
  );
  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
      {" "}
      {/* <<< overflow-y-auto DIHAPUS DARI SINI */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-2xl p-6 md:p-8 max-w-3xl w-full relative transform transition-all duration-300 scale-95 animate-modal-in max-h-4/5 md:max-h-[90vh] overflow-y-auto">
        {" "}
        {/* <<< max-h-[90vh] dan overflow-y-auto DITAMBAHKAN DI SINI */}
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
          Tanggal: {writingDetail.publishedAt}
        </p>
        {/* Gambar (jika ada) */}
        {writingDetail.mainImage.asset.url && (
          <img
            src={writingDetail.mainImage.asset.url}
            alt={writingDetail.title}
            className="w-full h-64 object-cover rounded-lg mb-6 shadow-md"
            onError={(e) => {
              e.currentTarget.src = `https://placehold.co/600x400/cccccc/333333?text=Gambar+Gagal+Dimuat`;
              console.error(
                "Failed to load image within modal:",
                writingDetail.mainImage.asset.url
              );
            }}
          />
        )}
        {/* Isi Tulisan - Menggunakan dangerouslySetInnerHTML untuk HTML yang kaya */}
        {/* <div
          className="prose dark:prose-invert max-w-none text-gray-800 dark:text-gray-200 leading-relaxed"
          dangerouslySetInnerHTML={{ __html: writingDetail.body }}
        /> */}
        <div className="prose dark:prose-invert max-w-none text-gray-800 dark:text-gray-200 leading-relaxed">
          <PortableText
            value={writingDetail.body}
            // Tambahkan komponen kustom di sini jika kamu ingin mengubah cara rendering
            // misalnya untuk block code, video, atau audio.
            components={{
              // Ini hanya contoh, sesuaikan dengan kebutuhanmu
              block: {
                h1: ({ children }) => (
                  <h1 className="text-4xl my-4">{children}</h1>
                ),
                normal: ({ children }) => <p className="my-2">{children}</p>,
              },
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default WritingModal;
