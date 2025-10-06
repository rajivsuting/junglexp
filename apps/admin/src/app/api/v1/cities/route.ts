import { NextResponse } from 'next/server'

import { getCities, getCitiesByStateId } from '@repo/actions/cities.actions'

import type { TCity } from '@repo/db/schema/city'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)

  const stateId = searchParams.get('state')

  let cities: TCity[] = []
  if (stateId) {
    cities = await getCitiesByStateId(stateId)
  } else {
    cities = (await getCities()) as any[]
  }

  return NextResponse.json(cities)
}
