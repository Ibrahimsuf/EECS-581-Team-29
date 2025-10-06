## Dylan Kneidel

*User Story*:
As a player, I want the game to include sound effects for player actions to introduce a more interactive experience.

#### Unadjusted Use Case Weight (UUCW)

Primary use case: Trigger sounds during gameplay events such as clicking on tiles, new game, losing, or winning --> Average --> 10

UUCW = 10

##### Unadjusted Actor Weight (UAW)

Single external actor (Player) interacting through UI with audio feedback --> Simple --> 1

UAW = 1

#### Technical Complexity Factor (TCF)**

| Factor                      | Weight | Reasoning                                                    |
| --------------------------- | ------ | ------------------------------------------------------------ |
| End-user efficiency         | 3      | Timely feedback improves user immersion and experience       |
| Reusability                 | 2      | Simple mappings for future sound additions                   |
| Concurrency                 | 3      | React state architecture alongside syncing with Flask backend API |
| Error handling & resilience | 2      | Prevent unfound sounds or misused endpoint structure         |

Estimated TCF = .6 + .01(3 + 2 + 3 + 2) = .6 + .1 = .71

#### Environmental Factors (EF)

| Factor                                                          | Weight |
| --------------------------------------------------------------- | ------ | 
| Low familiarity with sound design and implementation            | 2      |
| Low experience with React + Flask frontend/backend architecture | 4      |
| Difficulty of event-based language (TS) experience              | 2      |
| Requirement volatility (multiple sounds added in bursts)        | 2      |
| Integration issues (merge conflicts, async effects)             | 1      |

Estmated EF = 1.4 - .03(2 + 4 + 2 + 2  + 1) = 1.4 - .03 * 11 = 1.07

### Estimated Use Case Points (UCP)
UCP = (UUCW + UAW) * TCF * EF = (10 + 1) * .71 * 1.07 = 11 * .7597 = 8.3567

Adopting 10 hours per UCP for the architectural complexity and synchronous nature of audio events.
*Estimated Effort* = 8.3567 * 10 = 83.6 hours

*Original Personal Estimate*: 4-5 hours
*Actual Time*: 9 hours

### Scope Implemented

- Revised new SoundManager module for managing audio events in the browser.
- Designed Flask backend to NextJS frontend sound integration.
- Handled edge cases of audio playback outside the browser.
- Implemented win/lose sound events on frontend state update.
- Tested sound effect functionality and completion

| *Item* | *Estimated* | *Actual* |
|--------|-------------|----------|
| SoundManager revisions | .5h | 1.5h |
| React + NextJS sound event design/integration | 2h | 4h |
| Browser edge case handling | .5h | 1h |
| Victory/loss integration | .5h | 1.5h |
| Testing & regression checks | .5h | 1h |
| **Total** | ~4h | **9h** |

