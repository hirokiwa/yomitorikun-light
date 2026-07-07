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
  plainTextDialogLabel: string;
  copyPlainTextLabel: string;
  copyPlainTextText: string;
  copyPlainTextSucceeded: string;
  copyPlainTextFailed: string;
  openHistoryLabel: (position: number, hostname: string) => string;
  copyHistoryLabel: (position: number, hostname: string) => string;
  openTextHistoryLabel: (position: number) => string;
  copyTextHistoryLabel: (position: number) => string;
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
    plainTextDialogLabel: '読み取ったテキスト',
    copyPlainTextLabel: 'テキストをクリップボードにコピーする',
    copyPlainTextText: 'コピー',
    copyPlainTextSucceeded: 'コピーしました',
    copyPlainTextFailed: 'コピーできませんでした',
    openHistoryLabel: (position, hostname) =>
      `${position}番目の履歴：${hostname} を開く（新しいタブ）`,
    copyHistoryLabel: (position, hostname) =>
      `${position}番目の履歴：${hostname} をクリップボードにコピーする`,
    openTextHistoryLabel: (position) => `${position}番目の履歴：テキストを表示する`,
    copyTextHistoryLabel: (position) =>
      `${position}番目の履歴：テキストをクリップボードにコピーする`,
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
    plainTextDialogLabel: 'Scanned text',
    copyPlainTextLabel: 'Copy text to the clipboard',
    copyPlainTextText: 'Copy',
    copyPlainTextSucceeded: 'Copied',
    copyPlainTextFailed: 'Copy failed',
    openHistoryLabel: (position, hostname) =>
      `History item ${position}: open ${hostname} in a new tab`,
    copyHistoryLabel: (position, hostname) =>
      `History item ${position}: copy ${hostname} to the clipboard`,
    openTextHistoryLabel: (position) => `History item ${position}: show text`,
    copyTextHistoryLabel: (position) => `History item ${position}: copy text to the clipboard`,
  },
};

export const resolveRuntimeLocale = (language: string): RuntimeLocale =>
  language.toLowerCase().startsWith('en') ? 'en' : 'ja';

export const getRuntimeMessages = (language: string): RuntimeMessages =>
  messages[resolveRuntimeLocale(language)];

export const getDocumentMessages = (): RuntimeMessages =>
  getRuntimeMessages(document.documentElement.lang);
