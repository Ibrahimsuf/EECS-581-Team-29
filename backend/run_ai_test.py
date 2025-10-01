"""Small test runner for backend/ai.py

Usage:
  python3 run_ai_test.py

This will:
 - create a 10x10 board
 - place mines with a safe first-click at (0,0) including neighbors
 - reveal (0,0) to create an initial safe area
 - run medium_ai_move repeatedly and print each action
"""
from pprint import pprint
import time

from ai import medium_ai_move, easy_ai_move, hard_ai_move
from board import create_board, print_board, reveal_cell, is_win, neighbors
from bombs import place_mines, compute_numbers


WIDTH, HEIGHT = 10, 10
MINES = 20


def get_safe_zone(r, c, width, height):
    safe = {(r, c)}
    for nn in neighbors(r, c, width, height):
        safe.add(nn)
    return safe


def main():
    board = create_board(WIDTH, HEIGHT)

    # Place mines avoiding the first-click safe zone around (0,0)
    safe = get_safe_zone(0, 0, WIDTH, HEIGHT)
    place_mines(board, MINES, WIDTH, HEIGHT, forbidden=safe)
    compute_numbers(board, WIDTH, HEIGHT)

    # Reveal the first safe cell to seed the AI's revealed area
    res = reveal_cell(board, 0, 0, WIDTH, HEIGHT)
    print(f"Initial reveal at (0,0): {res}\n")
    print_board(board, WIDTH, HEIGHT)

    # Run AI until it returns None or the game resolves
    for step in range(1, 101):
        act = hard_ai_move(board, WIDTH, HEIGHT)
        print(f"Step {step}: AI action -> {act}")
        print_board(board, WIDTH, HEIGHT)

        if act is None:
            print("AI found no actionable move; stopping.")
            break
        # If boom or win, stop
        if any(cell.get("type") == "b" and cell.get("revealed") for cell in board.values()):
            print("Boom: AI revealed a mine.\n")
            break
        if is_win(board):
            print("AI caused a victory (all safe cells revealed).\n")
            break

        # small pause to make output readable when running
        time.sleep(0.05)

    print("Final board:")
    print_board(board, WIDTH, HEIGHT, reveal_all=True)


if __name__ == "__main__":
    main()
