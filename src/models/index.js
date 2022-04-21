// @ts-check
import { initSchema } from '@aws-amplify/datastore';
import { schema } from './schema';



const { Offer, Seller } = initSchema(schema);

export {
  Offer,
  Seller
};
