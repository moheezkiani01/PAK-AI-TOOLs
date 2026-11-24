import React from 'react';
import type { Metadata } from 'next';
import { BrandGrid } from '@/components/BrandGrid';
import type { BrandCardData } from '@/lib/brand-grid';

export const metadata: Metadata = {
  title: 'Brand Card Fixtures (Dev Test)',
  robots: {
    index: false,
    follow: false,
  },
};

const FIXTURE_CARDS: BrandCardData[] = [
  {
    slug: 'fixture-short',
    name: 'X',
    displayName: 'X',
    href: '/ai-chatbots/',
    logo: { src: '/brands/grok.png', alt: 'X logo', width: 40, height: 40 },
    planCount: 1,
    lowestPricePkr: 500,
    category: 'ai-chatbots',
    isMultiPlan: false,
  },
  {
    slug: 'fixture-normal',
    name: 'ChatGPT Plus',
    displayName: 'ChatGPT Plus',
    href: '/ai-chatbots/chatgpt/',
    logo: { src: '/brands/chatgpt.png', alt: 'ChatGPT Plus logo', width: 40, height: 40 },
    planCount: 9,
    lowestPricePkr: 1200,
    category: 'ai-chatbots',
    isMultiPlan: true,
  },
  {
    slug: 'fixture-60-chars',
    name: 'Super Long Enterprise AI Agent Suite With Multi Model Access',
    displayName: 'Super Long Enterprise AI Agent Suite With Multi Model Access',
    href: '/ai-chatbots/',
    logo: { src: '/brands/chatgpt.png', alt: 'Super Long Enterprise logo', width: 40, height: 40 },
    planCount: 4,
    lowestPricePkr: 4500,
    category: 'ai-chatbots',
    isMultiPlan: true,
  },
  {
    slug: 'fixture-parentheses',
    name: 'Autodesk All Apps (68 Applications)',
    displayName: 'Autodesk All Apps (68 Applications)',
    href: '/product/autodesk-all-apps-1-year/',
    logo: { src: '/brands/autodesk.png', alt: 'Autodesk logo', width: 40, height: 40 },
    planCount: 1,
    lowestPricePkr: 1200,
    category: 'design-creative',
    isMultiPlan: false,
  },
  {
    slug: 'fixture-single-plan',
    name: 'Canva Pro',
    displayName: 'Canva Pro',
    href: '/design-creative/canva/',
    logo: { src: '/brands/canva-pro.png', alt: 'Canva Pro logo', width: 40, height: 40 },
    planCount: 1,
    lowestPricePkr: 300,
    category: 'design-creative',
    isMultiPlan: false,
  },
  {
    slug: 'fixture-multi-plan',
    name: 'Claude Pro',
    displayName: 'Claude Pro',
    href: '/ai-apis/claude-api/',
    logo: { src: '/brands/claude.png', alt: 'Claude Pro logo', width: 40, height: 40 },
    planCount: 9,
    lowestPricePkr: 2500,
    category: 'ai-chatbots',
    isMultiPlan: true,
  },
  {
    slug: 'fixture-5-digit-price',
    name: 'MiniMax M Plan Explore',
    displayName: 'MiniMax M Plan Explore',
    href: '/product/minimax-m-plan-explore-1-month/',
    logo: { src: '/brands/minimax.png', alt: 'MiniMax logo', width: 40, height: 40 },
    planCount: 4,
    lowestPricePkr: 11000,
    category: 'ai-chatbots',
    isMultiPlan: false,
  },
];

export default function BrandCardFixturesPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-6">
      <div className="border-b border-separator pb-4">
        <h1 className="text-2xl font-bold text-text">Brand Card Equal-Height Fixtures</h1>
        <p className="text-sm text-text-secondary mt-1">
          Dev-only verification page testing 7 diverse card variations under CSS Grid auto-rows-fr.
        </p>
      </div>

      <BrandGrid brands={FIXTURE_CARDS} priorityCount={3} />
    </div>
  );
}
