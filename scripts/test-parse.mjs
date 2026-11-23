import fs from 'fs';
import path from 'path';

const content = fs.readFileSync('01_catalogue_indexable_pages.txt', 'utf8');

// Products are separated by ==================== PRODUCT #...
const productBlocks = content.split(/={40,}\r?\nPRODUCT #(\d+):\s*(.*?)\r?\n={40,}/g);

console.log('Split segments:', productBlocks.length);
// index 0 is file header
// then each product has 3 entries: match1 (id), match2 (title), block body
const products = [];
for (let i = 1; i < productBlocks.length; i += 3) {
  const id = parseInt(productBlocks[i]);
  const name = productBlocks[i + 1].trim();
  const body = productBlocks[i + 2];
  
  // Extract fields
  const statusMatch = body.match(/PAGE STATUS:\s*(.*?)(?:\r?\n|$)/);
  const canonicalMatch = body.match(/Canonical:\s*(.*?)(?:\s*\|\s*Parent:|$)/);
  const parentMatch = body.match(/Parent:\s*(.*?)(?:\r?\n|$)/);
  
  const seoTitleMatch = body.match(/1\.\s*SEO TITLE:\s*\r?\n(.*?)(?=\r?\n\r?\n2\.|\r?\n2\.)/s);
  const metaDescMatch = body.match(/2\.\s*META DESCRIPTION:\s*\r?\n(.*?)(?=\r?\n\r?\n3\.|\r?\n3\.)/s);
  const slugMatch = body.match(/3\.\s*URL SLUG:\s*\r?\n(.*?)(?=\r?\n\r?\n4\.|\r?\n4\.)/s);
  const h1Match = body.match(/4\.\s*H1:\s*\r?\n(.*?)(?=\r?\n\r?\n5\.|\r?\n5\.)/s);
  const ansMatch = body.match(/5\.\s*ANSWER-FIRST PARAGRAPH:\s*\r?\n(.*?)(?=\r?\n\r?\n6\.|\r?\n6\.)/s);
  
  // Quick facts table
  const qfMatch = body.match(/6\.\s*QUICK FACTS TABLE:\s*\r?\n([\s\S]*?)(?=\r?\n\r?\n7\.)/);
  
  // Content markdown
  const contentMatch = body.match(/7\.\s*PRODUCT PAGE CONTENT:\s*\r?\n([\s\S]*?)(?=\r?\n\r?\n8\.\s*FAQ:|\r?\n8\.\s*FAQ:)/);
  
  // FAQs
  const faqMatch = body.match(/8\.\s*FAQ:\s*\r?\n([\s\S]*?)(?=\r?\n\r?\n9\.\s*KEYWORD MAP:|\r?\n9\.\s*KEYWORD MAP:)/);
  
  // Schema JSON
  const schemaMatch = body.match(/11\.\s*JSON-LD SCHEMA:\s*\r?\n```json\s*([\s\S]*?)\s*```/);
  
  products.push({
    id,
    name,
    parent: parentMatch ? parentMatch[1].trim() : '',
    slug: slugMatch ? slugMatch[1].trim() : '',
    h1: h1Match ? h1Match[1].trim() : '',
    seoTitle: seoTitleMatch ? seoTitleMatch[1].trim() : '',
    metaDesc: metaDescMatch ? metaDescMatch[1].trim() : '',
    answer: ansMatch ? ansMatch[1].trim() : '',
    hasQuickFacts: !!qfMatch,
    hasContent: !!contentMatch,
    hasFaq: !!faqMatch,
    hasSchema: !!schemaMatch
  });
}

console.log('Parsed products:', products.length);
console.log('Missing slug:', products.filter(p => !p.slug).length);
console.log('Missing h1:', products.filter(p => !p.h1).length);
console.log('Missing answer:', products.filter(p => !p.answer).length);
console.log('Missing content:', products.filter(p => !p.hasContent).length);
console.log('Missing faq:', products.filter(p => !p.hasFaq).length);
console.log('Missing schema:', products.filter(p => !p.hasSchema).length);
if (products.length > 0) {
  console.log('Product #1:', products[0]);
}
