"use server";
import { and, count, db, eq, ilike, inArray } from '@repo/db/index';
import { ActivityBookings, activityBookingStatusEnum } from '@repo/db/schema/activity-bookings';

import type { TNewActivityBooking } from "@repo/db/schema/activity-bookings";

// Helper function to map column IDs to database columns
function getActivityBookingColumn(columnId: string) {
  const columnMap: Record<string, any> = {
    id: ActivityBookings.id,
    name: ActivityBookings.name,
    email: ActivityBookings.email,
    mobile: ActivityBookings.mobile,
    status: ActivityBookings.status,
    activity_id: ActivityBookings.activity_id,
    preferredDate: ActivityBookings.preferredDate,
    numberOfAdults: ActivityBookings.numberOfAdults,
    numberOfKids: ActivityBookings.numberOfKids,
    message: ActivityBookings.message,
  };

  return columnMap[columnId];
}

type TActivityBookingsFilter = {
  search?: string;
  page?: number;
  limit?: number;
  activity_id?: number;
  status?: (typeof activityBookingStatusEnum.enumValues)[number][];
  preferredDate?: string;
};

export const getActivityBookings = async (
  filter: TActivityBookingsFilter,
  sort?: { id: string; desc: boolean }[]
) => {
  const { search, page, limit, activity_id, status, preferredDate } = filter;

  const pageNum = page && page > 0 ? page : 1;
  const limitNum = limit && limit > 0 ? limit : 20;

  const where = and(
    search ? ilike(ActivityBookings.name, `%${search}%`) : undefined,
    activity_id ? eq(ActivityBookings.activity_id, activity_id) : undefined,
    status ? inArray(ActivityBookings.status, status) : undefined,
    preferredDate
      ? eq(ActivityBookings.preferredDate, preferredDate)
      : undefined
  );

  const activityBookings = await db().query.ActivityBookings.findMany({
    where,
    with: {
      activity: {
        columns: {
          id: true,
          name: true,
          slug: true,
        },
      },
    },
    limit: limitNum,
    offset: (pageNum - 1) * limitNum,
  });

  const total = await db()
    .select({ count: count() })
    .from(ActivityBookings)
    .where(where);

  return { activityBookings, total: total[0]?.count ?? 0 };
};

export const createActivityBooking = async (booking: TNewActivityBooking) => {
  const newBooking = await db()
    .insert(ActivityBookings)
    .values(booking)
    .returning();

  if (!newBooking[0]) {
    throw new Error("Failed to create activity booking");
  }

  const _booking = await db().query.ActivityBookings.findFirst({
    where: eq(ActivityBookings.id, newBooking[0].id),
    with: {
      activity: {
        columns: {
          id: true,
          name: true,
          slug: true,
        },
      },
    },
  });
  return _booking;
};

export const updateActivityBookingStatus = async (
  bookingId: string,
  status: (typeof activityBookingStatusEnum.enumValues)[number]
) => {
  const updatedBooking = await db()
    .update(ActivityBookings)
    .set({ status })
    .where(eq(ActivityBookings.id, bookingId))
    .returning();

  if (!updatedBooking) {
    throw new Error("Failed to update activity booking");
  }

  return updatedBooking;
};

export const getActivityBookingById = async (bookingId: string) => {
  const booking = await db().query.ActivityBookings.findFirst({
    where: eq(ActivityBookings.id, bookingId),
    with: {
      activity: true,
    },
  });

  return booking;
};
