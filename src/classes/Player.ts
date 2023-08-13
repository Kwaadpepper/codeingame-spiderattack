namespace TS {
    export class Player {
        base: Base;
        heros: Map<Id, Ally | Opponent> = new Map<Id, Ally | Opponent>();

        constructor(base: Base) {
            this.base = base;
        }

        addHero(hero: Ally | Opponent) {
            this.heros.set(hero.id, hero);
        }
    }
}
