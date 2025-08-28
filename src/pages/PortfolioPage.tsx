import React, { useState } from "react";

interface Project {
  id: number;
  title: string;
  description: string;
  imageUrl: string;
  isSecret?: boolean;
  link: string; // Opsional
}

const projects: Project[] = [
  {
    id: 1,
    title: "Polaris Idoly Pride",
    description:
      "Website berisi kumpulan informasi terkait dengan Idoly Pride, seperti karakter, card, lirik, dan lain-lain.",
    imageUrl: "https://wallpapercave.com/wp/wp8767116.jpg",
    link: "https://polaris.diveidolypapi.my.id/",
  },
  {
    id: 2,
    title: "Novel",
    description:
      "Dua novel hasil karangan saya, kisah di masa lalu dan kisah di masa kini. Kunjungi tab Writings untuk mulai membaca.",
    imageUrl: "https://material.dasewasia.my.id/img/other/novel_cover.png",
    link: "writings",
  },
  {
    id: 3,
    title: "Commission Art",
    description:
      "Kunjungi VGen saya untuk melakukan pesanan commission art, baik itu ilustrasi, fanart, atau lainnya. Untuk portofolio, lihat pada tab Gallery.",
    imageUrl: "https://material.dasewasia.my.id/img/other/comsheet.png",
    link: "https://vgen.co/dasewasia",
  },
  {
    id: 4,
    title: "IPxSG (Visual Novel)",
    description:
      "Sebuah proyek rahasia yang menggabungkan kisah Idoly Pride, Steins;Gate, Summertime Rendering, dan Seishun Buta Yarou. Tunggu pengumumannya...",
    imageUrl:
      "https://static.wikia.nocookie.net/idoly-pride/images/6/6f/Beginning_of_Lodestar.jpg", // Atau gambar placeholder yang relevan
    isSecret: true,
    link: "#", // Non-klik
  },
];

const PortfolioPage: React.FC = () => {
  const [isSecretRevealed, setIsSecretRevealed] = useState(false);

  const handleSecretClick = (event: React.MouseEvent<HTMLDivElement>) => {
    // Mencegah navigasi atau event lain
    event.preventDefault();
    event.stopPropagation();

    // Angkat status rahasia
    setIsSecretRevealed(true);
  };
  return (
    <section className="py-8">
      <h2 className="text-4xl font-bold text-center mb-10 text-blue-600 dark:text-blue-400">
        Karya-Karya Saya
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {projects.map((project) => (
          <div
            key={project.id}
            onClick={
              project.isSecret && !isSecretRevealed
                ? handleSecretClick
                : undefined
            }
            className={`
              bg-white dark:bg-gray-800 rounded-lg shadow-xl overflow-hidden transform transition duration-300
              ${project.isSecret && !isSecretRevealed ? "cursor-pointer" : ""}
              ${
                project.isSecret && !isSecretRevealed
                  ? ""
                  : "hover:scale-105 hover:shadow-2xl"
              }
            `}
          >
            <div
              className={`relative ${
                project.isSecret && !isSecretRevealed ? "" : ""
              }`}
            >
              <img
                src={project.imageUrl}
                alt={project.title}
                className={`w-full h-48 object-cover ${
                  project.isSecret && !isSecretRevealed
                    ? "grayscale blur-sm"
                    : ""
                }`}
              />
              {/* Overlay untuk teks "RAHASIA" */}
              {project.isSecret && !isSecretRevealed && (
                <div className="absolute inset-0 flex items-center justify-center bg-gray-900 bg-opacity-70 text-white font-bold text-2xl uppercase">
                  Rahasia
                </div>
              )}
            </div>

            <div
              className={`p-6 ${
                project.isSecret && !isSecretRevealed ? "opacity-50" : ""
              }`}
            >
              <h3 className="text-xl font-semibold mb-2 text-gray-800 dark:text-gray-100">
                {project.title}
              </h3>
              <p className="text-gray-600 dark:text-gray-300 text-sm mb-4">
                {project.description}
              </p>
              {project.link && (
                <a
                  href={project.link}
                  target={project.link.startsWith("http") ? "_blank" : "_self"}
                  rel="noopener noreferrer"
                  className={`inline-block bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-full text-sm font-medium transition duration-300
                    ${
                      project.isSecret && !isSecretRevealed
                        ? "pointer-events-none opacity-0"
                        : ""
                    }
                  `}
                >
                  Lihat Proyek
                </a>
              )}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default PortfolioPage;
