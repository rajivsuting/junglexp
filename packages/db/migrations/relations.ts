import { relations } from "drizzle-orm/relations";
import { states, cities, nationalParks, tours, tourPricing, inclusions, souvenirs, souvenirImages, images, tourHotels, tourImages, parkImages, amenities, hotelAmenities, hotels, policies, hotelPolicies, faqs, zones, hotelAmenitiesS, hotelImages, saftyFeatures, hotelSaftyFeatures } from "./schema";

export const citiesRelations = relations(cities, ({one, many}) => ({
	state: one(states, {
		fields: [cities.stateId],
		references: [states.id]
	}),
	nationalParks: many(nationalParks),
}));

export const statesRelations = relations(states, ({many}) => ({
	cities: many(cities),
}));

export const toursRelations = relations(tours, ({one, many}) => ({
	nationalPark: one(nationalParks, {
		fields: [tours.parkId],
		references: [nationalParks.id]
	}),
	tourPricing: one(tourPricing, {
		fields: [tours.pricingId],
		references: [tourPricing.id]
	}),
	inclusions: many(inclusions),
	tourHotels: many(tourHotels),
	tourImages: many(tourImages),
}));

export const nationalParksRelations = relations(nationalParks, ({one, many}) => ({
	tours: many(tours),
	souvenirs: many(souvenirs),
	city: one(cities, {
		fields: [nationalParks.cityId],
		references: [cities.id]
	}),
	parkImages: many(parkImages),
	faqs: many(faqs),
	zones: many(zones),
}));

export const tourPricingRelations = relations(tourPricing, ({many}) => ({
	tours: many(tours),
}));

export const inclusionsRelations = relations(inclusions, ({one}) => ({
	tour: one(tours, {
		fields: [inclusions.tourId],
		references: [tours.id]
	}),
}));

export const souvenirsRelations = relations(souvenirs, ({one, many}) => ({
	nationalPark: one(nationalParks, {
		fields: [souvenirs.parkId],
		references: [nationalParks.id]
	}),
	souvenirImages: many(souvenirImages),
}));

export const souvenirImagesRelations = relations(souvenirImages, ({one}) => ({
	souvenir: one(souvenirs, {
		fields: [souvenirImages.souvenirId],
		references: [souvenirs.id]
	}),
	image: one(images, {
		fields: [souvenirImages.imageId],
		references: [images.id]
	}),
}));

export const imagesRelations = relations(images, ({many}) => ({
	souvenirImages: many(souvenirImages),
	tourImages: many(tourImages),
	parkImages: many(parkImages),
	hotelImages: many(hotelImages),
}));

export const tourHotelsRelations = relations(tourHotels, ({one, many}) => ({
	tour: one(tours, {
		fields: [tourHotels.tourId],
		references: [tours.id]
	}),
	hotelAmenitiesses: many(hotelAmenitiesS),
}));

export const tourImagesRelations = relations(tourImages, ({one}) => ({
	tour: one(tours, {
		fields: [tourImages.tourId],
		references: [tours.id]
	}),
	image: one(images, {
		fields: [tourImages.imageId],
		references: [images.id]
	}),
}));

export const parkImagesRelations = relations(parkImages, ({one}) => ({
	image: one(images, {
		fields: [parkImages.imageId],
		references: [images.id]
	}),
	nationalPark: one(nationalParks, {
		fields: [parkImages.parkId],
		references: [nationalParks.id]
	}),
}));

export const hotelAmenitiesRelations = relations(hotelAmenities, ({one}) => ({
	amenity: one(amenities, {
		fields: [hotelAmenities.amenityId],
		references: [amenities.id]
	}),
	hotel: one(hotels, {
		fields: [hotelAmenities.hotelId],
		references: [hotels.id]
	}),
}));

export const amenitiesRelations = relations(amenities, ({many}) => ({
	hotelAmenities: many(hotelAmenities),
}));

export const hotelsRelations = relations(hotels, ({one, many}) => ({
	hotelAmenities: many(hotelAmenities),
	hotelPolicies: many(hotelPolicies),
	faqs: many(faqs),
	zone: one(zones, {
		fields: [hotels.zoneId],
		references: [zones.id]
	}),
	hotelImages: many(hotelImages),
	hotelSaftyFeatures: many(hotelSaftyFeatures),
	policies: many(policies),
}));

export const hotelPoliciesRelations = relations(hotelPolicies, ({one}) => ({
	policy: one(policies, {
		fields: [hotelPolicies.policyId],
		references: [policies.id]
	}),
	hotel: one(hotels, {
		fields: [hotelPolicies.hotelId],
		references: [hotels.id]
	}),
}));

export const policiesRelations = relations(policies, ({one, many}) => ({
	hotelPolicies: many(hotelPolicies),
	hotel: one(hotels, {
		fields: [policies.hotelId],
		references: [hotels.id]
	}),
}));

export const faqsRelations = relations(faqs, ({one}) => ({
	hotel: one(hotels, {
		fields: [faqs.hotelId],
		references: [hotels.id]
	}),
	nationalPark: one(nationalParks, {
		fields: [faqs.parkId],
		references: [nationalParks.id]
	}),
}));

export const zonesRelations = relations(zones, ({one, many}) => ({
	hotels: many(hotels),
	nationalPark: one(nationalParks, {
		fields: [zones.parkId],
		references: [nationalParks.id]
	}),
}));

export const hotelAmenitiesSRelations = relations(hotelAmenitiesS, ({one}) => ({
	tourHotel: one(tourHotels, {
		fields: [hotelAmenitiesS.hotelId],
		references: [tourHotels.id]
	}),
}));

export const hotelImagesRelations = relations(hotelImages, ({one}) => ({
	hotel: one(hotels, {
		fields: [hotelImages.hotelId],
		references: [hotels.id]
	}),
	image: one(images, {
		fields: [hotelImages.imageId],
		references: [images.id]
	}),
}));

export const hotelSaftyFeaturesRelations = relations(hotelSaftyFeatures, ({one}) => ({
	saftyFeature: one(saftyFeatures, {
		fields: [hotelSaftyFeatures.saftyFeatureId],
		references: [saftyFeatures.id]
	}),
	hotel: one(hotels, {
		fields: [hotelSaftyFeatures.hotelId],
		references: [hotels.id]
	}),
}));

export const saftyFeaturesRelations = relations(saftyFeatures, ({many}) => ({
	hotelSaftyFeatures: many(hotelSaftyFeatures),
}));