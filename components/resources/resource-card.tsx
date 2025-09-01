'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Download, FileText, User, Calendar } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Database } from '@/types/db';

type ResourceLibrary = Database['public']['Tables']['resource_library']['Row'];

interface ResourceCardProps {
  resource: ResourceLibrary;
  showStats?: boolean;
}

export function ResourceCard({ resource}: ResourceCardProps) {
  const getResourceTypeBadge = (resourceType: string | null) => {
    if (!resourceType) return null;
    
    const colors: Record<string, string> = {
      toolkit: 'bg-blue-100 text-blue-800',
      research_paper: 'bg-green-100 text-green-800',
      guide: 'bg-purple-100 text-purple-800',
      template: 'bg-orange-100 text-orange-800',
      video: 'bg-red-100 text-red-800',
      document: 'bg-yellow-100 text-yellow-800',
      report: 'bg-indigo-100 text-indigo-800',
      other: 'bg-gray-100 text-gray-800',
    };

    const labels: Record<string, string> = {
      research_paper: 'Research Paper',
      other: 'Other',
    };

    return (
      <Badge className={colors[resourceType] || colors.other}>
        {labels[resourceType] || resourceType?.toUpperCase()}
      </Badge>
    );
  };

  const getResourceIcon = (resourceType: string | null) => {
    const iconProps = { className: "h-12 w-12 text-blue-400" };
    
    switch (resourceType) {
      case 'video':
        return <div className="text-4xl">🎥</div>;
      case 'research_paper':
        return <div className="text-4xl">📄</div>;
      case 'toolkit':
        return <div className="text-4xl">🧰</div>;
      case 'guide':
        return <div className="text-4xl">📖</div>;
      case 'template':
        return <div className="text-4xl">📋</div>;
      case 'report':
        return <div className="text-4xl">📊</div>;
      default:
        return <FileText {...iconProps} />;
    }
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return '';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <Card className="h-full hover:shadow-lg transition-shadow duration-300 group">
      <CardContent className="p-0">
        {/* Resource Image */}
        <div className="relative h-48 overflow-hidden rounded-t-lg">
          {resource.image_url ? (
            <Image
              src={resource.image_url}
              alt={resource.title}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-300"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
              {getResourceIcon(resource.resource_type)}
            </div>
          )}
          
          {/* Resource Type Badge */}
          {resource.resource_type && (
            <div className="absolute top-3 left-3">
              {getResourceTypeBadge(resource.resource_type)}
            </div>
          )}

          {/* Featured Badge */}
          {resource.is_featured && (
            <div className="absolute top-3 right-3">
              <Badge className="bg-yellow-500 text-yellow-50">
                Featured
              </Badge>
            </div>
          )}

          {/* Download Badge */}
          {resource.file_url && (
            <div className="absolute bottom-3 right-3">
              <Badge className="bg-green-500 text-green-50">
                <Download className="h-3 w-3 mr-1" />
                Available
              </Badge>
            </div>
          )}
        </div>

        {/* Resource Content */}
        <div className="p-6">
          {/* Resource Title */}
          <h3 className="text-lg font-semibold text-gray-900 mb-3 line-clamp-2 group-hover:text-blue-600 transition-colors">
            {resource.title}
          </h3>

          {/* Resource Description */}
          {resource.description && (
            <p className="text-gray-600 text-sm mb-4 line-clamp-3">
              {resource.description}
            </p>
          )}

          {/* Resource Details */}
          <div className="space-y-2 mb-4">
            {/* Author */}
            {resource.author_name && (
              <div className="flex items-center gap-2 text-gray-500 text-sm">
                <User className="h-4 w-4" />
                <span>{resource.author_name}</span>
              </div>
            )}

            {/* Created Date */}
            {resource.created_at && (
              <div className="flex items-center gap-2 text-gray-500 text-sm">
                <Calendar className="h-4 w-4" />
                <span>{formatDate(resource.created_at)}</span>
              </div>
            )}
          </div>

          {/* Tags */}
          {resource.tags && (
            <div className="flex flex-wrap gap-1 mb-4">
              {resource.tags.split(',').slice(0, 3).map((tag, index) => (
                <Badge key={index} variant="outline" className="text-xs">
                  {tag.trim()}
                </Badge>
              ))}
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex gap-2">
            <Link href={`/resources/${resource.id}`} className="flex-1">
              <Button className="w-full" variant="outline">
                View Details
              </Button>
            </Link>
            
            {resource.file_url && (
              <Button
                asChild
                size="sm"
                className="bg-green-600 hover:bg-green-700"
              >
                <a 
                  href={resource.file_url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center"
                >
                  <Download className="h-4 w-4" />
                </a>
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
