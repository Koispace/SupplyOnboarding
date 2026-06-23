export const DASHBOARD_STATS = {
  totalProducts: 24,
  approved: 18,
  pendingReview: 4,
  trustScore: 92,
}

export const DASHBOARD_ALERTS = [
  {
    id: 'a1',
    severity: 'red',
    title: '2 products need label updates',
    subtitle: 'Updates required to comply with new regulations.',
  },
  {
    id: 'a2',
    severity: 'amber',
    title: 'FSSAI expires in 37 days',
    subtitle: 'Renew your license to maintain active status.',
  },
  {
    id: 'a3',
    severity: 'blue',
    title: '1 claim flagged by AI',
    subtitle: 'Review "Sugar-Free" claim on Energy Bites.',
  },
]

export const VERIFICATION_PIPELINE = [
  { stage: 'Draft', count: 2, key: 'draft' },
  { stage: 'Submitted', count: 1, key: 'submitted' },
  { stage: 'AI Review', count: 3, key: 'ai_review' },
  { stage: 'Human Review', count: 1, key: 'human_review' },
  { stage: 'Approved', count: 18, key: 'approved' },
]

export const RECENT_PRODUCTS = [
  {
    id: 'p1',
    name: 'Organic Whey Protein',
    status: 'Approved',
    trustScore: 96,
    updated: '2 days ago',
  },
  {
    id: 'p2',
    name: 'Energy Bites - Dark Choc',
    status: 'AI Review',
    trustScore: null,
    updated: '5 hrs ago',
  },
  {
    id: 'p3',
    name: 'Daily Multivitamin',
    status: 'Action Needed',
    trustScore: 72,
    updated: '1 week ago',
  },
  {
    id: 'p4',
    name: 'Pre-Workout Berry',
    status: 'Approved',
    trustScore: 92,
    updated: '2 weeks ago',
  },
]

export const TRUST_METRICS = [
  { label: 'Documentation Completeness', score: 95 },
  { label: 'Ingredient Quality', score: 88 },
  { label: 'Claim Reliability', score: 92 },
  { label: 'Compliance Health', score: 78 },
]
