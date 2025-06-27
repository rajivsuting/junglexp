"use client";

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
import { Input } from "@/components/ui/input";
import { useSignIn } from "@clerk/nextjs";
import { zodResolver } from "@hookform/resolvers/zod";

const emailSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
});

type EmailFormData = z.infer<typeof emailSchema>;

interface EmailFormProps {
  onSuccess: (email: string) => void;
}

export function EmailForm({ onSuccess }: EmailFormProps) {
  const { signIn } = useSignIn();

  const form = useForm<EmailFormData>({
    resolver: zodResolver(emailSchema),
    defaultValues: {
      email: "",
    },
  });

  const onSubmit = async (data: EmailFormData) => {
    try {
      if (!signIn) {
        throw new Error("SignIn not initialized");
      }

      // Start the sign-in process using the email method
      const result = await signIn.create({
        identifier: data.email,
      });

      // Send the email code to the user
      await result.prepareFirstFactor({
        strategy: "email_code",
        emailAddressId: result.supportedFirstFactors!.find(
          (factor) => factor.strategy === "email_code"
        )?.emailAddressId!,
      });

      onSuccess(data.email);
    } catch (err: any) {
      form.setError("root", {
        message:
          err?.errors?.[0]?.message || "Failed to send OTP. Please try again.",
      });
    }
  };

  return (
    <>
      <CardContent className="space-y-4">
        {form.formState.errors.root && (
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
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email Address</FormLabel>
                  <FormControl>
                    <Input
                      type="email"
                      placeholder="Enter your email"
                      disabled={form.formState.isSubmitting}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button
              type="submit"
              variant="default"
              className="w-full"
              disabled={form.formState.isSubmitting}
            >
              {form.formState.isSubmitting ? "Sending OTP..." : "Send OTP"}
            </Button>
          </form>
        </Form>
      </CardContent>
    </>
  );
}
