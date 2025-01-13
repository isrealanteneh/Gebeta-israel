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

export type { BeforeTakeHook, LandedOnEmptyPitHook, LandedOnNonEmptyPitHook }