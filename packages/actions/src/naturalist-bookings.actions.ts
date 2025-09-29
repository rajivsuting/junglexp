"use server";
import { and, count, db, eq, gte, ilike, lte } from "@repo/db/index";
import {
  NaturalistBookings,
  naturalistBookingStatusEnum,
} from "@repo/db/schema/naturalist-bookings";

import type { TNewNaturalistBooking } from "@repo/db/schema/naturalist-bookings";

type TNaturalistBookingsFilter = {
  search?: string;
  page?: number;
  limit?: number;
  park_id?: number;
  status?: (typeof naturalistBookingStatusEnum.enumValues)[number];
  from_date?: string;
  to_date?: string;
  date_of_safari?: string;
  slot?: string;
};

export const getNaturalistBookings = async (
  filter: TNaturalistBookingsFilter
) => {
  const { search, page, limit, park_id, status, date_of_safari, slot } = filter;

  // Parse date_of_safari if provided (format: "timestamp1,timestamp2")
  let parsedFromDate;
  let parsedToDate;

  if (date_of_safari) {
    const dates = date_of_safari.split(",");

    if (dates[0]) {
      parsedFromDate = new Date(Number(dates[0].trim())).toISOString();
    }
    if (dates[1]) {
      parsedToDate = new Date(Number(dates[1].trim())).toISOString();
    }
  }

  const pageNum = page && page > 0 ? page : 1;
  const limitNum = limit && limit > 0 ? limit : 20;

  const where = and(
    search ? ilike(NaturalistBookings.name, `%${search}%`) : undefined,
    park_id ? eq(NaturalistBookings.park_id, park_id) : undefined,
    status ? eq(NaturalistBookings.status, status) : undefined,
    slot ? eq(NaturalistBookings.slot, slot) : undefined,
    ...(parsedFromDate && parsedToDate
      ? [
          gte(NaturalistBookings.date_of_safari, parsedFromDate),
          lte(NaturalistBookings.date_of_safari, parsedToDate),
        ]
      : parsedFromDate
        ? [gte(NaturalistBookings.date_of_safari, parsedFromDate)]
        : parsedToDate
          ? [lte(NaturalistBookings.date_of_safari, parsedToDate)]
          : [])
  );

  const naturalistBookings = await db.query.NaturalistBookings.findMany({
    where,
    with: {
      park: true,
    },
    limit: limitNum,
    offset: (pageNum - 1) * limitNum,
  });

  const total = await db
    .select({ count: count() })
    .from(NaturalistBookings)
    .where(where);

  return { naturalistBookings, total: total[0]?.count ?? 0 };
};

export const createNaturalistBooking = async (
  booking: TNewNaturalistBooking
) => {
  const newBooking = await db
    .insert(NaturalistBookings)
    .values(booking)
    .returning();

  if (!newBooking) {
    throw new Error("Failed to create naturalist booking");
  }

  return newBooking;
};

export const updateNaturalistBookingStatus = async (
  bookingId: number,
  status: (typeof naturalistBookingStatusEnum.enumValues)[number]
) => {
  const updatedBooking = await db
    .update(NaturalistBookings)
    .set({ status })
    .where(eq(NaturalistBookings.id, bookingId))
    .returning();

  if (!updatedBooking) {
    throw new Error("Failed to update naturalist booking");
  }

  return updatedBooking;
};

export const getNaturalistBookingById = async (bookingId: number) => {
  const booking = await db.query.NaturalistBookings.findFirst({
    where: eq(NaturalistBookings.id, bookingId),
    with: {
      park: true,
    },
  });

  return booking;
};
