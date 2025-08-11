// src/sanityClient.ts
import { createClient } from "@sanity/client";

export default createClient({
  projectId: "698jepkg", // Dapatkan dari sanity.json
  dataset: "production", // Nama dataset yang kamu gunakan
  useCdn: false, // Menggunakan CDN untuk fetching yang lebih cepat
  apiVersion: "v2021-10-21", // Gunakan versi API terbaru
});
