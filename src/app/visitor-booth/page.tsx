import type { Metadata } from 'next';
import VisitorForm from '@/components/forms/VisitorForm';

export const metadata: Metadata = {
  title: { absolute: 'Visitor Booth | PRIDE 2026' },
  description: 'Form Visitor Booth PRIDE Industri 2026 untuk data usaha dan konsultasi.',
  alternates: { canonical: '/visitor-booth' },
};

export default function VisitorBoothFormPage() {
  return <VisitorForm type="booth" />;
}
