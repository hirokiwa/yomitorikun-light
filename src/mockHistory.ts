const mockHistoryTexts = [
  'https://example.com/products/qr-reader',
  'https://developer.mozilla.org/ja/docs/Web/HTML/Element/dialog',
  'https://vitejs.dev/guide/',
  'https://www.typescriptlang.org/docs/',
  'https://github.com/hirokiwa/yomitorikun-light',
  '社内Wi-Fi: yomitorikun-dev / password: sample-1234',
  '会議室A 10:00-11:00',
  '注文番号: DEV-QR-0007',
  'tel:03-0000-0000',
  'mailto:sample@example.com',
];

export const createMockHistory = (): urlHistory[] =>
  Array.from({ length: 30 }, (_, index) => {
    const text = mockHistoryTexts[index % mockHistoryTexts.length];
    return {
      url: `${text}${text.startsWith('http') ? `?sample=${index + 1}` : ` #${index + 1}`}`,
    };
  });
