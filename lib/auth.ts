export interface User {
  username: string;
  password: string;
  displayName: string;
}

export const USERS: User[] = [
  { username: "client1", password: "123456", displayName: "Айгерім Нұрғалиева" },
  { username: "client2", password: "123456", displayName: "Данияр Тоқтасынұлы" },
  { username: "client3", password: "123456", displayName: "Мадина Серікқызы" },
  { username: "client4", password: "123456", displayName: "Арман Досжанов" },
  { username: "client5", password: "123456", displayName: "Әсел Қайратқызы" },
  { username: "admin", password: "admin123", displayName: "Әкімші" },
];

const COOKIE_NAME = "lg_session";
const MAX_AGE_SECONDS = 60 * 60 * 24 * 7;

function getSecret(): string {
  return process.env.AUTH_SECRET ?? "lifeguard-kz-dev-secret-change-me";
}

function toHex(buf: ArrayBuffer): string {
  const bytes = new Uint8Array(buf);
  let s = "";
  for (let i = 0; i < bytes.length; i++) {
    s += bytes[i].toString(16).padStart(2, "0");
  }
  return s;
}

function fromHex(hex: string): Uint8Array {
  if (hex.length % 2 !== 0) return new Uint8Array(0);
  const out = new Uint8Array(hex.length / 2);
  for (let i = 0; i < out.length; i++) {
    out[i] = parseInt(hex.slice(i * 2, i * 2 + 2), 16);
  }
  return out;
}

function constantTimeEqual(a: Uint8Array, b: Uint8Array): boolean {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) diff |= a[i] ^ b[i];
  return diff === 0;
}

function base64UrlEncode(str: string): string {
  const bytes = new TextEncoder().encode(str);
  let bin = "";
  for (let i = 0; i < bytes.length; i++) bin += String.fromCharCode(bytes[i]);
  return btoa(bin).replace(/=/g, "").replace(/\+/g, "-").replace(/\//g, "_");
}

function base64UrlDecode(s: string): string {
  const pad = s.length % 4 === 0 ? "" : "=".repeat(4 - (s.length % 4));
  const b64 = (s + pad).replace(/-/g, "+").replace(/_/g, "/");
  const bin = atob(b64);
  const bytes = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i);
  return new TextDecoder().decode(bytes);
}

async function sign(username: string): Promise<string> {
  const key = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(getSecret()),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  );
  const sig = await crypto.subtle.sign("HMAC", key, new TextEncoder().encode(username));
  return toHex(sig);
}

export function verifyCredentials(username: string, password: string): User | null {
  const u = USERS.find((x) => x.username === username);
  if (!u) return null;
  const a = new TextEncoder().encode(u.password);
  const b = new TextEncoder().encode(password);
  return constantTimeEqual(a, b) ? u : null;
}

export async function createToken(username: string): Promise<string> {
  const sig = await sign(username);
  return base64UrlEncode(`${username}:${sig}`);
}

export async function verifyToken(token: string | undefined): Promise<User | null> {
  if (!token) return null;
  try {
    const decoded = base64UrlDecode(token);
    const idx = decoded.lastIndexOf(":");
    if (idx < 0) return null;
    const username = decoded.slice(0, idx);
    const sig = decoded.slice(idx + 1);
    const expected = await sign(username);
    if (!constantTimeEqual(fromHex(sig), fromHex(expected))) return null;
    return USERS.find((x) => x.username === username) ?? null;
  } catch {
    return null;
  }
}

export const AUTH_COOKIE = COOKIE_NAME;
export const AUTH_MAX_AGE = MAX_AGE_SECONDS;

export const PROTECTED_PATHS = ["/calculator", "/consultant", "/dashboard"];

export function isProtectedPath(pathname: string): boolean {
  return PROTECTED_PATHS.some((p) => pathname === p || pathname.startsWith(`${p}/`));
}
