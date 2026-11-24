import React from 'react';

export function JsonLd({ schema }: { schema: any }) {
  if (!schema) return null;
  const payload = schema['@context'] ? schema : { '@context': 'https://schema.org', ...schema };
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(payload) }}
    />
  );
}
