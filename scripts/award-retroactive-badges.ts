import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '../src/generated/prisma/client';
import { evaluateUserBadges } from '../src/lib/badges/evaluator';
import 'dotenv/config';

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL,
});

const prisma = new PrismaClient({
  adapter,
});

async function awardRetroactiveBadges() {
  console.log('🏆 Starting retroactive badge awarding...\n');

  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        email: true,
        name: true,
      },
    });

    console.log(`Found ${users.length} users\n`);

    let totalBadgesAwarded = 0;
    let totalPointsAwarded = 0;
    const results: Array<{
      userId: string;
      email: string | null;
      badgesAwarded: number;
      pointsEarned: number;
    }> = [];

    for (const user of users) {
      try {
        const result = await evaluateUserBadges(user.id);

        if (result.awardedBadges.length > 0) {
          totalBadgesAwarded += result.awardedBadges.length;
          totalPointsAwarded += result.totalPointsEarned;

          results.push({
            userId: user.id,
            email: user.email,
            badgesAwarded: result.awardedBadges.length,
            pointsEarned: result.totalPointsEarned,
          });

          console.log(
            `✅ ${user.email || user.name}: Awarded ${result.awardedBadges.length} badge(s), +${result.totalPointsEarned} pts`
          );
        } else {
          console.log(`⏭️  ${user.email || user.name}: No new badges`);
        }
      } catch (error) {
        console.error(`❌ Error processing user ${user.email || user.name}:`, error);
      }
    }

    console.log('\n' + '='.repeat(60));
    console.log('RETROACTIVE BADGE AWARDING COMPLETE');
    console.log('='.repeat(60));
    console.log(`Total users processed: ${users.length}`);
    console.log(`Total badges awarded: ${totalBadgesAwarded}`);
    console.log(`Total points awarded: ${totalPointsAwarded}`);
    console.log(`Users who received badges: ${results.length}`);
  } catch (error) {
    console.error('Fatal error:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

awardRetroactiveBadges()
  .then(() => {
    console.log('\n✅ Script completed successfully');
    process.exit(0);
  })
  .catch((error) => {
    console.error('\n❌ Script failed:', error);
    process.exit(1);
  });
