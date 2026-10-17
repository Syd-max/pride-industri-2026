import { redirect } from 'next/navigation';

export default function CheckInsRedirect() {
  redirect('/admin/participants');
}
