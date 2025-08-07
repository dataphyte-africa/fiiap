import {getRequestConfig} from 'next-intl/server';
import { cookies, headers } from 'next/headers';
 
export default getRequestConfig(async () => {
  // Provide a static locale, fetch a user setting,
  // read from `cookies()`, `headers()`, etc.
  // get current url

  const headersList = await headers();
  const locale = headersList.get('accept-language')?.split(',')[0] || 'en';
  const cookieStore = await cookies();
  const cookieLang = cookieStore.get('NEXT_LOCALE')?.value || 'en';
  const lang = locale.split('-')[0] || 'en';
  // console.log(lang, "lang");
  return {
    locale: cookieLang || lang,
    messages: (await import(`../messages/${cookieLang || lang}.json`)).default
  };
});