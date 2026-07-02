export const removeHtmlCommentsPlugin = {
  name: 'remove-html-comments',
  apply: 'build',
  transformIndexHtml: {
    order: 'post',
    handler: (html) => html.replace(/<!--[\s\S]*?-->/g, ''),
  },
};
