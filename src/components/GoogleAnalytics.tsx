'use client';

import Script from 'next/script';

const GA_MEASUREMENT_ID = 'G-M81BBJFFL2';

/**
 * Google Analytics 4 — loads gtag.js once for all routes.
 * Placed in the root layout so every page (/, /admin, /competition, /check-in)
 * is tracked automatically. Uses next/script "afterInteractive" to avoid
 * blocking the page render.
 */
export default function GoogleAnalytics() {
  return (
    <>
      {/* Load the gtag.js library */}
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`}
        strategy="afterInteractive"
      />

      {/* Initialise GA4 and send the first page_view */}
      <Script
        id="ga4-init"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${GA_MEASUREMENT_ID}', {
              page_path: window.location.pathname,
              send_page_view: true
            });
          `,
        }}
      />
    </>
  );
}
