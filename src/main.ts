import { buttonAction } from './buttonAction';
import { openFromQueryParameter } from './openFromQueryParameter';
import { qrCodeHistory } from './qrCodeHistory';
import { setupPlainTextDialog } from './viewPlainTextDialog';

const main = () => {
  setupPlainTextDialog();
  const isOpenUrlFromQuery = openFromQueryParameter();
  if (isOpenUrlFromQuery) {
    return;
  }
  qrCodeHistory();
  buttonAction();
};

main();
