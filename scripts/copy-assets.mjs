import fs from 'fs';
import path from 'path';

const sourceDir = 'C:/Users/Sachidanand.Singh/.gemini/antigravity-ide/brain/69a31cf3-e00d-4005-ad7c-8fa7a71a5970';
const targetDir = 'public/images';

const filesToCopy = [
  { src: 'plumbing_hero_banner_1788268959487.jpg', dest: 'plumbing-hero.jpg' },
  { src: 'electrical_hero_banner_1788268982172.jpg', dest: 'electrical-hero.jpg' }
];

for (const f of filesToCopy) {
  const srcPath = path.join(sourceDir, f.src);
  const destPath = path.join(targetDir, f.dest);
  if (fs.existsSync(srcPath)) {
    fs.copyFileSync(srcPath, destPath);
    console.log(`Copied ${f.src} to ${destPath}`);
  } else {
    console.error(`Source file not found: ${srcPath}`);
  }
}
