import { getReelsFromCache } from "@repo/actions/reels.actions";

import ReelsPage from "./reel-page";

import type { Metadata } from "next/types";

export default async function _ReelsPage() {
  const reels = await getReelsFromCache();
  return <ReelsPage reels={reels} />;
}
