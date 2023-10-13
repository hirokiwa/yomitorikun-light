export const viewFullHistories = (history: urlHistory[]) => {
  document.querySelector<HTMLDivElement>('#historyElement')!.innerHTML = history.length !== 0
    ? `
      <ul class="historyUnorderedList">
        ${history.map((h, i) => {
          return (`
            <li class="historyList" key=${crypto.randomUUID()}>
              <a
                href=${h.url}
                target="_blank"
                class="historyLink"
                title="${i+1}番目の履歴を開く"
              >
                ${h.url}
              </a>
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
            </li>
            `)
        }).join(" ")}
      </ul>
    `
    : `<p>履歴はありません。</p>`;
}