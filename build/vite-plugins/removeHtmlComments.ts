import type { Plugin } from 'vite';

export const removeHtmlCommentsPlugin: Plugin = {
  name: 'remove-html-comments',
  apply: 'build',
  transformIndexHtml: {
    order: 'post',
    handler: (html) => html.replace(/<!--[\s\S]*?-->/g, ''),
  },
};
