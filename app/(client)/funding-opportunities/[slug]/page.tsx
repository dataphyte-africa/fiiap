import { Suspense } from 'react';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { format, isBefore, addDays } from 'date-fns';
import { 
  ArrowLeft, 
  ExternalLink, 
  DollarSign,
  Calendar,
  Clock,
  MapPin,
  Building2,
  Users,
  CheckCircle,
  AlertTriangle,
  XCircle,
  FileText,
  Target,
  Award,
  Globe,
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ShareModal } from '@/components/ui/share-modal';
import { FundingOpportunityGrid } from '@/components/funding/funding-opportunity-grid';
import { FundingOpportunityGridSkeleton } from '@/components/funding/funding-opportunity-skeleton';
import { FundingOpportunityStatus, FundingOpportunityType, getFundingOpportunityBySlug, getPublicFundingOpportunities } from '@/lib/data/public-content';

interface FundingOpportunityPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export async function generateMetadata({ params }: FundingOpportunityPageProps): Promise<Metadata> {
  const { slug } = await params;
  const opportunity = await getFundingOpportunityBySlug(slug);

  if (!opportunity) {
    return {
      title: 'Funding Opportunity Not Found | FIIAP',
      description: 'The requested funding opportunity could not be found.',
    };
  }

  return {
    title: `${opportunity.title} | FIIAP Funding Opportunities`,
    description: opportunity.summary || opportunity.description || `Apply for ${opportunity.title} funding opportunity`,
    openGraph: {
      title: opportunity.title,
      description: opportunity.summary || opportunity.description || `Apply for ${opportunity.title} funding opportunity`,
      type: 'article',
      images: opportunity.featured_image_url ? [
        {
          url: opportunity.featured_image_url,
          alt: opportunity.title,
        }
      ] : undefined,
    },
    twitter: {
      card: 'summary_large_image',
      title: opportunity.title,
      description: opportunity.summary || opportunity.description || `Apply for ${opportunity.title} funding opportunity`,
      images: opportunity.featured_image_url ? [opportunity.featured_image_url] : undefined,
    },
  };
}

async function RelatedOpportunities({ currentOpportunityId, opportunityType }: { currentOpportunityId: string; opportunityType: FundingOpportunityType | null }) {
  try {
    const { data: relatedOpportunities } = await getPublicFundingOpportunities({
      type: opportunityType || undefined,
      limit: 3,
    });

    const filtered = relatedOpportunities.filter(opportunity => opportunity.id !== currentOpportunityId);

    if (filtered.length === 0) {
      return null;
    }

    return (
      <section className="mt-16">
        <h2 className="text-2xl font-bold text-gray-900 mb-8">
          Related Funding Opportunities
        </h2>
        <FundingOpportunityGrid opportunities={filtered} showStats={false} />
      </section>
    );
  } catch (error) {
    console.error('Error fetching related funding opportunities:', error);
    return null;
  }
}

export default async function FundingOpportunityPage({ params }: FundingOpportunityPageProps) {
  const { slug } = await params;
  const opportunity = await getFundingOpportunityBySlug(slug);

  if (!opportunity) {
    notFound();
  }

  const getOpportunityTypeBadge = (type: FundingOpportunityType | null) => {
    if (!type) return null;
    
    const colors: Record<string, string> = {
      grant: 'bg-green-100 text-green-800',
      fellowship: 'bg-blue-100 text-blue-800',
      donor_call: 'bg-purple-100 text-purple-800', 
      scholarship: 'bg-orange-100 text-orange-800',
      award: 'bg-yellow-100 text-yellow-800',
      loan: 'bg-red-100 text-red-800',
      other: 'bg-gray-100 text-gray-800',
    };

    const labels: Record<string, string> = {
      donor_call: 'Donor Call',
    };

    return (
      <Badge className={colors[type] || colors.other}>
        {labels[type] || type?.toUpperCase()}
      </Badge>
    );
  };

  const getStatusBadge = (status: FundingOpportunityStatus | null) => {
    if (!status) return null;
    
    const colors: Record<string, string> = {
      open: 'bg-green-100 text-green-800',
      closing_soon: 'bg-yellow-100 text-yellow-800',
      closed: 'bg-red-100 text-red-800',
      postponed: 'bg-gray-100 text-gray-800',
      cancelled: 'bg-red-100 text-red-800',
    };

    const icons: Record<string, React.ReactNode> = {
      open: <CheckCircle className="h-4 w-4" />,
      closing_soon: <AlertTriangle className="h-4 w-4" />,
      closed: <XCircle className="h-4 w-4" />,
      postponed: <Clock className="h-4 w-4" />,
      cancelled: <XCircle className="h-4 w-4" />,
    };

    const labels: Record<string, string> = {
      closing_soon: 'Closing Soon',
    };

    return (
      <Badge className={colors[status] || colors.open}>
        {icons[status]}
        <span className="ml-2">{labels[status] || status?.toUpperCase()}</span>
      </Badge>
    );
  };

  const getOpportunityIcon = (type: string | null) => {
    switch (type) {
      case 'grant':
        return <div className="text-6xl">💰</div>;
      case 'fellowship':
        return <div className="text-6xl">🎓</div>;
      case 'donor_call':
        return <div className="text-6xl">🏢</div>;
      case 'scholarship':
        return <div className="text-6xl">📚</div>;
      case 'award':
        return <div className="text-6xl">🏆</div>;
      case 'loan':
        return <div className="text-6xl">🏦</div>;
      default:
        return <DollarSign className="h-16 w-16 text-gray-400" />;
    }
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'Not specified';
    return format(new Date(dateString), 'MMMM dd, yyyy');
  };

  const formatDateTime = (dateString: string | null) => {
    if (!dateString) return 'Not specified';
    return format(new Date(dateString), 'MMMM dd, yyyy \'at\' h:mm a');
  };

  const formatAmount = (min?: number | null, max?: number | null, currency?: string | null) => {
    if (!min && !max) return 'Not specified';
    const curr = currency || 'USD';
    if (min && max && min !== max) return `${curr} ${min.toLocaleString()} - ${max.toLocaleString()}`;
    if (min) return `${curr} ${min.toLocaleString()}${max ? '' : '+'}`;
    if (max) return `Up to ${curr} ${max.toLocaleString()}`;
    return 'Not specified';
  };

  const getDeadlineStatus = (deadline: string | null) => {
    if (!deadline) return null;
    
    const deadlineDate = new Date(deadline);
    const now = new Date();
    const sevenDaysFromNow = addDays(now, 7);
    
    if (isBefore(deadlineDate, now)) {
      return 'expired';
    } else if (isBefore(deadlineDate, sevenDaysFromNow)) {
      return 'closing_soon';
    }
    return 'open';
  };

  const deadlineStatus = getDeadlineStatus(opportunity.application_deadline);

  return (
    <div className="min-h-screen bg-white">
      {/* Back Navigation */}
      <div className="border-b border-gray-200">
        <div className="container mx-auto px-4 py-4">
          <Link 
            href="/funding-opportunities" 
            className="inline-flex items-center text-primary  hover:text-primary/80 transition-colors"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Funding Opportunities
          </Link>
        </div>
      </div>

      {/* Opportunity Header */}
      <article className="container mx-auto px-4 py-8">
        <header className="mb-8">
          {/* Opportunity Type and Status */}
          <div className="flex items-center gap-3 mb-6">
            {opportunity.opportunity_type && getOpportunityTypeBadge(opportunity.opportunity_type)}
            {opportunity.status && getStatusBadge(opportunity.status)}
            {opportunity.is_featured && (
              <Badge className="bg-yellow-500 text-yellow-50">
                <Award className="h-3 w-3 mr-1" />
                Featured Opportunity
              </Badge>
            )}
            {opportunity.is_verified && (
              <Badge className="bg-green-500 text-green-50">
                <CheckCircle className="h-3 w-3 mr-1" />
                Verified
              </Badge>
            )}
            {opportunity.application_url && opportunity.status === 'open' && (
              <Badge className="bg-blue-500 text-blue-50">
                <ExternalLink className="h-3 w-3 mr-1" />
                Application Available
              </Badge>
            )}
          </div>

          {/* Opportunity Title */}
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-6 leading-tight">
            {opportunity.title}
          </h1>

          {/* Summary */}
          {opportunity.summary && (
            <p className="text-xl text-gray-600 mb-6 leading-relaxed">
              {opportunity.summary}
            </p>
          )}

          {/* Key Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            {/* Funder */}
            <div className="flex items-start gap-3">
              <Building2 className="h-5 w-5 text-blue-600 mt-1" />
              <div>
                <h3 className="font-medium text-gray-900">Funding Organization</h3>
                <p className="text-gray-600">{opportunity.funder_name}</p>
                {opportunity.funder_type && (
                  <p className="text-sm text-gray-500 capitalize">
                    {opportunity.funder_type.replace('_', ' ')}
                  </p>
                )}
              </div>
            </div>

            {/* Application Deadline */}
            <div className="flex items-start gap-3">
              <Calendar className={`h-5 w-5 mt-1 ${
                deadlineStatus === 'expired' ? 'text-red-600' :
                deadlineStatus === 'closing_soon' ? 'text-yellow-600' : 'text-green-600'
              }`} />
              <div>
                <h3 className="font-medium text-gray-900">Application Deadline</h3>
                <p className={`${
                  deadlineStatus === 'expired' ? 'text-red-600 font-medium' :
                  deadlineStatus === 'closing_soon' ? 'text-yellow-600 font-medium' : 'text-gray-600'
                }`}>
                  {formatDateTime(opportunity.application_deadline)}
                </p>
              </div>
            </div>

            {/* Funding Amount */}
            {(opportunity.funding_amount_min || opportunity.funding_amount_max) && (
              <div className="flex items-start gap-3">
                <DollarSign className="h-5 w-5 text-green-600 mt-1" />
                <div>
                  <h3 className="font-medium text-gray-900">Funding Amount</h3>
                  <p className="text-gray-600">
                    {formatAmount(opportunity.funding_amount_min, opportunity.funding_amount_max, opportunity.currency)}
                  </p>
                </div>
              </div>
            )}

            {/* Duration */}
            {opportunity.funding_duration_months && (
              <div className="flex items-start gap-3">
                <Clock className="h-5 w-5 text-purple-600 mt-1" />
                <div>
                  <h3 className="font-medium text-gray-900">Duration</h3>
                  <p className="text-gray-600">{opportunity.funding_duration_months} months</p>
                </div>
              </div>
            )}
          </div>

          {/* Tags */}
          {opportunity.tags && opportunity.tags.length > 0 && (
            <div className="mb-6">
              <h3 className="font-medium text-gray-900 mb-2">Tags</h3>
              <div className="flex flex-wrap gap-2">
                {opportunity.tags.map((tag, index) => (
                  <Badge key={index} variant="outline">
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex flex-wrap gap-4 py-4 border-y border-gray-200">
            {opportunity.application_url && opportunity.status === 'open' && (
              <Button asChild size="lg" className="bg-green-600 hover:bg-green-700">
                <a href={opportunity.application_url} target="_blank" rel="noopener noreferrer">
                  <ExternalLink className="h-4 w-4 mr-2" />
                  Apply Now
                </a>
              </Button>
            )}

            {opportunity.funder_website && (
              <Button asChild variant="outline" size="lg">
                <a href={opportunity.funder_website} target="_blank" rel="noopener noreferrer">
                  <Globe className="h-4 w-4 mr-2" />
                  Visit Funder Website
                </a>
              </Button>
            )}

            <ShareModal
              title={opportunity.title}
              url={`/funding-opportunities/${opportunity.slug}`}
              description={opportunity.summary || opportunity.description || undefined}
            />
          </div>
        </header>

        {/* Opportunity Image */}
        <div className="mb-8">
          {opportunity.featured_image_url ? (
            <div className="relative h-64 md:h-96 rounded-lg overflow-hidden">
              <Image
                src={opportunity.featured_image_url}
                alt={opportunity.title}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 1000px"
                priority
              />
            </div>
          ) : (
            <div className="h-64 md:h-96 bg-gradient-to-br from-gray-100 to-gray-200 rounded-lg flex items-center justify-center">
              {getOpportunityIcon(opportunity.opportunity_type)}
            </div>
          )}
        </div>

        {/* Opportunity Details */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Description */}
            {opportunity.description && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="h-5 w-5" />
                    About This Opportunity
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="prose max-w-none">
                    <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                      {opportunity.description}
                    </p>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Eligibility Criteria */}
            {opportunity.eligibility_criteria && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Users className="h-5 w-5" />
                    Eligibility Criteria
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="prose max-w-none">
                    <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                      {opportunity.eligibility_criteria}
                    </p>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Application Requirements */}
            {opportunity.application_requirements && opportunity.application_requirements.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <CheckCircle className="h-5 w-5" />
                    Application Requirements
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {opportunity.application_requirements.map((requirement, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                        <span className="text-gray-700">{requirement}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            )}

            {/* Selection Criteria */}
            {opportunity.selection_criteria && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Target className="h-5 w-5" />
                    Selection Criteria
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="prose max-w-none">
                    <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                      {opportunity.selection_criteria}
                    </p>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Quick Facts */}
            <Card>
              <CardHeader>
                <CardTitle>Quick Facts</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="font-medium text-gray-900 mb-1">Opportunity Type</h4>
                  <p className="text-gray-600 capitalize">
                    {opportunity.opportunity_type?.replace('_', ' ') || 'Not specified'}
                  </p>
                </div>
                
                <div>
                  <h4 className="font-medium text-gray-900 mb-1">Status</h4>
                  <p className="text-gray-600 capitalize">
                    {opportunity.status?.replace('_', ' ') || 'Not specified'}
                  </p>
                </div>

                <div>
                  <h4 className="font-medium text-gray-900 mb-1">Language</h4>
                  <p className="text-gray-600">{opportunity.language || 'English'}</p>
                </div>
                
                <div>
                  <h4 className="font-medium text-gray-900 mb-1">Published</h4>
                  <p className="text-gray-600">{formatDate(opportunity.created_at)}</p>
                </div>

                {opportunity.funding_period_start && (
                  <div>
                    <h4 className="font-medium text-gray-900 mb-1">Funding Period</h4>
                    <p className="text-gray-600">
                      {formatDate(opportunity.funding_period_start)}
                      {opportunity.funding_period_end && ` - ${formatDate(opportunity.funding_period_end)}`}
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Geographic Focus */}
            {opportunity.geographic_focus && opportunity.geographic_focus.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <MapPin className="h-5 w-5" />
                    Geographic Focus
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {opportunity.geographic_focus.map((location, index) => (
                      <Badge key={index} variant="outline">
                        {location}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Target Populations */}
            {opportunity.target_populations && opportunity.target_populations.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Users className="h-5 w-5" />
                    Target Populations
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {opportunity.target_populations.map((population, index) => (
                      <Badge key={index} variant="outline">
                        {population}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Thematic Areas */}
            {opportunity.thematic_areas && opportunity.thematic_areas.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Thematic Areas</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {opportunity.thematic_areas.map((area, index) => (
                      <Badge key={index} variant="outline">
                        {area}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Funder Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Building2 className="h-5 w-5" />
                  About the Funder
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {opportunity.funder_logo_url && (
                  <div className="flex justify-center">
                    <Image
                      src={opportunity.funder_logo_url}
                      alt={opportunity.funder_name}
                      width={120}
                      height={60}
                      className="object-contain"
                    />
                  </div>
                )}
                
                <div>
                  <h4 className="font-medium text-gray-900 mb-1">Organization</h4>
                  <p className="text-gray-600">{opportunity.funder_name}</p>
                </div>

                {opportunity.funder_type && (
                  <div>
                    <h4 className="font-medium text-gray-900 mb-1">Type</h4>
                    <p className="text-gray-600 capitalize">
                      {opportunity.funder_type.replace('_', ' ')}
                    </p>
                  </div>
                )}

                {opportunity.funder_description && (
                  <div>
                    <h4 className="font-medium text-gray-900 mb-1">About</h4>
                    <p className="text-gray-600 text-sm leading-relaxed">
                      {opportunity.funder_description}
                    </p>
                  </div>
                )}

                {opportunity.funder_contact_person && (
                  <div>
                    <h4 className="font-medium text-gray-900 mb-1">Contact Person</h4>
                    <p className="text-gray-600">{opportunity.funder_contact_person}</p>
                  </div>
                )}

                {opportunity.funder_contact_email && (
                  <div>
                    <h4 className="font-medium text-gray-900 mb-1">Contact Email</h4>
                    <p className="text-gray-600">
                      <a 
                        href={`mailto:${opportunity.funder_contact_email}`}
                        className="text-blue-600 hover:text-blue-700"
                      >
                        {opportunity.funder_contact_email}
                      </a>
                    </p>
                  </div>
                )}

                {opportunity.funder_website && (
                  <div className="pt-4 border-t">
                    <Button asChild variant="outline" className="w-full">
                      <a href={opportunity.funder_website} target="_blank" rel="noopener noreferrer">
                        <Globe className="h-4 w-4 mr-2" />
                        Visit Website
                      </a>
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Application */}
            {opportunity.application_url && (
              <Card className="border-green-200 bg-green-50">
                <CardContent className="p-6">
                  <div className="text-center">
                    <CheckCircle className="h-12 w-12 text-green-600 mx-auto mb-4" />
                    <h3 className="font-semibold text-green-900 mb-2">Ready to Apply?</h3>
                    <p className="text-sm text-green-700 mb-4">
                      Click the button below to access the application form.
                    </p>
                    <Button asChild className="w-full bg-green-600 hover:bg-green-700">
                      <a href={opportunity.application_url} target="_blank" rel="noopener noreferrer">
                        <ExternalLink className="h-4 w-4 mr-2" />
                        Apply Now
                      </a>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </article>

      {/* Related Opportunities */}
      <div className="bg-gray-50 py-16">
        <div className="container mx-auto px-4">
          <Suspense fallback={<FundingOpportunityGridSkeleton count={3} />}>
            <RelatedOpportunities 
              currentOpportunityId={opportunity.id || ''} 
              opportunityType={opportunity.opportunity_type} 
            />
          </Suspense>
        </div>
      </div>
    </div>
  );
}
