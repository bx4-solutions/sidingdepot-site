import { BLOG_POSTS } from '../src/data/blog-posts';
import fs from 'fs';

const origin = 'https://sidingdepot.com';
const lastmod = new Date().toISOString().slice(0, 10);

const urls = BLOG_POSTS
  .filter(post => post.status === 'published')
  .map(post => {
    return `  <url>
    <loc>${origin}/blog/${post.slug}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.7</priority>
  </url>`;
  })
  .join('\n');

const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>`;

fs.writeFileSync('public/blog-sitemap.xml', sitemap);
console.log('Blog sitemap generated at public/blog-sitemap.xml');
