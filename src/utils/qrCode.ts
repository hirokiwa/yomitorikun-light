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

// under developing ===================

const blobToArrayBuffer = (blob: Blob) => {
  return new Promise<ArrayBuffer>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      reader.result instanceof ArrayBuffer
        ? resolve(reader.result)
        : reject(null);
    };
    reader.onerror = () => { reject(null) };
    reader.readAsArrayBuffer(blob);
  });
}

const createImgElement = () => {
  try {
    return document.createElement('img');
  } catch (e) {
    console.error(e, "Faild to create img Element");
    return null;
  }
}

const getBlobSize = (blob: Blob) => {
  return new Promise<{ width: number, height: number }>((resolve, reject) => {
    const imgElement = createImgElement();
    if (!imgElement) {
      return reject("Faild to create img Element");
    }
    const imageUrl = URL.createObjectURL(blob);
    imgElement.src = imageUrl;
    imgElement.onload = () => {
      resolve({
        width: imgElement.width,
        height: imgElement.height,
      });
    }
    imgElement.onerror = (e) => {reject(e)};
  })
}

export const qrBlobToStringNew = async (blob: Blob) => {
  const arrayBuffer = await blobToArrayBuffer(blob)
    .then((value) => value)
    .catch((e) => {
      console.error(e.message);
      return null;
    });
  if (!arrayBuffer) {
    return null;
  }
  const unit8Array = new Uint8ClampedArray(arrayBuffer, 1, 4);
  const imageSize = await getBlobSize(blob);
  const code = jsQR(unit8Array, imageSize.width, imageSize.height);
  return code ? code.data : null;
}

// ======================