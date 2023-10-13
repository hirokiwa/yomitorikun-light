import { wrightTextToClipboard } from "./utils/clipboard";

export const viewFullHistories = (history: urlHistory[]) => {
  const historyWithId = history.map((h) => {
    return {
      text: h.url,
      id: crypto.randomUUID()
    }
  })
  document.querySelector<HTMLDivElement>('#historyElement')!.innerHTML = historyWithId.length !== 0
    ? `
      <ul class="historyUnorderedList">
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
                  fill = "#858585"
                  class="copyIconSvg"
                  >
                  <path xmlns="http://www.w3.org/2000/svg" d="M180-81q-24 0-42-18t-18-42v-603h60v603h474v60H180Zm120-120q-24 0-42-18t-18-42v-560q0-24 18-42t42-18h440q24 0 42 18t18 42v560q0 24-18 42t-42 18H300Zm0-60h440v-560H300v560Zm0 0v-560 560Z"/>
                </svg>
              </button>
            </li>
            `)
          }).join(" ")}
      </ul>
    `
    : `<p>履歴はありません。</p>`;
  historyWithId.map((h) => {
    const buttonElementToCopyLink = document.querySelector<HTMLButtonElement>(`#buttonToCopyHistoryLink-${h.id}`);
    if (!buttonElementToCopyLink) {
      return;
    }
    buttonElementToCopyLink.onclick = () => { wrightTextToClipboard(h.text) };
  });
}