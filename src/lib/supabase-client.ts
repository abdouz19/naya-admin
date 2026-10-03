const SUPABASE_URL = 'https://yskwdjaurwomsjpdgwgl.supabase.co';
const SUPABASE_KEY =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inlza3dkamF1cndvbXNqcGRnd2dsIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4NjM3NTkxMiwiZXhwIjoyMTAxOTUxOTEyfQ.m7FK-s79oFC70e6vpS9iIifL7F0KTKgZNWsR7IrGg-0';

export async function supabaseRest<T = any>(
  path: string,
  options: RequestInit = {},
): Promise<T | null> {
  try {
    const url = `${SUPABASE_URL}/rest/v1/${path}`;
    const res = await fetch(url, {
      ...options,
      headers: {
        apikey: SUPABASE_KEY,
        Authorization: `Bearer ${SUPABASE_KEY}`,
        'Content-Type': 'application/json',
        ...(options.headers || {}),
      },
    });
    if (!res.ok) {
      return null;
    }
    return (await res.json()) as T;
  } catch (_) {
    return null;
  }
}
