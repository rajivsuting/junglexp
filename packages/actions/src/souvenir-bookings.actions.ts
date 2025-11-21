"use server";
import { and, count, db, eq, ilike, inArray } from '@repo/db/index';
import { SouvenirBookings, souvenirBookingStatusEnum } from '@repo/db/schema/souvenir-bookings';

import type { TNewSouvenirBooking } from "@repo/db/schema/souvenir-bookings";

// Helper function to map column IDs to database columns
function getSouvenirBookingColumn(columnId: string) {
  const columnMap: Record<string, any> = {
    id: SouvenirBookings.id,
    name: SouvenirBookings.name,
    email: SouvenirBookings.email,
    mobile: SouvenirBookings.mobile,
    status: SouvenirBookings.status,
    souvenir_id: SouvenirBookings.souvenir_id,
    rate: SouvenirBookings.rate,
    quantity: SouvenirBookings.quantity,
    message: SouvenirBookings.message,
  };

  return columnMap[columnId];
}

type TSouvenirBookingsFilter = {
  search?: string;
  page?: number;
  limit?: number;
  souvenir_id?: number;
  status?: (typeof souvenirBookingStatusEnum.enumValues)[number][];
};

export const getSouvenirBookings = async (
  filter: TSouvenirBookingsFilter,
  sort?: { id: string; desc: boolean }[]
) => {
  const { search, page, limit, souvenir_id, status } = filter;

  const pageNum = page && page > 0 ? page : 1;
  const limitNum = limit && limit > 0 ? limit : 20;

  const where = and(
    search ? ilike(SouvenirBookings.name, `%${search}%`) : undefined,
    souvenir_id ? eq(SouvenirBookings.souvenir_id, souvenir_id) : undefined,
    status ? inArray(SouvenirBookings.status, status) : undefined
  );

  const souvenirBookings = await db.query.SouvenirBookings.findMany({
    where,
    with: {
      souvenir: {
        columns: {
          id: true,
          name: true,
          description: true,
          slug: true,
          price: true,
        },
      },
    },
    limit: limitNum,
    offset: (pageNum - 1) * limitNum,
  });

  const total = await db
    .select({ count: count() })
    .from(SouvenirBookings)
    .where(where);

  return { souvenirBookings, total: total[0]?.count ?? 0 };
};

export const createSouvenirBooking = async (booking: TNewSouvenirBooking) => {
  const newBooking = await db
    .insert(SouvenirBookings)
    .values(booking)
    .returning();

  if (!newBooking[0]) {
    throw new Error("Failed to create souvenir booking");
  }

  const _booking = await db.query.SouvenirBookings.findFirst({
    where: eq(SouvenirBookings.id, newBooking[0].id),
    with: {
      souvenir: true,
    },
  });
  return _booking;
};

export const updateSouvenirBookingStatus = async (
  bookingId: string,
  status: (typeof souvenirBookingStatusEnum.enumValues)[number]
) => {
  const updatedBooking = await db
    .update(SouvenirBookings)
    .set({ status })
    .where(eq(SouvenirBookings.id, bookingId))
    .returning();

  if (!updatedBooking) {
    throw new Error("Failed to update souvenir booking");
  }

  return updatedBooking;
};

export const getSouvenirBookingById = async (bookingId: string) => {
  const booking = await db.query.SouvenirBookings.findFirst({
    where: eq(SouvenirBookings.id, bookingId),
    with: {
      souvenir: {
        columns: {
          id: true,
          name: true,
          description: true,
          slug: true,
          price: true,
        },
      },
    },
  });

  return booking;
};
