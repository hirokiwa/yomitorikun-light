import { getDocumentMessages } from './i18n/runtime';
import { addHistory } from './qrCodeHistory';
import { getBlobFromClipboard } from './utils/clipboard';
import { qrBlobToString } from './utils/qrCode';
import { selectButtonQuery } from './utils/querySelector';
import { openWindow } from './utils/window';
import { viewMessage } from './viewMessage';

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

const readQrCodeHandler = async () => {
  const localizedMessages = getDocumentMessages();
  const qrBlob = await getBlobFromClipboard();
  if (qrBlob === null || qrBlob === 'error') {
    viewMessage(qrBlob ? localizedMessages.clipboardReadFailed : localizedMessages.clipboardEmpty);
    return;
  }

  qrBlobToString(qrBlob)
    .then((url) => {
      addHistory(url);
      openUrl(url);
    })
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
