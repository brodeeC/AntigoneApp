/**
 * API helpers: base URL from EXPO_PUBLIC_API_BASE_URL or production default.
 * See .env.example — never commit secrets; public Expo vars are embedded at build time.
 */

const DEFAULT_API_BASE = 'https://brodeeclontz.com/AntigoneApp/api';

export function getApiBaseUrl(): string {
  const raw = process.env.EXPO_PUBLIC_API_BASE_URL?.trim();
  return raw && raw.length > 0 ? raw.replace(/\/$/, '') : DEFAULT_API_BASE;
}

/** Path without leading slash, e.g. `read/1` or `search?mode=word&q=a` */
export function apiUrl(pathSuffix: string): string {
  const s = pathSuffix.replace(/^\//, '');
  return `${getApiBaseUrl()}/${s}`;
}

export async function apiFetchJson<T = unknown>(
  pathSuffix: string,
  init?: RequestInit
): Promise<T> {
  const res = await fetch(apiUrl(pathSuffix), init);
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.json() as Promise<T>;
}

export async function fetchMetadata(): Promise<{
  apiVersion: string;
  firstPage: number;
  lastPage: number;
  linesPerPage: number;
  minLine: number;
  maxLine: number;
}> {
  return apiFetchJson('metadata');
}

export function getSpeakersUrl(): string {
  return apiUrl('get_all_speakers');
}

export function buildSearchUrl(params: {
  mode: string;
  q: string;
  speaker?: string | null;
}): string {
  const sp = new URLSearchParams({ mode: params.mode, q: params.q });
  const sk = params.speaker?.trim();
  if (sk) sp.set('speaker', sk);
  return apiUrl(`search?${sp.toString()}`);
}

export function getReadPageUrl(page: number, speaker?: string | null): string {
  const sk = speaker?.trim();
  if (sk) {
    return apiUrl(`read/${page}?speaker=${encodeURIComponent(sk)}`);
  }
  return apiUrl(`read/${page}`);
}

/** `end` omitted or same as `start` → single-line endpoint */
export function getLinesUrl(start: number, end?: number | null, speaker?: string | null): string {
  const sk = speaker?.trim();
  const q = sk ? `?speaker=${encodeURIComponent(sk)}` : '';
  if (end != null && end !== start) {
    return apiUrl(`lines/${start}/${end}${q}`);
  }
  return apiUrl(`lines/${start}${q}`);
}

export function getWordDetailsUrl(word: string): string {
  return apiUrl(`word-details/${encodeURIComponent(word)}`);
}
