import { AppSidebar } from "@/components/app-sidebar"

import { Separator } from "@/components/ui/separator"
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar"
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import BreadCrumb from "@/components/bread-crumb";

export default async function Page( {children}: {children: React.ReactNode}) {
   const supabase = await createClient();
   
 
  const { data, error } = await supabase.auth.getClaims();
   if (error || !data?.claims) {
      redirect("/auth/login");
   }
   console.log(data.claims)
  
  return (
    <SidebarProvider>
      <AppSidebar user={{name: data.claims.user_metadata.displayName, email: data.claims.email || "", avatar: data.claims.user_metadata.avatar_url, role: data.claims.user_role}} />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12">
          <div className="flex items-center gap-2 px-4">
            <SidebarTrigger className="-ml-1" />
            <Separator
              orientation="vertical"
              className="mr-2 data-[orientation=vertical]:h-4"
            />
            <BreadCrumb />
          </div>
        </header>
        <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
          {children}
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
