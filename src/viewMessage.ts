const alertWithWindow = (text: string) => {
  try {
    window.alert(text);
    return "success"
  } catch (e) {
    console.error(e, "Alert failed.");
    return "faild";
  }
}

const getInnerWidth = () => {
  try {
    return window.innerWidth;
  } catch (e) {
    console.error(e, "Failed to get width.");
    return 0;
  }
}

export const viewMessage = (text: string) => {
  if (text === "") {
    return;
  }
  if (getInnerWidth() <= 900 && alertWithWindow(text) === "success") {
    return;
  }
  const messageBoxElement = document.querySelector<HTMLDivElement>("#messageBox");
  if (!messageBoxElement) {
    alertWithWindow(text);
    return;
  }

  messageBoxElement.innerHTML = `
    <div class="messageBox">
      <svg
        xmlns = "http://www.w3.org/2000/svg"
        height = "24"
        viewBox = "0 -960 960 960"
        width = "24"
        fill = "#707070"
      >
        <path xmlns="http://www.w3.org/2000/svg" d="M480-280q17 0 28.5-11.5T520-320q0-17-11.5-28.5T480-360q-17 0-28.5 11.5T440-320q0 17 11.5 28.5T480-280Zm-40-160h80v-240h-80v240ZM330-120 120-330v-300l210-210h300l210 210v300L630-120H330Zm34-80h232l164-164v-232L596-760H364L200-596v232l164 164Zm116-280Z"/>
      </svg>
      <p>
        <strong>${text}</strong>
      </p>
    </div>
  `
  messageBoxElement.addEventListener('animationend', () => {
    while (messageBoxElement.firstChild){
      messageBoxElement.removeChild(messageBoxElement.firstChild);
    }
  }, {
    once: true
  })
}