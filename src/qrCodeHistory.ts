import { createMockHistory } from './mockHistory';
import { viewFullHistories } from './viewHistory';

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

const saveHistory = (newHistory: urlHistory[]) => {
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

const renderStoredHistory = () => {
  viewFullHistories(getInitialHistory());
};

export const addHistory = (newOne: string) => {
  const currentHistory = getInitialHistory();
  if (currentHistory.length > 0 && currentHistory[0].url === newOne) {
    return;
  }
  if (saveHistory(buildNextHistory(newOne, currentHistory)) === 'failed') {
    return;
  }
  renderStoredHistory();
};

export const qrCodeHistory = () => {
  addEventListener(
    'DOMContentLoaded',
    () => {
      renderStoredHistory();
    },
    { once: true },
  );

  addEventListener('storage', (e: StorageEvent) => {
    if (e.key !== import.meta.env.VITE_LOCAL_STORAGE_KEY) {
      return;
    }
    renderStoredHistory();
  });
};
