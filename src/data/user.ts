import { prisma } from "@/lib/prisma";

export const getUserByEmail = async (email: string) => {
  try {
    const user = await prisma.user.findUnique({ where: { email } });
    return user;
  } catch {
    return null;
  }
};

export const getUserById = async (id: string) => {
  try {
    const user = await prisma.user.findUnique({ where: { id } });
    return user;
  } catch {
    return null;
  }
};

export const createUser = async (data: {
  email: string;
  name?: string;
  password: string;
}) => {
  try {
    const user = await prisma.user.create({ data });
    return user;
  } catch {
    return null;
  }
};
