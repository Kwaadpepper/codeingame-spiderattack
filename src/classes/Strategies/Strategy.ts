namespace TS {
    export abstract class Strategy {
        type: StrategyType

        protected player: Player
        protected heros: Map<Id, Ally>
        protected monsters: Array<Monster>

        constructor(type: StrategyType, player: Player, heros: Map<Id, Ally>, monsters: Array<Monster>) {
            this.type = type
            this.player = player
            this.heros = heros
            this.monsters = monsters
        }

        abstract assignTask(ally: Ally): void;

        static decideStrategyType(player: Player, heros: Map<Id, Ally>, monsters: Array<Monster>): StrategyType {
            const playerBase: Base = player.base
            const playerHealth = playerBase.health
            const monstersTargetingBase = this.monstersTargetingBase(playerBase, monsters)
            const monstersInBase = this.monstersInBase(playerBase, monsters)

            if (monstersInBase.length >= 3 || monstersTargetingBase.length >= 3) {
                return StrategyType.DEFENSIVE;
            }
            return StrategyType.STANDARD;
        }

        protected static monstersThreatingBase(base: Base, monsters: Array<Monster>): Array<Monster> {
            return monsters.filter(monster => {
                return monster.isInBase(base) || monster.threatFor === ThreatFor.allyBase
            }).sort((mA, mB) =>
                mA.distanceFrom(base.coord) -
                mB.distanceFrom(base.coord)
            )
        }

        protected static monstersInBase(base: Base, monsters: Array<Monster>): Array<Monster> {
            return monsters.filter(monster => {
                return monster.isInBase(base)
            }).sort((mA, mB) =>
                mA.distanceFrom(base.coord) -
                mB.distanceFrom(base.coord)
            )
        }

        protected static monstersTargetingBase(base: Base, monsters: Array<Monster>): Array<Monster> {
            return monsters.filter(monster => {
                return monster.threatFor === ThreatFor.allyBase
            }).sort((mA, mB) =>
                mA.distanceFrom(base.coord) -
                mB.distanceFrom(base.coord)
            )
        }
    }
}
