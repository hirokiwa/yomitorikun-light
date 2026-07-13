import { createMockHistory } from './mockHistory';
import { viewFullHistories } from './viewHistory';

const currentHistoryState: { value: urlHistory[] } = { value: [] };
const updateCurrentHistory = (newHistory: urlHistory[]) => {
  currentHistoryState.value = newHistory;
};

const extractHistory = (rawData: string) => {
  try {
    const result: dataFromLocalStrage = JSON.parse(rawData);
    return result.history;
  } catch (e) {
    console.error(e);
    return null;
  }
};

const getCurrentHistory = () => {
  const rawData = localStorage.getItem(import.meta.env.VITE_LOCAL_STORAGE_KEY);
  return rawData ? extractHistory(rawData) : null;
};

const getInitialHistory = () => {
  const currentHistory = getCurrentHistory();
  return currentHistory ?? (import.meta.env.DEV ? createMockHistory() : []);
};

const limitHistory = (history: urlHistory[]) => history.filter((_, index) => index < 50);

const buildNextHistory = (newOne: string, currentHistory: urlHistory[]) =>
  limitHistory([{ url: newOne }, ...currentHistory]);

export const addHistory = (newOne: string) => {
  if (currentHistoryState.value.length > 0 && currentHistoryState.value[0].url === newOne) {
    return;
  }
  const newHistory = buildNextHistory(newOne, currentHistoryState.value);

  viewFullHistories(newHistory);
  updateCurrentHistory(newHistory);
  try {
    const newJsonForLocalStrage: dataFromLocalStrage = { history: newHistory };
    localStorage.setItem(
      import.meta.env.VITE_LOCAL_STORAGE_KEY,
      JSON.stringify(newJsonForLocalStrage),
    );
  } catch (e) {
    console.error(e);
    return;
  }
};

export const qrCodeHistory = () => {
  if (typeof import.meta.env.VITE_LOCAL_STORAGE_KEY !== 'undefined') {
    updateCurrentHistory(getInitialHistory());
  }

  addEventListener(
    'DOMContentLoaded',
    () => {
      viewFullHistories(currentHistoryState.value);
    },
    { once: true },
  );

  addEventListener('storage', (e: StorageEvent) => {
    if (e.key !== import.meta.env.VITE_LOCAL_STORAGE_KEY) {
      return;
    }
    const newHistoryValue = e.newValue ? extractHistory(e.newValue) : null;
    const newHistory = newHistoryValue ?? [];
    viewFullHistories(newHistory);
    updateCurrentHistory(newHistory);
  });
};
