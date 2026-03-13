import type { MetadataRoute } from "next";
import { METROS_DATA } from "@/lib/city-data";

const BASE_URL = "https://prelaunch.tenseats.io";

export default function sitemap(): MetadataRoute.Sitemap {
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: BASE_URL + "/",
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1.0,
    },
    {
      url: BASE_URL + "/join",
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: BASE_URL + "/why-tenseats",
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: BASE_URL + "/launch",
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.8,
    },
  ];

  const cityPages: MetadataRoute.Sitemap = METROS_DATA.map((metro) => ({
    url: BASE_URL + "/cities/" + metro.name,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: 0.6,
  }));

  return [...staticPages, ...cityPages];
}
