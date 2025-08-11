// src/sanityClient.ts
import { createClient } from "@sanity/client";

export default createClient({
  projectId: process.env.SANITY_PROJECT_ID,
  dataset: process.env.SANITY_DATASET,
  useCdn: false, // Menggunakan CDN untuk fetching yang lebih cepat
  apiVersion: "v2021-10-21", // Gunakan versi API terbaru
});
