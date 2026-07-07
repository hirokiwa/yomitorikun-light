import { wrightTextToClipboard } from './utils/clipboard';
import { getDocumentMessages } from './i18n/runtime';
import { escapeHtml } from './utils/html';
import { buildHistoryDisplayUrl } from './utils/historyUrl';
import { selectButtonQuery, selectDivQuery, selectSVGQuery } from './utils/querySelector';
import { parseHttpUrl } from './utils/url';
import { createUUID } from './utils/uuid';
import { viewMessage } from './viewMessage';
import { viewPlainTextDialog } from './viewPlainTextDialog';

const activeTimerState: { value: historyTimerType | undefined } = { value: undefined };
const activeTimerIs = () => activeTimerState.value;
const setActiveTimerId = (newTimer: historyTimerType | undefined) => {
  activeTimerState.value = newTimer;
};

const ioCopyIconSvg = (copied: boolean, svgElement: SVGAElement) => {
  while (svgElement.firstChild) {
    svgElement.removeChild(svgElement.firstChild);
  }
  svgElement.innerHTML = copied
    ? `<path
      xmlns="http://www.w3.org/2000/svg"
      d="m490-383 228-228-42-41-185 186-97-97-42 42 138 138ZM260-200q-24 0-42-18t-18-42v-560q0-24 18-42t42-18h560q24 0 42 18t18 42v560q0 24-18 42t-42 18H260Zm0-60h560v-560H260v560ZM140-80q-24 0-42-18t-18-42v-620h60v620h620v60H140Zm120-740v560-560Z"
    />`
    : `<path
      xmlns="http://www.w3.org/2000/svg"
      d="M180-81q-24 0-42-18t-18-42v-603h60v603h474v60H180Zm120-120q-24 0-42-18t-18-42v-560q0-24 18-42t42-18h440q24 0 42 18t18 42v560q0 24-18 42t-42 18H300Zm0-60h440v-560H300v560Zm0 0v-560 560Z"
    />`;
};

const unifiedCopyIconSvg = () => {
  const currentTimerId = activeTimerIs();
  if (typeof currentTimerId === 'undefined') {
    return;
  }
  clearTimeout(currentTimerId.timerId);
  const currentSvgElement = selectSVGQuery(`#copyIconSvg-${currentTimerId.historyId}`);
  if (!currentSvgElement) {
    return;
  }
  ioCopyIconSvg(false, currentSvgElement);
};

const setTimer = (callback: () => void, timeout: number) => {
  try {
    return window.setTimeout(callback, timeout);
  } catch (e) {
    console.error(e, 'Faild to set timer');
    return null;
  }
};

const onClickHandlerForCopyLink = (historyWithId: historyWithIdType) => {
  const localizedMessages = getDocumentMessages();
  if (wrightTextToClipboard(historyWithId.text) === 'failed') {
    viewMessage(localizedMessages.copyFailed);
    return;
  }
  viewMessage(localizedMessages.copySucceeded);
  const svgElement = selectSVGQuery(`#copyIconSvg-${historyWithId.id}`);
  if (!svgElement) {
    return;
  }
  unifiedCopyIconSvg();
  ioCopyIconSvg(true, svgElement);
  const timerId = setTimer(() => {
    ioCopyIconSvg(false, svgElement);
    setActiveTimerId(undefined);
  }, 6000);
  setActiveTimerId(
    timerId
      ? {
          timerId: timerId,
          historyId: historyWithId.id,
        }
      : undefined,
  );
};

const buildHistoryItem = (historyWithId: historyWithIdType, position: number) => {
  const localizedMessages = getDocumentMessages();
  const parsedUrl = parseHttpUrl(historyWithId.text);
  const escapedText = escapeHtml(historyWithId.text);
  const escapedDisplayText = escapeHtml(historyWithId.displayText);
  const escapedId = escapeHtml(historyWithId.id);
  const visibleContent =
    parsedUrl === null
      ? `<button
          class="historyLink historyLink--button"
          type="button"
          aria-label="${localizedMessages.openTextHistoryLabel(position)}"
          aria-describedby="full-url-${escapedId}"
          id="buttonToOpenHistoryText-${escapedId}"
        >
          <span class="historyLinkFavionWrapper" aria-hidden="true">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              height="20"
              viewBox="0 -960 960 960"
              width="20"
              fill="#707070"
              class="historyLinkFavion"
              aria-hidden="true"
              focusable="false"
            >
              <path
                d="M280-240h400v-60H280v60Zm0-170h400v-60H280v60Zm0-170h400v-60H280v60ZM180-80q-24 0-42-18t-18-42v-680q0-24 18-42t42-18h600q24 0 42 18t18 42v680q0 24-18 42t-42 18H180Zm0-60h600v-680H180v680Zm0-680v680-680Z"
              />
            </svg>
          </span>
          ${escapedDisplayText}
        </button>`
      : `<a
          href="${escapedText}"
          target="_blank"
          rel="noopener noreferrer"
          class="historyLink"
          aria-label="${localizedMessages.openHistoryLabel(position, parsedUrl.hostname)}"
          aria-describedby="full-url-${escapedId}"
          title="${escapedText}"
        >
          <span class="historyLinkFavionWrapper" aria-hidden="true">
            <img
              src="https://www.google.com/s2/favicons?domain=${escapedText}"
              alt=""
              width="20"
              height="20"
              decoding="async"
              loading="lazy"
              class="historyLinkFavion"
            />
          </span>
          ${escapedDisplayText}
        </a>`;
  return `
    <li class="historyList" key="historyList-${escapedId}">
      ${visibleContent}
      <button
        class="buttonToCopyLink"
        type="button"
        title="${localizedMessages.copyTitle}"
        aria-label="${
          parsedUrl === null
            ? localizedMessages.copyTextHistoryLabel(position)
            : localizedMessages.copyHistoryLabel(position, parsedUrl.hostname)
        }"
        aria-describedby="full-url-${escapedId}"
        id="buttonToCopyHistoryLink-${escapedId}"
      >
        <svg
          xmlns = "http://www.w3.org/2000/svg"
          height = "28"
          viewBox = "0 -960 960 960"
          width = "28"
          fill = "#707070"
          class="copyIconSvg"
          aria-hidden="true"
          focusable="false"
          id="copyIconSvg-${escapedId}"
        >
          <path
            xmlns="http://www.w3.org/2000/svg"
            d="M180-81q-24 0-42-18t-18-42v-603h60v603h474v60H180Zm120-120q-24 0-42-18t-18-42v-560q0-24 18-42t42-18h440q24 0 42 18t18 42v560q0 24-18 42t-42 18H300Zm0-60h440v-560H300v560Zm0 0v-560 560Z"
          />
        </svg>
      </button>
      <span id="full-url-${escapedId}" class="sr-only">
        ${localizedMessages.fullUrlLabel}:${escapedText}
      </span>
    </li>
  `;
};

const bindHistoryCopyButton = (historyWithId: historyWithIdType) => {
  const buttonElementToCopyLink = selectButtonQuery(`#buttonToCopyHistoryLink-${historyWithId.id}`);
  if (!buttonElementToCopyLink) {
    return;
  }
  buttonElementToCopyLink.onclick = () => {
    onClickHandlerForCopyLink(historyWithId);
  };
};

const bindHistoryTextButton = (historyWithId: historyWithIdType) => {
  const parsedUrl = parseHttpUrl(historyWithId.text);
  if (parsedUrl !== null) {
    return;
  }
  const buttonElementToOpenText = selectButtonQuery(`#buttonToOpenHistoryText-${historyWithId.id}`);
  if (!buttonElementToOpenText) {
    return;
  }
  buttonElementToOpenText.onclick = () => {
    viewPlainTextDialog(historyWithId.text);
  };
};

export const viewFullHistories = (history: urlHistory[]) => {
  const localizedMessages = getDocumentMessages();
  const historyElement = selectDivQuery('#historyElement');
  if (!historyElement) {
    return;
  }
  const historyWithId: historyWithIdType[] = history.map((h, i) => {
    return {
      id: createUUID() ?? `${i}`,
      text: h.url,
      displayText: buildHistoryDisplayUrl(h.url),
    };
  });
  historyElement.innerHTML =
    historyWithId.length !== 0
      ? `
      <ul class="historyUnorderedList historyChild">
        ${historyWithId
          .map((h, i) => {
            return buildHistoryItem(h, i + 1);
          })
          .join(' ')}
      </ul>
    `
      : `<p class="historyChild">${localizedMessages.historyEmpty}</p>`;
  historyWithId.map(bindHistoryCopyButton);
  historyWithId.map(bindHistoryTextButton);
};
