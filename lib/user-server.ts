"use server";

import { getSession, User } from "./session";

const guestUser: User = {
  id: "guest",
  email: "",
  role: "GUEST",
  isLoggedIn: false,
  fullName: "",
  province: "",
  region: "",
  schoolName: "",
};

async function getPrisma() {
  try {
    const prismaModule = await import("./db");
    return prismaModule.default;
  } catch (error) {
    console.error("Prisma initialization failed:", error);
    return null;
  }
}

export async function getUser(): Promise<User> {
  try {
    const prisma = await getPrisma();
    if (!prisma) {
      return guestUser;
    }

    const session = await getSession().catch((error) => {
      console.error("getSession error:", error);
      return null;
    });

    // Session yo'q yoki user login bo'lmagan bo'lsa -> Guest
    if (!session?.user?.isLoggedIn || !session.user?.id) {
      return guestUser;
    }

    const userId = session.user.id;

    // Foydalanuvchini DBdan olish
    const dbUser = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        role: true,
        fullName: true,
        province: true,
        region: true,
        schoolName: true,
      },
    });

    // DBda yo‘q bo‘lsa (masalan, o‘chirilgan bo‘lsa)
    if (!dbUser) {
      return guestUser;
    }

    // Toza qaytarish
    return {
      ...dbUser,
      isLoggedIn: true,
    } as User;
  } catch (error) {
    console.error("getUser error:", error);

    // Har qanday xatoda xavfsiz Guest state qaytariladi
    return guestUser;
  }
}
