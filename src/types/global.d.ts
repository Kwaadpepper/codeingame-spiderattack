namespace TS {
    /** A unique ID */
    export type Id = number;

    export type Coord = {
        x: number;
        y: number;
    }

    export type Trajectory = {
        coord: Coord;
        target: Coord;
    }

    export enum Instruction {
        WAIT = "WAIT",
        SPELL = "SPELL",
        MOVE = "MOVE"
    }

    export enum StrategyType {
        STANDARD,
        DEFENSIVE
    }

    export enum SpellType {
        WIND = "WIND",
        SHIELD = "SHIELD",
        CONTROL = "CONTROL"
    }

    export enum ThreatFor {
        none = 0,
        allyBase = 1,
        ennemyBase = 2
    }

    export enum Target {
        /** No target */
        none = 0,
        /** targeting a base (any) */
        base = 1
    }

    export enum EntityType {
        monster = 0,
        ally = 1,
        opponent = 2
    }
}
