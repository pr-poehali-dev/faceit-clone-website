export const API = {
  auth: 'https://functions.poehali.dev/d7bb5f01-ef32-4791-b1ad-27ad0c284310',
  matchmaking: 'https://functions.poehali.dev/89078a48-a536-42a2-9153-df048e23e121',
  profile: 'https://functions.poehali.dev/c06b7f06-a2cb-48b9-8cc0-87be80a77afe',
};

export function getToken(): string | null {
  return localStorage.getItem('fz_token');
}

export function setToken(token: string) {
  localStorage.setItem('fz_token', token);
}

export function clearToken() {
  localStorage.removeItem('fz_token');
}

export interface PlayerStats {
  WinRate: number;
  AVG: number;
  KD: number;
  KR: number;
  HS: number;
  ADR: number;
}

export interface Profile {
  id: number;
  steam_id: string;
  nickname: string;
  avatar_url: string;
  elo: number;
  matches: number;
  stats: PlayerStats;
}

export interface LobbyPlayer {
  nickname: string;
  avatar_url: string;
  elo: number;
  team: number;
}

export interface MatchState {
  state: 'idle' | 'searching' | 'lobby';
  in_queue?: number;
  needed?: number;
  lobby_id?: number;
  status?: string;
  map?: string;
  server?: string;
  players?: LobbyPlayer[];
}

async function authedFetch(url: string, options: RequestInit = {}) {
  const token = getToken();
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string>),
  };
  if (token) headers['X-Auth-Token'] = token;
  const res = await fetch(url, { ...options, headers });
  return res.json();
}

export async function steamLogin() {
  const returnUrl = window.location.origin + window.location.pathname + '?steam=1';
  const res = await fetch(`${API.auth}?action=login&return_url=${encodeURIComponent(returnUrl)}`);
  const data = await res.json();
  if (data.url) window.location.href = data.url;
}

export async function handleSteamCallback(): Promise<boolean> {
  const params = new URLSearchParams(window.location.search);
  if (!params.get('steam')) return false;
  const qs = window.location.search.replace('?', '');
  const res = await fetch(`${API.auth}?action=callback&${qs}`);
  const data = await res.json();
  if (data.token) {
    setToken(data.token);
    window.history.replaceState({}, '', window.location.pathname);
    return true;
  }
  return false;
}

export async function getProfile(): Promise<Profile | null> {
  if (!getToken()) return null;
  const data = await authedFetch(API.profile);
  if (data.error) return null;
  return data;
}

export async function uploadAvatar(imageBase64: string): Promise<string | null> {
  const data = await authedFetch(API.profile, {
    method: 'POST',
    body: JSON.stringify({ image: imageBase64 }),
  });
  return data.avatar_url || null;
}

export async function matchmaking(action: 'join' | 'leave' | 'status'): Promise<MatchState> {
  return authedFetch(API.matchmaking, {
    method: 'POST',
    body: JSON.stringify({ action }),
  });
}
