import { notFound } from "next/navigation";

import { getPlaceById } from "@repo/actions/places.actions";

import PlaceForm from "./place-form";

import type { TPlace } from "@repo/db/schema/types";

interface PlaceViewPageProps {
  pageTitle?: string;
  mode?: "create" | "edit";
  placeId?: string;
  initialData?: TPlace | null;
}

export default async function PlaceViewPage({
  pageTitle = "Create Place",
  mode = "create",
  placeId,
}: PlaceViewPageProps) {
  let Place: TPlace | null = null;

  if (placeId !== "new") {
    if (isNaN(Number(placeId))) {
      notFound();
    }

    Place = (await getPlaceById(Number(placeId))) as any;

    if (!Place) {
      notFound();
    }

    pageTitle = "Update National Park";
  }

  return (
    <PlaceForm
      pageTitle={pageTitle}
      placeId={placeId ?? undefined}
      initialData={Place}
    />
  );
}
