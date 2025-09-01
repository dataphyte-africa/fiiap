import { Suspense } from 'react';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { 
  ArrowLeft, 
  Download, 
  FileText, 
  User, 
  Calendar,
  // ExternalLink
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ShareModal } from '@/components/ui/share-modal';
import { ResourceGrid } from '@/components/resources/resource-grid';
import { ResourceGridSkeleton } from '@/components/resources/resource-skeleton';
import { getResourceById, getPublicResources } from '@/lib/data/public-content';

interface ResourcePageProps {
  params: Promise< {
    id: string;
  }>;
}

export async function generateMetadata({ params }: ResourcePageProps): Promise<Metadata> {
  const {id} = await params;
  const resource = await getResourceById(id);

  if (!resource) {
    return {
      title: 'Resource Not Found | FIIAP',
      description: 'The requested resource could not be found.',
    };
  }

  return {
    title: `${resource.title} | FIIAP Resources`,
    description: resource.description || `Access ${resource.title} from our resource library`,
    openGraph: {
      title: resource.title,
      description: resource.description || `Access ${resource.title} from our resource library`,
      type: 'article',
      images: resource.image_url ? [
        {
          url: resource.image_url,
          alt: resource.title,
        }
      ] : undefined,
    },
    twitter: {
      card: 'summary_large_image',
      title: resource.title,
      description: resource.description || `Access ${resource.title} from our resource library`,
      images: resource.image_url ? [resource.image_url] : undefined,
    },
  };
}

async function RelatedResources({ currentResourceId, resourceType }: { currentResourceId: string; resourceType: string | null }) {
  try {
    const { data: relatedResources } = await getPublicResources({
      type: resourceType || undefined,
      limit: 3,
    });

    const filtered = relatedResources.filter(resource => resource.id !== currentResourceId);

    if (filtered.length === 0) {
      return null;
    }

    return (
      <section className="mt-16">
        <h2 className="text-2xl font-bold text-gray-900 mb-8">
          Related Resources
        </h2>
        <ResourceGrid resources={filtered} showStats={false} />
      </section>
    );
  } catch (error) {
    console.error('Error fetching related resources:', error);
    return null;
  }
}

export default async function ResourcePage({ params }: ResourcePageProps) {
  const {id} = await params;
  const resource = await getResourceById(id);

  if (!resource) {
    notFound();
  }

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
    switch (resourceType) {
      case 'video':
        return <div className="text-6xl">🎥</div>;
      case 'research_paper':
        return <div className="text-6xl">📄</div>;
      case 'toolkit':
        return <div className="text-6xl">🧰</div>;
      case 'guide':
        return <div className="text-6xl">📖</div>;
      case 'template':
        return <div className="text-6xl">📋</div>;
      case 'report':
        return <div className="text-6xl">📊</div>;
      default:
        return <FileText className="h-16 w-16 text-gray-400" />;
    }
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'Unknown';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Back Navigation */}
      <div className="border-b border-gray-200">
        <div className="container mx-auto px-4 py-4">
          <Link 
            href="/resources" 
            className="inline-flex items-center text-blue-600 hover:text-blue-700 transition-colors"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Resources
          </Link>
        </div>
      </div>

      {/* Resource Header */}
      <article className="container mx-auto px-4 py-8 max-w-4xl">
        <header className="mb-8">
          {/* Resource Type and Status */}
          <div className="flex items-center gap-3 mb-6">
            {resource.resource_type && getResourceTypeBadge(resource.resource_type)}
            {resource.is_featured && (
              <Badge className="bg-yellow-500 text-yellow-50">
                Featured Resource
              </Badge>
            )}
            {resource.file_url && (
              <Badge className="bg-green-500 text-green-50">
                <Download className="h-3 w-3 mr-1" />
                Available for Download
              </Badge>
            )}
          </div>

          {/* Resource Title */}
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-6 leading-tight">
            {resource.title}
          </h1>

          {/* Resource Description */}
          {resource.description && (
            <p className="text-xl text-gray-600 mb-6 leading-relaxed">
              {resource.description}
            </p>
          )}

          {/* Resource Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            {/* Author */}
            {resource.author_name && (
              <div className="flex items-start gap-3">
                <User className="h-5 w-5 text-blue-600 mt-1" />
                <div>
                  <h3 className="font-medium text-gray-900">Author</h3>
                  <p className="text-gray-600">{resource.author_name}</p>
                </div>
              </div>
            )}

            {/* Created Date */}
            <div className="flex items-start gap-3">
              <Calendar className="h-5 w-5 text-green-600 mt-1" />
              <div>
                <h3 className="font-medium text-gray-900">Published</h3>
                <p className="text-gray-600">{formatDate(resource.created_at)}</p>
              </div>
            </div>
          </div>

          {/* Tags */}
          {resource.tags && (
            <div className="mb-6">
              <h3 className="font-medium text-gray-900 mb-2">Tags</h3>
              <div className="flex flex-wrap gap-2">
                {resource.tags.split(',').map((tag, index) => (
                  <Badge key={index} variant="outline">
                    {tag.trim()}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex flex-wrap gap-4 py-4 border-y border-gray-200">
            {resource.file_url && (
              <Button asChild size="lg" className="bg-green-600 hover:bg-green-700">
                <a href={resource.file_url} target="_blank" rel="noopener noreferrer">
                  <Download className="h-4 w-4 mr-2" />
                  Download Resource
                </a>
              </Button>
            )}

            <ShareModal
              title={resource.title}
              url={`/resources/${resource.id}`}
              description={resource.description || undefined}
            />
          </div>
        </header>

        {/* Resource Image */}
        <div className="mb-8">
          {resource.image_url ? (
            <div className="relative h-64 md:h-96 rounded-lg overflow-hidden">
              <Image
                src={resource.image_url}
                alt={resource.title}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 1000px"
                priority
              />
            </div>
          ) : (
            <div className="h-64 md:h-96 bg-gradient-to-br from-gray-100 to-gray-200 rounded-lg flex items-center justify-center">
              {getResourceIcon(resource.resource_type)}
            </div>
          )}
        </div>

        {/* Resource Information */}
        <Card className="mb-8">
          <CardContent className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              About This Resource
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-medium text-gray-900 mb-2">Resource Type</h4>
                <p className="text-gray-600 capitalize">
                  {resource.resource_type?.replace('_', ' ') || 'Document'}
                </p>
              </div>
              
              {resource.author_name && (
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Created By</h4>
                  <p className="text-gray-600">{resource.author_name}</p>
                </div>
              )}
              
              <div>
                <h4 className="font-medium text-gray-900 mb-2">Published</h4>
                <p className="text-gray-600">{formatDate(resource.created_at)}</p>
              </div>
              
              <div>
                <h4 className="font-medium text-gray-900 mb-2">Availability</h4>
                <p className="text-gray-600">
                  {resource.file_url ? 'Available for Download' : 'View Only'}
                </p>
              </div>
            </div>

            {/* Download Section */}
            {resource.file_url && (
              <div className="mt-6 p-4 bg-green-50 rounded-lg border border-green-200">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium text-green-900">Download Resource</h4>
                    <p className="text-sm text-green-700">
                      Click the button below to download this resource to your device.
                    </p>
                  </div>
                  <Button asChild className="bg-green-600 hover:bg-green-700">
                    <a href={resource.file_url} target="_blank" rel="noopener noreferrer">
                      <Download className="h-4 w-4 mr-2" />
                      Download
                    </a>
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </article>

      {/* Related Resources */}
      <div className="bg-gray-50 py-16">
        <div className="container mx-auto px-4">
          <Suspense fallback={<ResourceGridSkeleton count={3} />}>
            <RelatedResources 
              currentResourceId={resource.id || ''} 
              resourceType={resource.resource_type} 
            />
          </Suspense>
        </div>
      </div>
    </div>
  );
}
