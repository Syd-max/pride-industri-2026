import type { CompetitionSlug } from '@/types';

export const attendanceCategory: Record<CompetitionSlug, string> = {
  'desain-kemasan': 'Desain Kemasan',
  'video-lokal': 'Video 1 Menit',
  'pengunjung-umum': 'Pengunjung Umum',
  'visitor-booth': 'Visitor Booth',
};

export function isCompetitionParticipant(slug: CompetitionSlug): boolean {
  return slug === 'desain-kemasan' || slug === 'video-lokal';
}

export function catalogLink(value: string | null | undefined): string | undefined {
  if (!value || /\s/.test(value) || !/^https?:\/\//i.test(value)) return undefined;
  try {
    const url = new URL(value);
    if (!url.hostname || url.username || url.password) return undefined;
    return url.href;
  } catch {
    return undefined;
  }
}
