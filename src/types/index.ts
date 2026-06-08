export type Role = 'homeowner' | 'broker' | 'provider' | 'admin';

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
  roles: Role[];
  avatarUrl?: string;
  phone?: string;
  brokerage?: string;
  licenseNo?: string;
}

export interface Property {
  id: string;
  address: string;
  city: string;
  state: string;
  zip: string;
  purchasePrice: number;
  currentValue: number;
  avmLow?: number;
  avmHigh?: number;
  mortgageBalance: number;
  mortgageRate?: number;
  equity: number;
  sqft: number;
  beds: number;
  baths: number;
  yearBuilt: number;
  imageUrl?: string;
  tasks?: Task[];
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
  description?: string;
  dueDate?: string;
  priority: 'high' | 'medium' | 'low';
  status?: string;
  completed: boolean;
}

// Broker contact types
export type BrokerContactType = 'Buyer' | 'Seller' | 'Both';
// Homeowner contact types
export type HomeownerContactType = 'Broker' | 'Provider' | 'Personal';
// Union for all roles
export type ContactType = BrokerContactType | HomeownerContactType;

export type ContactStatus = 'Active' | 'Passive' | 'Lead' | 'Non-Client';

export interface Contact {
  id: string;
  name: string;
  phone: string;
  email: string;
  address: string;
  status: ContactStatus;
  type: ContactType;
  lastContact: string;
  engagementScore?: number;
  avatarUrl?: string;
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

export interface Engagement {
  id: string;
  type: 'buy' | 'sell';
  status: string;
  currentStage: number;
  totalStages: number;
  stages: EngagementStage[];
  brokerName?: string;
  contactName?: string;
  notes?: string;
}

export interface EngagementStage {
  stageNumber: number;
  name: string;
  status: 'pending' | 'current' | 'done';
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
