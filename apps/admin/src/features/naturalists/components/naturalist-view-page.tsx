import { notFound } from 'next/navigation';

import { getNaturalistById } from '@repo/actions/naturlists.actions';

import NaturalistForm from './naturalist-form';

import type { TNaturalistBase } from "@repo/db/schema/naturalist";

interface Props {
  pageTitle?: string;
  mode?: "create" | "edit";
  id?: string;
}

export default async function NaturalistViewPage({
  pageTitle = "Create Naturalist",
  mode = "create",
  id,
}: Props) {
  let naturalist: (TNaturalistBase & { image?: any; park?: any }) | null = null;

  if (id && id !== "new") {
    if (isNaN(Number(id))) notFound();
    naturalist = (await getNaturalistById(Number(id))) as any;
    if (!naturalist) notFound();
    pageTitle = "Update Naturalist";
  }

  return <NaturalistForm pageTitle={pageTitle} initialData={naturalist} />;
}
