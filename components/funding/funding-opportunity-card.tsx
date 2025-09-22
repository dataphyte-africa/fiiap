'use client';

import Link from 'next/link';
import Image from 'next/image';
import { format, isBefore, addDays } from 'date-fns';
import { 
  Calendar, 
  DollarSign, 
  ExternalLink, 
  MapPin,
  Clock,
  Building2,
  Users,
  Tag,
  CheckCircle,
  AlertTriangle,
  XCircle
} from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Database } from '@/types/db';

type FundingOpportunity = Database['public']['Tables']['funding_opportunities']['Row'];

interface FundingOpportunityCardProps {
  opportunity: FundingOpportunity;
  showStats?: boolean;
}

export function FundingOpportunityCard({ opportunity, showStats = true }: FundingOpportunityCardProps) {
  const getOpportunityTypeBadge = (type: string | null) => {
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

  const getStatusBadge = (status: string | null) => {
    if (!status) return null;
    
    const colors: Record<string, string> = {
      open: 'bg-green-100 text-green-800',
      closing_soon: 'bg-yellow-100 text-yellow-800',
      closed: 'bg-red-100 text-red-800',
      postponed: 'bg-gray-100 text-gray-800',
      cancelled: 'bg-red-100 text-red-800',
    };

    const icons: Record<string, React.ReactNode> = {
      open: <CheckCircle className="h-3 w-3" />,
      closing_soon: <AlertTriangle className="h-3 w-3" />,
      closed: <XCircle className="h-3 w-3" />,
      postponed: <Clock className="h-3 w-3" />,
      cancelled: <XCircle className="h-3 w-3" />,
    };

    const labels: Record<string, string> = {
      closing_soon: 'Closing Soon',
    };

    return (
      <Badge className={colors[status] || colors.open}>
        {icons[status]}
        <span className="ml-1">{labels[status] || status?.toUpperCase()}</span>
      </Badge>
    );
  };

  const getOpportunityIcon = (type: string | null) => {
    const icons: Record<string, React.ReactNode> = {
      grant: <DollarSign className="h-8 w-8 text-green-600" />,
      fellowship: <Users className="h-8 w-8 text-blue-600" />,
      donor_call: <Building2 className="h-8 w-8 text-purple-600" />,
      scholarship: <Users className="h-8 w-8 text-orange-600" />,
      award: <Tag className="h-8 w-8 text-yellow-600" />,
      loan: <DollarSign className="h-8 w-8 text-red-600" />,
      other: <Tag className="h-8 w-8 text-gray-600" />,
    };

    return icons[type || 'other'] || icons.other;
  };

  const formatAmount = (min?: number | null, max?: number | null, currency?: string | null) => {
    if (!min && !max) return null;
    const curr = currency || 'USD';
    if (min && max && min !== max) return `${curr} ${min.toLocaleString()} - ${max.toLocaleString()}`;
    if (min) return `${curr} ${min.toLocaleString()}${max ? '' : '+'}`;
    if (max) return `Up to ${curr} ${max.toLocaleString()}`;
    return null;
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return null;
    return format(new Date(dateString), 'MMM dd, yyyy');
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
    <Card className="h-full hover:shadow-lg transition-all duration-300 group ">
      <CardContent className="p-0">
        {/* Opportunity Image */}
        <div className="relative h-48 overflow-hidden rounded-t-lg">
          {opportunity.featured_image_url ? (
            <Image
              src={opportunity.featured_image_url}
              alt={opportunity.title}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-300"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-blue-50 to-blue-100 flex items-center justify-center">
              {getOpportunityIcon(opportunity.opportunity_type)}
            </div>
          )}
          
          {/* Opportunity Type Badge */}
          {opportunity.opportunity_type && (
            <div className="absolute top-3 left-3">
              {getOpportunityTypeBadge(opportunity.opportunity_type)}
            </div>
          )}

          {/* Status Badge */}
          {opportunity.status && (
            <div className="absolute top-3 right-3">
              {getStatusBadge(opportunity.status)}
            </div>
          )}

          {/* Featured Badge */}
          {opportunity.is_featured && (
            <div className="absolute bottom-3 left-3">
              <Badge className="bg-yellow-500 text-yellow-50">
                <Tag className="h-3 w-3 mr-1" />
                Featured
              </Badge>
            </div>
          )}

          {/* Verified Badge */}
          {opportunity.is_verified && (
            <div className="absolute bottom-3 right-3">
              <Badge className="bg-green-500 text-green-50">
                <CheckCircle className="h-3 w-3 mr-1" />
                Verified
              </Badge>
            </div>
          )}
        </div>

        {/* Opportunity Content */}
        <div className="p-6">
          {/* Opportunity Title */}
          <div className="mb-4">
            <Link 
              href={`/funding-opportunities/${opportunity.slug}`}
              className="block"
            >
              <h3 className="text-lg font-semibold text-gray-900 group-hover:text-blue-600 transition-colors line-clamp-2 mb-2">
                {opportunity.title}
              </h3>
            </Link>
            
            {/* Summary */}
            {opportunity.summary && (
              <p className="text-gray-600 text-sm line-clamp-2">
                {opportunity.summary}
              </p>
            )}
          </div>

          {/* Funder Information */}
          <div className="flex items-center gap-2 mb-4">
            {opportunity.funder_logo_url ? (
              <Image
                src={opportunity.funder_logo_url}
                alt={opportunity.funder_name}
                width={24}
                height={24}
                className="rounded object-contain"
              />
            ) : (
              <Building2 className="h-5 w-5 text-gray-400" />
            )}
            <div>
              <p className="font-medium text-gray-900 text-sm">{opportunity.funder_name}</p>
              {opportunity.funder_type && (
                <p className="text-xs text-gray-500 capitalize">
                  {opportunity.funder_type.replace('_', ' ')}
                </p>
              )}
            </div>
          </div>

          {/* Opportunity Details */}
          <div className="space-y-3">
            {/* Funding Amount */}
            {formatAmount(opportunity.funding_amount_min, opportunity.funding_amount_max, opportunity.currency) && (
              <div className="flex items-center gap-2">
                <DollarSign className="h-4 w-4 text-green-600" />
                <span className="text-sm font-medium text-gray-900">
                  {formatAmount(opportunity.funding_amount_min, opportunity.funding_amount_max, opportunity.currency)}
                </span>
              </div>
            )}

            {/* Geographic Focus */}
            {opportunity.geographic_focus && opportunity.geographic_focus.length > 0 && (
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-blue-600" />
                <span className="text-sm text-gray-600">
                  {Array.isArray(opportunity.geographic_focus) 
                    ? opportunity.geographic_focus.slice(0, 2).join(', ')
                    : opportunity.geographic_focus
                  }
                  {Array.isArray(opportunity.geographic_focus) && opportunity.geographic_focus.length > 2 && 
                    ` +${opportunity.geographic_focus.length - 2} more`
                  }
                </span>
              </div>
            )}

            {/* Application Deadline */}
            {opportunity.application_deadline && (
              <div className="flex items-center gap-2">
                <Calendar className={`h-4 w-4 ${
                  deadlineStatus === 'expired' ? 'text-red-600' :
                  deadlineStatus === 'closing_soon' ? 'text-yellow-600' : 'text-gray-600'
                }`} />
                <span className={`text-sm ${
                  deadlineStatus === 'expired' ? 'text-red-600 font-medium' :
                  deadlineStatus === 'closing_soon' ? 'text-yellow-600 font-medium' : 'text-gray-600'
                }`}>
                  Deadline: {formatDate(opportunity.application_deadline)}
                </span>
              </div>
            )}

            {/* Duration */}
            {opportunity.funding_duration_months && (
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-purple-600" />
                <span className="text-sm text-gray-600">
                  {opportunity.funding_duration_months} months
                </span>
              </div>
            )}
          </div>

          {/* Tags */}
          {opportunity.tags && opportunity.tags.length > 0 && (
            <div className="mt-4 flex flex-wrap gap-1">
              {opportunity.tags.slice(0, 3).map((tag, index) => (
                <Badge key={index} variant="outline" className="text-xs">
                  {tag}
                </Badge>
              ))}
              {opportunity.tags.length > 3 && (
                <Badge variant="outline" className="text-xs">
                  +{opportunity.tags.length - 3} more
                </Badge>
              )}
            </div>
          )}

          {/* Action Buttons */}
          <div className="mt-6 flex gap-2">
            <Button asChild className="flex-1" size="sm">
              <Link href={`/funding-opportunities/${opportunity.slug}`}>
                View Details
              </Link>
            </Button>
            
            {opportunity.application_url && opportunity.status === 'open' && (
              <Button asChild variant="outline" size="sm">
                <a 
                  href={opportunity.application_url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center"
                >
                  <ExternalLink className="h-3 w-3 mr-1" />
                  Apply
                </a>
              </Button>
            )}
          </div>

          {/* Stats (if enabled) */}
          {showStats && (
            <div className="mt-4 pt-4 border-t border-gray-100 text-xs text-gray-500">
              <div className="flex items-center justify-between">
                <span>Published {formatDate(opportunity.created_at)}</span>
                {opportunity.language && (
                  <span>{opportunity.language}</span>
                )}
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
