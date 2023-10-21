import { addHistory } from "./qrCodeHistory";
import { getBlobFromClipboard } from "./utils/clipboard";
import { qrBlobToString } from "./utils/qrCode";
import { selectButtonQuery } from "./utils/querySelector";
import { viewMessage } from "./viewMessage";

const readQrCodeHandler = async () => {
  const qrBlob = await getBlobFromClipboard();
  if (qrBlob === null || qrBlob === "error") {
    viewMessage(qrBlob
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
      viewMessage("QRコードを検出できませんでした。");
    });
}

const readButton = selectButtonQuery("#readButton");
if (readButton) {
  readButton.onclick = readQrCodeHandler; 
}