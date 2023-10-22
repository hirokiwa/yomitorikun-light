export const selectDivQuery = (selector: string) => {
  try {
    return document.querySelector<HTMLDivElement>(selector);
  } catch (e) {
    console.error(e, "Faild to select query");
    return null;
  }
}

export const selectButtonQuery = (selector: string) => {
  try {
    return document.querySelector<HTMLButtonElement>(selector);
  } catch (e) {
    console.error(e, "Faild to select query");
    return null;
  }
}

export const selectSVGQuery = (selector: string) => {
  try {
    return document.querySelector<SVGAElement>(selector);
  } catch (e) {
    console.error(e, "Faild to select query");
    return null;
  }
}
