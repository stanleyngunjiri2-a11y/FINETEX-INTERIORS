import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "FINETEX INTERIORS",
    short_name: "FINETEX",
    description:
      "Quality interior solutions designed to make your space beautiful, functional and uniquely yours.",
    start_url: "/",
    scope: "/",
    display: "standalone",
    background_color: "#f7f5f0",
    theme_color: "#b18a5a",
    orientation: "portrait-primary",
    icons: [
      {
        src: "/icons/icon-192.png",
        sizes: "192x192",
        type: "image/png",
      },
      {
        src: "/icons/icon-512.png",
        sizes: "512x512",
        type: "image/png",
      },
    ],
  };
}