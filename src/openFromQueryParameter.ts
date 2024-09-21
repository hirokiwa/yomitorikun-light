import { openUrl } from "./buttonAction";
import { addHistory } from "./qrCodeHistory";

const getUrlFromQuery = () => {
  try {
    const url = new URL(window.location.href);
    const params = new URLSearchParams(url.search);
    const urlToOpen = params.get('url');
    return urlToOpen;
  } catch (e) { 
    console.error(e, "Faild to get URL.");
    return null;
  }
};

export const openFromQueryParameter = () => {
  const urlToOpen = getUrlFromQuery();
  urlToOpen && addHistory(urlToOpen);
  urlToOpen && openUrl(urlToOpen);

  return urlToOpen !== null;
};
