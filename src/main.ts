import { buttonAction } from "./buttonAction";
import { openFromQueryParameter } from "./openFromQueryParameter";
import { qrCodeHistory } from "./qrCodeHistory";

const main = () => {
  const isOpenUrlFromQuery = openFromQueryParameter();
  if (isOpenUrlFromQuery) {
    return;
  };
  qrCodeHistory();
  buttonAction();
}

main();