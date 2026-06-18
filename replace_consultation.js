import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const TARGET_DIR = path.join(__dirname, 'src');

function walk(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach((file) => {
    file = path.join(dir, file);
    const stat = fs.statSync(file);
    if (stat && stat.isDirectory()) {
      results = results.concat(walk(file));
    } else {
      if (file.endsWith('.ts') || file.endsWith('.tsx')) {
        results.push(file);
      }
    }
  });
  return results;
}

const files = walk(TARGET_DIR);
console.log(`Found ${files.length} TypeScript files.`);

let replaceCount = 0;

files.forEach((file) => {
  let content = fs.readFileSync(file, 'utf8');
  let original = content;

  // Replace case-sensitive consultations
  content = content.replace(/\bConsultations\b/g, 'Estimates');
  content = content.replace(/\bconsultations\b/g, 'estimates');
  content = content.replace(/\bConsultation\b/g, 'Estimate');
  content = content.replace(/\bconsultation\b/g, 'estimate');

  if (content !== original) {
    fs.writeFileSync(file, content, 'utf8');
    console.log(`Updated: ${path.relative(TARGET_DIR, file)}`);
    replaceCount++;
  }
});

console.log(`Finished. Updated ${replaceCount} files.`);
