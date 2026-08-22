import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import XLSX from 'xlsx';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

const excelPath = path.join(rootDir, 'blogs_export.xlsx');
const csvPath = path.join(rootDir, 'blogs_export.csv');
const blogDataJsPath = path.join(rootDir, 'lib', 'blog-data.js');

let filePathToRead = null;
if (fs.existsSync(excelPath)) {
  filePathToRead = excelPath;
} else if (fs.existsSync(csvPath)) {
  filePathToRead = csvPath;
}

if (!filePathToRead) {
  console.error('\x1b[31m✖ No blogs_export.xlsx or blogs_export.csv found to import.\x1b[0m');
  process.exit(1);
}

console.log(`Reading updated blogs from: ${filePathToRead}`);
const workbook = XLSX.readFile(filePathToRead);
const sheetName = workbook.SheetNames[0];
const rawRows = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName]);

if (!rawRows || rawRows.length === 0) {
  console.error('\x1b[31m✖ No rows found in the sheet.\x1b[0m');
  process.exit(1);
}

const cleanedPosts = rawRows.map(row => ({
  slug: String(row.slug || '').trim(),
  title: String(row.title || '').trim(),
  excerpt: String(row.excerpt || '').trim(),
  category: String(row.category || '').trim(),
  date: String(row.date || '').trim(),
  readTime: String(row.readTime || '').trim(),
  image: String(row.image || '').trim(),
  content: String(row.content || '').trim()
})).filter(post => post.slug && post.title);

console.log(`Parsed ${cleanedPosts.length} valid blog posts.`);

// Create a backup of existing blog-data.js
if (fs.existsSync(blogDataJsPath)) {
  const backupPath = path.join(rootDir, 'lib', `blog-data.backup-${Date.now()}.js`);
  fs.copyFileSync(blogDataJsPath, backupPath);
  console.log(`Backup created at: ${backupPath}`);
}

// Generate new JS content
const fileHeader = `// Auto-generated blog database from Excel/CSV export
// Generated on: ${new Date().toISOString()}

export const BLOG_POSTS = [
`;

const postEntries = cleanedPosts.map(post => {
  return `  {
    slug: ${JSON.stringify(post.slug)},
    title: ${JSON.stringify(post.title)},
    excerpt: ${JSON.stringify(post.excerpt)},
    category: ${JSON.stringify(post.category)},
    date: ${JSON.stringify(post.date)},
    readTime: ${JSON.stringify(post.readTime)},
    image: ${JSON.stringify(post.image)},
    content: \`
${post.content.replace(/`/g, '\\`').replace(/\${/g, '\\${')}
\`
  }`;
}).join(',\n');

const fileFooter = `\n];\n`;

const finalCode = fileHeader + postEntries + fileFooter;

fs.writeFileSync(blogDataJsPath, finalCode, 'utf8');
console.log(`\x1b[32m✔ Successfully updated lib/blog-data.js with ${cleanedPosts.length} blog posts!\x1b[0m`);
