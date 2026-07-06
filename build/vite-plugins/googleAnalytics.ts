import type { Plugin } from 'vite';

const measurementId = 'G-JWLNCNBNLF';

export const googleAnalyticsPlugin: Plugin = {
  name: 'google-analytics',
  apply: 'build',
  transformIndexHtml: (html) => ({
    html,
    tags: [
      {
        tag: 'script',
        attrs: {
          async: true,
          src: `https://www.googletagmanager.com/gtag/js?id=${measurementId}`,
        },
        injectTo: 'head',
      },
      {
        tag: 'script',
        children: `
          window.dataLayer = window.dataLayer || [];
          function gtag() { dataLayer.push(arguments); }
          gtag('js', new Date());
          gtag('config', '${measurementId}');
        `.trim(),
        injectTo: 'head',
      },
    ],
  }),
};
