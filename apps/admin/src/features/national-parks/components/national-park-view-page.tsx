import { notFound } from "next/navigation";

import { getNationalParkById } from "@repo/actions/parks.actions";

import NationalParkForm from "./national-park-form";

import type { TNationalPark } from "@repo/db/schema/types";

type TNationalParkViewPageProps = {
  parkId: string;
};

const NationalParkViewPage = async (props: TNationalParkViewPageProps) => {
  const { parkId } = props;

  let NationalPark: TNationalPark | null = null;
  let pageTitle = "Create New National Park";

  if (parkId !== "new") {
    NationalPark = await getNationalParkById(parkId);

    if (!NationalPark) {
      notFound();
    }

    pageTitle = "Update National Park";
  }

  return <NationalParkForm initialData={NationalPark} pageTitle={pageTitle} />;
};

export default NationalParkViewPage;
