let armies = {
  immune: [],
  infection: []
};

class Group {
  constructor(
    units,
    hpPerUnit,
    weaknesses = [],
    immunities = [],
    attackType,
    attackHp,
    initiative,
    name
  ) {
    this.units = units;
    this.hpPerUnit = hpPerUnit;
    this.weaknesses = weaknesses;
    this.immunities = immunities;
    this.attackType = attackType;
    this.attackHp = attackHp;
    this.initiative = initiative;
    this.name = name;
  }

  get effectivePower() {
    return this.units * this.attackHp;
  }

  selectTarget(targets) {
    let t = targets.sort((a, b) => {
      let damageA = this.potentialDamage(a);
      let damageB = this.potentialDamage(b);

      if (damageA > damageB) {
        return -1;
      } else if (damageA < damageB) {
        return 1;
      } else {
        let effA = a.effectivePower;
        let effB = b.effectivePower;
        if (effA === effB) {
          return a.initiative > b.initiative ? -1 : 1;
        } else {
          return effA > effB ? -1 : 1;
        }
      }
    })[0];
    if (!t) {
      return null;
    }
    if (this.potentialDamage(t) > 0) {
      return t;
    } else {
      return null;
    }
  }

  potentialDamage(target) {
    if (target.immunities.some(i => i === this.attackType)) {
      return 0;
    }
    let baseHp = this.effectivePower;
    if (target.weaknesses.some(i => i === this.attackType)) {
      return (baseHp *= 2);
    } else {
      return baseHp;
    }
  }

  attack(target) {
    let damage = this.potentialDamage(target);
    target.receiveDamage(damage, this);
  }

  receiveDamage(damage, attacker) {
    let units = Math.floor(damage / this.hpPerUnit);
    if (units > this.units) {
      units = this.units;
    }
    console.log(
      `${attacker.name} attacks ${this.name} with ${damage}, killing ${units}`
    );
    this.units -= units;
  }
}

function sortGroupsForAttack(a, b) {
  return a.initiative > b.initiative ? -1 : 1;
}

function sortGroupsForSelection(a, b) {
  return a.effectivePower > b.effectivePower
    ? -1
    : a.effectivePower === b.effectivePower
    ? a.initiative > b.initiative
      ? -1
      : 1
    : 1;
}

function createExampleArmies() {
  let armies = {};

  armies.immune = [
    new Group(
      17,
      5390,
      ['radiation', 'bludgeoning'],
      [],
      'fire',
      4507,
      2,
      'immune 1'
    ),
    new Group(
      989,
      1274,
      ['bludgeoning', 'slashing'],
      ['fire'],
      'slashing',
      25,
      3,
      'immune 2'
    )
  ];
  armies.infection = [
    new Group(
      801,
      4706,
      ['radiation'],
      [],
      'bludgeoning',
      116,
      1,
      'infection 1'
    ),
    new Group(
      4485,
      2961,
      ['fire', 'cold'],
      ['radiation'],
      'slashing',
      12,
      4,
      'infection 2'
    )
  ];

  return armies;
}

function createPart1Armies() {
  let armies = {};
  armies.immune = [
    new Group(597, 4458, [], [], 'slashing', 73, 6),
    new Group(4063, 9727, ['radiation'], [], 'radiation', 18, 9),
    new Group(
      2408,
      5825,
      ['slashing'],
      ['fire', 'radiation'],
      'slashing',
      17,
      2
    ),
    new Group(5199, 8624, [], ['fire'], 'radiation', 16, 15),
    new Group(1044, 4485, ['bludgeoning'], [], 'radiation', 41, 3),
    new Group(4890, 9477, ['fire'], ['cold'], 'slashing', 19, 7),
    new Group(1280, 10343, [], [], 'cold', 64, 19),
    new Group(609, 6435, [], [], 'cold', 86, 17),
    new Group(480, 2750, ['cold'], [], 'fire', 57, 11),
    new Group(
      807,
      4560,
      ['bludgeoning'],
      ['fire', 'slashing'],
      'radiation',
      56,
      8
    )
  ];
  armies.infection = [
    new Group(
      1237,
      50749,
      ['radiation'],
      ['cold', 'slashing', 'bludgeoning'],
      'radiation',
      70,
      12
    ),
    new Group(
      4686,
      25794,
      ['bludgeoning'],
      ['cold', 'slashing'],
      'bludgeoning',
      10,
      14
    ),
    new Group(1518, 38219, ['slashing', 'fire'], [], 'radiation', 42, 16),
    new Group(4547, 21147, ['fire'], ['radiation'], 'slashing', 7, 4),
    new Group(1275, 54326, [], ['cold'], 'cold', 65, 20),
    new Group(436, 36859, [], ['fire', 'cold'], 'fire', 164, 18),
    new Group(728, 53230, ['radiation', 'bludgeoning'], [], 'fire', 117, 5),
    new Group(2116, 21754, [], [], 'bludgeoning', 17, 10),
    new Group(2445, 21224, [], ['cold'], 'cold', 16, 13),
    new Group(3814, 22467, ['bludgeoning', 'radiation'], [], 'cold', 10, 1)
  ];
  return armies;
}

module.exports = async function main(lines) {
  let armies = createPart1Armies();
  while (armies.immune.length > 0 && armies.infection.length > 0) {
    debugger;
    console.log('=====================');
    console.log('Immune:');
    armies.immune.forEach(g => console.log(`\t${g.name} has ${g.units}`));
    console.log('Infection:');
    armies.infection.forEach(g => console.log(`\t${g.name} has ${g.units}`));
    let immune = armies.immune;
    let infection = armies.infection;

    let allGroups = [...immune, ...infection].sort(sortGroupsForSelection);

    let isImmune = g => armies.immune.includes(g);

    allGroups.forEach(g => {
      let target = g.selectTarget(isImmune(g) ? infection : immune);
      if (target) {
        g.target = target;
        immune = immune.filter(g => g !== target);
        infection = infection.filter(g => g !== target);
      }
    });

    allGroups.forEach(g => {
      let targets = isImmune(g) ? armies.infection : armies.immune;
      targets.forEach(t => {
        console.log(`${g.name} would deal ${t.name} ${g.potentialDamage(t)}`);
      });
    });

    allGroups = allGroups.sort(sortGroupsForAttack);
    allGroups.forEach(g => {
      if (g.target) {
        g.attack(g.target);
        g.target = null;
      }
    });

    armies.immune = armies.immune.filter(g => g.units > 0);
    armies.infection = armies.infection.filter(g => g.units > 0);
  }

  console.log(armies);
};
