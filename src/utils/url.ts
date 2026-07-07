export const parseHttpUrl = (text: string): URL | null => {
  try {
    const url = new URL(text);
    return url.protocol === 'http:' || url.protocol === 'https:' ? url : null;
  } catch {
    return null;
  }
};

export const isHttpUrl = (text: string) => parseHttpUrl(text) !== null;
