"use server";

import { prisma } from "@/lib/prisma";

// Get all users
export async function getUsers() {
  try {
    const users = await prisma.user.findMany();
    return { users };
  } catch (error) {
    return { error: "Failed to fetch users" };
  }
}

// Get a single user by ID
export async function getUser(id: string) {
  try {
    const user = await prisma.user.findUnique({
      where: { id },
    });
    return { user };
  } catch (error) {
    return { error: "Failed to fetch user" };
  }
}
