import { relations } from "drizzle-orm";

import { Users } from "./auth.schema";
import { Blogs, BlogImages } from "./blogs.schema";
import { Bookings, BookingPayments } from "./bookings.schema";
import { Gallery } from "./gallery.schema";
import { Images } from "./images.schema";
import {
  Resort,
  ResortFaqs,
  ResortImages,
  ResortPolicies,
} from "./resort.schema";
import {
  RoomTypes,
  RoomTypeAmenities,
  RoomTypeFaqs,
  RoomTypeImages,
  RoomTypePolicies,
} from "./room-types.schema";
import { Rooms } from "./rooms.schema";
import { Testimonials } from "./testimonials.schema";
import { Amenities } from "./amenities.schema";
import { Policies } from "./policies.schema";
import { Faqs } from "./faqs.schema";

export const resortRelations = relations(Resort, ({ many }) => ({
  images: many(ResortImages),
  policies: many(ResortPolicies),
  faqs: many(ResortFaqs),
  roomTypes: many(RoomTypes),
  rooms: many(Rooms),
  gallery: many(Gallery),
  testimonials: many(Testimonials),
}));

export const resortImagesRelations = relations(ResortImages, ({ one }) => ({
  resort: one(Resort, {
    fields: [ResortImages.resort_id],
    references: [Resort.id],
  }),
  image: one(Images, {
    fields: [ResortImages.image_id],
    references: [Images.id],
  }),
}));

export const resortPoliciesRelations = relations(ResortPolicies, ({ one }) => ({
  resort: one(Resort, {
    fields: [ResortPolicies.resort_id],
    references: [Resort.id],
  }),
  policy: one(Policies, {
    fields: [ResortPolicies.policy_id],
    references: [Policies.id],
  }),
}));

export const resortFaqsRelations = relations(ResortFaqs, ({ one }) => ({
  resort: one(Resort, {
    fields: [ResortFaqs.resort_id],
    references: [Resort.id],
  }),
  faq: one(Faqs, {
    fields: [ResortFaqs.faq_id],
    references: [Faqs.id],
  }),
}));

export const roomTypeRelations = relations(RoomTypes, ({ one, many }) => ({
  resort: one(Resort, {
    fields: [RoomTypes.resort_id],
    references: [Resort.id],
  }),
  images: many(RoomTypeImages),
  amenities: many(RoomTypeAmenities),
  policies: many(RoomTypePolicies),
  faqs: many(RoomTypeFaqs),
  rooms: many(Rooms),
  bookings: many(Bookings),
}));

export const roomTypeImagesRelations = relations(
  RoomTypeImages,
  ({ one }) => ({
    roomType: one(RoomTypes, {
      fields: [RoomTypeImages.room_type_id],
      references: [RoomTypes.id],
    }),
    image: one(Images, {
      fields: [RoomTypeImages.image_id],
      references: [Images.id],
    }),
  })
);

export const roomTypeAmenitiesRelations = relations(
  RoomTypeAmenities,
  ({ one }) => ({
    roomType: one(RoomTypes, {
      fields: [RoomTypeAmenities.room_type_id],
      references: [RoomTypes.id],
    }),
    amenity: one(Amenities, {
      fields: [RoomTypeAmenities.amenity_id],
      references: [Amenities.id],
    }),
  })
);

export const roomTypePoliciesRelations = relations(
  RoomTypePolicies,
  ({ one }) => ({
    roomType: one(RoomTypes, {
      fields: [RoomTypePolicies.room_type_id],
      references: [RoomTypes.id],
    }),
    policy: one(Policies, {
      fields: [RoomTypePolicies.policy_id],
      references: [Policies.id],
    }),
  })
);

export const roomTypeFaqsRelations = relations(RoomTypeFaqs, ({ one }) => ({
  roomType: one(RoomTypes, {
    fields: [RoomTypeFaqs.room_type_id],
    references: [RoomTypes.id],
  }),
  faq: one(Faqs, {
    fields: [RoomTypeFaqs.faq_id],
    references: [Faqs.id],
  }),
}));

export const roomRelations = relations(Rooms, ({ one, many }) => ({
  resort: one(Resort, {
    fields: [Rooms.resort_id],
    references: [Resort.id],
  }),
  roomType: one(RoomTypes, {
    fields: [Rooms.room_type_id],
    references: [RoomTypes.id],
  }),
  bookings: many(Bookings),
}));

export const bookingRelations = relations(Bookings, ({ one, many }) => ({
  roomType: one(RoomTypes, {
    fields: [Bookings.room_type_id],
    references: [RoomTypes.id],
  }),
  room: one(Rooms, {
    fields: [Bookings.room_id],
    references: [Rooms.id],
  }),
  user: one(Users, {
    fields: [Bookings.user_id],
    references: [Users.id],
  }),
  payments: many(BookingPayments),
}));

export const bookingPaymentsRelations = relations(
  BookingPayments,
  ({ one }) => ({
    booking: one(Bookings, {
      fields: [BookingPayments.booking_id],
      references: [Bookings.id],
    }),
  })
);

export const blogRelations = relations(Blogs, ({ one, many }) => ({
  author: one(Users, {
    fields: [Blogs.author_id],
    references: [Users.id],
  }),
  featuredImage: one(Images, {
    fields: [Blogs.featured_image_id],
    references: [Images.id],
  }),
  images: many(BlogImages),
}));

export const blogImagesRelations = relations(BlogImages, ({ one }) => ({
  blog: one(Blogs, {
    fields: [BlogImages.blog_id],
    references: [Blogs.id],
  }),
  image: one(Images, {
    fields: [BlogImages.image_id],
    references: [Images.id],
  }),
}));

export const galleryRelations = relations(Gallery, ({ one }) => ({
  resort: one(Resort, {
    fields: [Gallery.resort_id],
    references: [Resort.id],
  }),
  image: one(Images, {
    fields: [Gallery.image_id],
    references: [Images.id],
  }),
  videoThumbnail: one(Images, {
    fields: [Gallery.video_thumbnail_id],
    references: [Images.id],
  }),
}));

export const testimonialRelations = relations(Testimonials, ({ one }) => ({
  resort: one(Resort, {
    fields: [Testimonials.resort_id],
    references: [Resort.id],
  }),
  user: one(Users, {
    fields: [Testimonials.user_id],
    references: [Users.id],
  }),
  guestAvatar: one(Images, {
    fields: [Testimonials.guest_avatar_id],
    references: [Images.id],
  }),
}));

export const amenityRelations = relations(Amenities, ({ many }) => ({
  roomTypes: many(RoomTypeAmenities),
}));

export const policyRelations = relations(Policies, ({ many }) => ({
  resorts: many(ResortPolicies),
  roomTypes: many(RoomTypePolicies),
}));

export const faqRelations = relations(Faqs, ({ many }) => ({
  resorts: many(ResortFaqs),
  roomTypes: many(RoomTypeFaqs),
}));

export const imageRelations = relations(Images, ({ many }) => ({
  resortImages: many(ResortImages),
  roomTypeImages: many(RoomTypeImages),
  blogImages: many(BlogImages),
}));

