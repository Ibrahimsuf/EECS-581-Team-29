"use client";
import { useState } from "react";
import dynamic from "next/dynamic";
import { GridSizeForm } from "../components/GridSizeForm";

const MinesweeperBoard = dynamic(() => import("../components/MinesweeperBoard"), { ssr: false });

export default function Home() {
  const [size, setSize] = useState(10);
  const [mines, setMines] = useState(10);
  const [started, setStarted] = useState(false);

  return (
    <main className="font-sans flex flex-col items-center min-h-screen p-8 pb-20 gap-8 sm:p-20 bg-gradient-to-br from-gray-100 to-blue-100 dark:from-gray-900 dark:to-blue-950">
      <h1 className="text-4xl sm:text-6xl font-extrabold text-center mb-2">
        Minesweepers of the Midwest
      </h1>
      <GridSizeForm
        size={size}
        mines={mines}
        setSize={setSize}
        setMines={setMines}
        onStart={() => setStarted(true)}
      />
      {started && (
        <MinesweeperBoard size = {size} mines={mines} />
      )}
      <footer className="mt-8 text-center text-xs text-gray-500">
        &copy; {new Date().getFullYear()} Team 29
      </footer>
    </main>
  );
}
