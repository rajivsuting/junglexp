import { notFound } from "next/navigation";

import { getHotelById } from "@repo/actions/hotels.actions";

import HotelForm from "./hotel-form-new";

import type { THotel } from "@repo/db/schema/types";
type THotelViewPageProps = {
  hotelId: string;
};

const HotelViewPage = async (props: THotelViewPageProps) => {
  const { hotelId } = props;

  let Hotel: THotel | null = null;
  let pageTitle = "Create New Product";
  let mode: "create" | "edit" = "create";

  if (hotelId !== "new") {
    Hotel = await getHotelById(Number(hotelId));

    if (!Hotel) {
      notFound();
    }

    pageTitle = "Edit Product";
    mode = "edit";
  }
  console.log("Hotel", Hotel);

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
