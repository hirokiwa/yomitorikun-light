import type { Plugin } from 'vite';

const measurementId = 'G-JWLNCNBNLF';
const placeholder = '<meta data-build-placeholder="google-analytics">';
const googleAnalyticsTag = `<script async src="https://www.googletagmanager.com/gtag/js?id=${measurementId}"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag() { dataLayer.push(arguments); }
  gtag('js', new Date());
  gtag('config', '${measurementId}');
</script>`;

export const googleAnalyticsPlugin: Plugin = {
  name: 'google-analytics',
  apply: 'build',
  transformIndexHtml: (html) => html.replace(placeholder, googleAnalyticsTag),
};
