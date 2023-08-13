namespace TS {
    export class Opponent extends Entity {
        type: EntityType;

        constructor(id: number) {
            super(id)
            this.type = EntityType.opponent;
        }
    }
}
