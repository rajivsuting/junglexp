import type { ReactNode } from "react";

export default function PageLoadingContainer({
  children,
}: {
  children: ReactNode;
}) {
  return <div className="flex flex-1 p-4 md:px-6">{children}</div>;
}
