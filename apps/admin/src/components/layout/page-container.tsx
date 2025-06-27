import { ScrollArea } from "@/components/ui/scroll-area";

import type { ReactNode } from "react";

export default function PageContainer({
  children,
  scrollable = true,
}: {
  children: ReactNode;
  scrollable?: boolean;
}) {
  return (
    <>
      {scrollable ? (
        <ScrollArea className="h-[calc(100dvh-52px)]">
          <div className="flex flex-1 p-4 md:px-6 pb-8">{children}</div>
        </ScrollArea>
      ) : (
        <div className="flex flex-1 p-4 md:px-6">{children}</div>
      )}
    </>
  );
}
