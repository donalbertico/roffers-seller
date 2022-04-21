import { ModelInit, MutableModel, PersistentModelConstructor } from "@aws-amplify/datastore";





type OfferMetaData = {
  readOnlyFields: 'createdAt' | 'updatedAt';
}

type SellerMetaData = {
  readOnlyFields: 'createdAt' | 'updatedAt';
}

export declare class Offer {
  readonly id: string;
  readonly sellerID: string;
  readonly expires?: string;
  readonly owner: string;
  readonly createdAt?: string;
  readonly updatedAt?: string;
  constructor(init: ModelInit<Offer, OfferMetaData>);
  static copyOf(source: Offer, mutator: (draft: MutableModel<Offer, OfferMetaData>) => MutableModel<Offer, OfferMetaData> | void): Offer;
}

export declare class Seller {
  readonly id: string;
  readonly name: string;
  readonly Offers?: (Offer | null)[];
  readonly owner: string;
  readonly verified?: boolean;
  readonly createdAt?: string;
  readonly updatedAt?: string;
  constructor(init: ModelInit<Seller, SellerMetaData>);
  static copyOf(source: Seller, mutator: (draft: MutableModel<Seller, SellerMetaData>) => MutableModel<Seller, SellerMetaData> | void): Seller;
}