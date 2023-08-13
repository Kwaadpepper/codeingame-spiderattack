namespace TS {
    export class Standard extends Strategy {

        constructor(player: Player, heros: Map<Id, Ally>, monsters: Array<Monster>) {
            super(StrategyType.STANDARD, player, heros, monsters)
        }

        assignTask(ally: Ally): void {
            const MonstersInBase = Standard.monstersInBase(this.player.base, this.monsters)
            const MonstersTargetingBase = Standard.monstersTargetingBase(this.player.base, this.monsters)

            if (MonstersInBase.length) {
                // * Cible le monstre de la liste correspondant au hero id ou le plus proche de la base
                const monster = (MonstersInBase.at(ally.id) ?? MonstersInBase.at(0))
                if (!monster) {
                    throw new Error("Has not found any monster");
                }
                ally.target(monster)
                return;
            }

            if (MonstersTargetingBase.length) {
                // * Cible le monstre de la liste correspondant au hero id ou le plus proche de la base
                const monster = (MonstersTargetingBase.at(ally.id) ?? MonstersTargetingBase.at(0))
                if (!monster) {
                    throw new Error("Has not found any monster");
                }
                ally.target(monster)
                return;
            }

            // Aller au point d'attente
            const waitingPoint = ally.waitingPoint(this.player.base, this.type);
            ally.target(waitingPoint)
        }
    }
}
