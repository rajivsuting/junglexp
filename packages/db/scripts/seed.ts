import { config } from "dotenv";
import { drizzle } from "drizzle-orm/neon-http";

import { neon } from "@neondatabase/serverless";

import { Cities } from "../schema/city";
import { HotelImages, Hotels } from "../schema/hotels";
import { Images } from "../schema/image";
import { NationalParks, ParkImages } from "../schema/park";
import { States } from "../schema/state";
import { Users } from "../schema/user";
import { Zones } from "../schema/zones";
import citiesData from "./cities.json";
import hotelImagesData from "./hotel_images.json";
import hotelsData from "./hotels.json";
import imagesData from "./images.json";
import nationalParksData from "./national_parks.json";
import parkImagesData from "./park_images.json";
import statesData from "./states.json";
import usersData from "./users.json";
import zonesData from "./zones.json";

// Type declarations for JSON data
type StateData = {
  id: number;
  name: string;
  state_code: string;
  created_at: string;
  updated_at: string;
};

type CityData = {
  id: number;
  state_id: number;
  name: string;
  latitude: string;
  longitude: string;
  created_at: string;
  updated_at: string;
};

type UserData = {
  id: number;
  user_id: string;
  email: string;
  phone: string;
  first_name: string;
  last_name: string;
  role: number;
  created_at: string;
  updated_at: string;
};

type ImageData = {
  id: number;
  small_url: string;
  medium_url: string;
  large_url: string;
  original_url: string;
  created_at: string;
  updated_at: string;
  alt_text: string;
};

type NationalParkData = {
  id: number;
  city_id: number;
  name: string;
  slug: string;
  description: string;
  created_at: string;
  updated_at: string;
};

type ZoneData = {
  id: number;
  name: string;
  description: string;
  park_id: number;
};

type HotelData = {
  id: number;
  name: string;
  description: string;
  slug: string;
  zone_id: number;
  hotel_type: string;
  rating: number;
};

type HotelImageData = {
  id: number;
  hotel_id: number;
  image_id: number;
  order: number;
};

type ParkImageData = {
  id: number;
  park_id: number;
  image_id: number;
  order: number;
};

// Type assertions
const states = statesData as StateData[];
const cities = citiesData as CityData[];
const users = usersData as UserData[];
const images = imagesData as ImageData[];
const nationalParks = nationalParksData as NationalParkData[];
const zones = zonesData as ZoneData[];
const hotels = hotelsData as HotelData[];
const hotelImages = hotelImagesData as HotelImageData[];
const parkImages = parkImagesData as ParkImageData[];
// Load environment variables
config({ path: "../../.env.local" });

const sql = neon(process.env.DATABASE_URL!);
const db = drizzle(sql);

async function seedStates() {
  console.log("🌱 Seeding states...");

  try {
    // Clear existing states
    await db.delete(States);

    // Insert states with exact IDs from JSON
    for (const state of states) {
      await db.insert(States).values({
        id: state.id,
        name: state.name,
        state_code: state.state_code,
        created_at: new Date(state.created_at),
        updated_at: new Date(state.updated_at),
      });
    }

    console.log(`✅ Seeded ${states.length} states`);
  } catch (error) {
    console.error("❌ Error seeding states:", error);
    throw error;
  }
}

async function seedCities() {
  console.log("🌱 Seeding cities...");

  try {
    // Clear existing cities
    await db.delete(Cities);

    // Insert cities with exact IDs from JSON
    await db.insert(Cities).values(
      cities.map((city) => ({
        id: city.id,
        state_id: city.state_id,
        name: city.name,
        latitude: city.latitude,
        longitude: city.longitude,
        created_at: new Date(city.created_at),
        updated_at: new Date(city.updated_at),
      }))
    );

    console.log(`✅ Seeded ${cities.length} cities`);
  } catch (error) {
    console.error("❌ Error seeding cities:", error);
    throw error;
  }
}

async function seedUsers() {
  console.log("🌱 Seeding users...");

  try {
    // Clear existing users
    await db.delete(Users);

    // Insert users (ID will be auto-generated)

    await db.insert(Users).values(
      users.map((user) => ({
        user_id: user.user_id,
        email: user.email,
        phone: user.phone,
        first_name: user.first_name,
        last_name: user.last_name,
        role: user.role,
        created_at: new Date(user.created_at),
        updated_at: new Date(user.updated_at),
      }))
    );

    console.log(`✅ Seeded ${users.length} users`);
  } catch (error) {
    console.error("❌ Error seeding users:", error);
    throw error;
  }
}

async function seedImages() {
  console.log("🌱 Seeding images...");

  try {
    // Clear existing images
    await db.delete(Images);

    // Insert images (ID will be auto-generated)

    await db.insert(Images).values(
      images.map((image) => ({
        id: image.id,
        small_url: image.small_url,
        medium_url: image.medium_url,
        large_url: image.large_url,
        original_url: image.original_url,
        created_at: new Date(image.created_at),
        updated_at: new Date(image.updated_at),
        alt_text: image.alt_text,
      }))
    );

    console.log(`✅ Seeded ${images.length} images`);
  } catch (error) {
    console.error("❌ Error seeding images:", error);
    throw error;
  }
}

async function seedNationalParks() {
  console.log("🌱 Seeding national parks...");

  try {
    // Clear existing national parks
    await db.delete(NationalParks);

    // Insert national parks (ID will be auto-generated)

    await db.insert(NationalParks).values(
      nationalParks.map((park) => ({
        id: park.id,
        city_id: park.city_id,
        name: park.name,
        slug: park.slug,
        description: park.description,
        created_at: new Date(park.created_at),
        updated_at: new Date(park.updated_at),
        location: { x: 29.552262430482664, y: 78.88324288650782 }, // Default location coordinates
      }))
    );

    console.log(`✅ Seeded ${nationalParks.length} national parks`);
  } catch (error) {
    console.error("❌ Error seeding national parks:", error);
    throw error;
  }
}

async function seedZones() {
  console.log("🌱 Seeding zones...");

  try {
    // Clear existing zones
    await db.delete(Zones);

    // Insert zones (ID will be auto-generated)

    await db.insert(Zones).values(
      zones.map((zone) => ({
        id: zone.id,
        name: zone.name,
        description: zone.description,
        park_id: zone.park_id,
      }))
    );

    console.log(`✅ Seeded ${zones.length} zones`);
  } catch (error) {
    console.error("❌ Error seeding zones:", error);
    throw error;
  }
}

async function seedHotels() {
  console.log("🌱 Seeding hotels...");

  try {
    // Clear existing hotels
    await db.delete(Hotels);

    // Insert hotels (ID will be auto-generated)

    await db.insert(Hotels).values(
      hotels.map((hotel) => ({
        id: hotel.id,
        name: hotel.name,
        description: hotel.description,
        slug: hotel.slug,
        zone_id: hotel.zone_id,
        hotel_type: hotel.hotel_type as any, // Cast to enum type
        rating: hotel.rating,
        location: { x: 0, y: 0 }, // Default location coordinates
      }))
    );

    console.log(`✅ Seeded ${hotels.length} hotels`);
  } catch (error) {
    console.error("❌ Error seeding hotels:", error);
    throw error;
  }
}

async function seedHotelImages() {
  console.log("🌱 Seeding hotel images...");

  try {
    // Clear existing hotel images
    await db.delete(HotelImages);

    // Insert hotel images (ID will be auto-generated)
    await db.insert(HotelImages).values(
      hotelImages.map((hotelImage) => ({
        id: hotelImage.id,
        hotel_id: hotelImage.hotel_id,
        image_id: hotelImage.image_id,
        order: hotelImage.order,
      }))
    );

    console.log(`✅ Seeded ${hotelImages.length} hotel images`);
  } catch (error) {
    console.error("❌ Error seeding hotel images:", error);
    throw error;
  }
}

async function seedParkImages() {
  console.log("🌱 Seeding park images...");

  try {
    // Clear existing hotel images
    // await db.delete(ParkImages);

    // Insert hotel images (ID will be auto-generated)
    await db.insert(ParkImages).values(
      parkImages.map((parkImage) => ({
        id: parkImage.id,
        park_id: parkImage.park_id,
        image_id: parkImage.image_id,
        order: parkImage.order,
      }))
    );

    console.log(`✅ Seeded ${parkImages.length} park images`);
  } catch (error) {
    console.error("❌ Error seeding park images:", error);
    throw error;
  }
}

async function main() {
  console.log("🚀 Starting database seeding...");

  try {
    // Seed in order to maintain referential integrity
    // await seedStates();
    // await seedCities();
    // await seedUsers();
    // await seedImages();
    // await seedNationalParks();
    // await seedZones();
    // await seedHotels();
    // await seedHotelImages();
    await seedParkImages();

    console.log("🎉 Database seeding completed successfully!");
  } catch (error) {
    console.error("💥 Database seeding failed:", error);
    process.exit(1);
  }
}

// Run the seed function
main();
