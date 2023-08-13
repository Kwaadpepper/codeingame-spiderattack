namespace TS {
    export class Ally extends Entity {
        type: EntityType;

        movingTo: Coord = { x: 0, y: 0 };
        monsterTarget: Monster | null = null;

        constructor(id: number) {
            super(id)
            this.type = EntityType.ally;
        }

        /** Le point d'attente si il n'y a rien a faire */
        waitingPoint(base: Base, strategy: StrategyType): Coord {
            const inRad = (angle: number) => angle * (Math.PI / 180)
            let distanceFromBase = Base.baseRadius;
            let angleToWait = Base.baseAngle;
            switch (strategy) {
                case StrategyType.STANDARD:
                    // * Répartir les hero en bulle dans la base
                    distanceFromBase = Base.baseRadius + (Base.baseRadius / 9)
                    angleToWait = (Base.baseAngle / 6) * (this.id * 2 + 1);
                    // Trigo
                    return {
                        x: base.coord.x + Math.round(Math.cos(inRad(angleToWait)) * distanceFromBase),
                        y: base.coord.y + Math.round(Math.sin(inRad(angleToWait)) * distanceFromBase)
                    }
                case StrategyType.DEFENSIVE:
                    // * Le premier hero au plus proche
                    // * Répartir les autres en bulle
                    if (this.id === 0) {
                        return {
                            x: base.coord.x + 600,
                            y: base.coord.y + 600
                        }
                    }
                    distanceFromBase = Base.baseRadius + (Base.baseRadius / 9)
                    angleToWait = (Base.baseAngle / 3) * this.id;
                    // Trigo
                    return {
                        x: base.coord.x + Math.round(Math.cos(inRad(angleToWait)) * distanceFromBase),
                        y: base.coord.y + Math.round(Math.sin(inRad(angleToWait)) * distanceFromBase)
                    }
                default: throw new Error(`Unhandled strategy type ${strategy}`)
            }
        }

        target(target: Monster | Coord) {
            if (target instanceof Monster) {
                this.movingTo = target.coord;
                this.monsterTarget = target;
                return;
            }
            this.monsterTarget = null;
            this.movingTo = target;
        }

        move(): void {
            console.log(`${Instruction.MOVE} ${this.movingTo.x} ${this.movingTo.y}`)
        }
    }
}
