export type RuntimeLocale = 'ja' | 'en';

type RuntimeMessages = {
  clipboardReadFailed: string;
  clipboardEmpty: string;
  qrNotFound: string;
  openUrlFailed: string;
  copyFailed: string;
  copySucceeded: string;
  historyEmpty: string;
  fullUrlLabel: string;
  copyTitle: string;
  openHistoryLabel: (position: number, hostname: string) => string;
  copyHistoryLabel: (position: number, hostname: string) => string;
};

const messages: Record<RuntimeLocale, RuntimeMessages> = {
  ja: {
    clipboardReadFailed: 'クリップボードを読み取ることができませんでした。',
    clipboardEmpty: 'クリップボードにQRコード画像をコピーしてください。',
    qrNotFound: 'QRコードを検出できませんでした。',
    openUrlFailed: 'URLを開けませんでした。',
    copyFailed: 'クリップボードにコピーできませんでした。',
    copySucceeded: 'クリップボードにリンクをコピーしました。',
    historyEmpty: '履歴はありません。',
    fullUrlLabel: 'URL全文',
    copyTitle: 'クリップボードにコピー',
    openHistoryLabel: (position, hostname) => `${position}番目の履歴：${hostname} を開く（新しいタブ）`,
    copyHistoryLabel: (position, hostname) =>
      `${position}番目の履歴：${hostname} をクリップボードにコピーする`,
  },
  en: {
    clipboardReadFailed: 'Could not read the clipboard.',
    clipboardEmpty: 'Copy a QR code image to the clipboard.',
    qrNotFound: 'No QR code was detected.',
    openUrlFailed: 'Could not open the URL.',
    copyFailed: 'Could not copy to the clipboard.',
    copySucceeded: 'The link was copied to the clipboard.',
    historyEmpty: 'No history.',
    fullUrlLabel: 'Full URL',
    copyTitle: 'Copy to clipboard',
    openHistoryLabel: (position, hostname) =>
      `History item ${position}: open ${hostname} in a new tab`,
    copyHistoryLabel: (position, hostname) =>
      `History item ${position}: copy ${hostname} to the clipboard`,
  },
};

export const resolveRuntimeLocale = (language: string): RuntimeLocale =>
  language.toLowerCase().startsWith('en') ? 'en' : 'ja';

export const getRuntimeMessages = (language: string): RuntimeMessages =>
  messages[resolveRuntimeLocale(language)];

export const getDocumentMessages = (): RuntimeMessages =>
  getRuntimeMessages(document.documentElement.lang);
