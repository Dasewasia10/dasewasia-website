import React, { useState, useEffect, useCallback } from "react";
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/solid";

// Data mock untuk kategori dan nama gambar.
const imageManifest: { [key: string]: string[] } = {
  fanart: ["gochiusa_collab", "kana", "yu_moshikoi"],
  commission: ["unxinus", "molen_pisang", "green_girl"],
  "1x1": ["chisa_2024", "sumire_2024", "shizuku_2025", "suzu_2025"],
};

const BASE_IMAGE_URL = "https://dasewasia.my.id/api/img/drawing";

const GalleryPage: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>("fanart");
  const [currentImageIndex, setCurrentImageIndex] = useState<number>(0);
  const [imagesInCurrentCategory, setImagesInCurrentCategory] = useState<
    string[]
  >([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [mainImageLoaded, setMainImageLoaded] = useState<boolean>(false);

  useEffect(() => {
    // Ketika kategori berubah, reset indeks dan perbarui daftar gambar
    setLoading(true);
    setError(null);
    setMainImageLoaded(false);
    const images = imageManifest[selectedCategory] || [];
    setImagesInCurrentCategory(images);
    setCurrentImageIndex(0);
    setLoading(false); 
  }, [selectedCategory]);

  // Fungsi untuk mendapatkan URL gambar
  const getImageUrl = useCallback(
    (category: string, imageName: string): string => {
      return `${BASE_IMAGE_URL}/${category}/${imageName}`;
    },
    []
  );

  // Fungsi untuk navigasi gambar
  const navigateImage = useCallback(
    (direction: "prev" | "next") => {
      if (imagesInCurrentCategory.length === 0) return;

      setMainImageLoaded(false);

      let newIndex = currentImageIndex;
      if (direction === "next") {
        newIndex = (currentImageIndex + 1) % imagesInCurrentCategory.length;
      } else {
        newIndex =
          (currentImageIndex - 1 + imagesInCurrentCategory.length) %
          imagesInCurrentCategory.length;
      }
      setCurrentImageIndex(newIndex);
    },
    [currentImageIndex, imagesInCurrentCategory.length]
  );

  // Handler untuk keyboard navigation (opsional)
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "ArrowLeft") {
        navigateImage("prev");
      } else if (event.key === "ArrowRight") {
        navigateImage("next");
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [navigateImage]);

  const currentImageName = imagesInCurrentCategory[currentImageIndex];
  const currentImageUrl = currentImageName
    ? getImageUrl(selectedCategory, currentImageName)
    : "";

  // Dapatkan gambar sebelumnya dan selanjutnya untuk pratinjau
  const getPreviewImage = (offset: number) => {
    if (imagesInCurrentCategory.length === 0) return "";
    const index =
      (currentImageIndex + offset + imagesInCurrentCategory.length) %
      imagesInCurrentCategory.length;
    return getImageUrl(selectedCategory, imagesInCurrentCategory[index]);
  };

  const prevImageUrl = getPreviewImage(-1);
  const nextImageUrl = getPreviewImage(1);

  return (
    <section className="px-4 md:px-0">
      <h2 className="text-4xl font-bold text-center mb-8 text-blue-600 dark:text-blue-400">
        Gegambaran Saya
      </h2>

      {/* Pemilihan Kategori */}
      <div className="mb-8 flex justify-center flex-wrap gap-3">
        {Object.keys(imageManifest).map((category) => (
          <button
            key={category}
            onClick={() => setSelectedCategory(category)}
            className={`px-5 py-2 rounded-full text-sm font-medium transition-all duration-300
              ${
                selectedCategory === category
                  ? "bg-blue-500 text-white shadow-md ring-2 ring-blue-300"
                  : "bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 hover:bg-blue-100 dark:hover:bg-blue-700"
              }`}
          >
            {category.charAt(0).toUpperCase() + category.slice(1)}{" "}
            {/* Kapitalisasi awal */}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="text-center text-lg text-gray-600 dark:text-gray-400">
          Memuat gambar...
        </div>
      ) : error ? (
        <div className="text-center text-lg text-red-500">Error: {error}</div>
      ) : imagesInCurrentCategory.length === 0 ? (
        <div className="text-center text-lg text-gray-600 dark:text-gray-400">
          Tidak ada gambar di kategori ini.
        </div>
      ) : (
        <div className="relative flex items-center justify-center h-[60vh] md:h-[70vh] w-full max-w-5xl mx-auto bg-gray-100 dark:bg-gray-800 rounded-lg shadow-xl p-4 md:p-6">
          {/* Tombol Navigasi Kiri */}
          <button
            onClick={() => navigateImage("prev")}
            className="absolute left-2 md:left-4 z-10 p-2 rounded-full bg-black bg-opacity-40 hover:bg-opacity-60 text-white transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
            aria-label="Previous image"
          >
            <ChevronLeftIcon className="w-8 h-8" />
          </button>

          {/* Gambar Pratinjau Kiri */}
          <div
            onClick={() => navigateImage("prev")}
            className="absolute left-16 md:left-24 w-24 h-24 md:w-32 md:h-32 overflow-hidden rounded-lg shadow-md cursor-pointer transition-all duration-300 transform hover:scale-105 opacity-70 hover:opacity-100"
          >
            <img
              src={prevImageUrl}
              alt="Previous"
              className="w-full h-full object-cover"
              onError={(e) => {
                e.currentTarget.src = `https://placehold.co/128x128/cccccc/333333?text=Error`;
              }}
            />
          </div>

          {/* Gambar Utama yang Difokuskan */}
          <div className="flex-1 flex justify-center items-center mx-auto max-w-[calc(100%-12rem)] md:max-w-[calc(100%-20rem)] h-full">
            <img
              src={currentImageUrl}
              alt={currentImageName}
              className={`max-w-4/5 max-h-[calc(60vh-2rem)] md:max-h-[calc(70vh-2rem)] object-contain rounded-lg shadow-2xl border-4 border-blue-500 transition-all duration-500 ease-in-out ${
                mainImageLoaded ? "opacity-100 scale-100" : "opacity-0 scale-95"
              }`}
              onLoad={() => setMainImageLoaded(true)}
              onError={(e) => {
                e.currentTarget.src = `https://placehold.co/600x400/ff0000/ffffff?text=Image+Failed+to+Load`;
                setError("Gagal memuat gambar utama.");
                setMainImageLoaded(true); // Tetap tampilkan placeholder
              }}
            />
          </div>

          {/* Gambar Pratinjau Kanan */}
          <div
            onClick={() => navigateImage("next")}
            className="absolute right-16 md:right-24 w-24 h-24 md:w-32 md:h-32 overflow-hidden rounded-lg shadow-md cursor-pointer transition-all duration-300 transform hover:scale-105 opacity-70 hover:opacity-100"
          >
            <img
              src={nextImageUrl}
              alt="Next"
              className="w-full h-full object-cover"
              onError={(e) => {
                e.currentTarget.src = `https://placehold.co/128x128/cccccc/333333?text=Error`;
              }}
            />
          </div>

          {/* Tombol Navigasi Kanan */}
          <button
            onClick={() => navigateImage("next")}
            className="absolute right-2 md:right-4 z-10 p-2 rounded-full bg-black bg-opacity-40 hover:bg-opacity-60 text-white transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
            aria-label="Next image"
          >
            <ChevronRightIcon className="w-8 h-8" />
          </button>
        </div>
      )}
    </section>
  );
};

export default GalleryPage;
