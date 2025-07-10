import React, { useState } from "react";
import { SocialIcon } from "react-social-icons"; // Contoh library ikon sosmed

const API_BASE_URL = "https://dasewasia.my.id/api/"; // Sesuaikan dengan URL backend Anda

const ConnectPage: React.FC = () => {
  const [name, setName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [message, setMessage] = useState<string>("");
  const [status, setStatus] = useState<
    "idle" | "loading" | "success" | "error"
  >("idle");
  const [responseMessage, setResponseMessage] = useState<string>("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); // Mencegah refresh halaman default

    setStatus("loading");
    setResponseMessage("");

    try {
      const response = await fetch(`${API_BASE_URL}send-email`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, email, message }),
      });

      const data = await response.json();

      if (response.ok) {
        setStatus("success");
        setResponseMessage(data.message || "Pesan Anda berhasil dikirim!");
        // Bersihkan formulir setelah berhasil
        setName("");
        setEmail("");
        setMessage("");
      } else {
        setStatus("error");
        setResponseMessage(
          data.message || "Gagal mengirim pesan. Silakan coba lagi."
        );
      }
    } catch (error) {
      console.error("Error saat mengirim formulir:", error);
      setStatus("error");
      setResponseMessage("Terjadi kesalahan jaringan. Silakan coba lagi.");
    }
  };

  return (
    <section className="py-8 flex flex-col md:flex-row items-center text-center w-full gap-4 justify-center h-full">
      <div>
        <h2 className="text-4xl font-bold mb-10 text-blue-600 dark:text-blue-400">
          Terhubung Dengan Saya
        </h2>

        <div className="mb-10 max-w-xl text-gray-700 dark:text-gray-300 text-lg">
          <p className="mb-4">
            Saya selalu terbuka untuk kolaborasi, proyek menarik, atau sekadar
            berbagi ide! Jangan ragu untuk menghubungi saya melalui platform
            berikut:
          </p>
          <p className="font-semibold text-blue-600 dark:text-blue-400 text-xl">
            dasesplace@gmail.com
          </p>
        </div>
        <div className="flex flex-wrap justify-center gap-6 mb-10">
          {/* Anda bisa menggunakan ikon SVG atau library seperti react-social-icons */}
          <SocialIcon
            url="https://linkedin.com/in/iwan-saputra-8a522a14a"
            target="_blank"
            fgColor="#fff"
            className="transform hover:scale-110 transition duration-300"
          />
          <SocialIcon
            url="https://github.com/Dasewasia10"
            target="_blank"
            fgColor="#fff"
            className="transform hover:scale-110 transition duration-300"
          />
          <SocialIcon
            url="https://x.com/dasewasia"
            target="_blank"
            fgColor="#fff"
            className="transform hover:scale-110 transition duration-300"
          />
          {/* Ikon Kustom untuk vgen.co */}
          <a
            href="https://vgen.co/dasewasia"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center w-12 h-12 rounded-full text-white dark:text-gray-900 shadow-md transform hover:scale-110 transition duration-300"
            aria-label="Visit vgen.co profile"
          >
            <img
              src="https://material.dasewasia.my.id/img/other/vgen_face_logo_ori.png"
              alt="vgen.co"
            />
          </a>
          {/* Tambahkan ikon untuk komis jika ada platformnya, atau buat ikon kustom */}
          {/* Contoh: <a href="link-komis" target="_blank" className="text-blue-500 hover:text-blue-700"><PencilIcon className="w-12 h-12" /></a> */}
        </div>
      </div>

      {/* Jika ingin ada formulir kontak */}
      <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-xl w-full max-w-lg">
        <h3 className="text-2xl font-semibold mb-6 text-gray-800 dark:text-gray-100">
          Kirim Pesan
        </h3>
        <form className="space-y-4" onSubmit={handleSubmit}>
          <div>
            <label
              htmlFor="name"
              className="block text-left text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              Nama Anda
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100"
            />
          </div>
          <div>
            <label
              htmlFor="email"
              className="block text-left text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              Email Anda
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100"
            />
          </div>
          {/* Honeypot field - SEMBUNYIKAN DENGAN CSS DI index.css atau dengan Tailwind */}
          <div style={{ display: "none" }}>
            {" "}
            {/* Atau gunakan className="hidden" di Tailwind */}
            <label htmlFor="hp-field">Jangan Isi Ini</label>
            <input
              type="text"
              id="hp-field"
              name="hp-field"
              value=""
              onChange={() => {}}
              tabIndex={-1}
              autoComplete="off"
            />
          </div>
          <div>
            <label
              htmlFor="message"
              className="block text-left text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              Pesan
            </label>
            <textarea
              id="message"
              name="message"
              rows={4}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100"
            ></textarea>
          </div>
          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-md shadow-md transition duration-300"
            disabled={status === "loading"} // Nonaktifkan tombol saat loading
          >
            {status === "loading" ? "Mengirim..." : "Kirim Pesan"}
          </button>

          {/* Pesan status */}
          {responseMessage && (
            <div
              className={`mt-4 p-3 rounded-md text-sm ${
                status === "success"
                  ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                  : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
              }`}
            >
              {responseMessage}
            </div>
          )}
        </form>
      </div>
    </section>
  );
};

export default ConnectPage;
