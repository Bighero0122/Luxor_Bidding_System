import { PrismaClient } from "@prisma/client";

// Define the BidStatus enum that matches your Prisma schema
export enum BidStatus {
  PENDING = "PENDING",
  ACCEPTED = "ACCEPTED",
  REJECTED = "REJECTED",
}

// Define the base types manually
export interface User {
  id: string;
  name: string;
  email: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Collection {
  id: string;
  name: string;
  description: string;
  stocks: number;
  price: number;
  createdAt: Date;
  updatedAt: Date;
  ownerId: string;
}

export interface Bid {
  id: string;
  price: number;
  status: BidStatus;
  createdAt: Date;
  updatedAt: Date;
  collectionId: string;
  userId: string;
}

// Define relationship types
export type CollectionWithOwner = Collection & {
  owner: User;
};

export type BidWithUser = Bid & {
  user: User;
};

export type BidWithCollection = Bid & {
  collection: Collection;
};

// Create a singleton Prisma client to prevent multiple instances
const globalForPrisma = global as unknown as { prisma: PrismaClient };

export const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({
    log: ["query", "error", "warn"],
  });

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
