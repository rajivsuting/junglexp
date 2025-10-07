import { searchParamsCache } from '@/lib/searchparams'
import { getHotelBookings } from '@repo/actions/hotel-bookings.action'

import { HotelBookingsTable } from './components/hotel-bookings-table'
import { columns } from './components/hotel-bookings-table/columns'

const HotelBookingsListing = async () => {
  const page = searchParamsCache.get('page')
  const search = searchParamsCache.get('name')
  const pageLimit = searchParamsCache.get('perPage')
  const status = searchParamsCache.get('status')
  const hotel_id = searchParamsCache.get('hotel_id')
  const room_id = searchParamsCache.get('room_id')
  const check_in_date = searchParamsCache.get('check_in_date')
  const check_out_date = searchParamsCache.get('check_out_date')
  const to_date = searchParamsCache.get('to_date')
  const sort = searchParamsCache.get('sort')

  const checkInDate = new Date(new Date(Number(check_in_date))?.setHours(0, 0, 0, 0))
  const checkOutDate = new Date(new Date(Number(check_out_date))?.setHours(0, 0, 0, 0))

  const filters = {
    page,
    limit: pageLimit,
    ...(search && { search }),
    ...(status &&
      Array.isArray(status) &&
      status.length > 0 && {
        status: status as ('pending' | 'confirmed' | 'cancelled')[],
      }),
    ...(hotel_id && { hotel_id: Number(hotel_id) }),
    ...(room_id && { room_id: Number(room_id) }),
    ...(check_in_date && {
      check_in_date: checkInDate,
    }),
    ...(check_out_date && {
      check_out_date: checkOutDate,
    }),
  }

  const { hotelBookings, total } = await getHotelBookings(
    filters as any,
    // @ts-ignore
    sort || []
  )

  return <HotelBookingsTable data={hotelBookings} totalItems={total} columns={columns} />
}

export default HotelBookingsListing
