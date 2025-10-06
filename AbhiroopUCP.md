**Abhiroop Goel**

User Story:
As a player, I want the game to include sound effects for specific actions (click, flag, bomb, win, lose) so that gameplay feels more responsive and immersive.

**Unadjusted Actor Weight (UAW)**

Single external actor (Player) interacting through UI with audio feedback → Simple = 1->
UAW = 1

**Unadjusted Use Case Weight (UUCW)**

Primary use case: Trigger appropriate sounds based on gameplay events (reveal, flag, explosion, win/loss) and manage playback consistency across state updates → Average = 10 ->
UUCW = 10

**Technical Complexity Factor (TCF)**

| Factor                      | Weight | Reasoning                                                    |
| --------------------------- | ------ | ------------------------------------------------------------ |
| End-user efficiency         | 3      | Immediate audio feedback improves experience                 |
| Ease of use                 | 2      | Simple sound cue mapping                                     |
| Concurrency / state sync    | 3      | Syncing sound events with async React state + backend events |
| Error handling & resilience | 3      | Prevent overlapping or repeated sounds, handle null refs     |

Formula:
TCF = 0.6 + 0.01 × (3 + 2 + 3 + 3) = 0.6 + 0.11 = 0.71

**Environmental Factors (EF)**

| Factor                                                          | Weight |
| --------------------------------------------------------------- | ------ |  
| Limited experience with React sound libraries                   | 4      |           
| Need for backend-frontend consistency                           | 3      |           
| Requirement volatility (multiple sound types added iteratively) | 3      |           
| Integration issues (merge conflicts, async effects)             | 4      |           

Formula:
EF = 1.4 – 0.03 × (4 + 3 + 3 + 4) = 1.4 – 0.03 × 14 = 1.4 – 0.42 = 0.98

**Use Case Points (UCP)**

UCP = (UAW + UUCW) × TCF × EF
= (1 + 10) × 0.71 × 0.98
= 11 × 0.6958
≈ 7.65

**Effort Estimate**

Adopted 10 hours per UCP (moderate complexity, JS + audio + testing)
Estimated Effort = 7.65 × 10 ≈ 76.5 hours

Original Personal Estimate: ~6–8 hours
Actual Time: 18 hours

**Scope Implemented**

Added SoundManager module for managing audio events.

Integrated click, flag, explosion, and win/lose sounds into frontend event handlers (onReveal, onFlag, onGameOver).

Added preloading and debounce to prevent duplicate sound triggers.

Handled missing sound file errors and browser mute edge cases.

Synced win/lose sounds with backend state updates.

Tested and refined timing/alignment with animations.

| **Item**                                        | **Estimated** | **Actual** |
| ----------------------------------------------- | ------------- | ---------- |
| SoundManager module creation                    | 1h            | 3h         |
| Event hook integration (reveal, flag, gameover) | 2h            | 4h         |
| Audio preloading / debounce                     | 0.5h          | 2h         |
| Volume controls & fail-safe                     | 0.5h          | 1.5h       |
| Testing & UX alignment                          | 1h            | 3h         |
| Merge fix & regression testing                  | —             | 4.5h       |
| **Total**                                       | ~6–8h         | **18h**    |





