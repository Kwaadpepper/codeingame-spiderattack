namespace TS {
    export class Base {
        static baseRadius: 5000;
        static baseAngle: 90;

        id: Id;
        coord: Coord;

        health: number = 0;
        mana: number = 0;

        constructor(id: Id, x: number, y: number) {
            this.id = id;
            this.coord = {
                x: x,
                y: y
            }
        }

        setStatus(health: number, mana: number) {
            this.health = health;
            this.mana = mana;
        }
    }
}
