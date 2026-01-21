import { BadgesOverview } from '@/components/badges/badges-overview';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Achievement Badges - TILA',
  description: 'View your earned badges and track your progress',
};

export default function BadgesPage() {
  return (
    <div className="container mx-auto py-8 space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">Achievement Badges</h1>
        <p className="text-muted-foreground">
          Earn badges by completing learning milestones and challenges
        </p>
      </div>

      <BadgesOverview />
    </div>
  );
}
