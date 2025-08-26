import React, { useState } from "react";
import { SocialIcon } from "react-social-icons";
import { FaGhost } from "react-icons/fa"; // Import ikon hantu dari react-icons

const API_BASE_URL = "https://dasewasia.my.id/api/";

const ConnectPage: React.FC = () => {
  const [message, setMessage] = useState<string>("");
  const [status, setStatus] = useState<
    "idle" | "loading" | "success" | "error"
  >("idle");
  const [responseMessage, setResponseMessage] = useState<string>("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (message.trim() === "") {
      setResponseMessage("Pesan tidak boleh kosong.");
      return;
    }

    setStatus("loading");
    setResponseMessage("");

    try {
      // Mengirim pesan dengan nama dan email kosong (anonim)
      const response = await fetch(`${API_BASE_URL}send-email`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: "Anonim",
          email: "anonim@anonim.com",
          message,
        }),
      });

      // Periksa apakah respons berhasil (status 200-299)
      if (response.ok) {
        const data = await response.json();
        setStatus("success");
        setResponseMessage(
          data.message || "Pesan anonim Anda berhasil dikirim!"
        );
        setMessage(""); // Bersihkan textarea setelah berhasil
      } else {
        // Tangani respons non-OK, misalnya status 400 atau 500
        const errorData = await response.json();
        setStatus("error");
        setResponseMessage(
          errorData.message || "Gagal mengirim pesan. Silakan coba lagi."
        );
      }
    } catch (error) {
      console.error("Error saat mengirim formulir:", error);
      setStatus("error");
      setResponseMessage("Terjadi kesalahan jaringan. Silakan coba lagi.");
    }
  };

  return (
    <section className="py-8 flex flex-col items-center text-center w-full min-h-full justify-center">
      <h2 className="text-4xl font-bold mb-6 text-blue-600 dark:text-blue-400">
        Kotak Saran Anonim
      </h2>

      <div className="flex items-center text-red-400 mb-6 px-4 py-2 bg-red-100 dark:bg-red-900 rounded-lg max-w-lg">
        <FaGhost className="text-2xl mr-2" />
        <p className="text-sm">
          Pesan yang Anda kirimkan bersifat anonim dan tidak ada jaminan akan
          dibalas.
        </p>
      </div>

      <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-xl w-full max-w-lg">
        <h3 className="text-2xl font-semibold mb-6 text-gray-800 dark:text-gray-100">
          Kirim Pesan Anonim
        </h3>
        <form className="space-y-4" onSubmit={handleSubmit}>
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
              rows={6}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Tulis pesan Anda di sini..."
              className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100"
            ></textarea>
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-md shadow-md transition duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={status === "loading" || message.trim() === ""}
          >
            {status === "loading" ? "Mengirim..." : "Kirim Pesan Anonim"}
          </button>

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

      <div className="mt-8">
        <p className="mb-4 text-gray-700 dark:text-gray-300 text-lg">
          Atau, Anda bisa tetap terhubung dengan saya melalui platform berikut:
        </p>
        <div className="flex flex-wrap justify-center gap-6">
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
        </div>
      </div>
    </section>
  );
};

export default ConnectPage;
