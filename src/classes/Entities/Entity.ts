namespace TS {
    export abstract class Entity {
        id: number;
        coord: Coord = { x: 0, y: 0 };
        trajectory: Trajectory | null = null;

        targeting: Target = Target.none;
        threatFor: ThreatFor = ThreatFor.none;

        /** Is the entity under a spell */
        controlled: boolean = false;

        health: number = 0;
        shieldLife: number = 0;

        constructor(id: number) {
            this.id = id
        }

        distanceFrom(coord: Coord): number {
            return Math.abs(Math.sqrt(Math.pow(this.coord.x - coord.x, 2) + Math.pow(this.coord.y - coord.y, 2)))
        }

        isControlled(): boolean {
            return this.controlled;
        }

        isShielded(): boolean {
            return this.shieldLife > 0;
        }

        isAlive(): boolean {
            return this.health > 0;
        }

        setCoord(x: number, y: number) {
            this.coord = {
                x: x,
                y: y
            }
        }

        setStatus(controlled: boolean, shield: number, health: number) {
            this.controlled = controlled
            this.shieldLife = shield
            this.health = health
        }

        setTrajectory(vx: number, vy: number) {
            this.trajectory = {
                coord: {
                    x: this.coord.x,
                    y: this.coord.y
                },
                target: {
                    x: vx,
                    y: vy
                }
            }
        }

        setTarget(target: Target) {
            this.targeting = target;
        }

        setThreatFor(threatFor: ThreatFor) {
            this.threatFor = threatFor;
        }
    }
}
