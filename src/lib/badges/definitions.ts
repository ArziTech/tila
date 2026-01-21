import { BadgeDefinition } from './types';

export const BADGE_DEFINITIONS: BadgeDefinition[] = [
  {
    id: 'first-steps',
    name: 'First Steps',
    description: 'Complete your first learning item',
    icon: '🌱',
    category: 'MILESTONES',
    criteria: { learnings: 1 },
    points: 10,
  },
  {
    id: 'knowledge-seeker',
    name: 'Knowledge Seeker',
    description: 'Complete 10 learning items',
    icon: '📚',
    category: 'MILESTONES',
    criteria: { learnings: 10 },
    points: 50,
  },
  {
    id: 'dedicated-learner',
    name: 'Dedicated Learner',
    description: 'Complete 50 learning items',
    icon: '🎓',
    category: 'MILESTONES',
    criteria: { learnings: 50 },
    points: 200,
  },
  {
    id: 'on-fire',
    name: 'On Fire',
    description: 'Maintain a 3-day learning streak',
    icon: '🔥',
    category: 'STREAKS',
    criteria: { current_streak: 3 },
    points: 30,
  },
  {
    id: 'unstoppable',
    name: 'Unstoppable',
    description: 'Maintain a 7-day learning streak',
    icon: '⚡',
    category: 'STREAKS',
    criteria: { current_streak: 7 },
    points: 100,
  },
  {
    id: 'point-collector',
    name: 'Point Collector',
    description: 'Earn 100 total points',
    icon: '💎',
    category: 'POINTS',
    criteria: { total_points: 100 },
    points: 25,
  },
  {
    id: 'point-master',
    name: 'Point Master',
    description: 'Earn 1,000 total points',
    icon: '👑',
    category: 'POINTS',
    criteria: { total_points: 1000 },
    points: 150,
  },
  {
    id: 'explorer',
    name: 'Explorer',
    description: 'Learn across 3 different categories',
    icon: '🧭',
    category: 'DIVERSITY',
    criteria: { uniqueCategories: 3 },
    points: 40,
  },
  {
    id: 'polymath',
    name: 'Polymath',
    description: 'Learn across 5 different categories',
    icon: '🌟',
    category: 'DIVERSITY',
    criteria: { uniqueCategories: 5 },
    points: 120,
  },
  {
    id: 'advanced-mind',
    name: 'Advanced Mind',
    description: 'Complete 5 advanced difficulty items',
    icon: '🚀',
    category: 'DIFFICULTY',
    criteria: { advancedCount: 5 },
    points: 80,
  },
];

export function getBadgeById(id: string): BadgeDefinition | undefined {
  return BADGE_DEFINITIONS.find((badge) => badge.id === id);
}

export function calculateBadgeProgress(
  badge: BadgeDefinition,
  userStats: Record<string, number>
): { current: number; required: number; percentage: number } {
  const criteriaKey = Object.keys(badge.criteria)[0] as keyof typeof badge.criteria;
  const required = badge.criteria[criteriaKey] as number;
  const current = userStats[criteriaKey] || 0;
  const percentage = Math.min(100, Math.round((current / required) * 100));

  return { current, required, percentage };
}
