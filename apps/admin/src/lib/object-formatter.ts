import type { TNewImage } from "@repo/db/schema/image";
import type { UploadResult } from "./upload-files";

export class UploadResultFormatter {
  images: UploadResult[] = [];

  constructor(images: UploadResult[]) {
    this.images = images;
  }

  formatToDBImages(): TNewImage[] {
    const formatted: TNewImage[] = [];

    for (let index = 0; index < this.images.length; index++) {
      const image = this.images[index];

      const map =
        image?.variants.reduce(
          (acc, next) => ({
            ...acc,
            [next.size]: next.url,
          }),
          {} as Record<string, string>
        ) || {};

      formatted.push({
        original_url: map.original || "",
        small_url: map.small || "",
        medium_url: map.medium || "",
        large_url: map.large || "",
      });
    }

    return formatted;
  }
}
