export interface BadgeCriteria {
  learnings?: number;
  total_points?: number;
  current_streak?: number;
  longest_streak?: number;
  uniqueCategories?: number;
  beginnerCount?: number;
  intermediateCount?: number;
  advancedCount?: number;
}

export interface BadgeDefinition {
  id: string;
  name: string;
  description: string;
  icon: string;
  category: string;
  criteria: BadgeCriteria;
  points: number;
}

export interface BadgeProgress {
  badge: BadgeDefinition;
  current: number;
  required: number;
  percentage: number;
  earned: boolean;
}

export interface UserBadgeWithDetails {
  id: string;
  name: string;
  description: string;
  icon: string;
  category: string;
  points: number;
  earnedAt: Date;
}
