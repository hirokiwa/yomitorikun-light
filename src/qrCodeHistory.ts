import { createMockHistory } from './mockHistory';
import { renderHistoryList } from './viewHistory';

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

const trimHistoryToLimit = (history: urlHistory[]) => history.filter((_, index) => index < 50);

const createNextHistory = (newOne: string, currentHistory: urlHistory[]) =>
  trimHistoryToLimit([{ url: newOne }, ...currentHistory]);

const writeStoredHistory = (newHistory: urlHistory[]) => {
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

export const addHistoryEntry = (targetUrl: string) => {
  const currentHistory = readHistoryOrDefault();

  const latestEntryUrl = currentHistory[0]?.url;
  const isDuplicateOfLatest = latestEntryUrl === targetUrl;

  const writeResult = isDuplicateOfLatest
    ? 'alreadyExists'
    : writeStoredHistory(createNextHistory(targetUrl, currentHistory));

  return writeResult === 'succeeded' ? renderStoredHistoryList() : writeResult;
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
