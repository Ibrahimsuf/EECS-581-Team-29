# Chloe Tran

**User Story:** As a player using AI mode, I want the game to clearly show when it is the bot's turn so I don't click during AI processing and can follow what the bot is doing.

**Unadjusted Actor Weight (UAW):**
Single external actor (Player) interacting with turn system → Simple = 1
UAW = 1

**Unadjusted Use Case Weight (UUCW):**
Primary use case: Indicate AI turn state & block invalid interaction (simple transactional flow) → Simple = 5
UUCW = 5

**Technical Complexity Factor (TCF):**
End-user efficiency (turn clarity) = 3
Ease of use (visual feedback + dimming) = 3
Concurrency / state sync (human vs AI turn) = 4
Error handling & resilience (no-op clicks, double-trigger prevention) = 3
Formula: TCF = 0.6 + 0.01 * (3*0.5 + 3*1 + 4*1 + 3*0.5)
= 0.6 + 0.01 * (1.5 + 3 + 4 + 1.5) = 0.6 + 0.01 * 10 = 0.6 + 0.10 = 0.70

**Environmental Factors (EF):**
Low familiarity with Flask back-end patterns = 4
Limited TypeScript/React typing experience = 5
Requirement volatility (avatar + auto AI injection mid-task) = 3
Distributed coordination latency (merges / rework) = 4
Formula: EF = 1.4 - 0.03 * ( (4*1.5) + (5*0.5) + (3*2) - (4*1) )
= 1.4 - 0.03 * (6 + 2.5 + 6 - 4)
= 1.4 - 0.03 * 10.5 = 1.4 - 0.315 = 1.085

**Use Case Points (UCP):**
UCP = (UAW + UUCW) * TCF * EF = (1 + 5) * 0.70 * 1.085 = 6 * 0.7595 ≈ 4.56

**Effort Estimate:**
Adopt 20 hours per UCP (higher due to integration & unfamiliar stack)
Estimated Effort = 4.56 * 20 ≈ 91 hours

**Original Personal Estimate:** ~4–5 hours  
**Actual Time:** 15 hours  

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


