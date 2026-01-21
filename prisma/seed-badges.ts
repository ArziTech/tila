import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient, BadgeCategory } from '../src/generated/prisma/client';
import 'dotenv/config';

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL,
});

const prisma = new PrismaClient({
  adapter,
});

const badges = [
  // MILESTONES
  {
    id: 'first-steps',
    name: 'First Steps',
    description: 'Complete your first learning item',
    icon: '🌱',
    category: BadgeCategory.MILESTONES,
    criteria: { learnings: 1 },
    points: 10,
  },
  {
    id: 'knowledge-seeker',
    name: 'Knowledge Seeker',
    description: 'Complete 10 learning items',
    icon: '📚',
    category: BadgeCategory.MILESTONES,
    criteria: { learnings: 10 },
    points: 50,
  },
  {
    id: 'dedicated-learner',
    name: 'Dedicated Learner',
    description: 'Complete 50 learning items',
    icon: '🎓',
    category: BadgeCategory.MILESTONES,
    criteria: { learnings: 50 },
    points: 200,
  },
  // STREAKS
  {
    id: 'on-fire',
    name: 'On Fire',
    description: 'Maintain a 3-day learning streak',
    icon: '🔥',
    category: BadgeCategory.STREAKS,
    criteria: { current_streak: 3 },
    points: 30,
  },
  {
    id: 'unstoppable',
    name: 'Unstoppable',
    description: 'Maintain a 7-day learning streak',
    icon: '⚡',
    category: BadgeCategory.STREAKS,
    criteria: { current_streak: 7 },
    points: 100,
  },
  // POINTS
  {
    id: 'point-collector',
    name: 'Point Collector',
    description: 'Earn 100 total points',
    icon: '💎',
    category: BadgeCategory.POINTS,
    criteria: { total_points: 100 },
    points: 25,
  },
  {
    id: 'point-master',
    name: 'Point Master',
    description: 'Earn 1,000 total points',
    icon: '👑',
    category: BadgeCategory.POINTS,
    criteria: { total_points: 1000 },
    points: 150,
  },
  // DIVERSITY
  {
    id: 'explorer',
    name: 'Explorer',
    description: 'Learn across 3 different categories',
    icon: '🧭',
    category: BadgeCategory.DIVERSITY,
    criteria: { uniqueCategories: 3 },
    points: 40,
  },
  {
    id: 'polymath',
    name: 'Polymath',
    description: 'Learn across 5 different categories',
    icon: '🌟',
    category: BadgeCategory.DIVERSITY,
    criteria: { uniqueCategories: 5 },
    points: 120,
  },
  // DIFFICULTY
  {
    id: 'advanced-mind',
    name: 'Advanced Mind',
    description: 'Complete 5 advanced difficulty items',
    icon: '🚀',
    category: BadgeCategory.DIFFICULTY,
    criteria: { advancedCount: 5 },
    points: 80,
  },
];

async function main() {
  console.log('Seeding badges...');

  for (const badge of badges) {
    await prisma.badge.upsert({
      where: {
        id: badge.id,
      },
      update: {},
      create: badge,
    });
  }

  console.log(`Seeded ${badges.length} badges`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
