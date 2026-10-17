import { redirect } from 'next/navigation';

export default function CompetitionsRedirect() {
  redirect('/admin/qr-generator');
}
