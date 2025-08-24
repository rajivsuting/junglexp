import { notFound } from "next/navigation";

import { getSouvenirById } from "@repo/actions/souvenirs.actions";

import SouvenirForm from "./souvenir-form";

import type { TSouvenir } from "@repo/db/schema/types";

type TSouvenirViewPageProps = {
  souvenirId: string;
};

const SouvenirViewPage = async (props: TSouvenirViewPageProps) => {
  const { souvenirId } = props;

  let data: TSouvenir | null = null;
  let pageTitle = "Create New Souvenir";

  if (souvenirId !== "new") {
    data = await getSouvenirById(souvenirId);

    if (!data) {
      notFound();
    }

    pageTitle = "Edit Souvenir";
  }

  return <SouvenirForm />;
};

export default SouvenirViewPage;
