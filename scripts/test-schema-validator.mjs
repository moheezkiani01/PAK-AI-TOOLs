import fs from 'fs';

async function validateUrl(url) {
  const res = await fetch('https://validator.schema.org/validate', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({ url })
  });
  const text = await res.text();
  // Strip Google JSON protection prefix if present
  const cleanJson = text.startsWith(")]}'") ? text.slice(4).trim() : text;
  const parsed = JSON.parse(cleanJson);
  
  console.log(`\n==============================================`);
  console.log(`VALIDATOR.SCHEMA.ORG REPORT FOR: ${url}`);
  console.log(`==============================================`);
  
  let totalErrors = 0;
  let totalWarnings = 0;
  
  if (parsed.tripleGroups) {
    for (const group of parsed.tripleGroups) {
      for (const node of group.nodes || []) {
        const typeGroup = node.typeGroup;
        const errs = node.errors || [];
        if (errs.length > 0) {
          totalErrors += errs.length;
          console.log(`[ERROR] in ${typeGroup}:`, errs);
        }
        for (const prop of node.properties || []) {
          for (const val of prop.values || []) {
            if (val.errors && val.errors.length > 0) {
              totalErrors += val.errors.length;
              console.log(`[ERROR] in ${typeGroup} -> ${prop.name}:`, val.errors);
            }
          }
        }
      }
    }
  }
  console.log(`Total Errors: ${totalErrors}, Total Warnings: ${totalWarnings}`);
  return { totalErrors, totalWarnings };
}

async function run() {
  await validateUrl('https://pak-ai-tools.moheezkiani01.workers.dev/');
  await validateUrl('https://pak-ai-tools.moheezkiani01.workers.dev/faqs/');
  await validateUrl('https://pak-ai-tools.moheezkiani01.workers.dev/streaming/');
  await validateUrl('https://pak-ai-tools.moheezkiani01.workers.dev/product/netflix-premium-4k-slot-1-month/');
  await validateUrl('https://pak-ai-tools.moheezkiani01.workers.dev/product/claude-api-unlimited-1-day/');
}

run();
