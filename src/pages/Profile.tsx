import React from "react";

const HomePage: React.FC = () => {
  return (
    <section className="min-h-[calc(100vh-10rem)] md:min-h-full flex flex-col justify-center items-center text-center p-4">
      <h2 className="text-5xl md:text-6xl font-extrabold text-blue-600 dark:text-blue-400 mb-6 animate-fade-in">
        Selamat datang di Dasewasia's Page! Aku Dase!
      </h2>
      <span className="text-xl md:text-2xl leading-relaxed max-w-3xl text-gray-700 dark:text-gray-300 mb-8 animate-fade-in delay-200">
        Saya adalah seorang <strong>Freelancer</strong> dengan passion di bidang{" "}
        <strong>ilustrasi</strong>. Suka mengotak-atik kode,
        berkreasi, dan berbagi cerita melalui tulisan.
      </span>
      <div className="flex flex-wrap justify-center gap-4 animate-fade-in delay-400">
        <a
          href="portfolio" // Ganti dengan logika navigasi jika tidak pakai anchor
          className="bg-blue-500 hover:bg-blue-600 text-white px-8 py-3 rounded-full text-lg font-semibold shadow-lg transition duration-300 transform hover:scale-105"
        >
          Lihat Karya Saya
        </a>
        <a
          href="connect" // Ganti dengan logika navigasi jika tidak pakai anchor
          className="border-2 border-blue-500 text-blue-600 dark:text-blue-400 px-8 py-3 rounded-full text-lg font-semibold transition duration-300 hover:bg-blue-500 hover:text-white dark:hover:text-white"
        >
          Hubungi Saya
        </a>
      </div>
    </section>
  );
};

export default HomePage;
