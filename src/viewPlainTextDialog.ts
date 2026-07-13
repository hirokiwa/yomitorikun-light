import { getDocumentMessages } from './i18n/runtime';
import { wrightTextToClipboard } from './utils/clipboard';
import { selectButtonQuery } from './utils/querySelector';

const dialogState: { text: string } = { text: '' };
const copyFeedbackTimerState: { value: number | undefined } = { value: undefined };
const copyFeedbackDuration = 6000;
const copyIconPath =
  'M180-81q-24 0-42-18t-18-42v-603h60v603h474v60H180Zm120-120q-24 0-42-18t-18-42v-560q0-24 18-42t42-18h440q24 0 42 18t18 42v560q0 24-18 42t-42 18H300Zm0-60h440v-560H300v560Zm0 0v-560 560Z';
const copiedIconPath =
  'm490-383 228-228-42-41-185 186-97-97-42 42 138 138ZM260-200q-24 0-42-18t-18-42v-560q0-24 18-42t42-18h560q24 0 42 18t18 42v560q0 24-18 42t-42 18H260Zm0-60h560v-560H260v560ZM140-80q-24 0-42-18t-18-42v-620h60v620h620v60H140Zm120-740v560-560Z';
const copyFailedIconPath =
  'm40-120 440-760 440 760H40Zm138-80h604L480-720 178-200Zm330.5-51.5Q520-263 520-280t-11.5-28.5Q497-320 480-320t-28.5 11.5Q440-297 440-280t11.5 28.5Q463-240 480-240t28.5-11.5ZM440-360h80v-200h-80v200Zm40-100Z';

const selectPlainTextDialog = () => document.querySelector<HTMLDialogElement>('#plainTextDialog');

const selectPlainTextDialogContent = () =>
  document.querySelector<HTMLParagraphElement>('#plainTextDialogText');

const selectPlainTextDialogCopyText = () =>
  document.querySelector<HTMLSpanElement>('#plainTextDialogCopyButtonText');

const selectPlainTextDialogCopyIcon = () =>
  document.querySelector<SVGSVGElement>('#plainTextDialogCopyIcon');

const setDialogText = (text: string) => {
  dialogState.text = text;
};

const setCopyFeedbackTimerId = (timerId: number | undefined) => {
  copyFeedbackTimerState.value = timerId;
};

const clearCopyFeedbackTimer = () => {
  if (typeof copyFeedbackTimerState.value === 'undefined') {
    return;
  }
  clearTimeout(copyFeedbackTimerState.value);
  setCopyFeedbackTimerId(undefined);
};

const renderDialogText = (text: string) => {
  const plainTextDialogContent = selectPlainTextDialogContent();
  if (!plainTextDialogContent) {
    return;
  }
  plainTextDialogContent.textContent = text;
};

const renderCopyIcon = (pathData: string) => {
  const copyIcon = selectPlainTextDialogCopyIcon();
  if (!copyIcon) {
    return;
  }
  copyIcon.innerHTML = `<path d="${pathData}" />`;
};

const renderCopyButtonContent = (text: string, pathData: string) => {
  const copyButtonText = selectPlainTextDialogCopyText();
  if (copyButtonText) {
    copyButtonText.textContent = text;
  }
  renderCopyIcon(pathData);
};

const resetCopyButtonContent = () => {
  clearCopyFeedbackTimer();
  renderCopyButtonContent(getDocumentMessages().copyPlainTextText, copyIconPath);
};

const scheduleCopyButtonContentReset = () => {
  clearCopyFeedbackTimer();
  setCopyFeedbackTimerId(window.setTimeout(resetCopyButtonContent, copyFeedbackDuration));
};

const renderDialogLabels = () => {
  const localizedMessages = getDocumentMessages();
  const plainTextDialog = selectPlainTextDialog();
  const copyButton = selectButtonQuery('#plainTextDialogCopyButton');
  plainTextDialog?.setAttribute('aria-label', localizedMessages.plainTextDialogLabel);
  copyButton?.setAttribute('aria-label', localizedMessages.copyPlainTextLabel);
  copyButton?.setAttribute('title', localizedMessages.copyPlainTextLabel);
  renderCopyButtonContent(localizedMessages.copyPlainTextText, copyIconPath);
};

const handleCopyTextInDialog = () => {
  const localizedMessages = getDocumentMessages();

  const successToCopy = wrightTextToClipboard(dialogState.text) === 'success';

  const diaologCopyButtonContent = {
    text: successToCopy
      ? localizedMessages.copyPlainTextSucceeded
      : localizedMessages.copyPlainTextFailed,
    iconPath: successToCopy ? copiedIconPath : copyFailedIconPath,
  };

  renderCopyButtonContent(diaologCopyButtonContent.text, diaologCopyButtonContent.iconPath);
  scheduleCopyButtonContentReset();
};

const closeDialogOnBackdropClick = (event: MouseEvent) => {
  const plainTextDialog = selectPlainTextDialog();
  if (!plainTextDialog || event.target !== plainTextDialog) {
    return;
  }
  plainTextDialog.close();
};

export const setupPlainTextDialog = () => {
  const plainTextDialog = selectPlainTextDialog();
  const copyButton = selectButtonQuery('#plainTextDialogCopyButton');
  if (!plainTextDialog || !copyButton) {
    return;
  }
  renderDialogLabels();
  plainTextDialog.onclick = closeDialogOnBackdropClick;
  copyButton.onclick = handleCopyTextInDialog;
};

export const viewPlainTextDialog = (text: string) => {
  const plainTextDialog = selectPlainTextDialog();
  if (!plainTextDialog) {
    return;
  }
  setDialogText(text);
  renderDialogText(text);
  resetCopyButtonContent();
  if (plainTextDialog.open) {
    return;
  }
  plainTextDialog.showModal();
};
