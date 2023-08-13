namespace TS {
    export class Defensive extends Strategy {
        constructor(player: Player, heros: Map<Id, Ally>, monsters: Array<Monster>) {
            super(StrategyType.STANDARD, player, heros, monsters)
        }

        assignTask(ally: Ally): void {
            const MonstersInBase = Standard.monstersInBase(this.player.base, this.monsters)
            const MonstersThreatingBase = Standard.monstersThreatingBase(this.player.base, this.monsters)

            // * one will stay in base
            if (ally.id === 0) {
                if (MonstersInBase.length) {
                    // * Cible le monstre de la liste correspondant au hero id ou le plus proche de la base
                    const monster = (MonstersInBase.at(ally.id) ?? MonstersInBase.at(0))
                    if (!monster) {
                        throw new Error("Has not found any monster");
                    }
                    ally.target(monster)
                }

                // Aller au point d'attente
                const waitingPoint = ally.waitingPoint(this.player.base, this.type);
                ally.target(waitingPoint)
                return;
            }

            // * Others will handle all ennemies
            if (MonstersThreatingBase.length) {
                // * Cible le monstre de la liste correspondant au hero id ou le plus proche de la base
                const monster = (MonstersThreatingBase.at(ally.id) ?? MonstersThreatingBase.at(0))
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
