import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import sanityClient from "../sanityClient";
import { format } from "date-fns";

import SearchInput from "../components/SearchInput";
import Pagination from "../components/Pagination";

interface Writing {
  _id: string;
  title: string;
  excerpt: string;
  publishedAt: string;
  mainImage: {
    asset: {
      _ref: string; // Referensi gambar di Sanity
      url: string;
    };
  };
  slug: {
    current: string;
  };
}

// Kueri GROQ dengan pengurutan
const WRITINGS_QUERY = `*[_type == "writing" && defined(slug.current)]{
  _id,
  title,
  excerpt,
  publishedAt,
  slug,
  mainImage{
    asset->{
      _id,
      url
    }
  }
} | order(publishedAt desc)`;

const WritingsPage: React.FC = () => {
  const navigate = useNavigate();
  const [allWritings, setAllWritings] = useState<Writing[]>([]);
  const [loadingList, setLoadingList] = useState<boolean>(true);
  const [errorList, setErrorList] = useState<string | null>(null);

  // State untuk search dan pagination
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const itemsPerPage = 6; // Atur jumlah item per halaman

  // useEffect hook untuk mengambil daftar tulisan saat komponen pertama kali di-mount
  useEffect(() => {
    const fetchWritingsList = async () => {
      setLoadingList(true);
      setErrorList(null);

      try {
        const data: Writing[] = await sanityClient.fetch(WRITINGS_QUERY);
        setAllWritings(data);
      } catch (err) {
        console.error("Gagal memuat daftar tulisan:", err);
        setErrorList("Gagal memuat daftar tulisan. Silakan coba lagi.");
      } finally {
        setLoadingList(false);
      }
    };
    fetchWritingsList();
  }, []);
  const handleCardClick = (slug: string) => {
    navigate(`/writings/${slug}`);
  };

  // Logika Filter dan Pagination
  const filteredWritings = allWritings.filter(
    (writing) =>
      writing.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      writing.excerpt.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedWritings = filteredWritings.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  useEffect(() => {
    // Reset halaman ke 1 setiap kali filteredWritings berubah.
    // Ini memastikan kita tidak terjebak di halaman yang tidak ada.
    setCurrentPage(1);
  }, [filteredWritings.length]); // Pantau perubahan panjang daftar yang difilter

  // Handler untuk pencarian
  const handleSearch = (query: string) => {
    setSearchQuery(query);
    // setCurrentPage(1); // Kembali ke halaman 1 saat pencarian baru
  };

  // Handler untuk perubahan halaman
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  return (
    <section className="py-8">
      <h2 className="text-4xl font-bold text-center mb-10 text-blue-600 dark:text-blue-400">
        Tulisan-Tulisan Saya
      </h2>

      {/* Komponen Search */}
      <SearchInput onSearch={handleSearch} />

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
      ) : filteredWritings.length === 0 ? (
        // Tampilkan pesan jika tidak ada tulisan yang tersedia
        <div className="text-center text-lg text-gray-600 dark:text-gray-400">
          Tidak ada tulisan yang tersedia.
        </div>
      ) : (
        // Tampilkan daftar tulisan dalam grid jika data berhasil dimuat
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {paginatedWritings.map((writing) => (
            <div
              key={writing._id}
              className="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-6 transform transition duration-300 hover:scale-105 hover:shadow-2xl cursor-pointer"
              onClick={() => handleCardClick(writing.slug.current)} // Ketika kartu diklik, buka modal
            >
              {/* Tampilkan gambar jika ada */}
              {writing.mainImage.asset.url && (
                <img
                  src={writing.mainImage.asset.url}
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
                {format(new Date(writing.publishedAt), "HH:mm, dd/MM/yyyy")}
              </p>
            </div>
          ))}
        </div>
      )}

      {/* Komponen Pagination */}
      <Pagination
        currentPage={currentPage}
        totalItems={filteredWritings.length}
        itemsPerPage={itemsPerPage}
        onPageChange={handlePageChange}
      />
    </section>
  );
};

export default WritingsPage;
