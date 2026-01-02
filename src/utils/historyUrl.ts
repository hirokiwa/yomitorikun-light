const prefixesToOmit = ["https://www.", "http://www.", "https://", "http://"];

export const buildHistoryDisplayUrl = (url: string) => {
  return prefixesToOmit.reduce((formattedUrl, prefix) => {
    return formattedUrl.startsWith(prefix) ? formattedUrl.slice(prefix.length) : formattedUrl;
  }, url);
};
