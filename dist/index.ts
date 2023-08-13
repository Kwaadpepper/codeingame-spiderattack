
/** A unique ID */
type Id = number;

type Coord = {
    x: number;
    y: number;
}

type Trajectory = {
    coord: Coord;
    target: Coord;
}

enum Instruction {
    WAIT = "WAIT",
    SPELL = "SPELL",
    MOVE = "MOVE"
}

enum SpellType {
    WIND = "WIND",
    SHIELD = "SHIELD",
    CONTROL = "CONTROL"
}

enum ThreatFor {
    none = 0,
    allyBase = 1,
    ennemyBase = 2
}

enum Target {
    /** No target */
    none = 0,
    /** targeting a base (any) */
    base = 1
}

enum EntityType {
    monster = 0,
    ally = 1,
    opponent = 2
}


// ------

class Base {
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


// ------

abstract class Entity {
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


// ------

class Opponent extends Entity {
    type: EntityType;

    constructor(id: number) {
        super(id)
        this.type = EntityType.opponent;
    }
}


// ------

class Ally extends Entity {
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


// ------

class Monster extends Entity {
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


// ------

class Player {
    base: Base;
    heros: Map<Id, Ally | Opponent> = new Map<Id, Ally | Opponent>();

    constructor(base: Base) {
        this.base = base;
    }

    addHero(hero: Ally | Opponent) {
        this.heros.set(hero.id, hero);
    }
}


// ------

abstract class Spell {
    private type: SpellType;

    constructor(type: SpellType) {
        this.type = type
    }

    /** Cast a spell on entity or location */
    abstract cast(entity: Monster | null, location: Coord | null): void;

    /** Can the spell be casted */
    abstract canBeCasted(): boolean;
}


// ------


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
        }).sort((mA, mB) => mA.distanceFrom(player.base.coord) - mB.distanceFrom(player.base.coord))

    player.heros.forEach(hero => {
        // Write an action using console.log()
        // To debug: console.error('Debug messages...');

        // Attaquer le Premier monstre qui entre dans la base

        if (MonstersInBase.length) {
            const monster = MonstersInBase.at(0) as Monster
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
