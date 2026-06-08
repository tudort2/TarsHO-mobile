import { Property, Contact, ContactStatus, ContactType, Engagement, Task } from '../types';

const BASE_URL = (process.env.EXPO_PUBLIC_API_URL || 'https://your-app.up.railway.app').replace(/\/$/, '');

// Module-level token — set by AuthContext after login
let _token: string | null = null;
export function setToken(t: string | null) { _token = t; }

// ── Core fetch helper ────────────────────────────────────────────────────────
async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string>),
  };
  if (_token) headers['Authorization'] = `Bearer ${_token}`;

  const res = await fetch(`${BASE_URL}${path}`, { ...options, headers });

  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: res.statusText }));
    throw new Error(err.error || err.message || `Request failed (${res.status})`);
  }
  return res.json();
}

// ── Normalization helpers ────────────────────────────────────────────────────
function normalizeStatus(s: string): ContactStatus {
  switch (s?.toLowerCase()) {
    case 'active':     return 'Active';
    case 'passive':    return 'Passive';
    case 'non_client': return 'Non-Client';
    default:           return 'Lead';
  }
}

function normalizeContactType(t: string): ContactType {
  switch (t?.toLowerCase()) {
    case 'seller': return 'Seller';
    case 'both':   return 'Both';
    default:       return 'Buyer';
  }
}

export function normalizeProperty(raw: any): Property {
  const addr = [raw.address_line1, raw.address_line2].filter(Boolean).join(', ');
  const avm = raw.avm_value || 0;
  const mortgage = raw.mortgage_balance || 0;
  return {
    id: raw.id,
    address: addr,
    city: raw.city,
    state: raw.state,
    zip: raw.zip,
    purchasePrice: parseFloat(raw.purchase_price) || 0,
    currentValue: parseFloat(avm) || parseFloat(raw.purchase_price) || 0,
    avmLow: raw.avm_low ? parseFloat(raw.avm_low) : undefined,
    avmHigh: raw.avm_high ? parseFloat(raw.avm_high) : undefined,
    mortgageBalance: parseFloat(mortgage) || 0,
    mortgageRate: raw.mortgage_rate ? parseFloat(raw.mortgage_rate) : undefined,
    equity: Math.max(0, (parseFloat(avm) || parseFloat(raw.purchase_price) || 0) - parseFloat(mortgage)),
    sqft: raw.sqft || 0,
    beds: raw.beds || 0,
    baths: parseFloat(raw.baths) || 0,
    yearBuilt: raw.year_built || 0,
    imageUrl: undefined,
    tasks: (raw.tasks || []).map(normalizeTask),
  };
}

export function normalizeTask(raw: any): Task {
  return {
    id: raw.id,
    title: raw.title,
    description: raw.description,
    dueDate: raw.due_date ? raw.due_date.split('T')[0] : undefined,
    priority: raw.priority === 'high' ? 'high' : raw.priority === 'low' ? 'low' : 'medium',
    status: raw.status,
    completed: raw.status === 'done',
  };
}

export function normalizeContact(raw: any): Contact {
  return {
    id: raw.id,
    name: `${raw.first_name} ${raw.last_name}`,
    phone: raw.phone || raw.phone_mobile || raw.phone_home || '',
    email: raw.email || '',
    address: raw.address || '',
    status: normalizeStatus(raw.status),
    type: normalizeContactType(raw.contact_type),
    lastContact: raw.last_contact ? raw.last_contact.split('T')[0] : 'Never',
    engagementScore: raw.engagement_score,
    notes: raw.notes || '',
    desiredProperty: (raw.price_min || raw.desired_budget_min) ? {
      minSqft: raw.gla_min || raw.desired_sqft_min || 0,
      maxSqft: raw.gla_max || 0,
      beds: raw.bed_min || raw.desired_beds || 0,
      baths: raw.bath_min || raw.desired_baths || 0,
      propertyType: raw.desired_type || 'Any',
      city: raw.city || raw.desired_city || '',
      minBudget: parseFloat(raw.price_min || raw.desired_budget_min) || 0,
      maxBudget: parseFloat(raw.price_max || raw.desired_budget_max) || 0,
      timing: raw.desired_timing || '',
    } : undefined,
    interactions: (raw.interactions || []).map((i: any) => ({
      id: i.id,
      date: i.occurred_at ? i.occurred_at.split('T')[0] : '',
      type: i.type || 'Note',
      note: i.summary || '',
    })),
  };
}

export function normalizeEngagement(raw: any): Engagement {
  return {
    id: raw.id,
    type: raw.type as 'buy' | 'sell',
    status: raw.status,
    currentStage: raw.current_stage || 1,
    totalStages: raw.total_stages || 16,
    stages: (raw.stages || []).map((s: any) => ({
      stageNumber: s.stage_number,
      name: s.name,
      status: s.status as 'pending' | 'current' | 'done',
    })),
    brokerName: raw.broker_name,
    contactName: raw.contact_name,
    notes: raw.notes,
  };
}

// ── API surface ──────────────────────────────────────────────────────────────
export const api = {
  auth: {
    login: (email: string, password: string) =>
      request<{ token: string; user: any }>('/api/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email, password }),
      }),

    me: () => request<any>('/api/auth/me'),

    updateMe: (data: {
      firstName?: string; lastName?: string; phone?: string;
      brokerage?: string; licenseNo?: string; avatarUrl?: string;
    }) => request<any>('/api/auth/me', { method: 'PATCH', body: JSON.stringify(data) }),

    switchRole: (role: string) =>
      request<{ token: string; user: any }>('/api/auth/switch-role', {
        method: 'POST',
        body: JSON.stringify({ role }),
      }),

    changePassword: (currentPassword: string, newPassword: string) =>
      request('/api/auth/change-password', {
        method: 'POST',
        body: JSON.stringify({ currentPassword, newPassword }),
      }),
  },

  properties: {
    list: () =>
      request<any[]>('/api/properties').then(rows => rows.map(normalizeProperty)),

    get: (id: string) =>
      request<any>(`/api/properties/${id}`).then(normalizeProperty),

    create: (data: {
      addressLine1: string; addressLine2?: string; city: string;
      state: string; zip: string; county?: string;
      beds?: number; baths?: number; sqft?: number; yearBuilt?: number;
      purchasePrice?: number; purchaseDate?: string;
      mortgageBalance?: number; mortgageRate?: number; mortgageType?: string;
    }) => request<any>('/api/properties', { method: 'POST', body: JSON.stringify(data) })
         .then(normalizeProperty),

    refreshAvm: (id: string) =>
      request<any>(`/api/properties/${id}/refresh-avm`, { method: 'POST' }),

    tasks: {
      list: (propertyId: string) =>
        request<any[]>(`/api/properties/${propertyId}/tasks`).then(rows => rows.map(normalizeTask)),

      create: (propertyId: string, data: { title: string; description?: string; dueDate?: string; priority?: string }) =>
        request<any>(`/api/properties/${propertyId}/tasks`, { method: 'POST', body: JSON.stringify(data) })
          .then(normalizeTask),

      update: (propertyId: string, taskId: string, status: string) =>
        request<any>(`/api/properties/${propertyId}/tasks/${taskId}`, {
          method: 'PATCH', body: JSON.stringify({ status }),
        }).then(normalizeTask),
    },
  },

  contacts: {
    list: (params?: { status?: string; type?: string; search?: string }) => {
      const qs = params
        ? '?' + Object.entries(params).filter(([, v]) => v).map(([k, v]) => `${k}=${encodeURIComponent(v!)}`).join('&')
        : '';
      return request<any[]>(`/api/contacts${qs}`).then(rows => rows.map(normalizeContact));
    },

    get: (id: string) =>
      request<any>(`/api/contacts/${id}`).then(normalizeContact),

    create: (data: {
      firstName: string; lastName: string; email?: string; phone?: string;
      address?: string; status?: string; contactType?: string; notes?: string;
    }) => request<any>('/api/contacts', { method: 'POST', body: JSON.stringify(data) })
         .then(normalizeContact),

    update: (id: string, data: Partial<{
      firstName: string; lastName: string; email: string; phone: string;
      address: string; status: string; contactType: string; notes: string; lastContact: string;
    }>) => request<any>(`/api/contacts/${id}`, { method: 'PATCH', body: JSON.stringify(data) })
         .then(normalizeContact),

    logInteraction: (id: string, type: string, summary: string) =>
      request<any>(`/api/contacts/${id}/interactions`, {
        method: 'POST',
        body: JSON.stringify({ type, summary }),
      }),
  },

  engagements: {
    list: () =>
      request<any[]>('/api/engagements').then(rows => rows.map(normalizeEngagement)),

    get: (id: string) =>
      request<any>(`/api/engagements/${id}`).then(normalizeEngagement),

    advance: (id: string) =>
      request<any>(`/api/engagements/${id}/advance`, { method: 'PATCH' })
        .then(normalizeEngagement),
  },

  market: {
    listings: (params: { city?: string; minPrice?: number; maxPrice?: number; minBeds?: number }) => {
      const qs = '?' + Object.entries(params).filter(([, v]) => v !== undefined).map(([k, v]) => `${k}=${v}`).join('&');
      return request<any[]>(`/api/market/listings${qs}`);
    },
  },
};
