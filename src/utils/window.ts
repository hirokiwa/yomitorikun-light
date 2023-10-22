export const openWindow = (url: string) => {
  try {
    return window.open(url);
  } catch (e) {
    console.error(e, "Faild to open URL");
    return null;
  }
}