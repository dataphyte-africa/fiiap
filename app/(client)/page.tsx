
import { Hero } from "@/components/landing-page/hero";
import { Feature1 } from "@/components/landing-page/feature-1";
import { Feature2 } from "@/components/landing-page/feature-2";
import { Feature3 } from "@/components/landing-page/feature-3";
import { Feature4 } from "@/components/landing-page/feature-4";
export default function Home() {
  return (
    <main className="min-h-screen flex flex-col items-center w-full">
      <Hero />
      <Feature1 />
      <Feature2 />
      <Feature3 />
      <Feature4 />
    </main>
  );
}
