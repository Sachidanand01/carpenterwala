import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import XLSX from 'xlsx';
import { BLOG_POSTS } from '../lib/blog-data.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

console.log(`Found ${BLOG_POSTS.length} blog posts in lib/blog-data.js.`);

// Prepare data rows for spreadsheet
const rows = BLOG_POSTS.map((post, index) => ({
  id: index + 1,
  slug: post.slug || '',
  title: post.title || '',
  category: post.category || '',
  date: post.date || '',
  readTime: post.readTime || '',
  excerpt: (post.excerpt || '').trim(),
  content: (post.content || '').trim(),
  image: post.image || ''
}));

// Create Worksheet
const worksheet = XLSX.utils.json_to_sheet(rows);

// Configure column widths for optimal reading/editing in Excel
worksheet['!cols'] = [
  { wch: 6 },   // id
  { wch: 35 },  // slug
  { wch: 50 },  // title
  { wch: 20 },  // category
  { wch: 15 },  // date
  { wch: 12 },  // readTime
  { wch: 60 },  // excerpt
  { wch: 100 }, // content
  { wch: 60 }   // image
];

// Create Workbook
const workbook = XLSX.utils.book_new();
XLSX.utils.book_append_sheet(workbook, worksheet, 'Carpenterwala Blogs');

// Export to .xlsx
const excelPath = path.join(rootDir, 'blogs_export.xlsx');
XLSX.writeFile(workbook, excelPath);
console.log(`\x1b[32m✔ Excel file created successfully:\x1b[0m ${excelPath}`);

// Export to .csv (with UTF-8 BOM so Excel opens it with perfect unicode encoding)
const csvPath = path.join(rootDir, 'blogs_export.csv');
const csvContent = XLSX.utils.sheet_to_csv(worksheet);
fs.writeFileSync(csvPath, '\uFEFF' + csvContent, 'utf8');
console.log(`\x1b[32m✔ CSV file created successfully:\x1b[0m ${csvPath}`);
