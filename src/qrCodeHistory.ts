import { createMockHistory } from './mockHistory';
import { renderHistoryList } from './viewHistory';

const MAX_HISTORY_ENTRIES = 50;

const parseStoredHistory = (rawData: string) => {
  try {
    const result: dataFromLocalStrage = JSON.parse(rawData);
    return result.history;
  } catch (e) {
    console.error(e);
    return null;
  }
};

const readHistoryFromStorage = () => {
  const rawData = localStorage.getItem(import.meta.env.VITE_LOCAL_STORAGE_KEY);
  return rawData ? parseStoredHistory(rawData) : null;
};

const readHistoryOrDefault = () => {
  const storedHistory = readHistoryFromStorage();
  return storedHistory ?? (import.meta.env.DEV ? createMockHistory() : []);
};

const writeHistoryToStorage = (newHistory: urlHistory[]) => {
  try {
    const newJsonForLocalStrage: dataFromLocalStrage = { history: newHistory };
    localStorage.setItem(
      import.meta.env.VITE_LOCAL_STORAGE_KEY,
      JSON.stringify(newJsonForLocalStrage),
    );
    return 'succeeded';
  } catch (e) {
    console.error(e);
    return 'failed';
  }
};

const renderStoredHistoryList = () => {
  renderHistoryList(readHistoryOrDefault());
};

const excludeDuplicateUrls = (newUrl: string, history: urlHistory[]) =>
  history.filter((entry) => entry.url !== newUrl);
const addNewUrlToHistory = (newUrl: string, history: urlHistory[]) => [{ url: newUrl }, ...history];
const trimHistoryToLimit = (history: urlHistory[], limit: number) => history.slice(0, limit);

const createNewHistory = (newUrl: string, currentHistory: urlHistory[]) => {
  const filteredHistory = excludeDuplicateUrls(newUrl, currentHistory);
  const updatedHistory = addNewUrlToHistory(newUrl, filteredHistory);
  const trimmedHistory = trimHistoryToLimit(updatedHistory, MAX_HISTORY_ENTRIES);
  return trimmedHistory;
};

export const addHistoryEntry = (newUrl: string) => {
  const currentHistory = readHistoryOrDefault();
  const newHistory = createNewHistory(newUrl, currentHistory);
  const writeResult = writeHistoryToStorage(newHistory);
  if (writeResult === 'succeeded') {
    renderHistoryList(newHistory);
  }

  return writeResult;
};

export const qrCodeHistory = () => {
  addEventListener(
    'DOMContentLoaded',
    () => {
      renderStoredHistoryList();
    },
    { once: true },
  );

  addEventListener('storage', (e: StorageEvent) => {
    if (e.key !== import.meta.env.VITE_LOCAL_STORAGE_KEY) {
      return;
    }
    renderStoredHistoryList();
  });
};
