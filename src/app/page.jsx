/* eslint-disable react/jsx-filename-extension */
"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();

  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <main className="flex flex-col gap-2 row-start-2 items-center justify-center">
        <Image
          src="/images/codewalnut-logo.svg"
          alt="CodeWalnut logo"
          width={180}
          height={38}
          priority
        />

        <h1 className="text-4xl font-bold mt-6">Tech Test</h1>
        <h2 className="text-lg">Good luck!</h2>

        <button className="mt-6 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600" 
        onClick={() => router.push('/pokemon-search')}> Go to Pokémon Search </button>

        <button className="mt-6 px-4 py-2 bg-green-500 text-white rounded hover:bg-green-700" 
        onClick={() => router.push('/pokemon-explorer')}> Explore Pokémon </button>

      </main>
    </div>
  );
}
