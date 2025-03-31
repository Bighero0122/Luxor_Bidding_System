import { PrismaClient } from "@prisma/client";
import { BidStatus } from "../src/types/prisma";

const prisma = new PrismaClient();

async function main() {
  // Clear existing data
  await prisma.bid.deleteMany();
  await prisma.collection.deleteMany();
  await prisma.user.deleteMany();

  // Create 10 users
  const users = [];
  for (let i = 0; i < 10; i++) {
    const user = await prisma.user.create({
      data: {
        name: `User ${i + 1}`,
        email: `user${i + 1}@example.com`,
      },
    });
    users.push(user);
  }

  // Create 100 collections (10 per user)
  const collections = [];
  for (let i = 0; i < users.length; i++) {
    for (let j = 0; j < 10; j++) {
      const collection = await prisma.collection.create({
        data: {
          name: `Collection ${i * 10 + j + 1}`,
          description: `Description for collection ${i * 10 + j + 1}`,
          stocks: Math.floor(Math.random() * 50) + 1,
          price: parseFloat((Math.random() * 1000 + 10).toFixed(2)),
          ownerId: users[i].id,
        },
      });
      collections.push(collection);
    }
  }

  // Create 10 bids per collection
  for (const collection of collections) {
    // Get users who are not the owner
    const potentialBidders = users.filter(
      (user) => user.id !== collection.ownerId
    );

    for (let i = 0; i < 10; i++) {
      // Select a random bidder from users who are not the owner
      const randomIndex = Math.floor(Math.random() * potentialBidders.length);
      const bidder = potentialBidders[randomIndex];

      // Create a bid with random price (mostly around or above the collection price)
      const priceFactor = 0.8 + Math.random() * 0.4; // 0.8 to 1.2
      const bidPrice = parseFloat((collection.price * priceFactor).toFixed(2));

      await prisma.bid.create({
        data: {
          price: bidPrice,
          status: BidStatus.PENDING,
          collectionId: collection.id,
          userId: bidder.id,
        },
      });
    }
  }

  console.log("Database seeded successfully!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
