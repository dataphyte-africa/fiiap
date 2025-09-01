import { ResourceCard } from './resource-card';
import { Database } from '@/types/db';

type ResourceLibrary = Database['public']['Tables']['resource_library']['Row'];

interface ResourceGridProps {
  resources: ResourceLibrary[];
  showStats?: boolean;
}

export function ResourceGrid({ resources, showStats = true }: ResourceGridProps) {
  if (resources.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-6xl mb-4">📚</div>
        <h3 className="text-xl font-semibold text-gray-900 mb-2">
          No resources found
        </h3>
        <p className="text-gray-600">
          Check back later for new toolkits, guides, and educational materials from our community.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {resources.map((resource) => (
        <ResourceCard 
          key={resource.id} 
          resource={resource} 
          showStats={showStats}
        />
      ))}
    </div>
  );
}
