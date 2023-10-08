import jsQR, { QRCode } from "jsqr";

const initQrCode = ( QRImage: HTMLImageElement ): QRCode | null => {
  const canvas = document.createElement('canvas');
  canvas.width = QRImage.width;
  canvas.height = QRImage.height;
  const context = canvas.getContext('2d') as CanvasRenderingContext2D;
  context.drawImage(QRImage, 0, 0);
  const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
  return jsQR(imageData.data, imageData.width, imageData.height);
}

export const qrBlobToString = (blob: Blob): Promise<string> => {
  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (event) => {
      const QRImage = new Image();
      QRImage.onload = () => {
        try {
          const qrCode = initQrCode( QRImage );
          if (qrCode) {
            resolve(qrCode.data);
          } else {
            reject(new Error('No QR code found in the image.'));
          }
        } catch (error) {
          reject(error);
        }
      }
      QRImage.src = event.target?.result as string;
    }
    reader.onerror = (error) => {
      reject(error);
    }
    reader.readAsDataURL(blob);
  })
}
