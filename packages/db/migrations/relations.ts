import { relations } from "drizzle-orm/relations";
import { rooms, roomImages, images, roomPlans, activities, activityAmenities, amenities, souvenirs, souvenirImages, nationalParks, zones, hotels, states, cities, hotelAmenities, faqs, hotelFaqs, hotelImages, policies, hotelPolicies, saftyFeatures, hotelSaftyFeatures, places, placeImages, roomAmenities, activityImages, activityItinerary, parkImages, activityPolicies, activityPackages, naturalist, hotelBookings, naturalistBookings } from "./schema";

export const roomImagesRelations = relations(roomImages, ({one}) => ({
	room: one(rooms, {
		fields: [roomImages.roomId],
		references: [rooms.id]
	}),
	image: one(images, {
		fields: [roomImages.imageId],
		references: [images.id]
	}),
}));

export const roomsRelations = relations(rooms, ({one, many}) => ({
	roomImages: many(roomImages),
	roomPlans: many(roomPlans),
	hotel: one(hotels, {
		fields: [rooms.hotelId],
		references: [hotels.id]
	}),
	roomAmenities: many(roomAmenities),
	hotelBookings: many(hotelBookings),
}));

export const imagesRelations = relations(images, ({many}) => ({
	roomImages: many(roomImages),
	souvenirImages: many(souvenirImages),
	hotelImages: many(hotelImages),
	placeImages: many(placeImages),
	activityImages: many(activityImages),
	parkImages: many(parkImages),
	naturalists: many(naturalist),
}));

export const roomPlansRelations = relations(roomPlans, ({one, many}) => ({
	room: one(rooms, {
		fields: [roomPlans.roomId],
		references: [rooms.id]
	}),
	hotelBookings: many(hotelBookings),
}));

export const activityAmenitiesRelations = relations(activityAmenities, ({one}) => ({
	activity: one(activities, {
		fields: [activityAmenities.activityId],
		references: [activities.id]
	}),
	amenity: one(amenities, {
		fields: [activityAmenities.amenityId],
		references: [amenities.id]
	}),
}));

export const activitiesRelations = relations(activities, ({one, many}) => ({
	activityAmenities: many(activityAmenities),
	nationalPark: one(nationalParks, {
		fields: [activities.parkId],
		references: [nationalParks.id]
	}),
	activityImages: many(activityImages),
	activityItineraries: many(activityItinerary),
	activityPolicies: many(activityPolicies),
	activityPackages: many(activityPackages),
}));

export const amenitiesRelations = relations(amenities, ({many}) => ({
	activityAmenities: many(activityAmenities),
	hotelAmenities: many(hotelAmenities),
	roomAmenities: many(roomAmenities),
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

export const souvenirsRelations = relations(souvenirs, ({one, many}) => ({
	souvenirImages: many(souvenirImages),
	nationalPark: one(nationalParks, {
		fields: [souvenirs.parkId],
		references: [nationalParks.id]
	}),
}));

export const nationalParksRelations = relations(nationalParks, ({one, many}) => ({
	activities: many(activities),
	souvenirs: many(souvenirs),
	zones: many(zones),
	city: one(cities, {
		fields: [nationalParks.cityId],
		references: [cities.id]
	}),
	parkImages: many(parkImages),
	naturalists: many(naturalist),
	naturalistBookings: many(naturalistBookings),
}));

export const hotelsRelations = relations(hotels, ({one, many}) => ({
	zone: one(zones, {
		fields: [hotels.zoneId],
		references: [zones.id]
	}),
	hotelAmenities: many(hotelAmenities),
	hotelFaqs: many(hotelFaqs),
	hotelImages: many(hotelImages),
	hotelPolicies: many(hotelPolicies),
	hotelSaftyFeatures: many(hotelSaftyFeatures),
	rooms: many(rooms),
	hotelBookings: many(hotelBookings),
}));

export const zonesRelations = relations(zones, ({one, many}) => ({
	hotels: many(hotels),
	nationalPark: one(nationalParks, {
		fields: [zones.parkId],
		references: [nationalParks.id]
	}),
}));

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

export const hotelAmenitiesRelations = relations(hotelAmenities, ({one}) => ({
	hotel: one(hotels, {
		fields: [hotelAmenities.hotelId],
		references: [hotels.id]
	}),
	amenity: one(amenities, {
		fields: [hotelAmenities.amenityId],
		references: [amenities.id]
	}),
}));

export const hotelFaqsRelations = relations(hotelFaqs, ({one}) => ({
	faq: one(faqs, {
		fields: [hotelFaqs.faqId],
		references: [faqs.id]
	}),
	hotel: one(hotels, {
		fields: [hotelFaqs.hotelId],
		references: [hotels.id]
	}),
}));

export const faqsRelations = relations(faqs, ({many}) => ({
	hotelFaqs: many(hotelFaqs),
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

export const policiesRelations = relations(policies, ({many}) => ({
	hotelPolicies: many(hotelPolicies),
	activityPolicies: many(activityPolicies),
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

export const placeImagesRelations = relations(placeImages, ({one}) => ({
	place: one(places, {
		fields: [placeImages.placeId],
		references: [places.id]
	}),
	image: one(images, {
		fields: [placeImages.imageId],
		references: [images.id]
	}),
}));

export const placesRelations = relations(places, ({many}) => ({
	placeImages: many(placeImages),
}));

export const roomAmenitiesRelations = relations(roomAmenities, ({one}) => ({
	room: one(rooms, {
		fields: [roomAmenities.roomId],
		references: [rooms.id]
	}),
	amenity: one(amenities, {
		fields: [roomAmenities.amenityId],
		references: [amenities.id]
	}),
}));

export const activityImagesRelations = relations(activityImages, ({one}) => ({
	activity: one(activities, {
		fields: [activityImages.activityId],
		references: [activities.id]
	}),
	image: one(images, {
		fields: [activityImages.imageId],
		references: [images.id]
	}),
}));

export const activityItineraryRelations = relations(activityItinerary, ({one}) => ({
	activity: one(activities, {
		fields: [activityItinerary.activityId],
		references: [activities.id]
	}),
}));

export const parkImagesRelations = relations(parkImages, ({one}) => ({
	nationalPark: one(nationalParks, {
		fields: [parkImages.parkId],
		references: [nationalParks.id]
	}),
	image: one(images, {
		fields: [parkImages.imageId],
		references: [images.id]
	}),
}));

export const activityPoliciesRelations = relations(activityPolicies, ({one}) => ({
	activity: one(activities, {
		fields: [activityPolicies.activityId],
		references: [activities.id]
	}),
	policy: one(policies, {
		fields: [activityPolicies.policyId],
		references: [policies.id]
	}),
}));

export const activityPackagesRelations = relations(activityPackages, ({one}) => ({
	activity: one(activities, {
		fields: [activityPackages.activityId],
		references: [activities.id]
	}),
}));

export const naturalistRelations = relations(naturalist, ({one}) => ({
	image: one(images, {
		fields: [naturalist.imageId],
		references: [images.id]
	}),
	nationalPark: one(nationalParks, {
		fields: [naturalist.parkId],
		references: [nationalParks.id]
	}),
}));

export const hotelBookingsRelations = relations(hotelBookings, ({one}) => ({
	roomPlan: one(roomPlans, {
		fields: [hotelBookings.planId],
		references: [roomPlans.id]
	}),
	hotel: one(hotels, {
		fields: [hotelBookings.hotelId],
		references: [hotels.id]
	}),
	room: one(rooms, {
		fields: [hotelBookings.roomId],
		references: [rooms.id]
	}),
}));

export const naturalistBookingsRelations = relations(naturalistBookings, ({one}) => ({
	nationalPark: one(nationalParks, {
		fields: [naturalistBookings.parkId],
		references: [nationalParks.id]
	}),
}));