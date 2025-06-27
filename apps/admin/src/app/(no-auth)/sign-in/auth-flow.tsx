"use client";

import { useState } from "react";

import { AuthHeader } from "./auth-header";
import { EmailForm } from "./email-form";
import { OtpForm } from "./otp-form";

export function AuthFlow() {
  const [step, setStep] = useState<"email" | "otp">("email");
  const [email, setEmail] = useState("");

  const handleEmailSuccess = (emailAddress: string) => {
    setEmail(emailAddress);
    setStep("otp");
  };

  const handleBackToEmail = () => {
    setStep("email");
    setEmail("");
  };

  const handleOtpSuccess = () => {
    // Redirect to dashboard after successful OTP verification
    window.location.href = "/";
  };

  return (
    <>
      <AuthHeader step={step} email={email} />
      {step === "email" ? (
        <EmailForm onSuccess={handleEmailSuccess} />
      ) : (
        <OtpForm
          email={email}
          onBack={handleBackToEmail}
          onSuccess={handleOtpSuccess}
        />
      )}
    </>
  );
}
