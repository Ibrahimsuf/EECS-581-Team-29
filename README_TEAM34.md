# Minesweepers of the Midwest – EECS 581 Team 34

A web-based take on the classic Minesweeper game with AI functionality, built for EECS 581.  
**Frontend:** Next.js (TypeScript, Tailwind, Material-UI)  
**Backend:** Flask (Python)  
**Added Features:** AI opponents, accessible UI, customizable difficulty, responsive design, REST API.
---

## Features

- **Classic 10×10 Minesweeper grid** with customizable mine count (10–20 mines).
- **AI Opponents:** Choose from Easy, Medium, and Hard AI difficulty levels that play alongside you.
- **Turn-based gameplay:** Alternate moves with AI opponents in real-time.
- **First-click safety:** Your first cell (and its neighbors) are always safe.
- **Flag and reveal:** Right-click or long-press to toggle flags, left-click to uncover cells.
- **Flood reveal:** Uncovering an empty cell automatically reveals adjacent safe cells.
- **Sound effects:** Audio feedback for game events (explosion, victory, flag placement).
- **Responsive UI:** Modern Material-UI components, works great on desktop and mobile.
- **Accessibility:** Keyboard navigation, color-independent status, screen reader labels.
- **REST API:** All gameplay logic and AI handled by backend Flask API.

---

## System Overview

### Architecture

- **Frontend**:
  - Next.js app with React components (`Minesweeper`, `MinesweeperBoard`, `Cell`, `AI_Selector`, `BotAvatar`)
  - Material-UI components for modern UI elements
  - Handles user input, renders grid, manages AI turn visualization
  - Sound management system for game audio feedback
  - Styling via Tailwind CSS and Material-UI.

- **Backend**:
  - Python Flask app (`api.py`) exposes REST endpoints for game actions and AI moves.
  - AI logic in `ai.py` with three difficulty levels (Easy, Medium, Hard).
  - Game logic in Python modules (`board.py`, `bombs.py`).
  - Session store tracks game state and turn management per user.


## How to Run (Local Development)

### Prerequisites
- Node.js & npm (for frontend)
- Python 3.9+ (for backend)
- pip (for Python dependencies)

### 1. Backend Setup (Flask)
```bash
cd backend
pip install -r requirements.txt
python api.py
```
- This launches the REST API at `http://localhost:8000`
- Key Endpoints:
  - `POST /games` — Create a new game with AI settings
  - `GET /games/{gameId}` — Get current game state
  - `POST /games/{gameId}/reveal` — Reveal a cell
  - `POST /games/{gameId}/flag` — Toggle flag on a cell
  - `POST /games/{gameId}/aiEnd` — Process AI turn

### 2. Frontend Setup (Next.js)
```bash
cd frontend
npm install
npm run dev
```
- Launches web app at `http://localhost:3000`
- Connects to backend API (`http://localhost:8000` by default).

---

## How to Play

1. **Choose the number of mines (10–20) from the difficulty buttons.**
2. **Select AI mode:** Choose from No AI, Easy AI, Medium AI, or Hard AI.
3. **Click a cell to uncover it.**
   - First click is always safe (no mine in cell or neighbors).
   - Empty cells trigger flood reveal of safe neighbors.
4. **Right-click (or long-press on mobile) to place or remove a flag.**
5. **AI turns:** When playing with AI, the bot will automatically make moves after your turn.
   - Watch the bot avatar to see when it's the AI's turn.
   - The board becomes slightly dimmed during AI turns.
6. **Win by uncovering all non-mine cells. Lose by clicking a mine.**
7. **Use the "New Game" button to reset with current settings.**

### AI Difficulty Levels
- **Easy AI:** Makes random moves, avoiding flagged and revealed cells.
- **Medium AI:** Uses basic strategy - finds safe cells around revealed numbers.
- **Hard AI:** "Cheats" by always knowing where mines are and only clicks safe cells.

---

## Frontend Components & Functions

- **`Minesweeper`** (`frontend/src/components/Minesweeper.tsx`)
  - Top-level game component with AI integration.
  - Handles game state, turn management, user input, and AI automation.
  - Calls backend API via helper functions (`createGame`, `getState`, `reveal`, `flag`, `aiEnd`).
  - Features automatic AI move triggering with visual feedback.
  - Functions:
    - `newGame(mines)`: Starts a new game with AI settings.
    - `onReveal(r, c)`: Reveals cell at row `r`, col `c`.
    - `onFlag(r, c)`: Toggles flag on cell.
    - `handleCellMouseDown(e, r, c)`: Handles left/right click events.
    - `numberTextColor(val)`: Maps numbers to color classes (for cell display).
    - Auto-triggers AI moves with sound effects and visual feedback.

- **`AI_Selector`** (`frontend/src/components/AI_Selector.tsx`)
  - UI component for selecting AI difficulty level.
  - Material-UI buttons with visual selection state.

- **`BotAvatar`** (`frontend/src/components/BotAvatar.tsx`)
  - Visual indicator showing when it's the AI's turn.
  - Animated avatar with status display.

- **`MinesweeperBoard`** (`frontend/src/components/MinesweeperBoard.tsx`)
  - Renders the game grid with turn-based visual states.
  - Dims during AI turns for better UX.

- **`Cell`** (`frontend/src/components/Cell.tsx`)
  - Individual cell component with accessibility features.
  - Handles revealed/flagged states and click events.

- **`GridSizeForm`** (`frontend/src/components/GridSizeForm.tsx`)
  - UI for selecting mine count and difficulty.

---

## Backend Modules & Functions

- **`api.py`**
  - Main Flask application with REST API endpoints.
  - Handles game creation, state management, and turn-based logic.
  - Integrates AI moves with human player actions.
  - Functions:
    - `create_game()`: Creates new game with AI settings.
    - `reveal()`: Handles cell reveals with turn management.
    - `flag()`: Handles flag operations with turn switching.
    - `aiEnd()`: Processes AI moves and updates game state.

- **`ai.py`**
  - AI logic with three difficulty levels.
  - Functions:
    - `ai_move(board, width, height, mode)`: Main AI decision function.
    - `easy_ai_move()`: Random cell selection avoiding revealed/flagged cells.
    - `medium_ai_move()`: Strategic moves using revealed numbers and patterns.
    - `hard_ai_move()`: Perfect play by avoiding all mines.

- **`bombs.py`**
  - Handles mine logic.
  - Functions:
    - `place_mines(board, mines, width, height, forbidden)`: Places mines avoiding forbidden zone.
    - `compute_numbers(board, width, height)`: Calculates adjacent mine counts.
    - `neighbors(r, c, width, height)`: Yields neighbor coordinates.

- **`board.py`** (assumed from imports)
  - Core board management.
  - Functions:
    - `create_board(width, height)`: Creates empty board.
    - `reveal_cell(board, r, c)`: Reveals cell, triggers flood if empty.
    - `toggle_flag(board, r, c)`: Flags/unflags cell.
    - `is_win(board)`: Checks win condition.
    - `placed_flag_count(board)`: Counts flags.

---

## API Endpoints (Backend)

| Endpoint         | Method | Purpose                    | Payload                   |
|------------------|--------|----------------------------|---------------------------|
| `/new`           | POST   | Start a new game           | `{mines: int, safe: bool}`|
| `/uncover`       | POST   | Reveal a cell              | `{gameId, row, col}`      |
| `/flag`          | POST   | Flag/unflag a cell         | `{gameId, row, col}`      |
| `/state`         | GET    | Get current game state     | `{gameId}`                |

---


---

## Credits
Team 34
Course: EECS 581, Fall 2025
