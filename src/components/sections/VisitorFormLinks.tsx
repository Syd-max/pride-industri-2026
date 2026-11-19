import Link from 'next/link';
import { ChefHatIcon, SewingMachineIcon } from '@/components/ui/CompetitionWelcomeBanner';
import './visitor-form-links.css';

export default function VisitorFormLinks() {
  return (
    <section id="visitor-forms" aria-label="Form visitor PRIDE Industri 2026" className="visitor-form-links">
      <div className="visitor-form-links-grid">
        <Link href="/visitor-booth" className="visitor-form-card visitor-form-card-booth">
          <span className="visitor-form-card-content">
            <span className="visitor-form-card-title">Visitor<br />Booth</span>
            <span className="visitor-form-card-action">Isi Form</span>
          </span>
          <span aria-hidden="true" className="visitor-form-card-art"><SewingMachineIcon /></span>
        </Link>
        <Link href="/visitor-umum" className="visitor-form-card visitor-form-card-umum">
          <span className="visitor-form-card-content">
            <span className="visitor-form-card-title">Visitor<br />Umum</span>
            <span className="visitor-form-card-action">Isi Form</span>
          </span>
          <span aria-hidden="true" className="visitor-form-card-art"><ChefHatIcon /></span>
        </Link>
      </div>
    </section>
  );
}
