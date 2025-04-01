"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";

// Get all collections
export async function getCollections() {
  try {
    const collections = await prisma.collection.findMany({
      include: {
        owner: true,
      },
    });
    return { collections };
  } catch (error) {
    return { error: "Failed to fetch collections" };
  }
}

// Get a single collection by ID
export async function getCollection(id: string) {
  try {
    const collection = await prisma.collection.findUnique({
      where: { id },
      include: {
        owner: true,
      },
    });
    return { collection };
  } catch (error) {
    return { error: "Failed to fetch collection" };
  }
}

// Create a new collection
export async function createCollection(data: {
  name: string;
  description: string;
  stocks: number;
  price: number;
  ownerId: string;
}) {
  try {
    const collection = await prisma.collection.create({
      data,
    });
    revalidatePath("/");
    return { collection };
  } catch (error) {
    return { error: "Failed to create collection" };
  }
}

// Update a collection
export async function updateCollection(
  id: string,
  data: {
    name?: string;
    description?: string;
    stocks?: number;
    price?: number;
  }
) {
  try {
    const collection = await prisma.collection.update({
      where: { id },
      data,
    });
    revalidatePath("/");
    return { collection };
  } catch (error) {
    return { error: "Failed to update collection" };
  }
}

// Delete a collection
export async function deleteCollection(id: string) {
  try {
    // First delete all bids related to this collection
    await prisma.bid.deleteMany({
      where: { collectionId: id },
    });

    // Then delete the collection
    const collection = await prisma.collection.delete({
      where: { id },
    });

    revalidatePath("/");
    return { collection };
  } catch (error) {
    return { error: "Failed to delete collection" };
  }
}
