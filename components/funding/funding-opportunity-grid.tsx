import { Database } from '@/types/db';
import { FundingOpportunityCard } from './funding-opportunity-card';

type FundingOpportunity = Database['public']['Tables']['funding_opportunities']['Row'];

interface FundingOpportunityGridProps {
  opportunities: FundingOpportunity[];
  showStats?: boolean;
}

export function FundingOpportunityGrid({ opportunities, showStats = true }: FundingOpportunityGridProps) {
  if (opportunities.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-6xl mb-4">💰</div>
        <h3 className="text-xl font-semibold text-gray-900 mb-2">
          No funding opportunities found
        </h3>
        <p className="text-gray-600">
          Check back later for new opportunities or adjust your search criteria.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {opportunities.map((opportunity) => (
        <FundingOpportunityCard 
          key={opportunity.id} 
          opportunity={opportunity} 
          showStats={showStats}
        />
      ))}
    </div>
  );
}
