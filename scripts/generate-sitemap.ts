import fs from 'fs';
import path from 'path';

const BASE_URL = 'https://sidingdepot.com';

const SERVICES = [
  'siding',
  'painting',
  'windows',
  'doors',
  'gutters',
  'deck',
  'roofing'
];

const CITIES = [
  'marietta',
  'alpharetta',
  'milton',
  'canton',
  'woodstock',
  'roswell',
  'kennesaw',
  'johns-creek',
  'sandy-springs',
  'acworth'
];

const ROUTES = [
  '/',
  '/contact',
  '/projects',
  '/guide',
  ...SERVICES.map(s => `/services/${s}`),
  ...CITIES.flatMap(c => SERVICES.map(s => `/locations/${c}/${s}`))
];

function generateSitemap() {
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${ROUTES.map(route => `  <url>
    <loc>${BASE_URL}${route}</loc>
    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>${route === '/' ? '1.0' : '0.8'}</priority>
  </url>`).join('\n')}
</urlset>`;

  fs.writeFileSync(path.join(process.cwd(), 'public/sitemap.xml'), xml);
  console.log('Sitemap generated at public/sitemap.xml');
}

generateSitemap();
