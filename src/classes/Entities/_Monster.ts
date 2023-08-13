namespace TS {
    export class Monster extends Entity {
        type: EntityType;

        constructor(id: number) {
            super(id)
            this.type = EntityType.monster;
        }

        isInBase(base: Base): boolean {
            console.error(
                this.id,
                Base.baseRadius,
                Math.abs(this.coord.x - base.coord.x),
                Math.abs(this.coord.y - base.coord.y),
                (Math.abs(this.coord.x - base.coord.x) < Base.baseRadius),
                (Math.abs(this.coord.y - base.coord.y) < Base.baseRadius)
            );
            // TODO apply PI radius here
            return Math.abs(base.coord.x - this.coord.x) <= Base.baseRadius &&
                Math.abs(base.coord.y - this.coord.y) <= Base.baseRadius
        }
    }
}
