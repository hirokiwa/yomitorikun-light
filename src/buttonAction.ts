import { getDocumentMessages } from './i18n/runtime';
import { addHistoryEntry } from './qrCodeHistory';
import { getBlobFromClipboard } from './utils/clipboard';
import { qrBlobToString } from './utils/qrCode';
import { selectButtonQuery } from './utils/querySelector';
import { isHttpUrl } from './utils/url';
import { openWindow } from './utils/window';
import { viewMessage } from './viewMessage';
import { viewPlainTextDialog } from './viewPlainTextDialog';

export const openUrl = (url: string) => {
  try {
    if (!openWindow(url)) {
      location.href = url;
    }
  } catch (error) {
    viewMessage(getDocumentMessages().openUrlFailed);
    console.error(error, 'Failed to open URL');
  }
};

const handleDecodedQrText = (text: string) => {
  addHistoryEntry(text);
  isHttpUrl(text) ? openUrl(text) : viewPlainTextDialog(text);
};

const readQrCodeHandler = async () => {
  const localizedMessages = getDocumentMessages();
  const qrBlob = await getBlobFromClipboard();
  if (qrBlob === null || qrBlob === 'error') {
    viewMessage(qrBlob ? localizedMessages.clipboardReadFailed : localizedMessages.clipboardEmpty);
    return;
  }

  qrBlobToString(qrBlob)
    .then(handleDecodedQrText)
    .catch(() => {
      viewMessage(localizedMessages.qrNotFound);
    });
};

export const buttonAction = () => {
  const readButton = selectButtonQuery('#readButton');
  if (readButton) {
    readButton.onclick = readQrCodeHandler;
  }
};
