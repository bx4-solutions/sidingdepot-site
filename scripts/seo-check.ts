import fs from 'fs';
import path from 'path';

async function checkSeoFiles() {
  const results = {
    robots: { exists: false, content: '', issues: [] as string[] },
    sitemap: { exists: false, urlCount: 0, issues: [] as string[] },
    errors: [] as string[]
  };

  // Check robots.txt
  const robotsPath = path.join(process.cwd(), 'public/robots.txt');
  if (fs.existsSync(robotsPath)) {
    results.robots.exists = true;
    results.robots.content = fs.readFileSync(robotsPath, 'utf-8');
    if (!results.robots.content.includes('Sitemap:')) {
      results.robots.issues.push('Missing Sitemap declaration in robots.txt');
    }
  } else {
    results.errors.push('robots.txt not found');
  }

  // Check sitemap.xml
  const sitemapPath = path.join(process.cwd(), 'public/sitemap.xml');
  if (fs.existsSync(sitemapPath)) {
    results.sitemap.exists = true;
    const content = fs.readFileSync(sitemapPath, 'utf-8');
    const urls = content.match(/<loc>(.*?)<\/loc>/g) || [];
    results.sitemap.urlCount = urls.length;
    if (urls.length === 0) {
      results.sitemap.issues.push('Sitemap exists but contains no URLs');
    }
  } else {
    results.errors.push('sitemap.xml not found');
  }

  return results;
}

export const runSeoCheck = checkSeoFiles;
