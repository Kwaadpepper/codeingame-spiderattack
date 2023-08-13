namespace TS {
    export abstract class Spell {
        private type: SpellType;

        constructor(type: SpellType) {
            this.type = type
        }

        /** Cast a spell on entity or location */
        abstract cast(entity: Monster | null, location: Coord | null): void;

        /** Can the spell be casted */
        abstract canBeCasted(): boolean;
    }
}
