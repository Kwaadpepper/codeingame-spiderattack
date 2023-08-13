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
        waitingPoint(base: Base): Coord {
            const distanceFromBase = 5000 + (5000 / 9)
            const angleToWait = (90 / 6) * (this.id * 2 + 1);
            const angleToWaitInRad = angleToWait * (Math.PI / 180)
            // Trigo
            return {
                x: Math.round(Math.cos(angleToWaitInRad) * distanceFromBase),
                y: Math.round(Math.sin(angleToWaitInRad) * distanceFromBase)
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
