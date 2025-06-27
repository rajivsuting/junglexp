import { Mail, Shield } from "lucide-react";

import { CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

interface AuthHeaderProps {
  step: "email" | "otp";
  email: string;
}

export function AuthHeader({ step, email }: AuthHeaderProps) {
  return (
    <CardHeader className="text-center">
      <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-blue-100">
        {step === "email" ? (
          <Mail className="h-6 w-6 text-blue-600" />
        ) : (
          <Shield className="h-6 w-6 text-blue-600" />
        )}
      </div>
      <CardTitle className="text-2xl font-bold">
        {step === "email" ? "Sign In" : "Verify OTP"}
      </CardTitle>
      <CardDescription>
        {step === "email"
          ? "Enter your email address to receive a one-time password"
          : `We've sent a 6-digit code to ${email}`}
      </CardDescription>
    </CardHeader>
  );
}
