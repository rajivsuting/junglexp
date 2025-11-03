import { config } from "dotenv";
import { drizzle } from "drizzle-orm/neon-http";

// Auth Schema
import {
  Accounts,
  EmailVerificationTokens,
  PasswordResetTokens,
  Sessions,
  TwoFactorTokens,
  UserAuditLog,
  UserPreferences,
  userRoles,
  Users,
  Verifications,
} from "./schema/auth.schema";

// Core Schemas
import { Amenities } from "./schema/amenities.schema";
import { Faqs } from "./schema/faqs.schema";
import { Images } from "./schema/images.schema";
import { policyKindEnum, Policies } from "./schema/policies.schema";

// Resort Schema
import {
  Resort,
  ResortFaqs,
  ResortImages,
  ResortPolicies,
  resortStatusEnum,
} from "./schema/resort.schema";

// Room Types Schema
import {
  bedTypeEnum,
  RoomTypeAmenities,
  RoomTypeFaqs,
  RoomTypeImages,
  RoomTypePolicies,
  RoomTypes,
  roomTypeStatusEnum,
} from "./schema/room-types.schema";

// Rooms Schema
import { Rooms, roomStatusEnum } from "./schema/rooms.schema";

// Bookings Schema
import {
  BookingPayments,
  Bookings,
  bookingStatusEnum,
  paymentStatusEnum,
} from "./schema/bookings.schema";

// Blog Schema
import {
  BlogImages,
  Blogs,
  blogCategoryEnum,
  blogStatusEnum,
} from "./schema/blogs.schema";

// Gallery Schema
import {
  Gallery,
  galleryCategoryEnum,
  galleryTypeEnum,
} from "./schema/gallery.schema";

// Testimonials Schema
import {
  Testimonials,
  testimonialStatusEnum,
} from "./schema/testimonials.schema";

// Relations
import * as relations from "./schema/relations.schema";

/**
 * --------------------------------------- Export All Types ---------------------------------------
 */

// Auth Types
export type {
  TAccount,
  TNewUser,
  TSession,
  TUser,
  TUserAuditLog,
  TUserPreferences,
  TUserRole,
  TVerification,
} from "./schema/auth.schema";

// Core Types
export type {
  TAmenityBase,
  TInsertAmenity,
  TNewAmenity,
} from "./schema/amenities.schema";

export type { TFaqBase, TInsertFaq, TNewFaq } from "./schema/faqs.schema";

export type { TImage, TNewImage } from "./schema/images.schema";

export type {
  TInsertPolicy,
  TNewPolicy,
  TPolicyBase,
  TPolicyKind,
} from "./schema/policies.schema";

// Resort Types
export type {
  TNewResort,
  TNewResortFaq,
  TNewResortImage,
  TNewResortPolicy,
  TResortBase,
  TResortFaqBase,
  TResortImageBase,
  TResortPolicyBase,
  TResortStatus,
} from "./schema/resort.schema";

// Room Types
export type {
  TBedType,
  TNewRoomType,
  TNewRoomTypeAmenity,
  TNewRoomTypeFaq,
  TNewRoomTypeImage,
  TNewRoomTypePolicy,
  TRoomTypeAmenityBase,
  TRoomTypeBase,
  TRoomTypeFaqBase,
  TRoomTypeImageBase,
  TRoomTypePolicyBase,
  TRoomTypeStatus,
} from "./schema/room-types.schema";

// Room Types
export type {
  TNewRoom,
  TRoomBase,
  TRoomStatus,
} from "./schema/rooms.schema";

// Booking Types
export type {
  TBookingBase,
  TBookingPaymentBase,
  TBookingStatus,
  TNewBooking,
  TNewBookingPayment,
  TPaymentStatus,
} from "./schema/bookings.schema";

// Blog Types
export type {
  TBlogBase,
  TBlogCategory,
  TBlogImageBase,
  TBlogStatus,
  TNewBlog,
  TNewBlogImage,
} from "./schema/blogs.schema";

// Gallery Types
export type {
  TGalleryBase,
  TGalleryCategory,
  TGalleryType,
  TNewGallery,
} from "./schema/gallery.schema";

// Testimonial Types
export type {
  TNewTestimonial,
  TTestimonialBase,
  TTestimonialStatus,
} from "./schema/testimonials.schema";

// Composite Types with Relations
export type {
  TBlog,
  TBlogImage,
  TBooking,
  TBookingWithDetails,
  TGallery,
  TResort,
  TResortFaq,
  TResortImage,
  TResortPolicy,
  TRoom,
  TRoomType,
  TRoomTypeAmenity,
  TRoomTypeFaq,
  TRoomTypeImage,
  TRoomTypePolicy,
  TTestimonial,
} from "./schema/types.schema";

/**
 * --------------------------------------- Export Drizzle Utilities ---------------------------------------
 */
export * from "drizzle-orm";

/**
 * --------------------------------------- Export Schema Tables ---------------------------------------
 */
export {
  // Auth
  Accounts,
  EmailVerificationTokens,
  PasswordResetTokens,
  Sessions,
  TwoFactorTokens,
  UserAuditLog,
  UserPreferences,
  userRoles,
  Users,
  Verifications,
  // Core
  Amenities,
  Faqs,
  Images,
  Policies,
  policyKindEnum,
  // Resort
  Resort,
  ResortFaqs,
  ResortImages,
  ResortPolicies,
  resortStatusEnum,
  // Room Types
  bedTypeEnum,
  RoomTypeAmenities,
  RoomTypeFaqs,
  RoomTypeImages,
  RoomTypePolicies,
  RoomTypes,
  roomTypeStatusEnum,
  // Rooms
  Rooms,
  roomStatusEnum,
  // Bookings
  BookingPayments,
  Bookings,
  bookingStatusEnum,
  paymentStatusEnum,
  // Blogs
  BlogImages,
  Blogs,
  blogCategoryEnum,
  blogStatusEnum,
  // Gallery
  Gallery,
  galleryCategoryEnum,
  galleryTypeEnum,
  // Testimonials
  Testimonials,
  testimonialStatusEnum,
};

/**
 * --------------------------------------- Schema Object ---------------------------------------
 */
export const schemaWithoutRelations = {
  // Auth
  Users,
  Sessions,
  Accounts,
  Verifications,
  PasswordResetTokens,
  EmailVerificationTokens,
  TwoFactorTokens,
  UserPreferences,
  UserAuditLog,
  // Core
  Images,
  Amenities,
  Policies,
  Faqs,
  // Resort
  Resort,
  ResortImages,
  ResortPolicies,
  ResortFaqs,
  // Room Types
  RoomTypes,
  RoomTypeImages,
  RoomTypeAmenities,
  RoomTypePolicies,
  RoomTypeFaqs,
  // Rooms
  Rooms,
  // Bookings
  Bookings,
  BookingPayments,
  // Blogs
  Blogs,
  BlogImages,
  // Gallery
  Gallery,
  // Testimonials
  Testimonials,
};

export const schema = {
  ...schemaWithoutRelations,
  ...relations,
};

/**
 * --------------------------------------- Database Connection ---------------------------------------
 */

// Load environment variables - only in non-production environments
if (process.env.NODE_ENV !== "production") {
  config({ path: "../../.env" });
}

const getDatabaseUrl = () => {
  const url = process.env.DATABASE_URL;
  if (!url) {
    throw new Error("DATABASE_URL environment variable is required");
  }
  return url;
};

// Export Drizzle database instance
export const db = drizzle(getDatabaseUrl(), { schema });
