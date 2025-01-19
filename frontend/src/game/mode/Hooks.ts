import Pit from "../Pit";

interface BeforeTakeHook {
    (takePit: Pit): boolean
}

interface LandedOnEmptyPitHook {
    (emptyPit: Pit): void
}

interface LandedOnNonEmptyPitHook {
    (nonEmptyPit: Pit): boolean
}

interface TakeFunction {
    (pitStones: number): number
}

interface PitRepopulatedHook {
    (repopulatedPit: Pit): void
}

export type { BeforeTakeHook, LandedOnEmptyPitHook, LandedOnNonEmptyPitHook, TakeFunction, PitRepopulatedHook }