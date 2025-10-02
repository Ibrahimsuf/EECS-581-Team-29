"use client";

import soundManager from "@/lib/soundManager";
import { createGame, getState, reveal, flag, GameState, BoardCell, aiEnd } from "@/lib/api";
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';import BotAvatar from "./BotAvatar";
import { useState, useEffect } from "react";

type Props = {
  defaultMines?: number;   // 10..20
  safeNeighbors?: boolean; // true = first click protects neighbors too
};
interface Difficulty {
  name: string
  selected: boolean
}

let Difficulties: Difficulty[] = [
  {name: "No AI", selected: true},
  {name: "Easy AI", selected: false},
  {name: "Medium AI", selected: false},
  {name: "Hard AI", selected: false}
]

export default function Minesweeper({ defaultMines = 15, safeNeighbors = true }: Props) {
  const [gameId, setGameId] = useState<string | null>(null);
  const [state, setState] = useState<GameState | null>(null);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [selectedDifficulty, setSelectedDifficulty] = useState("No AI")
  // Start new game
  const newGame = async (mines = defaultMines) => {
    try {
      setLoading(true);
      setErrorMsg(null);
      const g = await createGame(mines, safeNeighbors, selectedDifficulty != "No AI", selectedDifficulty);
      setGameId(g.game_id);
      console.log(g.game_id)
      const s = await getState(g.game_id);
      setState(s);
      soundManager.play("gameStart");
    } catch (e: any) {
      setErrorMsg(e.message ?? "Failed to create game");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    newGame(defaultMines);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Auto-trigger AI moves
  useEffect(() => {
    const makeAiMove = async () => {
      if (!gameId || !state || state.status !== "Playing") return;
      if ((state.turn ?? "human") !== "ai") return;
      if (loading) return; // Prevent multiple concurrent AI moves

      try {
        setLoading(true);
        // small delay
        await new Promise(resolve => setTimeout(resolve, 500));
        const s = await aiEnd(gameId);
        setState(s);
        
        // Play sounds for AI moves
        if (s.status === "Game Lost") {
          soundManager.play("explosion");
        } else if (s.status === "Victory") {
          soundManager.play("victory");
        }
      } catch (e: any) {
        setErrorMsg(e.message ?? "AI move failed");
      } finally {
        setLoading(false);
      }
    };

    makeAiMove();
  }, [state?.turn, gameId, state?.status, loading]);

  // run any time a cell is revealed
  const onReveal = async (r: number, c: number) => {
    console.log(state)
    if (!gameId || !state || state.status !== "Playing") return;
    // Only block reveals during AI turn
    if ((state.turn ?? "human") === "ai") return;
    try {
      setLoading(true);
      const s = await reveal(gameId, r, c, selectedDifficulty);
      setState(s);

      // reminder to use the API's version here where "Game Lost" is the actual loss value
      if (s.status === "Game Lost") {
        soundManager.play("explosion");
      } else if (s.status === "Victory") {
        soundManager.play("victory");
      }
    } catch (e: any) {
      setErrorMsg(e.message ?? "Reveal failed");
    } finally {
      setLoading(false);
    }
  };

  const onFlag = async (r: number, c: number) => {
    if (!gameId || !state || state.status !== "Playing") return;
    try {
      setLoading(true);
      const s = await flag(gameId, r, c, selectedDifficulty);
      setState(s);
      // proper flag placed --> play sound
      soundManager.play("flag");
    } catch (e: any) {
      setErrorMsg(e.message ?? "Flag failed");
    } finally {
      setLoading(false);
    }
  };

  const renderCell = (cell: BoardCell) => {
    if (cell === ".") return "";
    if (cell === " ") return "";       // empty revealed cell
    return cell;                       // "F", "1".."8", "B"
  };

  const handleCellMouseDown = (e: React.MouseEvent<HTMLButtonElement>, r: number, c: number) => {
    // Left click: reveal, Right click: flag
    if (e.button === 2) {
      e.preventDefault();
      onFlag(r, c);
    } else if (e.button === 0) {
      onReveal(r, c);
    }
  };

  const handleContextMenu = (e: React.MouseEvent) => {
    // Prevent browser context menu on right click
    e.preventDefault();
  };

  // Text color mapping for numbers (no background classes)
  const numberTextColor = (val: string) => {
    switch (val) {
      case "1": return "text-blue-900";       // Dark Blue
      case "2": return "text-green-600";      // Green
      case "3": return "text-red-600";        // Red
      case "4": return "text-purple-700";     // Purple / dark
      case "5": return "text-[#800000]";      // Maroon (custom)
      case "6": return "text-teal-700";       // Teal / dark green
      // Optional:
      // case "7": return "text-gray-800";
      // case "8": return "text-black";
      default:  return "text-black";
    }
  };

  return (
    <div className="p-4 space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex flex-col items-start gap-2">
        <div className="flex items-center gap-3">
          <Stack spacing={2} direction="row">
            {
              Difficulties.map((difficulty) => 
              <Button 
              key={difficulty.name}
              variant={(difficulty.name == selectedDifficulty) ? "contained" : "outlined"}
              onClick={(event) => setSelectedDifficulty(difficulty.name)}
              >{difficulty.name}
              </Button>
            )
            }
          </Stack>
        </div>
        <div className="flex items-center gap-3">
          <label className="text-sm">Mines:</label>
            <div className="flex gap-2">
              {[10, 12, 15, 18, 20].map((m) => (
                <button
                  key={m}
                  onClick={() => newGame(m)}
                  className={`px-3 py-1 rounded border hover:bg-gray-50`}
                  disabled={loading}
                  title={`Start new game with ${m} mines`}
                >
                  {m}
                </button>
              ))}
            </div>
                      <span className="text-sm px-2 py-1 rounded bg-gray-100 text-black">
            Flags remaining: <strong>{state?.remaining_mines ?? "-"}</strong>
          </span>
        </div>
          <button
            onClick={() => newGame(defaultMines)}
            className="px-3 py-1 rounded bg-black text-white hover:opacity-90 disabled:opacity-50"
            disabled={loading}
          >
            New Game
          </button>
        </div>
      </div>

      {/* Error */}
      {errorMsg && (
        <div className="text-sm text-red-600 bg-red-50 border border-red-200 px-3 py-2 rounded">
          {errorMsg}
        </div>
      )}

      {/* Grid */}
      <div className="flex items-end gap-4">
        <div
          className="inline-block select-none"
          onContextMenu={handleContextMenu}
          role="grid"
          aria-label="Minesweeper grid"
        >
          {state ? (
            <div
              className={
                "grid bg-gray-100 rounded-xl shadow-lg p-2 border border-gray-300 " +
                // delete pointer events block
                ((state.turn ?? "human") === "ai" && state.status === "Playing" ? "opacity-70" : "")
              }
              style={{ gridTemplateColumns: `repeat(${state.width}, 2.5rem)` }}
            >
            {state.board.map((row, r) =>
              row.map((cell, c) => {
                const isCovered = cell === ".";
                const isFlag = cell === "F";
                const isBomb = cell === "B";
                const content = renderCell(cell);
                const contentStr = String(content);
                const isNumber = /^[1-8]$/.test(contentStr);

                // Tailwind cell styles
                let cls = "w-10 h-10 flex items-center justify-center text-base font-bold border border-gray-400 rounded-lg transition-all duration-150 outline-none focus:ring-2 focus:ring-blue-400";
                if (isCovered) cls += " bg-gray-200 hover:bg-gray-300 active:bg-gray-400 cursor-pointer";
                else if (isBomb) cls += " bg-red-600 text-white border-red-700 animate-pulse";
                else if (isFlag) cls += " bg-yellow-400 text-black border-yellow-500";
                else cls += " bg-white text-black";

                // Number coloring
                if (!isCovered && !isBomb && !isFlag && isNumber) {
                  cls += " " + numberTextColor(contentStr);
                }

                return (
                  <button
                    key={`${r}-${c}`}
                    type="button"
                    className={cls}
                    onMouseDown={(e: React.MouseEvent<HTMLButtonElement>) => handleCellMouseDown(e, r, c)}
                    onKeyDown={(e: React.KeyboardEvent<HTMLButtonElement>) => {
                      if (e.key === "Enter" || e.key === " ") onReveal(r, c);
                      if (e.key.toLowerCase() === "f") onFlag(r, c);
                    }}
                    tabIndex={0}
                    aria-label={`cell ${r},${c}${isNumber ? ` ${contentStr}` : ""}`}
                  >
                    {contentStr}
                  </button>
                );
              })
            )}
            </div>
          ) : (
            <div className="text-sm text-gray-500">Loading…</div>
          )}
        </div>
        
        {/* Bot Avatar pos*/}
        {state && (
          <div className="mb-2">
            <BotAvatar 
              isAiTurn={(state.turn ?? "human") === "ai"} 
              gameStatus={state.status}
            />
          </div>
        )}
      </div>

      {state?.ai_enabled && state?.turn === "ai" && state?.status === "Playing" && (
        <div className="flex items-center gap-3 text-sm text-gray-600">
          <span>Bot turn</span>
          <button
            onClick={async () => {
              if (!gameId) return;
              try {
                setLoading(true);
                const s = await aiEnd(gameId);
                setState(s);
              } catch (e: any) {
                setErrorMsg(e.message ?? "AI end failed");
              } finally {
                setLoading(false);
              }
            }}
            className="px-2 py-1 rounded border border-gray-300 hover:bg-gray-50"
          >
            Debug: End Bot turn
          </button>
        </div>
      )}
    </div>
  );
}
