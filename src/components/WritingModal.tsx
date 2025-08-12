// src/components/WritingModal.tsx

import React, { useEffect, useState, useRef } from "react";
import StyledText from "./StyledText";

import sanityClient from "../sanityClient";
import { PortableText } from "@portabletext/react";
import { urlFor } from "../imageUrl";
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
  glossary?: {
    term: string;
    definition: string;
    slug: { current: string }; // Tambahkan slug di interface
  }[];
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

  // Buat ref untuk modal content, agar bisa mendeteksi klik di luarnya
  const modalRef = useRef<HTMLDivElement>(null);

  // State baru untuk mengelola tooltip yang aktif
  const [activeTooltip, setActiveTooltip] = useState<string | null>(null);
  const hoverTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Fungsi untuk menampilkan tooltip
  const showTooltip = (termSlug: string) => {
    if (hoverTimer.current) {
      clearTimeout(hoverTimer.current);
    }
    hoverTimer.current = setTimeout(() => {
      setActiveTooltip(termSlug);
    }, 500);
  };

  // Fungsi untuk menyembunyikan tooltip
  const hideTooltip = () => {
    if (hoverTimer.current) {
      clearTimeout(hoverTimer.current);
    }
    setActiveTooltip(null);
  };

  useEffect(() => {
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
          body[]{
            ...,
            markDefs[]{
              ...,
              _type == "glossaryTerm" => {
                // Ikuti referensi dan ambil data yang dibutuhkan
                "termRef": termRef->{
                  term,
                  definition,
                  slug
                }
              }
            }
          },
          publishedAt,
          mainImage{
            asset->{
              _id,
              url
            }
          },
        }`;

        const params = { writingSlug };
        const data: WritingDetail = await sanityClient.fetch(query, params);

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
      }
    };

    fetchWritingDetail();
  }, [writingSlug]);

  // Efek untuk mendeteksi klik di luar modal
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        modalRef.current &&
        !modalRef.current.contains(event.target as Node)
      ) {
        onClose();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [onClose]);

  if (loading) {
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
    return null;
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
      <div
        ref={modalRef}
        className="bg-white dark:bg-gray-800 rounded-lg shadow-2xl p-6 md:p-8 max-w-3xl w-full relative transform transition-all duration-300 scale-95 animate-modal-in max-h-[90vh] overflow-y-auto"
      >
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
          {format(new Date(writingDetail.publishedAt), "HH:mm, dd/MM/yyyy")}
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
        <div className="prose dark:prose-invert max-w-none text-gray-800 dark:text-gray-200 leading-relaxed text-justify">
          <PortableText
            value={writingDetail.body}
            components={{
              block: {
                h1: ({ children }) => (
                  <h1 className="text-4xl font-bold my-4">{children}</h1>
                ),
                h2: ({ children }) => (
                  <h2 className="text-3xl font-semibold my-3">{children}</h2>
                ),
                h3: ({ children }) => (
                  <h3 className="text-2xl font-semibold my-2">{children}</h3>
                ),
                // Tambahkan class mb-4 di paragraf untuk spasi bawah
                normal: ({ children }) => (
                  <p className="my-2 leading-relaxed mb-4">
                    <StyledText>{children}</StyledText>
                  </p>
                ),
                blockquote: ({ children }) => (
                  <blockquote className="border-l-4 border-blue-500 dark:border-blue-400 pl-4 my-4 italic text-gray-600 dark:text-gray-300">
                    {children}
                  </blockquote>
                ),
                dialogue: ({ children }) => (
                  <p className="my-4 italic leading-relaxed text-gray-700 dark:text-gray-300">
                    {children}
                  </p>
                ),
              },
              // Konfigurasi untuk tipe kustom (seperti pageBreak)
              types: {
                pageBreak: ({ value }) => {
                  if (value.breakType === "doubleRule") {
                    return (
                      <hr className="my-8 border-t-2 border-gray-400 dark:border-gray-500" />
                    );
                  }
                  return (
                    <hr className="my-8 border-t border-gray-300 dark:border-gray-600" />
                  );
                },
                // Tambahkan custom component untuk gambar dan file jika perlu
                image: ({ value }) => (
                  <img
                    src={urlFor(value).url()}
                    alt={value.alt || "Gambar dari tulisan"}
                    className="my-6 mx-auto w-full max-w-lg rounded-lg shadow-md"
                  />
                ),
                file: ({ value }) => (
                  <div className="my-4 p-4 border rounded-md bg-gray-100 dark:bg-gray-700">
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Audio:
                    </p>
                    <audio controls className="w-full mt-2">
                      <source src={value.asset.url} />
                      Your browser does not support the audio element.
                    </audio>
                    {value.caption && (
                      <p className="text-center text-xs mt-2 text-gray-500 dark:text-gray-400">
                        {value.caption}
                      </p>
                    )}
                  </div>
                ),
                dialogueBlock: ({ value }) => (
                  <div className="my-4 p-4 border-l-4 border-blue-500 italic text-xl leading-relaxed text-gray-700 dark:text-gray-300">
                    <PortableText
                      value={value.dialogue}
                      components={{
                        block: {
                          normal: ({ children }) => <p>{children}</p>,
                        },
                      }}
                    />
                  </div>
                ),
              },
              // Konfigurasi untuk decorators (strong, em, code) dan annotations (link)
              marks: {
                link: ({ children, value }) => (
                  <a
                    href={value.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 dark:text-blue-400 hover:underline"
                  >
                    {children}
                  </a>
                ),
                strong: ({ children }) => (
                  <strong className="font-bold">{children}</strong>
                ),
                em: ({ children }) => <em className="italic">{children}</em>,
                code: ({ children }) => (
                  <code className="bg-gray-200 dark:bg-gray-700 rounded-md px-1 py-0.5 text-red-600 dark:text-red-400">
                    {children}
                  </code>
                ),
                glossaryTerm: ({ children, value }) => {
                  const term = value.termRef;
                  if (!term) return children;

                  const isTooltipActive = activeTooltip === term.slug.current;

                  return (
                    <span
                      className="font-semibold underline cursor-pointer hover:text-blue-500 relative"
                      onMouseEnter={() => showTooltip(term.slug.current)}
                      onMouseLeave={hideTooltip}
                      onClick={() => {
                        // Jika sudah diklik, hilangkan. Jika belum, tampilkan.
                        if (isTooltipActive) {
                          hideTooltip();
                        } else {
                          setActiveTooltip(term.slug.current);
                        }
                      }}
                    >
                      {children}
                      {isTooltipActive && (
                        <div className="absolute top-full left-0 mt-2 z-50 p-4 w-64 lg:w-80 bg-gray-900 text-white rounded-lg shadow-2xl transition-opacity duration-300">
                          <h4 className="font-bold text-lg mb-1">
                            {term.term}
                          </h4>
                          <p className="text-sm text-left">{term.definition}</p>
                        </div>
                      )}
                    </span>
                  );
                },
              },
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default WritingModal;
