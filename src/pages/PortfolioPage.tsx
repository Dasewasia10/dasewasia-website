import React from "react";

interface Project {
  id: number;
  title: string;
  description: string;
  imageUrl: string;
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
];

const PortfolioPage: React.FC = () => {
  return (
    <section className="py-8">
      <h2 className="text-4xl font-bold text-center mb-10 text-blue-600 dark:text-blue-400">
        Karya-Karya Saya
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {projects.map((project) => (
          <div
            key={project.id}
            className="bg-white dark:bg-gray-800 rounded-lg shadow-xl overflow-hidden transform transition duration-300 hover:scale-105 hover:shadow-2xl"
          >
            <img
              src={project.imageUrl}
              alt={project.title}
              className="w-full h-48 object-cover"
            />
            <div className="p-6">
              <h3 className="text-xl font-semibold mb-2 text-gray-800 dark:text-gray-100">
                {project.title}
              </h3>
              <p className="text-gray-600 dark:text-gray-300 text-sm mb-4">
                {project.description}
              </p>
              {project.link && (
                <a
                  href={project.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-full text-sm font-medium transition duration-300"
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
