import { wrightTextToClipboard } from "./utils/clipboard";

let activeTimer: historyTimerType | undefined = undefined;
const activeTimerIs = () => activeTimer;
const setActiveTimerId = (newTimer: historyTimerType | undefined) => {
  activeTimer = newTimer;
}

const ioCopyIconSvg = (copied: boolean, svgElement: SVGAElement) => {
  while (svgElement.firstChild){
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
}

const unifiedCopyIconSvg = () => {
  const currentTimerId = activeTimerIs();
  if (!currentTimerId) {
    return;
  }
  clearTimeout(currentTimerId.timerId);
  const currentSvgElement = document.querySelector<SVGAElement>(`#copyIconSvg-${currentTimerId.historyId}`);
  if (!currentSvgElement) {
    return;
  }
  ioCopyIconSvg(false, currentSvgElement);
}

const onClickHandlerForCopyLink = (historyWithId: historyWithIdType) => {
  if (wrightTextToClipboard(historyWithId.text) === "failed") {
    alert("クリップボードにコピーできませんでした。");
    return;
  }
  const svgElement = document.querySelector<SVGAElement>(`#copyIconSvg-${historyWithId.id}`);
  if (!svgElement) {
    return;
  }
  unifiedCopyIconSvg();
  ioCopyIconSvg(true, svgElement);
  const timerId = window.setTimeout(() => {
    ioCopyIconSvg(false, svgElement);
    setActiveTimerId(undefined);
  }, 2000);
  setActiveTimerId({
    timerId: timerId,
    historyId: historyWithId.id
  });
}

export const viewFullHistories = (history: urlHistory[]) => {
  const historyWithId: historyWithIdType[] = history.map((h) => {
    return {
      id: crypto.randomUUID(),
      text: h.url
    }
  })
  document.querySelector<HTMLDivElement>('#historyElement')!.innerHTML = historyWithId.length !== 0
    ? `
      <ul class="historyUnorderedList historyChild">
        ${historyWithId.map((h, i) => {
          return (`
            <li class="historyList" key="historyList-${h.id}">
              <a
                href=${h.text}
                target="_blank"
                class="historyLink"
                title="${i + 1}番目の履歴を開く"
              >
                ${h.text}
              </a>
              <button 
                class="buttonToCopyLink"
                type="button"
                title="${i + 1}番目の履歴のリンクをクリップボードにコピーする"
                aria-label="${i + 1}番目の履歴のリンクをクリップボードにコピーする"
                id="buttonToCopyHistoryLink-${h.id}"
              >
                <svg
                  xmlns = "http://www.w3.org/2000/svg"
                  height = "28"
                  viewBox = "0 -960 960 960"
                  width = "28"
                  fill = "#707070"
                  class="copyIconSvg"
                  id="copyIconSvg-${h.id}"
                >
                  <path
                    xmlns="http://www.w3.org/2000/svg"
                    d="M180-81q-24 0-42-18t-18-42v-603h60v603h474v60H180Zm120-120q-24 0-42-18t-18-42v-560q0-24 18-42t42-18h440q24 0 42 18t18 42v560q0 24-18 42t-42 18H300Zm0-60h440v-560H300v560Zm0 0v-560 560Z"
                  />
                </svg>
              </button>
            </li>
            `)
          }).join(" ")}
      </ul>
    `
    : `<p class="historyChild">履歴はありません。</p>`;
  historyWithId.map((h) => {
    const buttonElementToCopyLink = document.querySelector<HTMLButtonElement>(`#buttonToCopyHistoryLink-${h.id}`);
    if (!buttonElementToCopyLink) {
      return;
    }
    buttonElementToCopyLink.onclick = () => { onClickHandlerForCopyLink(h) };
  });
}