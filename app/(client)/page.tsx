
import { Hero } from "@/components/landing-page/hero";
import { Feature1 } from "@/components/landing-page/feature-1";
import { Feature2 } from "@/components/landing-page/feature-2";
import { Feature3 } from "@/components/landing-page/feature-3";
import { FeaturedBlogPosts } from "@/components/landing-page/featured-blog-posts";
import { FeaturedForumPosts } from "@/components/landing-page/featured-forum-posts";
import { Suspense } from "react";
import { OrganisationsGridSkeleton } from "@/components/organisations";
import { FeaturedBlogPostsSkeleton, FeaturedForumPostsSkeleton } from "@/components/landing-page/featured-content-skeleton";

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col items-center w-full">
      <Hero />
      <Feature1 />
      <Feature2 />
      <Suspense fallback={<OrganisationsGridSkeleton />}>
        <Feature3 />
      </Suspense>
      
      {/* Featured Blog Posts Section */}
      <Suspense fallback={<FeaturedBlogPostsSkeleton />}>
        <FeaturedBlogPosts />
      </Suspense>
      
      {/* Featured Forum Posts Section */}
      <Suspense fallback={<FeaturedForumPostsSkeleton />}>
        <FeaturedForumPosts />
      </Suspense>
      
    </main>
  );
}
