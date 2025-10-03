"""
Flask API for Minesweeper game.

Flask REST API for Minesweeper with AI opponents
EECS 581 Team 34 - Minesweepers of the Midwest

Endpoints: /games (POST), /games/{id} (GET/DELETE), /games/{id}/reveal (POST), 
           /games/{id}/flag (POST), /games/{id}/aiEnd (POST)
ADDED Features: Turn-based gameplay, AI difficulties (Easy/Medium/Hard), CORS enabled
Port: 8000
Authors: Chloe Tran, Ibrahim.
"""

import uuid
from flask import Flask, request, jsonify, make_response
from ai import ai_move
from board import (
    create_board, reveal_cell, toggle_flag, is_win, placed_flag_count, neighbors
)
from bombs import place_mines, compute_numbers
app = Flask(__name__)

# In-memory game store: game_id -> game dict
GAMES = {}

# ---- Config ----
DEFAULT_WIDTH = 10
DEFAULT_HEIGHT = 10

# ---- Helpers ----
def corsify(resp):
    resp.headers["Access-Control-Allow-Origin"] = "*"           # for dev; restrict in prod
    resp.headers["Access-Control-Allow-Methods"] = "GET,POST,DELETE,OPTIONS"
    resp.headers["Access-Control-Allow-Headers"] = "Content-Type, Authorization"
    return resp

@app.after_request
def add_cors_headers(resp):
    return corsify(resp)

@app.route("/health", methods=["GET"])
def health():
    return corsify(jsonify({"ok": True}))

def public_view(game):
    """Return a client-safe, serializable board view."""
    board = game["board"]
    reveal_all = (game["status"] != "Playing")
    view_rows = []
    for r in range(game["height"]):
        row = []
        for c in range(game["width"]):
            cell = board[(r, c)]
            if reveal_all or cell["revealed"]:
                if cell["type"] == "b":
                    shown = "B"
                elif cell["type"] == "n":
                    shown = str(cell.get("number", 0))
                else:
                    shown = " "  # empty
            else:
                shown = "F" if cell["flagged"] else "."
            row.append(shown)
        view_rows.append(row)
    return view_rows

def ensure_mines(game, r, c):
    """Place mines lazily on the first reveal, making the first click (and optionally neighbors) safe."""
    if game["mines_placed"]:
        return
    safe = {(r, c)}
    if game["safe_neighbors"]:
        for nn in neighbors(r, c, game["width"], game["height"]):
            safe.add(nn)
    place_mines(game["board"], game["mines"], game["width"], game["height"], forbidden=safe)
    compute_numbers(game["board"], game["width"], game["height"])
    game["mines_placed"] = True

def game_payload(game_id):
    g = GAMES[game_id]
    remaining = g["mines"] - placed_flag_count(g["board"])
    return {
        "game_id": game_id,
        "status": g["status"],                       # "Playing" | "Game Lost" | "Victory"
        "width": g["width"],
        "height": g["height"],
        "mines": g["mines"],
        "remaining_mines": remaining,
        "board": public_view(g),  
        "ai_mode": g["ai_mode"],                 # 2D array of ".", "F", " ", "1".."8", "B" (B only when game over)
        # Turn-based add
        "ai_enabled": g["ai_enabled"],
        "turn": g.get("turn", "human"),         
    }

# ---- Routes ----

@app.route("/games", methods=["POST", "OPTIONS"])
def create_game():
    if request.method == "OPTIONS":
        return corsify(make_response("", 204))

    data = request.get_json(silent=True) or {}
    width  = int(data.get("width",  DEFAULT_WIDTH))
    height = int(data.get("height", DEFAULT_HEIGHT))
    mines  = int(data.get("mines", 10))            # must be 10..20 per your rules
    ai_enabled = data.get("ai_enabled")
    safe_neighbors = bool(data.get("safe_neighbors", True))  # first click safe zone includes neighbors
    ai_mode = data.get("ai_mode", "NO AI")
    # Enforce your rules
    if width != 10 or height != 10:
        return corsify(jsonify({"error": "Board must be 10x10"})), 400
    if not (10 <= mines <= 20):
        return corsify(jsonify({"error": "Mines must be between 10 and 20"})), 400

    board = create_board(width, height)
    gid = str(uuid.uuid4())
    GAMES[gid] = {
        "board": board,
        "width": width,
        "height": height,
        "mines": mines,
        "mines_placed": False,       # will place after first reveal
        "status": "Playing",
        "safe_neighbors": safe_neighbors,
        "ai_mode": ai_mode,
        # Turn-based val
        "ai_enabled": ai_enabled,          #AI mode on default
        "turn": "human",           # human starts
    }
    return corsify(jsonify({"game_id": gid, "status": "Playing"})), 201
   


@app.route("/games/<gid>", methods=["GET", "DELETE", "OPTIONS"])
def game_state(gid):
    if request.method == "OPTIONS":
        return corsify(make_response("", 204))

    g = GAMES.get(gid)
    if not g:
        return corsify(jsonify({"error": "game not found"})), 404

    if request.method == "DELETE":
        del GAMES[gid]
        return corsify(jsonify({"ok": True}))

    # GET
    return corsify(jsonify(game_payload(gid)))

@app.route("/games/<gid>/reveal", methods=["POST", "OPTIONS"])
def reveal(gid):
    if request.method == "OPTIONS":
        return corsify(make_response("", 204))

    g = GAMES.get(gid)
    if not g:
        return corsify(jsonify({"error": "game not found"})), 404
    if g["status"] != "Playing":
        return corsify(jsonify(game_payload(gid)))

    # human's turn if AI mode is enabled for debug
    if g.get("ai_enabled", False) and g.get("turn", "human") != "human":
        return corsify(jsonify(game_payload(gid)))

    data = request.get_json(silent=True) or {}
    try:
        r = int(data["row"])
        c = int(data["col"])
        ai_mode = data["ai_mode"]
        print(f"The AI Mode is {ai_mode}")
    except Exception:
        return corsify(jsonify({"error": "row and col (0-based) are required"})), 400
    # First click safe (and neighbors if configured)
    ensure_mines(g, r, c)

    res = reveal_cell(g["board"], r, c, g["width"], g["height"])
    if res == "boom":
        g["status"] = "Game Lost"
        
    elif is_win(g["board"]):
        g["status"] = "Victory"
    print()
    # Only switch to AI turn on valid revealed cells
    if g["ai_enabled"] and res != "already":
        g["turn"] = "ai"
    return corsify(jsonify(game_payload(gid)))

@app.route("/games/<gid>/flag", methods=["POST", "OPTIONS"])
def flag(gid):
    if request.method == "OPTIONS":
        return corsify(make_response("", 204))

    g = GAMES.get(gid)
    if not g:
        return corsify(jsonify({"error": "game not found"})), 404
    if g["status"] != "Playing":
        return corsify(jsonify(game_payload(gid)))


    data = request.get_json(silent=True) or {}
    try:
        r = int(data["row"])
        c = int(data["col"])
        ai_mode = data["ai_mode"]
        print(f"The AI Mode is {ai_mode}")
    except Exception:
        return corsify(jsonify({"error": "row and col (0-based) are required"})), 400

    ok = toggle_flag(g["board"], r, c, g["width"], g["height"])
    if not ok:
        return corsify(jsonify({"error": "cannot flag/unflag a revealed cell"})), 400
    return corsify(jsonify(game_payload(gid)))
# For testing
@app.route("/games/<gid>/aiEnd", methods=["POST", "OPTIONS"])
def aiEnd(gid):
    data = request.get_json(silent=True) or {}
    if request.method == "OPTIONS":
        return corsify(make_response("", 204))

    g = GAMES.get(gid)
    if not g:
        return corsify(jsonify({"error": "game not found"})), 404

    ai_mode = g.get("ai_mode", "No AI")
    # make ai move
    if ai_mode == "No AI":
        return corsify(jsonify(game_payload(gid)))
    else:
        ai_move_squares =  ai_move(g["board"],  g["width"], g["height"], ai_mode)
        r_ai, c_ai, _ = ai_move_squares
        res = reveal_cell(g["board"], r_ai, c_ai, g["width"], g["height"])
        if res == "boom":
            g["status"] = "Game Lost"   
        elif is_win(g["board"]):
            g["status"] = "Victory"
    g["turn"] = "human"
    return corsify(jsonify(game_payload(gid)))



if __name__ == "__main__":
    # Run on port 8000 to avoid clashing with Next.js 3000
    app.run(host="127.0.0.1", port=8000, debug=True)
