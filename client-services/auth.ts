import { createClient } from "@/lib/supabase/client"


export const newProfile =  async (userId: string, name: string) => {
   const supabase = createClient()
   const {error} = await  supabase.from('profiles').insert({
      id: userId,
      name,
      role: 'cso_rep'

   })
   if(error){
      throw new Error(error.message)
   }

}