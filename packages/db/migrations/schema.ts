import { pgTable, uniqueIndex, unique, bigint, text, varchar, integer, timestamp, serial, foreignKey, boolean, index, pgEnum } from "drizzle-orm/pg-core"
import { sql } from "drizzle-orm"

export const faqSubject = pgEnum("faq_subject", ['hotel', 'destination', 'park', 'site'])
export const hotelType = pgEnum("hotel_type", ['resort', 'forest'])
export const policyKind = pgEnum("policy_kind", ['include', 'exclude'])


export const users = pgTable("users", {
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	id: bigint({ mode: "number" }).primaryKey().generatedByDefaultAsIdentity({ name: "users_id_seq", startWith: 1, increment: 1, minValue: 1, maxValue: 9223372036854775807, cache: 1 }),
	userId: text("user_id").notNull(),
	email: varchar({ length: 255 }).notNull(),
	phone: varchar({ length: 255 }),
	firstName: varchar("first_name", { length: 225 }).notNull(),
	lastName: varchar("last_name", { length: 225 }).notNull(),
	role: integer().default(0).notNull(),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow().notNull(),
	updatedAt: timestamp("updated_at", { mode: 'string' }).defaultNow().notNull(),
}, (table) => [
	uniqueIndex("user_id_unique").using("btree", table.userId.asc().nullsLast().op("text_ops")),
	unique("users_user_id_unique").on(table.userId),
	unique("users_email_unique").on(table.email),
	unique("users_phone_unique").on(table.phone),
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
	foreignKey({
			columns: [table.stateId],
			foreignColumns: [states.id],
			name: "cities_state_id_states_id_fk"
		}),
]);

export const tours = pgTable("tours", {
	id: serial().primaryKey().notNull(),
	title: text().notNull(),
	slug: text().notNull(),
	description: text().notNull(),
	parkId: integer("park_id").notNull(),
	pricingId: integer("pricing_id").notNull(),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow().notNull(),
	updatedAt: timestamp("updated_at", { mode: 'string' }).defaultNow().notNull(),
}, (table) => [
	foreignKey({
			columns: [table.parkId],
			foreignColumns: [nationalParks.id],
			name: "tours_park_id_national_parks_id_fk"
		}),
	foreignKey({
			columns: [table.pricingId],
			foreignColumns: [tourPricing.id],
			name: "tours_pricing_id_tour_pricing_id_fk"
		}),
	unique("tours_slug_unique").on(table.slug),
]);

export const inclusions = pgTable("inclusions", {
	id: serial().primaryKey().notNull(),
	tourId: integer("tour_id").notNull(),
	isIncluded: boolean("is_included").default(false).notNull(),
	name: text().notNull(),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow(),
}, (table) => [
	foreignKey({
			columns: [table.tourId],
			foreignColumns: [tours.id],
			name: "inclusions_tour_id_tours_id_fk"
		}),
]);

export const images = pgTable("images", {
	id: serial().primaryKey().notNull(),
	smallUrl: text("small_url").notNull(),
	mediumUrl: text("medium_url").notNull(),
	largeUrl: text("large_url").notNull(),
	originalUrl: text("original_url").notNull(),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow(),
	updatedAt: timestamp("updated_at", { mode: 'string' }).defaultNow(),
});

export const souvenirs = pgTable("souvenirs", {
	id: serial().primaryKey().notNull(),
	name: varchar({ length: 255 }).notNull(),
	slug: text().notNull(),
	description: text().notNull(),
	price: integer().notNull(),
	parkId: integer("park_id"),
	isAvailable: boolean("is_available").default(false).notNull(),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow(),
	updatedAt: timestamp("updated_at", { mode: 'string' }).defaultNow(),
}, (table) => [
	index("souvenirs_id_idx").using("btree", table.parkId.asc().nullsLast().op("int4_ops")),
	index("souvenirs_is_available_idx").using("btree", table.isAvailable.asc().nullsLast().op("bool_ops")),
	index("souvenirs_name_availability_idx").using("btree", table.name.asc().nullsLast().op("text_ops"), table.isAvailable.asc().nullsLast().op("bool_ops")),
	index("souvenirs_name_idx").using("btree", table.name.asc().nullsLast().op("text_ops")),
	index("souvenirs_slug_idx").using("btree", table.slug.asc().nullsLast().op("text_ops")),
	foreignKey({
			columns: [table.parkId],
			foreignColumns: [nationalParks.id],
			name: "souvenirs_park_id_national_parks_id_fk"
		}),
	unique("souvenirs_name_unique").on(table.name),
	unique("souvenirs_slug_unique").on(table.slug),
]);

export const souvenirImages = pgTable("souvenir_images", {
	souvenirId: integer("souvenir_id").notNull(),
	imageId: integer("image_id").notNull(),
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

export const tourHotels = pgTable("tour_hotels", {
	id: serial().primaryKey().notNull(),
	tourId: integer("tour_id").notNull(),
	hotelName: text("hotel_name").notNull(),
	hotelType: text("hotel_type").notNull(),
	hotelAddress: text("hotel_address").notNull(),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow().notNull(),
}, (table) => [
	foreignKey({
			columns: [table.tourId],
			foreignColumns: [tours.id],
			name: "tour_hotels_tour_id_tours_id_fk"
		}),
]);

export const tourImages = pgTable("tour_images", {
	tourId: integer("tour_id").notNull(),
	imageId: integer("image_id").notNull(),
}, (table) => [
	foreignKey({
			columns: [table.tourId],
			foreignColumns: [tours.id],
			name: "tour_images_tour_id_tours_id_fk"
		}),
	foreignKey({
			columns: [table.imageId],
			foreignColumns: [images.id],
			name: "tour_images_image_id_images_id_fk"
		}),
]);

export const tourPricing = pgTable("tour_pricing", {
	id: serial().primaryKey().notNull(),
	tourId: integer("tour_id").notNull(),
	adultPrice: integer("adult_price").notNull(),
	childPrice: integer("child_price"),
	infantPrice: integer("infant_price"),
	currency: varchar({ length: 6 }).default('INR').notNull(),
	taxIncluded: boolean("tax_included").default(false).notNull(),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow().notNull(),
	updatedAt: timestamp("updated_at", { mode: 'string' }).defaultNow().notNull(),
});

export const nationalParks = pgTable("national_parks", {
	id: serial().primaryKey().notNull(),
	cityId: integer("city_id").notNull(),
	name: text().notNull(),
	slug: text().notNull(),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow(),
	updatedAt: timestamp("updated_at", { mode: 'string' }).defaultNow(),
	description: text().notNull(),
}, (table) => [
	index("name_idx").using("btree", table.name.asc().nullsLast().op("text_ops")),
	index("slug_idx").using("btree", table.slug.asc().nullsLast().op("text_ops")),
	foreignKey({
			columns: [table.cityId],
			foreignColumns: [cities.id],
			name: "national_parks_city_id_cities_id_fk"
		}),
	unique("national_parks_slug_unique").on(table.slug),
]);

export const parkImages = pgTable("park_images", {
	parkId: integer("park_id").notNull(),
	imageId: integer("image_id").notNull(),
	order: integer().notNull(),
	id: serial().primaryKey().notNull(),
}, (table) => [
	foreignKey({
			columns: [table.imageId],
			foreignColumns: [images.id],
			name: "park_images_image_id_images_id_fk"
		}),
	foreignKey({
			columns: [table.parkId],
			foreignColumns: [nationalParks.id],
			name: "park_images_park_id_national_parks_id_fk"
		}).onDelete("cascade"),
]);

export const hotelAmenities = pgTable("hotel_amenities", {
	id: serial().primaryKey().notNull(),
	hotelId: integer("hotel_id"),
	amenityId: integer("amenity_id"),
}, (table) => [
	foreignKey({
			columns: [table.amenityId],
			foreignColumns: [amenities.id],
			name: "hotel_amenities_amenity_id_amenities_id_fk"
		}),
	foreignKey({
			columns: [table.hotelId],
			foreignColumns: [hotels.id],
			name: "hotel_amenities_hotel_id_hotels_id_fk"
		}),
]);

export const hotelPolicies = pgTable("hotel_policies", {
	id: serial().primaryKey().notNull(),
	hotelId: integer("hotel_id"),
	policyId: integer("policy_id"),
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

export const faqs = pgTable("faqs", {
	id: serial().primaryKey().notNull(),
	question: text().notNull(),
	answer: text().notNull(),
	subject: faqSubject().notNull(),
	hotelId: integer("hotel_id"),
	order: integer().notNull(),
	parkId: integer("park_id"),
}, (table) => [
	index("faqs_hotel_idx").using("btree", table.hotelId.asc().nullsLast().op("int4_ops"), table.order.asc().nullsLast().op("int4_ops")),
	index("faqs_park_idx").using("btree", table.parkId.asc().nullsLast().op("int4_ops"), table.order.asc().nullsLast().op("int4_ops")),
	uniqueIndex("faqs_unique_hotel").using("btree", table.hotelId.asc().nullsLast().op("text_ops"), table.question.asc().nullsLast().op("text_ops")),
	uniqueIndex("faqs_unique_park").using("btree", table.parkId.asc().nullsLast().op("int4_ops"), table.question.asc().nullsLast().op("int4_ops")),
	foreignKey({
			columns: [table.hotelId],
			foreignColumns: [hotels.id],
			name: "faqs_hotel_id_hotels_id_fk"
		}).onDelete("cascade"),
	foreignKey({
			columns: [table.parkId],
			foreignColumns: [nationalParks.id],
			name: "faqs_park_id_national_parks_id_fk"
		}).onDelete("cascade"),
]);

export const hotels = pgTable("hotels", {
	id: serial().primaryKey().notNull(),
	name: text().notNull(),
	description: text().notNull(),
	slug: text().notNull(),
	zoneId: integer("zone_id"),
	hotelType: hotelType("hotel_type").notNull(),
	rating: integer().default(0),
}, (table) => [
	foreignKey({
			columns: [table.zoneId],
			foreignColumns: [zones.id],
			name: "hotels_zone_id_zones_id_fk"
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

export const hotelAmenitiesS = pgTable("hotel_amenities_s", {
	id: serial().primaryKey().notNull(),
	hotelId: integer("hotel_id").notNull(),
	amenityId: integer("amenity_id"),
}, (table) => [
	foreignKey({
			columns: [table.hotelId],
			foreignColumns: [tourHotels.id],
			name: "hotel_amenities_s_hotel_id_tour_hotels_id_fk"
		}),
]);

export const saftyFeatures = pgTable("safty_features", {
	id: serial().primaryKey().notNull(),
	label: text().notNull(),
	icon: text().notNull(),
	order: integer().notNull(),
});

export const promotions = pgTable("promotions", {
	id: serial().primaryKey().notNull(),
	name: text().notNull(),
	link: text().notNull(),
	order: integer(),
	isActive: boolean("is_active").default(true),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow(),
	updatedAt: timestamp("updated_at", { mode: 'string' }).defaultNow(),
});

export const hotelImages = pgTable("hotel_images", {
	id: serial().primaryKey().notNull(),
	hotelId: integer("hotel_id"),
	imageId: integer("image_id"),
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

export const hotelSaftyFeatures = pgTable("hotel_safty_features", {
	id: serial().primaryKey().notNull(),
	saftyFeatureId: integer("safty_feature_id"),
	hotelId: integer("hotel_id"),
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

export const policies = pgTable("policies", {
	id: serial().primaryKey().notNull(),
	kind: policyKind().notNull(),
	label: text().notNull(),
	hotelId: integer("hotel_id").notNull(),
	order: integer().notNull(),
}, (table) => [
	index("hotel_policies_kind_idx").using("btree", table.kind.asc().nullsLast().op("enum_ops")),
	index("hotel_policies_label_idx").using("btree", table.label.asc().nullsLast().op("text_ops")),
	foreignKey({
			columns: [table.hotelId],
			foreignColumns: [hotels.id],
			name: "policies_hotel_id_hotels_id_fk"
		}),
]);

export const amenities = pgTable("amenities", {
	id: serial().primaryKey().notNull(),
	label: text().notNull(),
	icon: text().notNull(),
	order: integer().notNull(),
});
