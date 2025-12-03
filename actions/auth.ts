/* eslint-disable @typescript-eslint/no-explicit-any */
"use server";

import bcrypt from "bcryptjs";
import { getSession, User } from "@/lib/session";
import { redirect } from "next/navigation";
import prisma from "@/lib/db";
import { PrismaClientKnownRequestError } from "@/lib/generated/prisma/internal/prismaNamespace";

export async function loginAction(formData: FormData) {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  try {
    // 1. Find user in DB
    const userFromDb = await prisma.user.findUnique({ where: { email } });

    if (!userFromDb) {
      throw new Error("Email yoki parol noto'g'ri");
    }

    // 2. Verify password using bcrypt
    const passwordMatch = await bcrypt.compare(password, userFromDb.password);

    if (!passwordMatch) {
      throw new Error("Email yoki parol noto'g'ri");
    }

    // 3. Create the session payload
    const user: User = {
      id: userFromDb.id,
      email: userFromDb.email,
      role: userFromDb.role as User["role"],
      isLoggedIn: true,
    };

    // 4. Store user data in the session
    const session = await getSession();

    session.user = user;
    await session.save();
  } catch (error: any) {
    // In a real app, you would log this error and return a user-friendly message
    console.error("Login failed:", error.message);
    return {
      error: error.message || "Login qilishda noma'lum xatolik yuz berdi",
    };
  }
}

export async function logoutAction() {
  const session = await getSession();
  session.destroy();

  // Redirect to home page after logout
  redirect("/auth/teacher-login");
}

export async function registerAction(formData: FormData) {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const fullName = formData.get("fullName") as string;
  const age = parseInt(formData.get("age") as string);
  const province = formData.get("province") as string;
  const region = formData.get("region") as string;
  const schoolName = formData.get("schoolName") as string;

  // Hash the password before storing
  const hashedPassword = await bcrypt.hash(password, 10);

  try {
    await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        age,
        fullName,
        province,
        region,
        schoolName,
      },
    });
  } catch (error: any) {
    // 1. Prisma unique field (noyob maydon) xatoligini tekshirish
    if (error instanceof PrismaClientKnownRequestError) {
      // P2002 kodi - Bu unique constraint (noyoblik cheklovi) buzilganligini bildiradi.
      if (error.code === "P2002") {
        return {
          error: "Bu elektron pochta manzili allaqachon ro'yxatdan o'tgan.",
        };
      }
    }

    // 2. Boshqa barcha noma'lum xatoliklar
    return { error: "Ro'yhatdan o'tishda noma'lum xatolik yuz berdi" };
  }
}
