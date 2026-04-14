import AsyncStorage from '@react-native-async-storage/async-storage';

const LAST_READ_PAGE_KEY = '@antigone/lastReadPage';

export async function getLastReadPage(): Promise<number | null> {
  try {
    const raw = await AsyncStorage.getItem(LAST_READ_PAGE_KEY);
    if (raw == null || raw === '') return null;
    const n = parseInt(raw, 10);
    return Number.isFinite(n) && n >= 1 ? n : null;
  } catch {
    return null;
  }
}

export async function setLastReadPage(page: number): Promise<void> {
  try {
    if (!Number.isFinite(page) || page < 1) return;
    await AsyncStorage.setItem(LAST_READ_PAGE_KEY, String(Math.floor(page)));
  } catch {
    /* ignore */
  }
}
