import type { TAmenityBase } from "./amenities";
import type { TCity } from "./city";
import type { TFaqsBase } from "./faqs";
import type { THotelAmenitiesBase } from "./hotel-amenities";
import type {
  THotelBase,
  THotelImageBase,
  THotelPolicyBase,
  THotelSaftyFeatureBase,
} from "./hotels";
import type { TImage } from "./image";
import type { TNationalParkBase, TParkImageBase } from "./park";
import type { TPolicyBase } from "./policies";
import type { TSaftyFeatureBase } from "./safty-features";
import type { TSouvenirBase, TSouvenirImageBase } from "./souvenirs";
import type { TState } from "./state";
import type { TZoneBase } from "./zones";

export type TCityWithState = TCity & {
  state: TState;
};

export type TParkImage = TParkImageBase & {
  image: TImage;
};

export type TNationalPark = TNationalParkBase & {
  city: TCityWithState;
  images: TParkImage[];
};

export type TSouvenirWithImage = TSouvenirBase & {
  images: TImage[];
};

export type TSouvenirImage = TSouvenirImageBase & {
  image: TImage;
};

export type TSouvenir = TSouvenirBase & {
  images: TSouvenirImage[];
  park: TNationalPark;
};

export type TZone = TZoneBase & {
  park: TNationalParkBase;
};

export type THotelImage = THotelImageBase & {
  image: TImage;
};

export type THotelPolicy = THotelPolicyBase & {
  policy: TPolicyBase;
};

export type THotelSaftyFeature = THotelSaftyFeatureBase & {
  feature: TSaftyFeatureBase;
};

export type THotelAmenity = THotelAmenitiesBase & {
  amenity: TAmenityBase;
};

export type THotelFaq = {
  id: number;
  faq_id: number;
  hotel_id: number;
  order: number;
  faq: TFaqsBase;
};

export type THotel = THotelBase & {
  zone: TZone;
  images: THotelImage[];
  includes: THotelAmenitiesBase[];
  excludes: THotelAmenitiesBase[];
  policies: THotelPolicy[];
  saftyFeatures: THotelSaftyFeature[];
  amenities: THotelAmenity[];
  faqs: THotelFaq[];
};
