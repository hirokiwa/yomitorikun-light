export const getBlobFromClipboard = async () => {
  try {
    const clipboardItems = await navigator.clipboard.read();
    if (clipboardItems.length === 0) {
      return null;
    }
    for (const clipboardItem of clipboardItems) {
      for (const type of clipboardItem.types) {
        const blob = await clipboardItem.getType(type);
        const isImage = blob.type.startsWith('image/');
        if (!isImage) {
          continue;
        }
        return blob
      }
    }
  } catch (e) {
    console.error(e);
    return "error";
  }
  return null;
}

export const wrightTextToClipboard = (newClipText: string) => {
  try {
    navigator.clipboard.writeText(newClipText);
    return "success";
  } catch (e) {
    console.error(e);
    return "failed";
  }
};