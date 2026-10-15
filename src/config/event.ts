/**
 * PRIDE Industri 2026 — Event Configuration
 * 
 * ORGANIZER: Update provisional values (marked [PROVISIONAL]) before launch.
 * This file is the single source of truth for all event details.
 */

export const EVENT_CONFIG = {
  name: 'PRIDE Industri 2026',
  fullName: 'Pagelaran Ragam Inovasi dan Eksistensi',
  organizer: 'PT Rahman Ramadhan Diandra (RRD Organizer)',
  hostPartner: 'Braga City Walk',

  // [PROVISIONAL] start time — confirm exact WIB start with organizer
  startDate: new Date('2026-11-27T09:00:00+07:00'),
  endDate: new Date('2026-11-28T21:00:00+07:00'),

  venue: {
    name: 'Braga City Walk',
    address: 'Jl. Braga No. 99–101, Braga, Kecamatan Sumur Bandung, Kota Bandung',
    city: 'Bandung',
    province: 'Jawa Barat',
    googleMapsUrl:
      'https://maps.google.com/?q=Braga+City+Walk+Bandung',
  },

  contact: {
    email: 'rumahkemasan.disdaginbdg@gmail.com',
    instagram: 'https://www.instagram.com/bdg.perdaganganindustri',
    instagramHandle: '@bdg.perdaganganindustri',
    tiktok: 'https://www.tiktok.com/@disdagin.bandung',
    tiktokHandle: '@disdagin.bandung',
  },

  hashtags: [
    '#disdaginkotabandung',
    '#kemilau',
    '#prideindustri2026',
    '#bdg',
    '#eventbandung',
    '#bandung',
  ],

  competitions: {
    desainKemasan: {
      id: 'desain-kemasan',
      slug: 'desain-kemasan',
      name: 'Lomba Desain Kemasan',
      shortName: 'Desain Kemasan',
      theme: 'Inovasi Desain Kemasan Ramah Lingkungan untuk Produk Kuliner Berbahan Dasar Lokal',
      category: 'Kuliner',
      prize: {
        total: 2_250_000,
        first: 1_000_000,
        second: 750_000,
        third: 500_000,
      },
      schedule: {
        registrationOpen: new Date('2026-10-21T00:00:00+07:00'),
        registrationClose: new Date('2026-11-21T23:59:59+07:00'),
        finalistAnnouncement: new Date('2026-11-25T00:00:00+07:00'),
        grandFinal: new Date('2026-11-28T00:00:00+07:00'),
      },
      documentPath: '/syarat-desain-kemasan.pdf',
      assetsLink: 'https://bit.ly/PRIDE2026LogodanVisualAssets',
    },
    videoLokal: {
      id: 'video-lokal',
      slug: 'video-lokal',
      name: 'Lomba Video 1 Menit',
      shortName: 'Video Lokal',
      theme: 'Karya Lokal, Cerita Lokal',
      categories: ['Fesyen', 'Kuliner', 'Kriya', 'PRIDE Industri 2026'],
      prize: {
        total: 2_250_000,
        first: 1_000_000,
        second: 750_000,
        third: 500_000,
      },
      schedule: {
        // [PROVISIONAL] No specific registration open date in documents — using event dates
        filming: 'Filming: 27–28 November 2026',
        publication: '27–28 November 2026',
        judging: '28 November 2026',
      },
      documentPath: '/syarat-video-lokal.pdf',
    },
  },

  // Check-in time window (matches event dates)
  checkin: {
    windowStart: new Date('2026-11-27T07:00:00+07:00'),
    windowEnd: new Date('2026-11-28T22:00:00+07:00'),
  },
} as const;

export type CompetitionId = 'desain-kemasan' | 'video-lokal';
