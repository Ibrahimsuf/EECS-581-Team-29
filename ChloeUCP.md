# Chloe Tran

**User Story:** As a player using AI mode, I want the game to clearly show when it is the bot's turn so I don't click during AI processing and can follow what the bot is doing.

**Scope Implemented:** Turn-state handling (human ↔ AI), backend turn flag integration, AI auto-move trigger hook, visual dimming during AI turn, bot avatar component with status + animation, sound alignment, fix for premature AI turn switching on no-op clicks / invalid flags.

| Item | Estimated | Actual |
|------|-----------|--------|
| Turn state toggle + API param plumbing | 2h | 4h |
| AI auto-move effect & debounce | 1h | 2h |
| Prevent invalid turn flips (revealed / flag edge cases) | 0.5h | 2h |
| Bot avatar (UI + animation + props) | 0.5h | 2h |
| Refactors & status string harmonization | 0.5h | 1.5h |
| Integration fixes w/ others' merges & regressions | — | 3.5h |
| **Total** | **~4–5h** | **15h** |


