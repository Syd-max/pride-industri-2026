import type { MetadataRoute } from 'next';

const baseUrl = 'https://prideindustri.web.id';

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: baseUrl, changeFrequency: 'weekly', priority: 1 },
    { url: `${baseUrl}/competition/video-lokal`, changeFrequency: 'weekly', priority: 0.8 },
    { url: `${baseUrl}/competition/desain-kemasan`, changeFrequency: 'weekly', priority: 0.8 },
    { url: `${baseUrl}/privacy`, changeFrequency: 'yearly', priority: 0.2 },
  ];
}
