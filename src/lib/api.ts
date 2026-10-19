/** Where the admin keeps its session token (see AuthContext). */
export const ADMIN_TOKEN_STORAGE_KEY = 'nayha_admin_token';

/** Dispatched on `window` when the API refuses the session (401/403). */
export const UNAUTHORIZED_EVENT = 'nayha:unauthorized';

/**
 * `fetch` for the NAYHA API: adds the admin's token, which every admin route
 * requires, and signals a refused session so the admin is sent back to the
 * login page.
 */
export async function apiFetch(
  input: string,
  init: RequestInit = {},
): Promise<Response> {
  const token = localStorage.getItem(ADMIN_TOKEN_STORAGE_KEY);
  const headers = new Headers(init.headers);
  if (token && !headers.has('Authorization')) {
    headers.set('Authorization', `Bearer ${token}`);
  }
  const res = await fetch(input, { ...init, headers });
  if (res.status === 401 || res.status === 403) {
    window.dispatchEvent(new Event(UNAUTHORIZED_EVENT));
  }
  return res;
}
