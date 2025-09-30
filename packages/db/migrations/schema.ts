import { pgTable, foreignKey, serial, integer, text, index, timestamp, unique, varchar, boolean, uniqueIndex, bigint, geometry, doublePrecision, date, pgEnum } from "drizzle-orm/pg-core"
import { sql } from "drizzle-orm"

export const hotelBookingStatus = pgEnum("hotel_booking_status", ['pending', 'confirmed', 'cancelled'])
export const hotelStatus = pgEnum("hotel_status", ['active', 'inactive'])
export const hotelType = pgEnum("hotel_type", ['resort', 'forest', 'home'])
export const mealPlan = pgEnum("meal_plan", ['EP', 'CP', 'MAP', 'AP'])
export const naturalistBookingStatus = pgEnum("naturalist_booking_status", ['pending', 'confirmed', 'cancelled'])
export const policyKind = pgEnum("policy_kind", ['include', 'exclude'])
export const userRoles = pgEnum("user_roles", ['user', 'admin', 'super_admin'])


export const roomImages = pgTable("room_images", {
	id: serial().primaryKey().notNull(),
	roomId: integer("room_id"),
	imageId: integer("image_id"),
	order: integer().default(0).notNull(),
}, (table) => [
	foreignKey({
			columns: [table.roomId],
			foreignColumns: [rooms.id],
			name: "room_images_room_id_rooms_id_fk"
		}).onDelete("cascade"),
	foreignKey({
			columns: [table.imageId],
			foreignColumns: [images.id],
			name: "room_images_image_id_images_id_fk"
		}).onDelete("cascade"),
]);

export const roomPlans = pgTable("room_plans", {
	id: serial().primaryKey().notNull(),
	roomId: integer("room_id"),
	planType: mealPlan("plan_type").notNull(),
	price: integer().default(0).notNull(),
	description: text(),
	isActive: integer("is_active").default(1).notNull(),
}, (table) => [
	foreignKey({
			columns: [table.roomId],
			foreignColumns: [rooms.id],
			name: "room_plans_room_id_rooms_id_fk"
		}).onDelete("cascade"),
]);

export const activityAmenities = pgTable("activity_amenities", {
	id: serial().primaryKey().notNull(),
	activityId: integer("activity_id"),
	amenityId: integer("amenity_id"),
	order: integer().default(0).notNull(),
}, (table) => [
	foreignKey({
			columns: [table.activityId],
			foreignColumns: [activities.id],
			name: "activity_amenities_activity_id_activities_id_fk"
		}).onDelete("cascade"),
	foreignKey({
			columns: [table.amenityId],
			foreignColumns: [amenities.id],
			name: "activity_amenities_amenity_id_amenities_id_fk"
		}).onDelete("cascade"),
]);

export const souvenirImages = pgTable("souvenir_images", {
	souvenirId: integer("souvenir_id").notNull(),
	imageId: integer("image_id").notNull(),
	id: serial().primaryKey().notNull(),
	order: integer().default(0).notNull(),
}, (table) => [
	foreignKey({
			columns: [table.souvenirId],
			foreignColumns: [souvenirs.id],
			name: "souvenir_images_souvenir_id_souvenirs_id_fk"
		}),
	foreignKey({
			columns: [table.imageId],
			foreignColumns: [images.id],
			name: "souvenir_images_image_id_images_id_fk"
		}),
]);

export const activities = pgTable("activities", {
	id: serial().primaryKey().notNull(),
	name: text().notNull(),
	description: text().notNull(),
	slug: text().notNull(),
	parkId: integer("park_id"),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow().notNull(),
	updatedAt: timestamp("updated_at", { mode: 'string' }).defaultNow().notNull(),
}, (table) => [
	index("activities_name_idx").using("btree", table.name.asc().nullsLast().op("text_ops")),
	index("activities_park_id_idx").using("btree", table.parkId.asc().nullsLast().op("int4_ops")),
	index("activities_slug_idx").using("btree", table.slug.asc().nullsLast().op("text_ops")),
	foreignKey({
			columns: [table.parkId],
			foreignColumns: [nationalParks.id],
			name: "activities_park_id_national_parks_id_fk"
		}).onDelete("cascade"),
]);

export const souvenirs = pgTable("souvenirs", {
	id: serial().primaryKey().notNull(),
	name: varchar({ length: 255 }).notNull(),
	slug: text().notNull(),
	description: text().notNull(),
	price: integer().notNull(),
	parkId: integer("park_id"),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow(),
	updatedAt: timestamp("updated_at", { mode: 'string' }).defaultNow(),
	quantity: integer().default(0).notNull(),
}, (table) => [
	index("souvenirs_name_idx").using("btree", table.name.asc().nullsLast().op("text_ops")),
	index("souvenirs_park_id_idx").using("btree", table.parkId.asc().nullsLast().op("int4_ops")),
	index("souvenirs_slug_idx").using("btree", table.slug.asc().nullsLast().op("text_ops")),
	foreignKey({
			columns: [table.parkId],
			foreignColumns: [nationalParks.id],
			name: "souvenirs_park_id_national_parks_id_fk"
		}),
	unique("souvenirs_name_unique").on(table.name),
	unique("souvenirs_slug_unique").on(table.slug),
]);

export const promotions = pgTable("promotions", {
	id: serial().primaryKey().notNull(),
	name: text().notNull(),
	link: text().notNull(),
	order: integer(),
	isActive: boolean("is_active").default(true),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow(),
	updatedAt: timestamp("updated_at", { mode: 'string' }).defaultNow(),
});

export const users = pgTable("users", {
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	id: bigint({ mode: "number" }).primaryKey().generatedByDefaultAsIdentity({ name: "users_id_seq", startWith: 1, increment: 1, minValue: 1, maxValue: 9223372036854775807, cache: 1 }),
	userId: text("user_id").notNull(),
	email: varchar({ length: 255 }).notNull(),
	phone: varchar({ length: 255 }),
	firstName: varchar("first_name", { length: 225 }).notNull(),
	lastName: varchar("last_name", { length: 225 }).notNull(),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow().notNull(),
	updatedAt: timestamp("updated_at", { mode: 'string' }).defaultNow().notNull(),
	userRole: userRoles("user_role").default('user').notNull(),
}, (table) => [
	uniqueIndex("email_unique").using("btree", table.email.asc().nullsLast().op("text_ops")),
	index("phone_unique").using("btree", table.phone.asc().nullsLast().op("text_ops")),
	index("role_unique").using("btree", table.userRole.asc().nullsLast().op("enum_ops")),
	uniqueIndex("user_id_unique").using("btree", table.userId.asc().nullsLast().op("text_ops")),
	unique("users_user_id_unique").on(table.userId),
	unique("users_email_unique").on(table.email),
	unique("users_phone_unique").on(table.phone),
]);

export const hotels = pgTable("hotels", {
	id: serial().primaryKey().notNull(),
	name: text().notNull(),
	description: text().notNull(),
	slug: text().notNull(),
	zoneId: integer("zone_id"),
	hotelType: hotelType("hotel_type").notNull(),
	rating: integer().default(0),
	location: geometry({ type: "point" }).notNull(),
	status: hotelStatus().default('active'),
	isFeatured: boolean("is_featured").default(false),
}, (table) => [
	index("hotels_hotel_type_idx").using("btree", table.hotelType.asc().nullsLast().op("enum_ops")),
	index("hotels_hotel_type_rating_idx").using("btree", table.hotelType.asc().nullsLast().op("int4_ops"), table.rating.asc().nullsLast().op("int4_ops")),
	index("hotels_hotel_type_zone_id_idx").using("btree", table.hotelType.asc().nullsLast().op("enum_ops"), table.zoneId.asc().nullsLast().op("int4_ops")),
	index("hotels_hotels_status_hotel_type_idx").using("btree", table.status.asc().nullsLast().op("enum_ops"), table.hotelType.asc().nullsLast().op("enum_ops")),
	index("hotels_hotels_status_hotel_type_rating_idx").using("btree", table.status.asc().nullsLast().op("enum_ops"), table.hotelType.asc().nullsLast().op("enum_ops"), table.rating.asc().nullsLast().op("int4_ops")),
	index("hotels_hotels_status_hotel_type_zone_id_idx").using("btree", table.status.asc().nullsLast().op("enum_ops"), table.hotelType.asc().nullsLast().op("int4_ops"), table.zoneId.asc().nullsLast().op("enum_ops")),
	index("hotels_hotels_status_hotel_type_zone_id_rating_idx").using("btree", table.status.asc().nullsLast().op("int4_ops"), table.hotelType.asc().nullsLast().op("int4_ops"), table.zoneId.asc().nullsLast().op("enum_ops"), table.rating.asc().nullsLast().op("int4_ops")),
	index("hotels_hotels_status_is_featured_hotel_type_zone_id_rating_idx").using("btree", table.status.asc().nullsLast().op("enum_ops"), table.isFeatured.asc().nullsLast().op("enum_ops"), table.hotelType.asc().nullsLast().op("int4_ops"), table.zoneId.asc().nullsLast().op("int4_ops"), table.rating.asc().nullsLast().op("bool_ops")),
	index("hotels_is_featured_hotel_type_idx").using("btree", table.isFeatured.asc().nullsLast().op("enum_ops"), table.hotelType.asc().nullsLast().op("enum_ops")),
	index("hotels_is_featured_hotel_type_rating_idx").using("btree", table.isFeatured.asc().nullsLast().op("bool_ops"), table.hotelType.asc().nullsLast().op("enum_ops"), table.rating.asc().nullsLast().op("int4_ops")),
	index("hotels_is_featured_hotel_type_zone_id_idx").using("btree", table.isFeatured.asc().nullsLast().op("int4_ops"), table.hotelType.asc().nullsLast().op("bool_ops"), table.zoneId.asc().nullsLast().op("bool_ops")),
	index("hotels_is_featured_hotel_type_zone_id_rating_idx").using("btree", table.isFeatured.asc().nullsLast().op("enum_ops"), table.hotelType.asc().nullsLast().op("int4_ops"), table.zoneId.asc().nullsLast().op("bool_ops"), table.rating.asc().nullsLast().op("bool_ops")),
	index("hotels_is_featured_idx").using("btree", table.isFeatured.asc().nullsLast().op("bool_ops")),
	index("hotels_location_idx").using("btree", table.location.asc().nullsLast().op("btree_geometry_ops")),
	index("hotels_name_idx").using("btree", table.name.asc().nullsLast().op("text_ops")),
	index("hotels_rating_idx").using("btree", table.rating.asc().nullsLast().op("int4_ops")),
	index("hotels_slug_idx").using("btree", table.slug.asc().nullsLast().op("text_ops")),
	index("hotels_status_idx").using("btree", table.status.asc().nullsLast().op("enum_ops")),
	index("hotels_zone_id_idx").using("btree", table.zoneId.asc().nullsLast().op("int4_ops")),
	foreignKey({
			columns: [table.zoneId],
			foreignColumns: [zones.id],
			name: "hotels_zone_id_zones_id_fk"
		}).onDelete("cascade"),
]);

export const states = pgTable("states", {
	id: serial().primaryKey().notNull(),
	name: text().notNull(),
	stateCode: text("state_code").notNull(),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow(),
	updatedAt: timestamp("updated_at", { mode: 'string' }).defaultNow(),
}, (table) => [
	unique("states_name_unique").on(table.name),
	unique("states_state_code_unique").on(table.stateCode),
]);

export const cities = pgTable("cities", {
	id: serial().primaryKey().notNull(),
	stateId: integer("state_id"),
	name: text().notNull(),
	latitude: text(),
	longitude: text(),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow(),
	updatedAt: timestamp("updated_at", { mode: 'string' }).defaultNow(),
}, (table) => [
	index("cities_state_id_idx").using("btree", table.stateId.asc().nullsLast().op("int4_ops")),
	foreignKey({
			columns: [table.stateId],
			foreignColumns: [states.id],
			name: "cities_state_id_states_id_fk"
		}),
]);

export const hotelAmenities = pgTable("hotel_amenities", {
	id: serial().primaryKey().notNull(),
	hotelId: integer("hotel_id"),
	amenityId: integer("amenity_id"),
	order: integer().notNull(),
}, (table) => [
	foreignKey({
			columns: [table.hotelId],
			foreignColumns: [hotels.id],
			name: "hotel_amenities_hotel_id_hotels_id_fk"
		}),
	foreignKey({
			columns: [table.amenityId],
			foreignColumns: [amenities.id],
			name: "hotel_amenities_amenity_id_amenities_id_fk"
		}),
]);

export const amenities = pgTable("amenities", {
	id: serial().primaryKey().notNull(),
	label: text().notNull(),
	icon: text().notNull(),
});

export const faqs = pgTable("faqs", {
	id: serial().primaryKey().notNull(),
	question: text().notNull(),
	answer: text().notNull(),
});

export const hotelFaqs = pgTable("hotel_faqs", {
	id: serial().primaryKey().notNull(),
	faqId: integer("faq_id"),
	hotelId: integer("hotel_id"),
	order: integer().notNull(),
}, (table) => [
	foreignKey({
			columns: [table.faqId],
			foreignColumns: [faqs.id],
			name: "hotel_faqs_faq_id_faqs_id_fk"
		}).onDelete("cascade"),
	foreignKey({
			columns: [table.hotelId],
			foreignColumns: [hotels.id],
			name: "hotel_faqs_hotel_id_hotels_id_fk"
		}).onDelete("cascade"),
]);

export const hotelImages = pgTable("hotel_images", {
	id: serial().primaryKey().notNull(),
	hotelId: integer("hotel_id"),
	imageId: integer("image_id"),
	order: integer().default(0).notNull(),
}, (table) => [
	foreignKey({
			columns: [table.hotelId],
			foreignColumns: [hotels.id],
			name: "hotel_images_hotel_id_hotels_id_fk"
		}).onDelete("cascade"),
	foreignKey({
			columns: [table.imageId],
			foreignColumns: [images.id],
			name: "hotel_images_image_id_images_id_fk"
		}).onDelete("cascade"),
]);

export const images = pgTable("images", {
	id: serial().primaryKey().notNull(),
	smallUrl: text("small_url").notNull(),
	mediumUrl: text("medium_url").notNull(),
	largeUrl: text("large_url").notNull(),
	originalUrl: text("original_url").notNull(),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow(),
	altText: text("alt_text").default(').notNull(),
	updatedAt: timestamp("updated_at", { mode: 'string' }).defaultNow(),
});

export const policies = pgTable("policies", {
	id: serial().primaryKey().notNull(),
	kind: policyKind().notNull(),
	label: text().notNull(),
}, (table) => [
	index("hotel_policies_kind_idx").using("btree", table.kind.asc().nullsLast().op("enum_ops")),
	index("hotel_policies_label_idx").using("btree", table.label.asc().nullsLast().op("text_ops")),
]);

export const hotelPolicies = pgTable("hotel_policies", {
	id: serial().primaryKey().notNull(),
	policyId: integer("policy_id"),
	hotelId: integer("hotel_id"),
	order: integer().default(0).notNull(),
}, (table) => [
	foreignKey({
			columns: [table.policyId],
			foreignColumns: [policies.id],
			name: "hotel_policies_policy_id_policies_id_fk"
		}).onDelete("cascade"),
	foreignKey({
			columns: [table.hotelId],
			foreignColumns: [hotels.id],
			name: "hotel_policies_hotel_id_hotels_id_fk"
		}).onDelete("cascade"),
]);

export const saftyFeatures = pgTable("safty_features", {
	id: serial().primaryKey().notNull(),
	label: text().notNull(),
	icon: text().notNull(),
});

export const hotelSaftyFeatures = pgTable("hotel_safty_features", {
	id: serial().primaryKey().notNull(),
	saftyFeatureId: integer("safty_feature_id"),
	hotelId: integer("hotel_id"),
	order: integer().notNull(),
}, (table) => [
	foreignKey({
			columns: [table.saftyFeatureId],
			foreignColumns: [saftyFeatures.id],
			name: "hotel_safty_features_safty_feature_id_safty_features_id_fk"
		}).onDelete("cascade"),
	foreignKey({
			columns: [table.hotelId],
			foreignColumns: [hotels.id],
			name: "hotel_safty_features_hotel_id_hotels_id_fk"
		}).onDelete("cascade"),
]);

export const zones = pgTable("zones", {
	id: serial().primaryKey().notNull(),
	name: text().notNull(),
	description: text().notNull(),
	parkId: integer("park_id"),
}, (table) => [
	foreignKey({
			columns: [table.parkId],
			foreignColumns: [nationalParks.id],
			name: "zones_park_id_national_parks_id_fk"
		}),
]);

export const nationalParks = pgTable("national_parks", {
	id: serial().primaryKey().notNull(),
	cityId: integer("city_id").notNull(),
	name: text().notNull(),
	slug: text().notNull(),
	description: text().notNull(),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow(),
	updatedAt: timestamp("updated_at", { mode: 'string' }).defaultNow(),
}, (table) => [
	index("national_parks_name_idx").using("btree", table.name.asc().nullsLast().op("text_ops")),
	index("national_parks_slug_idx").using("btree", table.slug.asc().nullsLast().op("text_ops")),
	foreignKey({
			columns: [table.cityId],
			foreignColumns: [cities.id],
			name: "national_parks_city_id_cities_id_fk"
		}),
	unique("national_parks_slug_unique").on(table.slug),
]);

export const placeImages = pgTable("place_images", {
	id: serial().primaryKey().notNull(),
	placeId: integer("place_id"),
	imageId: integer("image_id"),
	order: integer().default(0).notNull(),
}, (table) => [
	foreignKey({
			columns: [table.placeId],
			foreignColumns: [places.id],
			name: "place_images_place_id_places_id_fk"
		}).onDelete("cascade"),
	foreignKey({
			columns: [table.imageId],
			foreignColumns: [images.id],
			name: "place_images_image_id_images_id_fk"
		}).onDelete("cascade"),
]);

export const rooms = pgTable("rooms", {
	id: serial().primaryKey().notNull(),
	name: text().notNull(),
	description: text().notNull(),
	roomQty: integer("room_qty").default(1).notNull(),
	capacity: integer().default(2).notNull(),
	hotelId: integer("hotel_id"),
}, (table) => [
	foreignKey({
			columns: [table.hotelId],
			foreignColumns: [hotels.id],
			name: "rooms_hotel_id_hotels_id_fk"
		}).onDelete("cascade"),
]);

export const roomAmenities = pgTable("room_amenities", {
	id: serial().primaryKey().notNull(),
	roomId: integer("room_id"),
	amenityId: integer("amenity_id"),
	order: integer().default(0).notNull(),
}, (table) => [
	foreignKey({
			columns: [table.roomId],
			foreignColumns: [rooms.id],
			name: "room_amenities_room_id_rooms_id_fk"
		}).onDelete("cascade"),
	foreignKey({
			columns: [table.amenityId],
			foreignColumns: [amenities.id],
			name: "room_amenities_amenity_id_amenities_id_fk"
		}).onDelete("cascade"),
]);

export const places = pgTable("places", {
	id: serial().primaryKey().notNull(),
	name: text().notNull(),
	description: text().notNull(),
	slug: text().notNull(),
	location: geometry({ type: "point" }).notNull(),
}, (table) => [
	index("places_location_idx").using("btree", table.location.asc().nullsLast().op("btree_geometry_ops")),
	index("places_name_idx").using("btree", table.name.asc().nullsLast().op("text_ops")),
	index("places_slug_idx").using("btree", table.slug.asc().nullsLast().op("text_ops")),
	unique("places_slug_unique").on(table.slug),
]);

export const activityImages = pgTable("activity_images", {
	id: serial().primaryKey().notNull(),
	activityId: integer("activity_id"),
	imageId: integer("image_id"),
	order: integer().default(0).notNull(),
}, (table) => [
	foreignKey({
			columns: [table.activityId],
			foreignColumns: [activities.id],
			name: "activity_images_activity_id_activities_id_fk"
		}).onDelete("cascade"),
	foreignKey({
			columns: [table.imageId],
			foreignColumns: [images.id],
			name: "activity_images_image_id_images_id_fk"
		}).onDelete("cascade"),
]);

export const activityItinerary = pgTable("activity_itinerary", {
	id: serial().primaryKey().notNull(),
	activityId: integer("activity_id"),
	title: text().notNull(),
	description: text().notNull(),
	order: integer().default(0).notNull(),
}, (table) => [
	foreignKey({
			columns: [table.activityId],
			foreignColumns: [activities.id],
			name: "activity_itinerary_activity_id_activities_id_fk"
		}).onDelete("cascade"),
]);

export const parkImages = pgTable("park_images", {
	id: serial().primaryKey().notNull(),
	parkId: integer("park_id").notNull(),
	imageId: integer("image_id").notNull(),
	order: integer().notNull(),
	isMobile: boolean("is_mobile").default(false).notNull(),
}, (table) => [
	foreignKey({
			columns: [table.parkId],
			foreignColumns: [nationalParks.id],
			name: "park_images_park_id_national_parks_id_fk"
		}).onDelete("cascade"),
	foreignKey({
			columns: [table.imageId],
			foreignColumns: [images.id],
			name: "park_images_image_id_images_id_fk"
		}),
]);

export const activityPolicies = pgTable("activity_policies", {
	id: serial().primaryKey().notNull(),
	activityId: integer("activity_id"),
	policyId: integer("policy_id"),
	order: integer().default(0).notNull(),
}, (table) => [
	foreignKey({
			columns: [table.activityId],
			foreignColumns: [activities.id],
			name: "activity_policies_activity_id_activities_id_fk"
		}).onDelete("cascade"),
	foreignKey({
			columns: [table.policyId],
			foreignColumns: [policies.id],
			name: "activity_policies_policy_id_policies_id_fk"
		}).onDelete("cascade"),
]);

export const activityPackages = pgTable("activity_packages", {
	id: serial().primaryKey().notNull(),
	name: text().notNull(),
	duration: doublePrecision().notNull(),
	number: integer().notNull(),
	order: integer().default(0).notNull(),
	active: boolean().default(true).notNull(),
	activityId: integer("activity_id"),
	price: doublePrecision().notNull(),
	price1: doublePrecision("price_1").notNull(),
}, (table) => [
	foreignKey({
			columns: [table.activityId],
			foreignColumns: [activities.id],
			name: "activity_packages_activity_id_activities_id_fk"
		}).onDelete("cascade"),
]);

export const naturalist = pgTable("naturalist", {
	id: serial().primaryKey().notNull(),
	name: text().notNull(),
	imageId: integer("image_id"),
	description: text().notNull(),
	parkId: integer("park_id"),
}, (table) => [
	index().using("btree", table.name.asc().nullsLast().op("text_ops")),
	index().using("btree", table.parkId.asc().nullsLast().op("int4_ops")),
	index().using("btree", table.parkId.asc().nullsLast().op("int4_ops"), table.name.asc().nullsLast().op("text_ops")),
	foreignKey({
			columns: [table.imageId],
			foreignColumns: [images.id],
			name: "naturalist_image_id_images_id_fk"
		}),
	foreignKey({
			columns: [table.parkId],
			foreignColumns: [nationalParks.id],
			name: "naturalist_park_id_national_parks_id_fk"
		}),
]);

export const hotelBookings = pgTable("hotel_bookings", {
	id: serial().primaryKey().notNull(),
	name: text().notNull(),
	email: text().notNull(),
	mobileNo: varchar("mobile_no", { length: 255 }).notNull(),
	checkInDate: date("check_in_date").notNull(),
	checkOutDate: date("check_out_date").notNull(),
	noOfRoomsRequired: integer("no_of_rooms_required").notNull(),
	noOfAdults: integer("no_of_adults").notNull(),
	noOfKids: integer("no_of_kids").notNull(),
	status: hotelBookingStatus().default('pending').notNull(),
	hotelId: integer("hotel_id"),
	roomId: integer("room_id"),
	planId: integer("plan_id"),
}, (table) => [
	index("hotel_bookings_check_in_date_idx").using("btree", table.checkInDate.asc().nullsLast().op("date_ops")),
	index("hotel_bookings_check_out_date_idx").using("btree", table.checkOutDate.asc().nullsLast().op("date_ops")),
	index("hotel_bookings_hotel_id_idx").using("btree", table.hotelId.asc().nullsLast().op("int4_ops")),
	index("hotel_bookings_no_of_adults_idx").using("btree", table.noOfAdults.asc().nullsLast().op("int4_ops")),
	index("hotel_bookings_no_of_kids_idx").using("btree", table.noOfKids.asc().nullsLast().op("int4_ops")),
	index("hotel_bookings_no_of_rooms_required_idx").using("btree", table.noOfRoomsRequired.asc().nullsLast().op("int4_ops")),
	index("hotel_bookings_no_of_rooms_required_no_of_adults_no_of_kids_idx").using("btree", table.noOfRoomsRequired.asc().nullsLast().op("int4_ops"), table.noOfAdults.asc().nullsLast().op("int4_ops"), table.noOfKids.asc().nullsLast().op("int4_ops")),
	index("hotel_bookings_room_id_idx").using("btree", table.roomId.asc().nullsLast().op("int4_ops")),
	index("hotel_bookings_status_hotel_id_name_email_mobile_no_idx").using("btree", table.status.asc().nullsLast().op("text_ops"), table.hotelId.asc().nullsLast().op("enum_ops"), table.name.asc().nullsLast().op("int4_ops"), table.email.asc().nullsLast().op("int4_ops"), table.mobileNo.asc().nullsLast().op("int4_ops")),
	index("hotel_bookings_status_idx").using("btree", table.status.asc().nullsLast().op("enum_ops")),
	index("hotel_bookings_status_room_id_name_email_mobile_no_idx").using("btree", table.status.asc().nullsLast().op("int4_ops"), table.roomId.asc().nullsLast().op("enum_ops"), table.name.asc().nullsLast().op("enum_ops"), table.email.asc().nullsLast().op("text_ops"), table.mobileNo.asc().nullsLast().op("int4_ops")),
	foreignKey({
			columns: [table.planId],
			foreignColumns: [roomPlans.id],
			name: "hotel_bookings_plan_id_room_plans_id_fk"
		}).onDelete("cascade"),
	foreignKey({
			columns: [table.hotelId],
			foreignColumns: [hotels.id],
			name: "hotel_bookings_hotel_id_hotels_id_fk"
		}).onDelete("cascade"),
	foreignKey({
			columns: [table.roomId],
			foreignColumns: [rooms.id],
			name: "hotel_bookings_room_id_rooms_id_fk"
		}).onDelete("cascade"),
]);

export const naturalistBookings = pgTable("naturalist_bookings", {
	id: serial().primaryKey().notNull(),
	name: text().notNull(),
	email: text().notNull(),
	mobileNo: text("mobile_no").notNull(),
	dateOfSafari: date("date_of_safari").notNull(),
	slot: text().notNull(),
	parkId: integer("park_id"),
	specialisedInterest: text("specialised_interest").notNull(),
	status: naturalistBookingStatus().default('pending').notNull(),
}, (table) => [
	index("naturalist_bookings_name_email_mobile_no_idx").using("btree", table.name.asc().nullsLast().op("text_ops"), table.email.asc().nullsLast().op("text_ops"), table.mobileNo.asc().nullsLast().op("text_ops")),
	index("naturalist_bookings_park_id_date_of_safari_idx").using("btree", table.parkId.asc().nullsLast().op("date_ops"), table.dateOfSafari.asc().nullsLast().op("int4_ops")),
	index("naturalist_bookings_park_id_idx").using("btree", table.parkId.asc().nullsLast().op("int4_ops")),
	index("naturalist_bookings_slot_idx").using("btree", table.slot.asc().nullsLast().op("text_ops")),
	index("naturalist_bookings_specialised_interest_idx").using("btree", table.specialisedInterest.asc().nullsLast().op("text_ops")),
	index("naturalist_bookings_status_idx").using("btree", table.status.asc().nullsLast().op("enum_ops")),
	index("naturalist_bookings_status_name_email_mobile_no_idx").using("btree", table.status.asc().nullsLast().op("enum_ops"), table.name.asc().nullsLast().op("enum_ops"), table.email.asc().nullsLast().op("text_ops"), table.mobileNo.asc().nullsLast().op("text_ops")),
	foreignKey({
			columns: [table.parkId],
			foreignColumns: [nationalParks.id],
			name: "naturalist_bookings_park_id_national_parks_id_fk"
		}).onDelete("cascade"),
]);
