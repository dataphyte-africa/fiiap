'use server'

import { cookies } from "next/headers";

import { revalidatePath } from "next/cache";

export const setLanguage = async (value: string) => {
  const cookieStore = await cookies();
  cookieStore.set('NEXT_LOCALE', value);
  revalidatePath('/')
}