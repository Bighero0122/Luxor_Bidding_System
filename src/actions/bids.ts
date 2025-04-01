"use server";

import { revalidatePath } from "next/cache";
import { BidStatus } from "@/types/prisma";
import { prisma } from "@/lib/prisma";
import { PrismaClient } from "@prisma/client";

// Get all bids for a collection
export async function getBidsForCollection(collectionId: string) {
  try {
    const bids = await prisma.bid.findMany({
      where: { collectionId },
      include: {
        user: true,
      },
      orderBy: {
        price: "desc",
      },
    });
    return { bids };
  } catch (error) {
    return { error: "Failed to fetch bids" };
  }
}

// Create a new bid
export async function createBid(data: {
  price: number;
  collectionId: string;
  userId: string;
}) {
  try {
    const bid = await prisma.bid.create({
      data: {
        ...data,
        status: BidStatus.PENDING,
      },
    });
    revalidatePath("/");
    return { bid };
  } catch (error) {
    return { error: "Failed to create bid" };
  }
}

// Update a bid
export async function updateBid(
  id: string,
  data: {
    price?: number;
    status?: BidStatus;
  }
) {
  try {
    const bid = await prisma.bid.update({
      where: { id },
      data,
    });
    revalidatePath("/");
    return { bid };
  } catch (error) {
    return { error: "Failed to update bid" };
  }
}

// Delete a bid
export async function deleteBid(id: string) {
  try {
    const bid = await prisma.bid.delete({
      where: { id },
    });
    revalidatePath("/");
    return { bid };
  } catch (error) {
    return { error: "Failed to delete bid" };
  }
}

// Accept a bid and reject others
export async function acceptBid(collectionId: string, bidId: string) {
  try {
    // Start a transaction to ensure atomicity
    await prisma.$transaction(async (tx: PrismaClient) => {
      // Accept the selected bid
      await tx.bid.update({
        where: { id: bidId },
        data: { status: BidStatus.ACCEPTED },
      });

      // Reject all other pending bids for this collection
      await tx.bid.updateMany({
        where: {
          collectionId,
          id: { not: bidId },
          status: BidStatus.PENDING,
        },
        data: { status: BidStatus.REJECTED },
      });
    });

    revalidatePath("/");
    return { success: true };
  } catch (error) {
    return { error: "Failed to accept bid" };
  }
}
