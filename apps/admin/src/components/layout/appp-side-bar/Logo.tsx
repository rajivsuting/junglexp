"use client";

import { useTheme } from 'next-themes';
import Image from 'next/image';

export const Logo = () => {
  const { theme } = useTheme();

  return (
    <Image src={"/Logo.svg"} alt="Junglexp-Logo" width={100} height={40} />
  );
};
