// src/components/WritingModal.tsx

import React, { useEffect, useState } from "react";
import sanityClient from "../sanityClient";
import { PortableText } from "@portabletext/react";
import { format } from "date-fns";

interface WritingDetail {
  _id: string;
  title: string;
  body: any[];
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
  writingSlug: string;
  onClose: () => void;
}

const WritingModal: React.FC<WritingModalProps> = ({
  writingSlug,
  onClose,
}) => {
  const [writingDetail, setWritingDetail] = useState<WritingDetail | null>(
    null
  );
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    console.log("WritingModal useEffect triggered. Slug:", writingSlug);

    const fetchWritingDetail = async () => {
      setLoading(true);
      setError(null);
      setWritingDetail(null);

      // Cek apakah slug valid sebelum fetching
      if (!writingSlug) {
        console.error("No writingSlug provided. Cannot fetch.");
        setError("Slug tulisan tidak ditemukan.");
        setLoading(false);
        return;
      }

      try {
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
          }
        }`;

        const params = { writingSlug };
        console.log("Fetching with query:", query, "and params:", params);

        const data: WritingDetail = await sanityClient.fetch(query, params);

        console.log("Data fetched from Sanity:", data);

        if (data) {
          setWritingDetail(data);
        } else {
          // Jika data null/kosong, berarti tidak ada tulisan dengan slug tersebut
          setError("Tulisan tidak ditemukan.");
        }
      } catch (err) {
        console.error("Gagal memuat detail tulisan:", err);
        setError("Gagal memuat konten tulisan. Silakan coba lagi.");
      } finally {
        setLoading(false);
        console.log("WritingModal fetch finished. Loading:", false);
      }
    };

    fetchWritingDetail();
  }, [writingSlug]);

  console.log(
    "WritingModal render: loading=",
    loading,
    "error=",
    error,
    "writingDetail=",
    writingDetail ? writingDetail.title : "null"
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
    console.log("WritingModal: writingDetail is null. Returning null.");
    return null;
  }

  console.log(
    "WritingModal: Rendering actual modal content for",
    writingDetail.title
  );
  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-2xl p-6 md:p-8 max-w-3xl w-full relative transform transition-all duration-300 scale-95 animate-modal-in max-h-[90vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-800 dark:hover:text-gray-200 text-3xl font-bold"
          aria-label="Close modal"
        >
          &times;
        </button>
        <h2 className="text-3xl font-bold mb-4 text-blue-600 dark:text-blue-400">
          {writingDetail.title}
        </h2>
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
          {format(new Date(writingDetail.publishedAt), 'HH:mm, dd/MM/yyyy')}
        </p>
        {writingDetail.mainImage?.asset?.url && (
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
        <div className="prose dark:prose-invert max-w-none text-gray-800 dark:text-gray-200 leading-relaxed">
          <PortableText
            value={writingDetail.body}
            components={{
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
