import AsyncStorage from '@react-native-async-storage/async-storage';

const BOOKMARKS_KEY = '@antigone/bookmarks/v1';

export type LineBookmark = {
  kind: 'line';
  line: number;
  /** optional user note */
  note?: string;
  createdAt: number;
};

export type WordBookmark = {
  kind: 'word';
  /** the surface form the user tapped/bookmarked */
  word: string;
  /** optional lemma if known */
  lemma?: string;
  /** optional line context (deep-link target) */
  line?: number;
  createdAt: number;
};

export type PageBookmark = {
  kind: 'page';
  page: number;
  createdAt: number;
};

export type RangeBookmark = {
  kind: 'range';
  start: number;
  end: number;
  /** optional user note */
  note?: string;
  createdAt: number;
};

export type Bookmark = LineBookmark | WordBookmark | PageBookmark | RangeBookmark;

export type BookmarkTarget =
  | (Omit<LineBookmark, 'createdAt'> & { createdAt?: number })
  | (Omit<WordBookmark, 'createdAt'> & { createdAt?: number })
  | (Omit<PageBookmark, 'createdAt'> & { createdAt?: number })
  | (Omit<RangeBookmark, 'createdAt'> & { createdAt?: number });

type Stored = {
  version: 1;
  items: Bookmark[];
};

function keyOf(b: Bookmark): string {
  if (b.kind === 'line') return `line:${b.line}`;
  if (b.kind === 'page') return `page:${b.page}`;
  if (b.kind === 'range') return `range:${b.start}-${b.end}`;
  // prefer lemma when present to avoid duplicates across inflected forms,
  // but keep form-only bookmarks stable too.
  return `word:${(b.lemma ?? b.word).trim().toLowerCase()}`;
}

async function readStore(): Promise<Stored> {
  try {
    const raw = await AsyncStorage.getItem(BOOKMARKS_KEY);
    if (!raw) return { version: 1, items: [] };
    const parsed = JSON.parse(raw) as Partial<Stored>;
    if (parsed.version !== 1 || !Array.isArray(parsed.items)) return { version: 1, items: [] };
    return { version: 1, items: parsed.items as Bookmark[] };
  } catch {
    return { version: 1, items: [] };
  }
}

async function writeStore(next: Stored): Promise<void> {
  try {
    await AsyncStorage.setItem(BOOKMARKS_KEY, JSON.stringify(next));
  } catch {
    /* ignore */
  }
}

export async function listBookmarks(): Promise<Bookmark[]> {
  const store = await readStore();
  return store.items
    .slice()
    .sort((a, b) => (b.createdAt ?? 0) - (a.createdAt ?? 0));
}

export async function isBookmarked(target: Bookmark | BookmarkTarget): Promise<boolean> {
  const store = await readStore();
  const k = keyOf({ ...(target as any), createdAt: (target as any).createdAt ?? 0 } as Bookmark);
  return store.items.some((b) => keyOf(b) === k);
}

export async function addBookmark(bookmark: Bookmark | BookmarkTarget): Promise<void> {
  const store = await readStore();
  const createdAt = typeof bookmark.createdAt === 'number' ? bookmark.createdAt : Date.now();
  const normalized = { ...bookmark, createdAt } as Bookmark;
  const k = keyOf(normalized);
  const nextItems = store.items.filter((b) => keyOf(b) !== k);
  nextItems.unshift(normalized);
  await writeStore({ version: 1, items: nextItems });
}

export async function removeBookmark(target: Bookmark | BookmarkTarget): Promise<void> {
  const store = await readStore();
  const k = keyOf({ ...(target as any), createdAt: (target as any).createdAt ?? 0 } as Bookmark);
  const nextItems = store.items.filter((b) => keyOf(b) !== k);
  await writeStore({ version: 1, items: nextItems });
}

export async function toggleBookmark(target: Bookmark | BookmarkTarget): Promise<boolean> {
  const store = await readStore();
  const k = keyOf({ ...(target as any), createdAt: (target as any).createdAt ?? 0 } as Bookmark);
  const exists = store.items.some((b) => keyOf(b) === k);
  if (exists) {
    await writeStore({ version: 1, items: store.items.filter((b) => keyOf(b) !== k) });
    return false;
  }
  await writeStore({ version: 1, items: [{ ...target, createdAt: Date.now() } as Bookmark, ...store.items] });
  return true;
}

export async function clearAllBookmarks(): Promise<void> {
  await writeStore({ version: 1, items: [] });
}

