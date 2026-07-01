const fs = require('fs');
const content = fs.readFileSync('lib/blog-data.js', 'utf8');

// A crude parser to extract slug and content from the BLOG_POSTS array
const postsMatches = content.matchAll(/slug:\s*'([^']+)',[\s\S]*?content:\s*`([\s\S]*?)`/g);

let count = 0;
for (const match of postsMatches) {
  const slug = match[1];
  const body = match[2];
  const hasH2 = body.includes('<h2>') || body.includes('<h2');
  count++;
  if (!hasH2) {
    console.log(`NO H2 in post: ${slug}`);
  } else {
    console.log(`Has H2 in post: ${slug}`);
  }
}
console.log(`Total parsed posts: ${count}`);
