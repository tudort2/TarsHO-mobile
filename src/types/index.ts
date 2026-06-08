export type Role = 'homeowner' | 'broker' | 'provider' | 'admin';

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
  avatarUrl?: string;
}

export interface Property {
  id: string;
  address: string;
  city: string;
  state: string;
  zip: string;
  purchasePrice: number;
  currentValue: number;
  mortgageBalance: number;
  equity: number;
  sqft: number;
  beds: number;
  baths: number;
  yearBuilt: number;
  lat: number;
  lng: number;
  imageUrl: string;
}

export interface JourneyStage {
  id: number;
  title: string;
  description: string;
  status: 'completed' | 'active' | 'pending';
  checklist: ChecklistItem[];
}

export interface ChecklistItem {
  id: string;
  label: string;
  completed: boolean;
}

export interface Task {
  id: string;
  title: string;
  dueDate: string;
  priority: 'high' | 'medium' | 'low';
  completed: boolean;
}

export type ContactStatus = 'Active' | 'Passive' | 'Lead' | 'Non-Client';
export type ContactType = 'Buyer' | 'Seller';

export interface Contact {
  id: string;
  name: string;
  phone: string;
  email: string;
  address: string;
  status: ContactStatus;
  type: ContactType;
  lastContact: string;
  engagementScore: number;
  avatarUrl: string;
  notes: string;
  desiredProperty?: DesiredProperty;
  interactions: Interaction[];
}

export interface DesiredProperty {
  minSqft: number;
  maxSqft: number;
  beds: number;
  baths: number;
  propertyType: string;
  city: string;
  minBudget: number;
  maxBudget: number;
  timing: string;
}

export interface Interaction {
  id: string;
  date: string;
  type: string;
  note: string;
}

export interface PipelineCard {
  id: string;
  clientName: string;
  address: string;
  stage: string;
  value: number;
  daysActive: number;
  avatarUrl: string;
}
