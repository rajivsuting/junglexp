"use client";

import { useTheme } from "next-themes";
import Image from "next/image";

export const Logo = () => {
  const { theme } = useTheme();

  return (
    <Image
      src={theme === "dark" ? "/LogoWhite.svg" : "/Logo.svg"}
      alt="eTroupers"
      width={100}
      height={40}
    />
  );
};
