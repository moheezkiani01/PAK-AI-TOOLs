import React from 'react';
import {
  Sparkles,
  Palette,
  Film,
  Tv,
  ShieldCheck,
  WandSparkles,
  AudioLines,
  GraduationCap,
  Briefcase,
  CodeXml,
  Cloud,
  ShieldAlert,
  Fingerprint,
  Smartphone,
  Webhook,
  HelpCircle,
  LucideProps,
} from 'lucide-react';

const iconMap: Record<string, React.FC<LucideProps>> = {
  Sparkles,
  Palette,
  Film,
  Tv,
  ShieldCheck,
  WandSparkles,
  AudioLines,
  GraduationCap,
  Briefcase,
  CodeXml,
  Cloud,
  ShieldAlert,
  Fingerprint,
  Smartphone,
  Webhook,
};

export function CategoryIcon({ name, ...props }: { name: string } & LucideProps) {
  const Component = iconMap[name] || HelpCircle;
  return <Component aria-hidden="true" {...props} />;
}
