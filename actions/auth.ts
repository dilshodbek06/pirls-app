/* eslint-disable @typescript-eslint/no-explicit-any */
"use server";

import bcrypt from "bcryptjs";
import { getSession, User } from "@/lib/session";
import { redirect } from "next/navigation";
import prisma from "@/lib/db";
import { PrismaClientKnownRequestError } from "@/lib/generated/prisma/internal/prismaNamespace";

// Teacher login
export async function loginAction(formData: FormData) {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  try {
    if (!email || !password) {
      return { error: "Email va parol talab etiladi" };
    }

    // 1. Find user in DB
    const userFromDb = await prisma.user.findUnique({
      where: { email },
    });

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
      fullName: userFromDb.fullName,
      province: userFromDb.province,
      region: userFromDb.region,
      schoolName: userFromDb.schoolName,
    };

    // 4. Store user data in the session
    const session = await getSession();

    session.user = user;
    await session.save();

    return { success: true };
  } catch (error: any) {
    // In a real app, you would log this error and return a user-friendly message
    console.error("Login failed:", error.message);
    return {
      error: error.message || "Login qilishda noma'lum xatolik yuz berdi",
    };
  }
}

// pupil login
export async function loginPupil(formData: FormData) {
  return loginAction(formData);
}

// Teacher logout
export async function logoutAction() {
  const session = await getSession();
  await session.destroy();

  // Redirect to home page after logout
  redirect("/auth/teacher-login");
}

// pupil logout
export async function logoutPupil() {
  const session = await getSession();
  await session.destroy();

  // Redirect to home page after logout
  redirect("/auth/login");
}

// Teacher register
export async function registerAction(formData: FormData) {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const fullName = formData.get("fullName") as string;
  const ageRaw = formData.get("age") as string;
  const age = Number.parseInt(ageRaw, 10);
  const province = formData.get("province") as string;
  const region = formData.get("region") as string;
  const schoolName = formData.get("schoolName") as string;

  if (
    !email ||
    !password ||
    !fullName ||
    Number.isNaN(age) ||
    !province ||
    !region ||
    !schoolName
  ) {
    return { error: "Barcha maydonlar to'ldirilishi shart" };
  }

  if (password.length < 6) {
    return { error: "Parol kamida 6 ta belgidan iborat bo'lishi kerak" };
  }

  // Hash the password before storing
  const hashedPassword = await bcrypt.hash(password, 10);

  try {
    const userFromDb = await prisma.user.create({
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

    // 3. Create the session payload
    const user: User = {
      id: userFromDb.id,
      email: userFromDb.email,
      role: userFromDb.role as User["role"],
      isLoggedIn: true,
      fullName: userFromDb.fullName,
      province: userFromDb.province,
      region: userFromDb.region,
      schoolName: userFromDb.schoolName,
    };

    // 4. Store user data in the session
    const session = await getSession();

    session.user = user;
    await session.save();

    return { success: true };
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

// pupil register
export async function registerPupil(formData: FormData) {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const fullName = formData.get("fullName") as string;
  const ageRaw = formData.get("age") as string;
  const age = Number.parseInt(ageRaw, 10);
  const province = formData.get("province") as string;
  const region = formData.get("region") as string;
  const schoolName = formData.get("schoolName") as string;

  if (
    !email ||
    !password ||
    !fullName ||
    Number.isNaN(age) ||
    !province ||
    !region ||
    !schoolName
  ) {
    return { error: "Barcha maydonlar to'ldirilishi shart" };
  }

  if (password.length < 6) {
    return { error: "Parol kamida 6 ta belgidan iborat bo'lishi kerak" };
  }

  // Hash the password before storing
  const hashedPassword = await bcrypt.hash(password, 10);

  try {
    const userFromDb = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        age,
        fullName,
        province,
        region,
        schoolName,
        role: "USER",
      },
    });

    // 3. Create the session payload
    const user: User = {
      id: userFromDb.id,
      email: userFromDb.email,
      role: userFromDb.role as User["role"],
      isLoggedIn: true,
      fullName: userFromDb.fullName,
      province: userFromDb.province,
      region: userFromDb.region,
      schoolName: userFromDb.schoolName,
    };

    // 4. Store user data in the session
    const session = await getSession();

    session.user = user;
    await session.save();

    return { success: true };
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
