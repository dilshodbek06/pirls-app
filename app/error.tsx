"use client";

import Link from "next/link";

export default function Error() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-6 py-12">
      <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-lg space-y-6 text-center">
        <div className="space-y-2">
          <p className="text-sm font-semibold text-indigo-600 uppercase tracking-wide">
            Oops!
          </p>
          <h1 className="text-2xl font-bold text-gray-900">
            Xatolik yuz berdi.
          </h1>
          <p className="text-sm text-gray-600">
            Sahifani yangilang yoki asosiy sahifaga qayting.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row sm:justify-center gap-3">
          <Link
            href="/"
            className="inline-flex justify-center rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-md transition hover:-translate-y-0.5 hover:bg-blue-500 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
          >
            Asosiy sahifaga qaytish
          </Link>
        </div>
      </div>
    </div>
  );
}
