import { BrowserQRCodeReader } from "@zxing/browser";

const qrCodeReader = new BrowserQRCodeReader();

export const qrBlobToString = async (blob: Blob): Promise<string> => {
  const url = URL.createObjectURL(blob);

  try {
    const result = await qrCodeReader.decodeFromImageUrl(url);
    return (result as any).text ?? result.getText();
  } catch (error) {
    throw new Error("No QR code found in the image.");
  } finally {
    URL.revokeObjectURL(url);
  }
};
