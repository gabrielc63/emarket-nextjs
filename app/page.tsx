"use client";

import { useQuery } from "@tanstack/react-query";
import apiRouter from "@/api/router";

export default function Home() {
  const { data } = useQuery({
    queryKey: ["getUsers"],
    queryFn: apiRouter.users.getUsers,
  });

  return (
    <div className="flex flex-col flex-1 items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <main className="flex flex-1 w-full max-w-3xl flex-col items-center justify-between py-32 px-16 bg-white dark:bg-black sm:items-start">
        {data?.map((user: any) => (
          <li key={user.id}>
            {user.name} - {user.email}
          </li>
        ))}
      </main>
    </div>
  );
}
