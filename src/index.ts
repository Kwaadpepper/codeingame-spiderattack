namespace TS {

    // CLASSES

    /** The game Frame */
    const Frame = {
        width: 17630,
        height: 9000
    };

    const inputs: number[] = (getInput().split(' ') as string[]).map(Number);
    const heroesPerPlayer: number = parseInt(getInput());
    var player: Player = new Player(new Base(0, inputs[0], inputs[1]));
    var opponent: Player = new Player(new Base(1, Frame.width, Frame.height));
    var monsters: Map<Id, Monster> = new Map<Id, Monster>();

    // ----- GAME LOOP -----

    while (true) {
        refreshBases();
        refreshEntities();

        const MonstersInBase = [...monsters.values()]
            .filter(monster => {
                return monster.threatFor === ThreatFor.allyBase ||
                    monster.isInBase(player.base)
            }).sort((mA, mB) =>
                mA.distanceFrom(player.base.coord) -
                mB.distanceFrom(player.base.coord)
            )

        player.heros.forEach(hero => {
            // Write an action using console.log()
            // To debug: console.error('Debug messages...');

            // Attaquer le Premier monstre qui entre dans la base

            if (MonstersInBase.length) {
                const monster = (MonstersInBase.at(hero.id) ?? MonstersInBase.at(0)) as Monster
                (hero as Ally).target(monster)
            } else {
                const waitingPoint = (hero as Ally).waitingPoint(player.base);
                (hero as Ally).target(waitingPoint)
            }

            // In the first league: MOVE <x> <y> | WAIT;
            // In later leagues: | SPELL <spellParams>;
        });

        player.heros.forEach(hero => (hero as Ally).move())
    }

    // ----- END GAME LOOP -----

    function refreshBases() {
        let inputs: string[] = getInput().split(' ');
        player.base.setStatus(
            // Player's base health
            parseInt(inputs[0]),
            // Ignore in the first league; Spend ten mana to cast a spell
            parseInt(inputs[1])
        )
        inputs = getInput().split(' ');
        opponent.base.setStatus(
            // Opponents's base health
            parseInt(inputs[0]),
            // Ignore in the first league; Spend ten mana to cast a spell
            parseInt(inputs[1])
        )
    }

    function refreshEntities() {
        // reset Monsters
        monsters = new Map<Id, Monster>();
        // Amount of heros and monsters you can see
        const entityCount: number = parseInt(getInput());
        for (let i = 0; i < entityCount; i++) {
            var inputs: string[] = getInput().split(' ');
            const id: Id = parseInt(inputs[0]) as Id;
            const type: EntityType = parseInt(inputs[1]) as EntityType;
            const entity = getFirstOrNew(type, id);

            entity.setStatus(
                // Ignore for this league; Equals 1 when this entity is under a control spell
                parseInt(inputs[5]) === 1,
                // Ignore for this league; Count down until shield spell fades
                parseInt(inputs[4]),
                // Remaining health of this monster
                parseInt(inputs[6])
            )
            // Coordinates
            entity.setCoord(parseInt(inputs[2]), parseInt(inputs[3]))
            // Trajectory of this monster
            entity.setTrajectory(
                parseInt(inputs[7]),
                parseInt(inputs[8])
            )
            // 0=monster with no target yet, 1=monster targeting a base
            entity.setTarget(parseInt(inputs[9]))
            // Given this monster's trajectory, is it a threat to 1=your base, 2=your opponent's base, 0=neither
            entity.setThreatFor(parseInt(inputs[10]))

            switch (type) {
                case EntityType.ally:
                    if (!player.heros.has(entity.id)) {
                        player.heros.set(entity.id, entity as Ally);
                    }
                    break;
                case EntityType.opponent:
                    if (!opponent.heros.has(entity.id)) {
                        opponent.heros.set(entity.id, entity as Opponent);
                    }
                    break;
                case EntityType.monster:
                    if (!monsters.has(entity.id)) {
                        monsters.set(entity.id, entity as Monster);
                    }
                    break;
            }
        }
    }

    function getFirstOrNew(type: EntityType, id: number): Entity {
        const allyHero = player.heros.get(id),
            opponentHero = opponent.heros.get(id),
            monster = monsters.get(id);
        switch (type) {
            case EntityType.ally: return allyHero ? allyHero : new Ally(id)
            case EntityType.opponent: return opponentHero ? opponentHero : new Opponent(id)
            case EntityType.monster: return monster ? monster : new Monster(id)
            default: throw new Error(`Unhandled type ${type}`)
        }
    }

    function getInput(): string {
        // @ts-ignore
        return readline();
    }
}
