let currentHistory: urlHistory[] = [];
const updateCurrentHistory = (newHistory: urlHistory[]) => {
  currentHistory = newHistory;
}

const extractHistory = (rawData: string) => {
  try {
    const result: dataFromLocalStrage = JSON.parse(rawData);
    return result.history;
  } catch (e) {
    console.error(e);
    return null;
  }
}

const getCurrentHistory = () => {
  const rawData = localStorage.getItem(import.meta.env.VITE_LOCAL_STORAGE_KEY);
  return rawData? extractHistory(rawData) : null;
}


export const addHistory = (newOne: string) => {
  if (currentHistory.length > 0 && currentHistory[0].url === newOne) {
    return
  }
  const pushedArray: urlHistory[] = [{ url: newOne }, ...currentHistory];
  const newHistory = pushedArray.length <= 50
    ? pushedArray
    : pushedArray.filter((_, index) => index < 50);
  
  try {
    const newJsonForLocalStrage: dataFromLocalStrage = { history: newHistory };
    localStorage.setItem(import.meta.env.VITE_LOCAL_STORAGE_KEY, JSON.stringify(newJsonForLocalStrage));
  } catch (e) {
    console.error(e);
    return;
  }
}

if ( typeof import.meta.env.VITE_LOCAL_STORAGE_KEY !== undefined ) {
  updateCurrentHistory(getCurrentHistory() ?? []);
}

addEventListener("storage", (e) => {
  if (e.key !== import.meta.env.VITE_LOCAL_STORAGE_KEY) {
    return;
  }
  const newHistory = e.newValue ? extractHistory(e.newValue) : null;
  updateCurrentHistory(newHistory ?? []);
});
