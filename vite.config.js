import { defineConfig, splitVendorChunkPlugin } from 'vite';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  root: './', //開発ディレクトリ設定
  build: {
    outDir: './dist', //出力場所の指定
    rollupOptions: { //ファイル出力設定
      output: {
        assetFileNames: (assetInfo) => {
          let extType = assetInfo.name.split('.')[1];
          //Webフォントファイルの振り分け
          if (/ttf|otf|eot|woff|woff2/i.test(extType)) {
            extType = 'fonts';
          }
          if (/png|jpe?g|svg|gif|tiff|bmp|ico/i.test(extType)) {
            extType = 'images';
          }
          //ビルド時のCSS名を明記してコントロールする
          if(extType === 'css') {
            return `assets/css/style.css`;
          }
          return `assets/${extType}/[name][extname]`;
        },
        chunkFileNames: 'assets/js/vendor/[name].js',
        entryFileNames: 'assets/js/[name].js',
      },
      input: {
        main: resolve(__dirname, 'index.html'),
        contact: resolve(__dirname, 'contact.html'),
        privacy: resolve(__dirname, 'privacy.html'),
      },
    },
  },
  plugins: [splitVendorChunkPlugin()]
});