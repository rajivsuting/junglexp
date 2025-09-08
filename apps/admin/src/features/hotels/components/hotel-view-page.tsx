import { notFound } from 'next/navigation';

import { getHotelById } from '@repo/actions/hotels.actions';

import HotelForm from './hotel-form-new';

import type { THotel } from "@repo/db/schema/types";
type THotelViewPageProps = {
  hotelId: string;
};

const HotelViewPage = async (props: THotelViewPageProps) => {
  const { hotelId } = props;

  let Hotel: THotel | undefined = undefined;
  let pageTitle = "Create New Hotel";
  let mode: "create" | "edit" = "create";

  if (hotelId !== "new") {
    Hotel = (await getHotelById(Number(hotelId))) as any;

    if (!Hotel) {
      notFound();
    }

    pageTitle = "Update Hotel";
    mode = "edit";
  }

  return (
    <HotelForm
      hotelId={hotelId}
      initialData={Hotel}
      mode={mode}
      pageTitle={pageTitle}
    />
  );
};

export default HotelViewPage;
