import { BrowserQRCodeReader } from '@zxing/browser';

const qrCodeReader = new BrowserQRCodeReader();

export const qrBlobToString = async (blob: Blob): Promise<string> => {
  const url = URL.createObjectURL(blob);

  try {
    const result = await qrCodeReader.decodeFromImageUrl(url);
    return result.getText();
  } finally {
    URL.revokeObjectURL(url);
  }
};
