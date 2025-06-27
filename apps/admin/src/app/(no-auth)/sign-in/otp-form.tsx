"use client";

import type React from "react";

import { ArrowLeft } from "lucide-react";
import { useEffect, useRef } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { CardContent, CardFooter } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useSignIn } from "@clerk/nextjs";
import { zodResolver } from "@hookform/resolvers/zod";

const otpSchema = z.object({
  otp: z
    .string()
    .length(6, "OTP must be exactly 6 digits")
    .regex(/^\d+$/, "OTP must contain only numbers"),
});

type OtpFormData = z.infer<typeof otpSchema>;

interface OtpInputProps {
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
}

function OtpInput({ value, onChange, disabled }: OtpInputProps) {
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    if (inputRefs.current[0]) {
      inputRefs.current[0].focus();
    }
  }, []);

  const handleChange = (index: number, digit: string) => {
    if (!/^\d*$/.test(digit)) return;

    const newValue = value.split("");
    newValue[index] = digit;
    const updatedValue = newValue.join("").slice(0, 6);
    onChange(updatedValue);

    // Move to next input if digit was entered
    if (digit && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === "Backspace") {
      if (!value[index] && index > 0) {
        // Move to previous input if current is empty
        inputRefs.current[index - 1]?.focus();
      } else {
        // Clear current input
        const newValue = value.split("");
        newValue[index] = "";
        onChange(newValue.join(""));
      }
    } else if (e.key === "ArrowLeft" && index > 0) {
      inputRefs.current[index - 1]?.focus();
    } else if (e.key === "ArrowRight" && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pastedData = e.clipboardData
      .getData("text")
      .replace(/\D/g, "")
      .slice(0, 6);
    onChange(pastedData);

    // Focus the next empty input or the last input
    const nextIndex = Math.min(pastedData.length, 5);
    inputRefs.current[nextIndex]?.focus();
  };

  return (
    <div className="flex gap-2 justify-center">
      {Array.from({ length: 6 }, (_, index) => (
        <input
          key={index}
          ref={(el) => (inputRefs.current[index] = el) as any}
          type="text"
          inputMode="numeric"
          maxLength={1}
          value={value[index] || ""}
          onChange={(e) => handleChange(index, e.target.value)}
          onKeyDown={(e) => handleKeyDown(index, e)}
          onPaste={handlePaste}
          disabled={disabled}
          className="w-12 h-12 text-center text-lg font-semibold border border-input bg-background rounded-md focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent disabled:cursor-not-allowed disabled:opacity-50"
        />
      ))}
    </div>
  );
}

interface OtpFormProps {
  email: string;
  onBack: () => void;
  onSuccess: () => void;
}

export function OtpForm({ email, onBack, onSuccess }: OtpFormProps) {
  const { signIn, setActive } = useSignIn();

  const form = useForm<OtpFormData>({
    resolver: zodResolver(otpSchema),
    defaultValues: {
      otp: "",
    },
  });

  const watchedOtp = form.watch("otp");

  const onSubmit = async (data: OtpFormData) => {
    try {
      if (!signIn) {
        throw new Error("SignIn not initialized");
      }

      // Attempt to complete the sign-in using the code
      const result = await signIn.attemptFirstFactor({
        strategy: "email_code",
        code: data.otp,
      });

      if (result.status === "complete") {
        await setActive({ session: result.createdSessionId });
        onSuccess();
      } else {
        form.setError("root", {
          message: "Verification failed. Please try again.",
        });
      }
    } catch (err: any) {
      console.error("Error:", err);
      form.setError("root", {
        message: err?.errors?.[0]?.message || "Invalid OTP. Please try again.",
      });
    }
  };

  const handleResendOtp = async () => {
    try {
      if (!signIn) {
        throw new Error("SignIn not initialized");
      }

      // Resend the email code
      await signIn.prepareFirstFactor({
        strategy: "email_code",
        emailAddressId: signIn.supportedFirstFactors!.find(
          (factor) => factor.strategy === "email_code"
        )?.emailAddressId!,
      });

      form.setError("root", {
        message: "",
      });

      // Show success message (you could use a toast here instead)
      alert("New OTP sent to your email!");
    } catch (err: any) {
      console.error("Error:", err);
      form.setError("root", {
        message:
          err?.errors?.[0]?.message ||
          "Failed to resend OTP. Please try again.",
      });
    }
  };

  return (
    <>
      <CardContent className="space-y-4">
        {form.formState.errors.root && form.formState.errors.root.message && (
          <Alert variant="destructive">
            <AlertDescription>
              {form.formState.errors.root.message}
            </AlertDescription>
          </Alert>
        )}

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="otp"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>One-Time Password</FormLabel>
                  <FormControl>
                    <OtpInput
                      value={field.value}
                      onChange={field.onChange}
                      disabled={form.formState.isSubmitting}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button
              type="submit"
              className="w-full"
              disabled={form.formState.isSubmitting || watchedOtp.length !== 6}
            >
              {form.formState.isSubmitting ? "Verifying..." : "Verify OTP"}
            </Button>
          </form>
        </Form>
      </CardContent>

      <CardFooter className="flex flex-col space-y-2">
        <Button
          variant="ghost"
          onClick={handleResendOtp}
          disabled={form.formState.isSubmitting}
          className="w-full"
        >
          Resend OTP
        </Button>
        <Button
          variant="outline"
          onClick={onBack}
          disabled={form.formState.isSubmitting}
          className="w-full"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Email
        </Button>
      </CardFooter>
    </>
  );
}
