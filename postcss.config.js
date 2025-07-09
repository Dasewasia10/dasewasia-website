// postcss.config.js
export default {
  plugins: {
    tailwindcss: {}, // Ini adalah plugin Tailwind CSS itu sendiri
    autoprefixer: {}, // Ini untuk menambahkan prefix vendor CSS
    "@tailwindcss/typography": {}, // <<< PASTIKAN INI ADA DI SINI
  },
};
