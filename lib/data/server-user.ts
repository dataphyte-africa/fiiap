import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export const getServerUser = async () => {
  const supabase = await createClient();
  const { data, error } = await supabase.auth.getClaims();
  if (error || !data?.claims) {
   redirect('/auth/login');
  }

  const user = data.claims;

  const { data: profile, error: profileError } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.sub)
    .single();

  if (profileError || !profile) {
    redirect('/auth/login');
  }

  return { ...user, profile };
};