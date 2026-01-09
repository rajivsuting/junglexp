import { getReelsFromCache } from "@repo/actions/reels.actions";

import ReelsPage from "./reel-page";

export default async function _ReelsPage() {
  const reels = await getReelsFromCache();
  return <ReelsPage reels={reels} />;
}
