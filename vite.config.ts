import path from 'node:path';
import { defineConfig, splitVendorChunkPlugin } from 'vite';
import { googleAnalyticsPlugin } from './build/vite-plugins/googleAnalytics';
import { createLocalizedHtmlPlugin } from './build/vite-plugins/localization/plugin';
import { removeHtmlCommentsPlugin } from './build/vite-plugins/removeHtmlComments';
import { updateSitemapLastmodPlugin } from './build/vite-plugins/updateSitemapLastmod';

const getAssetExtension = (assetName: string): string =>
  assetName.split('.').slice(-1)[0] ?? 'assets';

const getAssetDirectory = (extension: string): string => {
  if (/ttf|otf|eot|woff|woff2/i.test(extension)) {
    return 'fonts';
  }
  if (/png|jpe?g|svg|gif|tiff|bmp|ico/i.test(extension)) {
    return 'images';
  }
  return extension;
};

const getAssetFileName = (assetName: string | undefined): string => {
  const extension = getAssetExtension(assetName ?? '');
  return extension === 'css'
    ? 'assets/css/style.css'
    : `assets/${getAssetDirectory(extension)}/[name][extname]`;
};

export default defineConfig({
  root: './',
  appType: 'mpa',
  build: {
    outDir: './dist',
    rollupOptions: {
      output: {
        assetFileNames: ({ name }) => getAssetFileName(name),
        chunkFileNames: 'assets/js/vendor/[name].js',
        entryFileNames: 'assets/js/[name].js',
      },
      input: {
        main: path.resolve(process.cwd(), 'index.html'),
        contact: path.resolve(process.cwd(), 'contact.html'),
        privacy: path.resolve(process.cwd(), 'privacy.html'),
        notFound: path.resolve(process.cwd(), '404.html'),
      },
    },
  },
  plugins: [
    createLocalizedHtmlPlugin(),
    googleAnalyticsPlugin,
    removeHtmlCommentsPlugin,
    updateSitemapLastmodPlugin,
    splitVendorChunkPlugin(),
  ],
});
