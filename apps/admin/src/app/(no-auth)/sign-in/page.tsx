import { GalleryVerticalEnd } from "lucide-react";

import { Card } from "@/components/ui/card";

import { AuthFlow } from "./auth-flow";

export default function LoginPage() {
  return (
    <div className="grid min-h-svh lg:grid-cols-2">
      <div className="flex flex-col gap-4 p-6 md:p-10">
        <div className="flex justify-center gap-2 md:justify-start">
          <a href="#" className="flex items-center gap-2 font-medium">
            <div className="bg-primary text-primary-foreground flex size-6 items-center justify-center rounded-md">
              <GalleryVerticalEnd className="size-4" />
            </div>
            eTroupers
          </a>
        </div>
        <div className="flex flex-1 items-center justify-center">
          <Card className="w-full max-w-sm">
            <AuthFlow />
          </Card>
        </div>
      </div>
      <div className="bg-muted relative hidden lg:block">
        <img
          src="/safari-image-home.jpg"
          alt="safari image logo on right"
          className="absolute inset-0 h-full w-full object-cover dark:brightness-[0.2] dark:grayscale"
        />
      </div>
    </div>
  );
}
