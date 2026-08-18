"use client";

import { ReactNode } from "react";

export default function Template({ children }: { children: ReactNode }) {
  return (
    <div className="page-enter flex flex-col flex-1 w-full min-h-screen">
      {children}
    </div>
  );
}
