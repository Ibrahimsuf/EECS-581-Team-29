// src/lib/api.ts
import { API_BASE } from "./config";

export type BoardCell = "." | "F" | " " | "B" | `${number}`; // "1".."8"
export type GameState = {
  game_id: string;
  status: "Playing" | "Game Over: Loss" | "Victory";
  width: number;
  height: number;
  mines: number;
  remaining_mines: number;
  board: BoardCell[][];
  //turn-based
  ai_enabled?: boolean;
  turn?: "human" | "ai";
};

export async function createGame(mines = 15, safeNeighbors = true, ai_enabled: boolean) {
  const res = await fetch(`${API_BASE}/games`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ mines, safe_neighbors: safeNeighbors, ai_enabled}),
  });
  if (!res.ok) throw new Error(`Create game failed: ${res.status}`);
  return (await res.json()) as { game_id: string; status: GameState["status"] };
}

export async function getState(gameId: string) {
  const res = await fetch(`${API_BASE}/games/${gameId}`, { cache: "no-store" });
  if (!res.ok) throw new Error(`Get state failed: ${res.status}`);
  var res_json = await res.json()
  console.log("Res json = ", res_json)
  return (res_json) as GameState;
}

export async function reveal(gameId: string, row: number, col: number,  ai_mode: string) {
  const res = await fetch(`${API_BASE}/games/${gameId}/reveal`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ row, col, ai_mode }),
  });
  if (!res.ok) throw new Error(`Reveal failed: ${res.status}`);
  return (await res.json()) as GameState;
}

export async function flag(gameId: string, row: number, col: number, ai_mode: string) {
  const res = await fetch(`${API_BASE}/games/${gameId}/flag`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ row, col, ai_mode }),
  });
  if (!res.ok) throw new Error(`Flag failed: ${res.status}`);
  return (await res.json()) as GameState;
}
//Helpers ending AI turn
export async function aiEnd(gameId: string) {
  const res = await fetch(`${API_BASE}/games/${gameId}/aiEnd`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
  });
  if (!res.ok) throw new Error(`AI end failed: ${res.status}`);
  return (await res.json()) as GameState;
}
