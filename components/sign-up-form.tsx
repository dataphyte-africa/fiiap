"use client";

import { cn } from "@/lib/utils";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import Image from "next/image";
import { useTranslations } from "next-intl";
// import { newProfile } from "@/client-services/auth";

export function SignUpForm({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"div">) {
  const t = useTranslations('auth.signUp');
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [repeatPassword, setRepeatPassword] = useState("");
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    const supabase = createClient();
    setIsLoading(true);
    setError(null);

    if (password !== repeatPassword) {
      setError(t('passwordsNoMatch'));
      setIsLoading(false);
      return;
    }

    if (!acceptTerms) {
      setError(t('mustAcceptTerms'));
      setIsLoading(false);
      return;
    }

    try {
      const { error, data } = await supabase.auth.signUp({
      
        email,
        password,
        options: {
          // emailRedirectTo: `${window.location.origin}/protected`,
          data: {
           displayName: name,
          }
        },
      });
      if (error) throw error;
      if (!data.user) throw new Error("User not created")
      // await newProfile(data.user?.id, name)
      router.push("/auth/sign-up-success");
    } catch (error: unknown) {
      setError(error instanceof Error ? error.message : "An error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader>
          <Image src="/logo.png" alt="logo" width={50} height={50} />
          <CardTitle className="text-2xl">{t('title')}</CardTitle>
          <CardDescription>{t('description')}</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSignUp}>
            <div className="flex flex-col gap-6">
              <div className="grid gap-2">
                <Label htmlFor="name">{t('name')}</Label>
                <Input
                  id="name"
                  type="text"
                  placeholder={t('namePlaceholder')}
                  required
                  value={ name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="email">{t('email')}</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder={t('emailPlaceholder')}
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <div className="grid gap-2">
                <div className="flex items-center">
                  <Label htmlFor="password">{t('password')}</Label>
                </div>
                <Input
                  id="password"
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
              <div className="grid gap-2">
                <div className="flex items-center">
                  <Label htmlFor="repeat-password">{t('repeatPassword')}</Label>
                </div>
                <Input
                  id="repeat-password"
                  type="password"
                  required
                  value={repeatPassword}
                  onChange={(e) => setRepeatPassword(e.target.value)}
                />
              </div>
              <div className="flex items-start gap-2">
                <Checkbox
                  id="terms"
                  checked={acceptTerms}
                  onCheckedChange={(checked) => setAcceptTerms(checked as boolean)}
                  required
                />
                <label
                  htmlFor="terms"
                  className="text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  {t('acceptTermsPart1')}{" "}
                  <Link 
                    href="/terms-of-use" 
                    className="underline underline-offset-4 hover:text-primary"
                    target="_blank"
                  >
                    {t('termsOfUse')}
                  </Link>
                  {t('acceptTermsPart2')}
                </label>
              </div>
              {error && <p className="text-sm text-red-500">{error}</p>}
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? t('creatingAccount') : t('signUpButton')}
              </Button>
            </div>
            <div className="mt-4 text-center text-sm">
              {t('haveAccount')}{" "}
              <Link href="/auth/login" className="underline underline-offset-4">
                {t('login')}
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
