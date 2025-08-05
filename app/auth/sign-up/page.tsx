import { SignUpForm } from "@/components/sign-up-form";

export default function Page() {
  return (
    <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10 bg-feature-3-bg">
      <div className="w-full max-w-md">
        <SignUpForm />
      </div>
    </div>
  );
}
