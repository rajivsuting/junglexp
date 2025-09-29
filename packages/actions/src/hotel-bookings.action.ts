"use server";
import { and, count, db, eq, ilike, inArray } from "@repo/db/index";
import {
  HotelBookings,
  hotelBookingStatusEnum,
} from "@repo/db/schema/hotel-bookings";

import type { TNewHotelBooking } from "@repo/db/schema/hotel-bookings";

// Helper function to map column IDs to database columns
function getHotelBookingColumn(columnId: string) {
  const columnMap: Record<string, any> = {
    id: HotelBookings.id,
    name: HotelBookings.name,
    email: HotelBookings.email,
    mobile_no: HotelBookings.mobile_no,
    status: HotelBookings.status,
    check_in_date: HotelBookings.check_in_date,
    check_out_date: HotelBookings.check_out_date,
    no_of_rooms_required: HotelBookings.no_of_rooms_required,
    no_of_adults: HotelBookings.no_of_adults,
    no_of_kids: HotelBookings.no_of_kids,
    hotel_id: HotelBookings.hotel_id,
    room_id: HotelBookings.room_id,
    plan_id: HotelBookings.plan_id,
  };

  return columnMap[columnId];
}

type THotelBookingsFilter = {
  search?: string;
  page?: number;
  limit?: number;
  hotel_id?: number;
  room_id?: number;
  status?: (typeof hotelBookingStatusEnum.enumValues)[number][];
  check_in_date?: string;
  check_out_date?: string;
};

export const getHotelBookings = async (
  filter: THotelBookingsFilter,
  sort?: { id: string; desc: boolean }[]
) => {
  const {
    search,
    page,
    limit,
    hotel_id,
    room_id,
    status,
    check_in_date,
    check_out_date,
  } = filter;

  const pageNum = page && page > 0 ? page : 1;
  const limitNum = limit && limit > 0 ? limit : 20;

  const where = and(
    search ? ilike(HotelBookings.name, `%${search}%`) : undefined,
    hotel_id ? eq(HotelBookings.hotel_id, hotel_id) : undefined,
    room_id ? eq(HotelBookings.room_id, room_id) : undefined,
    status ? inArray(HotelBookings.status, status) : undefined,
    check_in_date ? eq(HotelBookings.check_in_date, check_in_date) : undefined,
    check_out_date
      ? eq(HotelBookings.check_out_date, check_out_date)
      : undefined
    // ...(from_date && to_date
    //   ? [
    //       eq(HotelBookings.check_in_date, from_date),
    //       eq(HotelBookings.check_out_date, to_date),
    //     ]
    //   : from_date
    //     ? [eq(HotelBookings.check_in_date, from_date)]
    //     : to_date
    //       ? [eq(HotelBookings.check_out_date, to_date)]
    //       : [])
  );

  const hotelBookings = await db.query.HotelBookings.findMany({
    where,
    with: {
      hotel: {
        columns: {
          id: true,
          name: true,
          description: true,
          slug: true,
        },
      },
      room: true,
      plan: true,
    },

    limit: limitNum,
    offset: (pageNum - 1) * limitNum,
  });

  const total = await db
    .select({ count: count() })
    .from(HotelBookings)
    .where(where);

  return { hotelBookings, total: total[0]?.count ?? 0 };
};

export const ceateHotelBooking = async (booking: TNewHotelBooking) => {
  const newBooking = await db.insert(HotelBookings).values(booking).returning();

  if (!newBooking[0]) {
    throw new Error("Failed to create hotel booking");
  }

  const _booking = await db.query.HotelBookings.findFirst({
    where: eq(HotelBookings.id, newBooking[0].id),
    with: {
      hotel: {
        columns: {
          id: true,
          name: true,
          description: true,
          slug: true,
        },
      },
      room: true,
      plan: true,
    },
  });
  return _booking;
};

export const updateHotelBookingStatus = async (
  bookingId: number,
  status: (typeof hotelBookingStatusEnum.enumValues)[number]
) => {
  const updatedBooking = await db
    .update(HotelBookings)
    .set({ status })
    .where(eq(HotelBookings.id, bookingId))
    .returning();

  if (!updatedBooking) {
    throw new Error("Failed to update hotel booking");
  }

  return updatedBooking;
};

export const getHotelBookingById = async (bookingId: number) => {
  const booking = await db.query.HotelBookings.findFirst({
    where: eq(HotelBookings.id, bookingId),
    with: {
      hotel: {
        columns: {
          id: true,
          name: true,
          description: true,
          slug: true,
        },
      },
      room: true,
      plan: true,
    },
  });

  return booking;
};
