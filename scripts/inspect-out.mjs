import fs from 'fs';

function inspect(file) {
  console.log(`\n=======================================================`);
  console.log(`FILE: ${file}`);
  console.log(`=======================================================`);
  if (!fs.existsSync(file)) {
    console.log('FILE NOT FOUND!');
    return;
  }
  const html = fs.readFileSync(file, 'utf8');
  
  // Scripts
  const scripts = [...html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)];
  console.log(`JSON-LD Scripts count: ${scripts.length}`);
  scripts.forEach((s, idx) => {
    console.log(`\n--- RAW SCRIPT ${idx} ---`);
    console.log(s[1]);
  });

  // Check strings
  console.log('\n--- PAYMENT STRINGS IN HTML ---');
  console.log('Contains "SadaPay, NayaPay or Raast":', html.includes('SadaPay, NayaPay or Raast'));
  console.log('Contains "SadaPay, NayaPay, Raast or UBL":', html.includes('SadaPay, NayaPay, Raast or UBL'));
  console.log('Contains "SadaPay, NayaPay ya Raast":', html.includes('SadaPay, NayaPay ya Raast'));
  console.log('Contains "SadaPay, NayaPay, Raast ya UBL":', html.includes('SadaPay, NayaPay, Raast ya UBL'));

  // If FAQ exists, print FAQ section
  const faqSection = html.match(/<section id="faq"[\s\S]*?<\/section>/);
  if (faqSection) {
    console.log('\n--- VISIBLE FAQ SECTION ---');
    console.log(faqSection[0]);
  }
}

inspect('out/product/netflix-premium-4k-slot-1-month/index.html');
inspect('out/streaming/index.html');
inspect('out/faqs/index.html');
inspect('out/index.html');
