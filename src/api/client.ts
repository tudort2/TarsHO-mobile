// TARS API Client — update BASE_URL to your Railway deployment
const BASE_URL = process.env.EXPO_PUBLIC_API_URL || 'https://your-app.railway.app';

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${BASE_URL}${path}`, {
    headers: { 'Content-Type': 'application/json', ...options?.headers },
    ...options,
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ message: res.statusText }));
    throw new Error(err.message || 'Request failed');
  }
  return res.json();
}

export const api = {
  auth: {
    login: (email: string, password: string) =>
      request<{ token: string; user: any }>('/api/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email, password }),
      }),
    changePassword: (token: string, currentPassword: string, newPassword: string) =>
      request('/api/auth/change-password', {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
        body: JSON.stringify({ currentPassword, newPassword }),
      }),
  },
  properties: {
    list: (token: string) =>
      request<any[]>('/api/properties', { headers: { Authorization: `Bearer ${token}` } }),
  },
  contacts: {
    list: (token: string) =>
      request<any[]>('/api/contacts', { headers: { Authorization: `Bearer ${token}` } }),
    create: (token: string, data: any) =>
      request('/api/contacts', { method: 'POST', headers: { Authorization: `Bearer ${token}` }, body: JSON.stringify(data) }),
  },
};
