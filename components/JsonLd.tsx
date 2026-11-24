import React from 'react';

interface JsonLdProps {
  data?: any;
  schema?: any;
}

export function JsonLd({ data, schema }: JsonLdProps) {
  const content = data ?? schema;
  if (!content) return null;
  const payload = content['@context'] ? content : { '@context': 'https://schema.org', ...content };
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(payload).replace(/</g, '\\u003c'),
      }}
    />
  );
}

export default JsonLd;
