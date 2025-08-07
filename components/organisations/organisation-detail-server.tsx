import { notFound } from "next/navigation";
import { getOrganisationById } from "@/lib/data/organisations";
import { OrganisationDetailView } from "./organisation-detail-view";

interface OrganisationDetailServerProps {
  id: string;
}

export async function OrganisationDetailServer({ id }: OrganisationDetailServerProps) {
  const organisation = await getOrganisationById(id);

  if (!organisation) {
    notFound();
  }

  return <OrganisationDetailView organisation={organisation} />;
} 