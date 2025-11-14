"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Share } from "@/components/share";
import { url } from "@/lib/metadata";

const fruits = ["apple", "banana", "cherry", "lemon"];
const fruitImages: Record<string, string> = {
  apple: "/apple.png",
  banana: "/banana.png",
  cherry: "/cherry.png",
  lemon: "/lemon.png",
};

export default function SlotMachine() {
  const [grid, setGrid] = useState<string[][]>(
    Array.from({ length: 3 }, () =>
      Array.from({ length: 3 }, () => randomFruit())
    )
  );
  const [spinning, setSpinning] = useState(false);
  const [winMessage, setWinMessage] = useState<string | null>(null);

  function randomFruit() {
    return fruits[Math.floor(Math.random() * fruits.length)];
  }

  const spin = () => {
    if (spinning) return;
    setSpinning(true);
    setWinMessage(null);
    const interval = setInterval(() => {
      setGrid((prev) => {
        const newGrid = prev.map((row) => [...row]);
        newGrid[2] = newGrid[1];
        newGrid[1] = newGrid[0];
        newGrid[0] = Array.from({ length: 3 }, () => randomFruit());
        return newGrid;
      });
    }, 200);
    setTimeout(() => {
      clearInterval(interval);
      setSpinning(false);
      checkWin();
    }, 2000);
  };

  const checkWin = () => {
    const centerRow = grid[1];
    if (
      centerRow[0] === centerRow[1] &&
      centerRow[1] === centerRow[2]
    ) {
      setWinMessage(`You won with ${centerRow[0]}!`);
    }
  };

  useEffect(() => {
    if (!spinning) {
      checkWin();
    }
  });

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="grid grid-cols-3 gap-2">
        {grid.flat().map((fruit, idx) => (
          <img
            key={idx}
            src={fruitImages[fruit]}
            alt={fruit}
            className="w-16 h-16"
          />
        ))}
      </div>
      <Button onClick={spin} disabled={spinning} variant="default">
        {spinning ? "Spinning..." : "Spin"}
      </Button>
      {winMessage && (
        <div className="mt-4 text-lg font-semibold">
          {winMessage}
          <Share text={`${winMessage} ${url}`} className="ml-2" />
        </div>
      )}
    </div>
  );
}
