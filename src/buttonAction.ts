import { addHistory } from "./qrCodeHistory";
import { getBlobFromClipboard } from "./utils/clipboard";
import { qrBlobToString } from "./utils/qrCode";
import { selectButtonQuery } from "./utils/querySelector";
import { openWindow } from "./utils/window";
import { viewMessage } from "./viewMessage";

const openUrl = (url: string) => {
  try {
    if (!openWindow(url)) {
      location.href = url;
    }
  } catch (e) {
    viewMessage("URLを開けませんでした。");
    console.error(e, "Faild to open URL");
  }
}

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
      openUrl(url);
    })
    .catch((_) => {
      viewMessage("QRコードを検出できませんでした。");
    });
}

const readButton = selectButtonQuery("#readButton");
if (readButton) {
  readButton.onclick = readQrCodeHandler; 
}