import type { TCity } from "./city";
import type { TImage } from "./image";
import type { TNationalPark } from "./park";
import type { TSouvenirBase, TSouvenirImageBase } from "./souvenirs";
import type { TState } from "./state";
import type { TTourImageBase, TTourBase, TTourPricingBase } from "./tour";

export type TCityWithState = TCity & {
  state: TState;
};

export type TNationalParkWithCity = TNationalPark & {
  city: TCityWithState;
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

export type TTour = TTourBase & {
  images: TTourImageBase & { image: TImage }[];
  pricing: TTourPricingBase;
};
