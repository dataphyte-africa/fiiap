"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { 
  Globe, 
  Calendar, 
  Users, 
  MapPin, 
  Building2,
  FileText,
  FolderOpen,
  Share2,
  Info,
  Languages,
  Phone,
  Mail
} from "lucide-react";
import { useTranslations } from "next-intl";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import type { Database } from "@/types/db";

type Organisation = Database['public']['Tables']['organisations']['Row'];

interface OrganisationDetailViewProps {
  organisation: Organisation;
}

interface TabItem {
  id: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
}

export function OrganisationDetailView({ organisation }: OrganisationDetailViewProps) {
  const t = useTranslations('organisations.detail');
  const [activeTab, setActiveTab] = useState("about");
  
  const tabs: TabItem[] = [
    { id: "about", label: t('tabs.about'), icon: Info },
    { id: "stories", label: t('tabs.stories'), icon: FileText },
    { id: "projects", label: t('tabs.projects'), icon: FolderOpen },
    { id: "documents", label: t('tabs.documents'), icon: FileText },
  ];

  console.log(organisation.cover_image_url);
  return (
    <div className="min-h-screen bg-gray-50 w-full">
      {/* Header Section */}
      <div className={` text-white h-[25vh] bg-cover bg-center bg-no-repeat ${!organisation.cover_image_url ? 'bg-gradient-to-r from-blue-900 to-blue-700' : 'bg-black/40'}`} style={organisation.cover_image_url ? { backgroundImage: `url("${organisation.cover_image_url}")` } : {}}>
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col md:flex-row items-start gap-6">
            {/* Logo */}
            {organisation.logo_url && (
              <div className="flex-shrink-0">
                <Image
                  src={organisation.logo_url}
                  alt={`${organisation.name} logo`}
                  width={80}
                  height={80}
                  className="rounded-lg bg-white p-2"
                />
              </div>
            )}
            
            {/* Organisation Info */}
            <div className="flex-1">
              <h1 className="text-2xl md:text-3xl font-bold mb-2">
                {organisation.name}
              </h1>
              <div className="flex flex-wrap items-center gap-4 text-blue-100 mb-4">
                <div className="flex items-center gap-1">
                  <MapPin className="w-4 h-4" />
                  <span>{[organisation.city, organisation.region, organisation.country].filter(Boolean).join(', ')}</span>
                </div>
                {organisation.website_url && (
                  <div className="flex items-center gap-1">
                    <Globe className="w-4 h-4" />
                    <Link 
                      href={organisation.website_url} 
                      target="_blank"
                      className="hover:text-white underline"
                    >
                      {organisation.website_url.replace(/^https?:\/\//, '')}
                    </Link>
                  </div>
                )}
              </div>
              
              {/* Key Stats */}
              <div className="flex flex-wrap gap-4 text-sm">
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  <span>
                    {t('header.founded')} {organisation.establishment_year || t('header.yearNotSpecified')}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Building2 className="w-4 h-4" />
                  <span>{organisation.type}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4" />
                  <span>{organisation.size} {t('header.scope')}</span>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-2">
              <Button variant="secondary" size="sm">
                <Share2 className="w-4 h-4 mr-2" />
                {t('header.shareProfile')}
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Side Navigation */}
          <div className="lg:w-64 flex-shrink-0">
            <div className="bg-white rounded-lg shadow-sm border p-4 sticky top-8">
              <nav className="space-y-1">
                {tabs.map((tab) => {
                  const Icon = tab.icon;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`w-full flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                        activeTab === tab.id
                          ? "bg-blue-50 text-blue-700 border-r-2 border-blue-700"
                          : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                      {tab.label}
                    </button>
                  );
                })}
              </nav>
            </div>
          </div>

          {/* Tab Content */}
          <div className="flex-1">
            {activeTab === "about" && <AboutTab organisation={organisation} />}
            {activeTab === "stories" && <StoriesTab organisation={organisation} />}
            {activeTab === "projects" && <ProjectsTab organisation={organisation} />}
            {activeTab === "documents" && <DocumentsTab organisation={organisation} />}
          </div>
        </div>
      </div>
    </div>
  );
}

// About Tab Component
function AboutTab({ organisation }: { organisation: Organisation }) {
  const t = useTranslations('organisations.detail.about');
  
  const formatSocialLinks = (socialLinks: unknown) => {
    if (!socialLinks || typeof socialLinks !== 'object') return [];
    return Object.entries(socialLinks as Record<string, unknown>).filter(([, url]) => url);
  };

  return (
    <div className="space-y-6">
      {/* About Organization */}
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <h2 className="text-xl font-semibold mb-4">{t('aboutOrganisation')}</h2>
        <div className="space-y-4">
          {organisation.mission && (
            <div>
              <h3 className="font-medium text-gray-900 mb-2">{t('mission')}</h3>
              <p className="text-gray-600 leading-relaxed">{organisation.mission}</p>
            </div>
          )}
          {organisation.vision && (
            <div>
              <h3 className="font-medium text-gray-900 mb-2">{t('vision')}</h3>
              <p className="text-gray-600 leading-relaxed">{organisation.vision}</p>
            </div>
          )}
        </div>
      </div>

      {/* Mission and Vision */}
      {(organisation.mission || organisation.vision) && (
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <h2 className="text-xl font-semibold mb-4">{t('missionAndVision')}</h2>
          <div className="space-y-4">
            {organisation.mission && (
              <div>
                <h3 className="font-medium text-gray-900 mb-2">{t('ourMission')}</h3>
                <p className="text-gray-600 leading-relaxed">{organisation.mission}</p>
              </div>
            )}
            {organisation.vision && (
              <div>
                <h3 className="font-medium text-gray-900 mb-2">{t('ourVision')}</h3>
                <p className="text-gray-600 leading-relaxed">{organisation.vision}</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Thematic Focus Areas */}
      {organisation.thematic_focus && organisation.thematic_focus.length > 0 && (
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <h2 className="text-xl font-semibold mb-4">{t('thematicFocusAreas')}</h2>
          <div className="flex flex-wrap gap-2">
            {organisation.thematic_focus.map((theme, index) => (
              <Badge key={index} variant="secondary" className="text-sm">
                {theme}
              </Badge>
            ))}
          </div>
        </div>
      )}

      {/* Languages */}
      {organisation.languages_spoken && organisation.languages_spoken.length > 0 && (
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <Languages className="w-5 h-5" />
            {t('languages')}
          </h2>
          <div className="flex flex-wrap gap-2">
            {organisation.languages_spoken.map((language, index) => (
              <Badge key={index} variant="outline" className="text-sm">
                {language}
              </Badge>
            ))}
          </div>
        </div>
      )}

      {/* Social Media */}
      {organisation.social_links && (
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <h2 className="text-xl font-semibold mb-4">{t('socialMedia')}</h2>
          <div className="space-y-3">
            {formatSocialLinks(organisation.social_links).map(([platform, url], index) => (
              <div key={index} className="flex items-center gap-3">
                <div className="w-6 h-6 bg-gray-100 rounded flex items-center justify-center">
                  <Share2 className="w-4 h-4 text-gray-600" />
                </div>
                <Link 
                  href={url as string} 
                  target="_blank" 
                  className="text-blue-600 hover:underline capitalize"
                >
                  {platform}
                </Link>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Contact Details */}
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <h2 className="text-xl font-semibold mb-4">{t('contactDetails')}</h2>
        <div className="space-y-3">
          {organisation.contact_email && (
            <div className="flex items-center gap-3">
              <Mail className="w-5 h-5 text-gray-400" />
              <Link 
                href={`mailto:${organisation.contact_email}`}
                className="text-blue-600 hover:underline"
              >
                {organisation.contact_email}
              </Link>
            </div>
          )}
          {organisation.contact_phone && (
            <div className="flex items-center gap-3">
              <Phone className="w-5 h-5 text-gray-400" />
              <Link 
                href={`tel:${organisation.contact_phone}`}
                className="text-blue-600 hover:underline"
              >
                {organisation.contact_phone}
              </Link>
            </div>
          )}
          {organisation.address && (
            <div className="flex items-start gap-3">
              <MapPin className="w-5 h-5 text-gray-400 mt-0.5" />
              <span className="text-gray-600">{organisation.address}</span>
            </div>
          )}
          {organisation.website_url && (
            <div className="flex items-center gap-3">
              <Globe className="w-5 h-5 text-gray-400" />
              <Link 
                href={organisation.website_url}
                target="_blank"
                className="text-blue-600 hover:underline"
              >
                {organisation.website_url}
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// Placeholder tabs - these would be implemented based on your requirements
function StoriesTab({ organisation }: { organisation: Organisation }) {
  const t = useTranslations('organisations.detail.stories');
  
  return (
    <div className="bg-white rounded-lg shadow-sm border p-6">
      <h2 className="text-xl font-semibold mb-4">{t('title')}</h2>
      <p className="text-gray-500">{t('placeholder', { organisationName: organisation.name })}</p>
    </div>
  );
}

function ProjectsTab({ organisation }: { organisation: Organisation }) {
  const t = useTranslations('organisations.detail.projects');
  
  return (
    <div className="bg-white rounded-lg shadow-sm border p-6">
      <h2 className="text-xl font-semibold mb-4">{t('title')}</h2>
      <p className="text-gray-500">{t('placeholder', { organisationName: organisation.name })}</p>
    </div>
  );
}

function DocumentsTab({ organisation }: { organisation: Organisation }) {
  const t = useTranslations('organisations.detail.documents');
  
  return (
    <div className="bg-white rounded-lg shadow-sm border p-6">
      <h2 className="text-xl font-semibold mb-4">{t('title')}</h2>
      <p className="text-gray-500">{t('placeholder', { organisationName: organisation.name })}</p>
    </div>
  );
} 