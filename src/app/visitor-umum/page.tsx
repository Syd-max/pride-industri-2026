import type { Metadata } from 'next';
import VisitorForm from '@/components/forms/VisitorForm';

export const metadata: Metadata = {
  title: { absolute: 'Visitor Umum | PRIDE 2026' },
  description: 'Form Visitor Umum PRIDE Industri 2026.',
  alternates: { canonical: '/visitor-umum' },
};

export default function VisitorUmumFormPage() {
  return <VisitorForm type="umum" />;
}
