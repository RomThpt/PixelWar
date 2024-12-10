"use client";

import Header from "./components/internal/Header";
import Map from "./components/Map";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col justify-between gap-16">
      {/* <Header /> */}
      <section className="flex flex-grow flex-col items-center justify-center">
        <Map />
      </section>
    </main>
  );
}
