import { addHistory } from "./qrCodeHistory";
import { getBlobFromClipboard } from "./utils/clipboard";
import { qrBlobToString } from "./utils/qrCode";

const readQrCodeHandler = async () => {
  const qrBlob = await getBlobFromClipboard();
  if (qrBlob === null || qrBlob === "error") {
    window.alert(qrBlob
      ? "クリップボードを読み取ることができませんでした。"
      : "クリップボードにQRコード画像をコピーしてください。"
    );
    return
  }

  qrBlobToString(qrBlob)
    .then((url) => {
      addHistory(url);
      if (!window.open(url)) {
        location.href = url;
      }
    })
    .catch((_) => {
      window.alert("QRコードを検出できませんでした。");
    });
}

const readButton = <HTMLButtonElement|null>document.getElementById('readButton');
if (readButton) {
  readButton.onclick = readQrCodeHandler; 
}