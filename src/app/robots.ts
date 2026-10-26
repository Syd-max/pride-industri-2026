import type { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/admin/', '/api/', '/check-in'],
    },
    sitemap: 'https://prideindustri.web.id/sitemap.xml',
  };
}
