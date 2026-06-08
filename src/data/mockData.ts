import { Property, JourneyStage, Task, Contact, PipelineCard, User } from '../types';

export const MOCK_USER: User = {
  id: '1',
  name: 'Alex Johnson',
  email: 'alex@example.com',
  role: 'homeowner',
  avatarUrl: 'https://i.pravatar.cc/150?img=3',
};

export const MOCK_PROPERTIES: Property[] = [
  {
    id: '1',
    address: '2847 Maple Avenue',
    city: 'Austin',
    state: 'TX',
    zip: '78701',
    purchasePrice: 485000,
    currentValue: 612000,
    mortgageBalance: 390000,
    equity: 222000,
    sqft: 2100,
    beds: 3,
    baths: 2,
    yearBuilt: 2018,
    lat: 30.2672,
    lng: -97.7431,
    imageUrl: 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=600',
  },
  {
    id: '2',
    address: '514 Riverside Drive',
    city: 'Austin',
    state: 'TX',
    zip: '78702',
    purchasePrice: 320000,
    currentValue: 415000,
    mortgageBalance: 280000,
    equity: 135000,
    sqft: 1650,
    beds: 2,
    baths: 2,
    yearBuilt: 2015,
    lat: 30.2550,
    lng: -97.7289,
    imageUrl: 'https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=600',
  },
];

export const BUY_STAGES: JourneyStage[] = [
  { id: 1,  title: 'Pre-Approval',       description: 'Get pre-approved for a mortgage to know your budget.',          status: 'completed', checklist: [{ id: 'b1a', label: 'Gather financial documents', completed: true }, { id: 'b1b', label: 'Submit loan application', completed: true }, { id: 'b1c', label: 'Receive pre-approval letter', completed: true }] },
  { id: 2,  title: 'Home Search',         description: 'Work with your agent to find properties that match your criteria.', status: 'completed', checklist: [{ id: 'b2a', label: 'Define must-haves vs nice-to-haves', completed: true }, { id: 'b2b', label: 'Tour at least 5 homes', completed: true }] },
  { id: 3,  title: 'Make an Offer',       description: 'Submit a competitive offer on your chosen home.',                status: 'active',    checklist: [{ id: 'b3a', label: 'Review comparable sales', completed: true }, { id: 'b3b', label: 'Submit written offer', completed: false }, { id: 'b3c', label: 'Negotiate terms', completed: false }] },
  { id: 4,  title: 'Offer Accepted',      description: 'Seller accepts your offer — time to move fast.',                  status: 'pending',   checklist: [{ id: 'b4a', label: 'Sign purchase agreement', completed: false }, { id: 'b4b', label: 'Wire earnest money deposit', completed: false }] },
  { id: 5,  title: 'Home Inspection',     description: 'Professional inspection to identify any issues.',                 status: 'pending',   checklist: [{ id: 'b5a', label: 'Schedule inspector', completed: false }, { id: 'b5b', label: 'Attend inspection', completed: false }, { id: 'b5c', label: 'Negotiate repairs', completed: false }] },
  { id: 6,  title: 'Appraisal',           description: 'Lender orders an appraisal to verify the home value.',           status: 'pending',   checklist: [{ id: 'b6a', label: 'Appraisal scheduled by lender', completed: false }, { id: 'b6b', label: 'Review appraisal results', completed: false }] },
  { id: 7,  title: 'Title Search',        description: 'Title company verifies clean ownership history.',                 status: 'pending',   checklist: [{ id: 'b7a', label: 'Title search ordered', completed: false }, { id: 'b7b', label: 'Review title commitment', completed: false }] },
  { id: 8,  title: 'Underwriting',        description: 'Lender reviews all documents for final loan approval.',          status: 'pending',   checklist: [{ id: 'b8a', label: 'Submit requested documents', completed: false }, { id: 'b8b', label: 'Respond to conditions', completed: false }] },
  { id: 9,  title: 'Home Insurance',      description: 'Purchase insurance required by the lender.',                     status: 'pending',   checklist: [{ id: 'b9a', label: 'Get at least 3 quotes', completed: false }, { id: 'b9b', label: 'Purchase and send binder to lender', completed: false }] },
  { id: 10, title: 'Final Walkthrough',   description: 'Last chance to verify the home is in agreed condition.',         status: 'pending',   checklist: [{ id: 'b10a', label: 'Schedule walkthrough 24h before closing', completed: false }, { id: 'b10b', label: 'Verify all repairs completed', completed: false }] },
  { id: 11, title: 'Closing Disclosure',  description: 'Review final loan terms and closing costs.',                     status: 'pending',   checklist: [{ id: 'b11a', label: 'Receive CD at least 3 days before closing', completed: false }, { id: 'b11b', label: 'Review all line items', completed: false }] },
  { id: 12, title: 'Wire Closing Funds',  description: 'Transfer down payment and closing costs.',                       status: 'pending',   checklist: [{ id: 'b12a', label: 'Verify wire instructions directly with title', completed: false }, { id: 'b12b', label: 'Send wire transfer', completed: false }] },
  { id: 13, title: 'Sign Documents',      description: 'Sign all closing documents at the title company.',               status: 'pending',   checklist: [{ id: 'b13a', label: 'Bring government ID', completed: false }, { id: 'b13b', label: 'Sign all loan and title docs', completed: false }] },
  { id: 14, title: 'Fund the Loan',       description: 'Lender releases funds to complete the purchase.',                status: 'pending',   checklist: [{ id: 'b14a', label: 'Lender funds confirmed', completed: false }] },
  { id: 15, title: 'Get the Keys',        description: 'Congratulations — you are a homeowner!',                         status: 'pending',   checklist: [{ id: 'b15a', label: 'Receive keys and garage openers', completed: false }, { id: 'b15b', label: 'Change all locks', completed: false }] },
  { id: 16, title: 'Move In',             description: 'Settle into your new home.',                                     status: 'pending',   checklist: [{ id: 'b16a', label: 'Transfer utilities to your name', completed: false }, { id: 'b16b', label: 'Update address with USPS and accounts', completed: false }, { id: 'b16c', label: 'Schedule movers', completed: false }] },
];

export const SELL_STAGES: JourneyStage[] = [
  { id: 1,  title: 'Prepare Home',       description: 'Get your home market-ready with repairs and staging.',            status: 'completed', checklist: [{ id: 's1a', label: 'Complete minor repairs', completed: true }, { id: 's1b', label: 'Deep clean entire home', completed: true }, { id: 's1c', label: 'Stage key rooms', completed: true }] },
  { id: 2,  title: 'Pricing Strategy',   description: 'Set a competitive list price based on the market.',               status: 'completed', checklist: [{ id: 's2a', label: 'Review CMA from agent', completed: true }, { id: 's2b', label: 'Agree on list price', completed: true }] },
  { id: 3,  title: 'List Property',      description: 'Go live on MLS and major portals.',                               status: 'active',    checklist: [{ id: 's3a', label: 'Professional photos taken', completed: true }, { id: 's3b', label: 'MLS listing created', completed: false }, { id: 's3c', label: 'Yard sign installed', completed: false }] },
  { id: 4,  title: 'Marketing Active',   description: 'Drive buyer traffic through digital and print campaigns.',         status: 'pending',   checklist: [{ id: 's4a', label: 'Social media ads running', completed: false }, { id: 's4b', label: 'Open house scheduled', completed: false }] },
  { id: 5,  title: 'Showings',           description: 'Host private tours for interested buyers.',                       status: 'pending',   checklist: [{ id: 's5a', label: 'Accept showing requests', completed: false }, { id: 's5b', label: 'Gather agent feedback', completed: false }] },
  { id: 6,  title: 'Review Offers',      description: 'Evaluate and negotiate incoming offers.',                         status: 'pending',   checklist: [{ id: 's6a', label: 'Review all offer terms', completed: false }, { id: 's6b', label: 'Counter or accept best offer', completed: false }] },
  { id: 7,  title: 'Under Contract',     description: 'Accepted offer — the home is under contract.',                   status: 'pending',   checklist: [{ id: 's7a', label: 'Sign purchase agreement', completed: false }, { id: 's7b', label: 'Receive earnest money', completed: false }] },
  { id: 8,  title: 'Buyer Inspection',   description: 'Buyer inspector reviews the property.',                          status: 'pending',   checklist: [{ id: 's8a', label: 'Provide access for inspection', completed: false }, { id: 's8b', label: 'Review repair requests', completed: false }, { id: 's8c', label: 'Negotiate concessions', completed: false }] },
  { id: 9,  title: 'Appraisal',          description: 'Lender appraises the home to confirm value.',                    status: 'pending',   checklist: [{ id: 's9a', label: 'Provide access for appraiser', completed: false }, { id: 's9b', label: 'Review appraisal outcome', completed: false }] },
  { id: 10, title: 'Title & Escrow',     description: 'Title company prepares closing documents.',                       status: 'pending',   checklist: [{ id: 's10a', label: 'Provide payoff info to title', completed: false }, { id: 's10b', label: 'Review settlement statement', completed: false }] },
  { id: 11, title: 'Buyer Financing',    description: 'Buyer lender finalizes the loan.',                                status: 'pending',   checklist: [{ id: 's11a', label: 'Monitor loan status updates', completed: false }] },
  { id: 12, title: 'Final Walkthrough',  description: 'Buyer confirms home is in agreed condition.',                     status: 'pending',   checklist: [{ id: 's12a', label: 'Leave home accessible for walkthrough', completed: false }] },
  { id: 13, title: 'Sign Closing Docs',  description: 'Sign deed and transfer documents.',                               status: 'pending',   checklist: [{ id: 's13a', label: 'Sign deed and seller documents', completed: false }] },
  { id: 14, title: 'Transfer Funds',     description: 'Net proceeds wired to your account.',                             status: 'pending',   checklist: [{ id: 's14a', label: 'Confirm wire instructions with title', completed: false }, { id: 's14b', label: 'Receive net proceeds', completed: false }] },
  { id: 15, title: 'Hand Over Keys',     description: 'Official transfer of possession.',                                status: 'pending',   checklist: [{ id: 's15a', label: 'Hand over all keys and codes', completed: false }, { id: 's15b', label: 'Remove all personal belongings', completed: false }] },
  { id: 16, title: 'Sold!',              description: 'Transaction complete. Congratulations!',                          status: 'pending',   checklist: [{ id: 's16a', label: 'File closing documents', completed: false }, { id: 's16b', label: 'Update address with USPS', completed: false }] },
];

export const MOCK_TASKS: Task[] = [
  { id: '1', title: 'Submit mortgage pre-approval docs', dueDate: 'Jun 10', priority: 'high',   completed: false },
  { id: '2', title: 'Schedule home inspection',          dueDate: 'Jun 12', priority: 'high',   completed: false },
  { id: '3', title: 'Review purchase agreement',         dueDate: 'Jun 15', priority: 'medium', completed: false },
  { id: '4', title: 'Get homeowner insurance quotes',    dueDate: 'Jun 18', priority: 'medium', completed: true  },
  { id: '5', title: 'Transfer utilities',                dueDate: 'Jun 25', priority: 'low',    completed: false },
];

export const MOCK_CONTACTS: Contact[] = [
  {
    id: '1', name: 'Sarah Mitchell', phone: '(512) 555-0121', email: 'sarah.mitchell@email.com',
    address: '1203 Oak Lane, Austin TX', status: 'Active', type: 'Buyer', lastContact: '2 days ago',
    engagementScore: 92, avatarUrl: 'https://i.pravatar.cc/150?img=5',
    notes: 'Pre-approved at $650k. Wants 3bd/2ba in North Austin.',
    interactions: [
      { id: 'i1', date: 'Jun 5', type: 'Call',    note: 'Discussed new listings in Round Rock.' },
      { id: 'i2', date: 'Jun 2', type: 'Showing', note: 'Toured 3 homes on Maple.' },
      { id: 'i3', date: 'May 28', type: 'Email',  note: 'Sent pre-approval checklist.' },
    ],
    desiredProperty: { minSqft: 1800, maxSqft: 2500, beds: 3, baths: 2, propertyType: 'Single Family', city: 'North Austin', minBudget: 500000, maxBudget: 650000, timing: 'Within 60 days' },
  },
  {
    id: '2', name: 'Marcus Rodriguez', phone: '(512) 555-0145', email: 'mrodriguez@email.com',
    address: '445 Pine Street, Austin TX', status: 'Active', type: 'Seller', lastContact: '1 day ago',
    engagementScore: 88, avatarUrl: 'https://i.pravatar.cc/150?img=12',
    notes: 'Wants to list in July. Home needs light staging.',
    interactions: [
      { id: 'i4', date: 'Jun 6',  type: 'Meeting', note: 'Discussed listing price and timeline.' },
      { id: 'i5', date: 'Jun 1',  type: 'Call',    note: 'Initial consultation call.' },
      { id: 'i6', date: 'May 25', type: 'Email',   note: 'Sent CMA report.' },
    ],
  },
  {
    id: '3', name: 'Jennifer Kim', phone: '(512) 555-0167', email: 'jkim@email.com',
    address: '892 Sunset Blvd, Austin TX', status: 'Lead', type: 'Buyer', lastContact: '1 week ago',
    engagementScore: 55, avatarUrl: 'https://i.pravatar.cc/150?img=9',
    notes: 'Referred by Marcus. Just started browsing.',
    interactions: [
      { id: 'i7', date: 'May 30', type: 'Email', note: 'Intro email with market overview.' },
    ],
    desiredProperty: { minSqft: 1200, maxSqft: 1800, beds: 2, baths: 2, propertyType: 'Condo', city: 'Downtown Austin', minBudget: 350000, maxBudget: 450000, timing: '3-6 months' },
  },
  {
    id: '4', name: 'David Thompson', phone: '(512) 555-0189', email: 'd.thompson@email.com',
    address: '231 River Walk, Austin TX', status: 'Passive', type: 'Buyer', lastContact: '3 weeks ago',
    engagementScore: 30, avatarUrl: 'https://i.pravatar.cc/150?img=15',
    notes: 'Long-term prospect. Not ready until next year.',
    interactions: [
      { id: 'i8', date: 'May 15', type: 'Call', note: 'Check-in call.' },
    ],
    desiredProperty: { minSqft: 2000, maxSqft: 3000, beds: 4, baths: 3, propertyType: 'Single Family', city: 'Cedar Park', minBudget: 600000, maxBudget: 800000, timing: '12+ months' },
  },
  {
    id: '5', name: 'Lisa Chen', phone: '(512) 555-0203', email: 'lchen@email.com',
    address: '1567 Barton Springs, Austin TX', status: 'Active', type: 'Seller', lastContact: 'Today',
    engagementScore: 95, avatarUrl: 'https://i.pravatar.cc/150?img=7',
    notes: 'Motivated seller. Price reduced. Multiple showings this week.',
    interactions: [
      { id: 'i9',  date: 'Jun 7', type: 'Meeting', note: 'Reviewed offers received.' },
      { id: 'i10', date: 'Jun 5', type: 'Showing', note: '4 showings coordinated.' },
      { id: 'i11', date: 'Jun 3', type: 'Call',    note: 'Discussed price reduction strategy.' },
    ],
  },
];

export const MOCK_PIPELINE: PipelineCard[] = [
  { id: '1', clientName: 'Sarah Mitchell', address: '847 Elm St, Austin TX',          stage: 'Under Contract',   value: 585000, daysActive: 12, avatarUrl: 'https://i.pravatar.cc/150?img=5' },
  { id: '2', clientName: 'Lisa Chen',      address: '1567 Barton Springs, Austin TX', stage: 'Active Showings',  value: 720000, daysActive: 8,  avatarUrl: 'https://i.pravatar.cc/150?img=7' },
  { id: '3', clientName: 'Robert Nash',    address: '342 Congress Ave, Austin TX',    stage: 'Offer Received',   value: 495000, daysActive: 5,  avatarUrl: 'https://i.pravatar.cc/150?img=21' },
  { id: '4', clientName: 'Emily Davis',    address: '991 South Lamar, Austin TX',     stage: 'Pre-Approval',     value: 410000, daysActive: 21, avatarUrl: 'https://i.pravatar.cc/150?img=8' },
];
