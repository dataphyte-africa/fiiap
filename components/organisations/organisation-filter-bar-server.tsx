import { getAllFilterOptions } from "@/lib/data/organisation-filters";
import { OrganisationFilterBar } from "./organisation-filter-bar";

export async function OrganisationFilterBarServer() {
  // Fetch all filter options concurrently using Promise.all
  const { countryOptions, thematicAreaOptions, regionOptions } = await getAllFilterOptions();

  return (
    <OrganisationFilterBar
      countryOptions={countryOptions}
      thematicAreaOptions={thematicAreaOptions}
      regionOptions={regionOptions}
    />
  );
} 