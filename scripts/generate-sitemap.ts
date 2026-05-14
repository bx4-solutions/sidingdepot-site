import fs from 'fs';
import { BLOG_POSTS } from '../src/data/blog-posts.ts';

const DOMAIN = 'https://sidingdepot.com';

const staticRoutes = [
  '',
  '/siding',
  '/painting',
  '/windows',
  '/blog',
  '/about',
  '/projects',
  '/contact',
  '/finance',
  '/reviews',
  '/gallery',
  '/lp/siding-marietta',
];

const generateSitemap = () => {
  const lastMod = new Date().toISOString().split('T')[0];
  
  let xml = '<?xml version="1.0" encoding="UTF-8"?>\n';
  xml += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.4.5">\n';

  // Add static routes
  staticRoutes.forEach(route => {
    xml += '  <url>\n';
    xml += `    <loc>${DOMAIN}${route}</loc>\n`;
    xml += `    <lastmod>${lastMod}</lastmod>\n`;
    xml += '    <changefreq>monthly</changefreq>\n';
    xml += '    <priority>0.8</priority>\n';
    xml += '  </url>\n';
  });

  // Add blog posts
  BLOG_POSTS.forEach(post => {
    if (post.status === 'published') {
      xml += '  <url>\n';
      xml += `    <loc>${DOMAIN}/blog/${post.slug}</loc>\n`;
      xml += `    <lastmod>${post.publishDate}</lastmod>\n`;
      xml += '    <changefreq>weekly</changefreq>\n';
      xml += '    <priority>0.7</priority>\n';
      xml += '  </url>\n';
    }
  });

  xml += '</urlset>';
  
  fs.writeFileSync('./public/sitemap.xml', xml);
  console.log('Sitemap generated successfully at ./public/sitemap.xml');
};

generateSitemap();
