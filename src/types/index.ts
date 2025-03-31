import { Collection, User, Bid } from "@/types/prisma";

export type CollectionWithOwner = Collection & {
  owner: User;
};

export type BidWithUser = Bid & {
  user: User;
};

export type CollectionFormData = {
  name: string;
  description: string;
  stocks: number;
  price: number;
};

export type BidFormData = {
  price: number;
};
