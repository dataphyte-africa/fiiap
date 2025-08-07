import { Skeleton } from "@/components/ui/skeleton";
import { Separator } from "@/components/ui/separator";

export function OrganisationFilterBarSkeleton() {
  return (
    <div className="bg-white border border-gray-200 flex rounded-full p-2 shadow-sm">
      <div className="flex flex-col md:flex-row gap-2 md:items-center md:justify-center w-full">
        {/* Name Search Skeleton */}
        <div className="min-w-[200px]">
          <div className="justify-between text-sm font-normal border border-input rounded-md px-4 py-2 cursor-pointer flex items-center">
            <div className="flex flex-col items-start gap-1">
              <Skeleton className="h-4 w-8" /> {/* Label */}
              <Skeleton className="h-4 w-24" /> {/* Placeholder */}
            </div>
            <Skeleton className="h-4 w-4" /> {/* Icon */}
          </div>
        </div>

        <Separator orientation="vertical" className="h-full w-0.5 hidden md:block" />

        {/* Thematic Area Skeleton */}
        <div className="min-w-[200px]">
          <div className="justify-between text-sm font-normal border border-input rounded-md px-4 py-2 cursor-pointer flex items-center">
            <div className="flex flex-col items-start gap-1">
              <Skeleton className="h-4 w-16" /> {/* Label */}
              <Skeleton className="h-4 w-20" /> {/* Placeholder */}
            </div>
            <Skeleton className="h-4 w-4" /> {/* Icon */}
          </div>
        </div>

        <Separator orientation="vertical" className="h-full w-0.5 hidden md:block" />

        {/* Country Skeleton */}
        <div className="min-w-[200px]">
          <div className="justify-between text-sm font-normal border border-input rounded-md px-4 py-2 cursor-pointer flex items-center">
            <div className="flex flex-col items-start gap-1">
              <Skeleton className="h-4 w-12" /> {/* Label */}
              <Skeleton className="h-4 w-24" /> {/* Placeholder */}
            </div>
            <Skeleton className="h-4 w-4" /> {/* Icon */}
          </div>
        </div>

        <Separator orientation="vertical" className="h-full w-0.5 hidden md:block" />

        {/* Region Skeleton */}
        <div className="min-w-[200px]">
          <div className="justify-between text-sm font-normal border border-input rounded-md px-4 py-2 cursor-pointer flex items-center">
            <div className="flex flex-col items-start gap-1">
              <Skeleton className="h-4 w-10" /> {/* Label */}
              <Skeleton className="h-4 w-20" /> {/* Placeholder */}
            </div>
            <Skeleton className="h-4 w-4" /> {/* Icon */}
          </div>
        </div>

        {/* Search Button Skeleton */}
        <div className="flex gap-2">
          <Skeleton className="h-10 w-20 rounded-full" /> {/* Search button */}
        </div>
      </div>
    </div>
  );
} 