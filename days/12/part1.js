const assert = require('assert');

function parseRule(line, rules) {
  let regex = /^([.#]{5}) => ([.#])/;
  let match = regex.exec(line);

  let key = match[1];
  let val = match[2];

  rules[key] = val;
  return rules;
}

function sumArr(arr) {
  return arr.reduce((memo, i) => memo + i, 0);
}

function sortKeysAsInts(obj) {
  return Object.keys(obj)
    .map(i => parseInt(i, 10))
    .sort((a, b) => {
      return a < b ? -1 : a === b ? 0 : 1;
    });
}

class PlantState {
  constructor(state) {
    this.state = state;
  }

  evolve(rules) {
    let nextState = {};
    let orderedKeys = sortKeysAsInts(this.state);
    for (
      let i = Math.min(...orderedKeys) - 6;
      i < Math.max(...orderedKeys) + 6;
      i++
    ) {
      let curState = this._stateAt(i);
      let rule = this._findRule(curState, rules);
      if (rule) {
        nextState[i] = rule === '#' ? true : false;
      } else {
        if (orderedKeys.includes(i)) {
          nextState[i] = false;
        }
      }
    }
    this.state = nextState;
  }

  _stateAt(i) {
    return [-2, -1, 0, 1, 2]
      .map(relIdx => {
        return this.state[i + relIdx] ? '#' : '.';
      })
      .join('');
  }

  _findRule(curState, rules) {
    return rules[curState];
  }

  toString() {
    let keys = sortKeysAsInts(this.state);
    let out = '';
    for (let i = Math.min(...keys); i < Math.max(...keys) + 1; i++) {
      out += this.state[i] ? '#' : '.';
    }

    let min = Math.min(...keys);
    return [
      '0'.padStart(Math.abs(min) + 1) +
        '1'.padStart(10) +
        '2'.padStart(10) +
        '3'.padStart(10),
      out
    ].join('\n');
  }
}

const GEN_COUNT = 20;
function solve(lines) {
  let initial = lines.shift();
  initial = initial
    .match(/: (.*)$/)[1]
    .split('')
    .reduce((memo, i, idx) => {
      memo[idx] = i === '#' ? true : false;
      return memo;
    }, {});
  debugger;
  let plants = new PlantState(initial);
  lines.shift(); // blank

  let rules = {};
  for (let l of lines) {
    rules = parseRule(l, rules);
  }

  let gen = 0;
  console.log('GEN: ', gen);
  console.log(plants.toString());
  while (gen < GEN_COUNT) {
    gen++;
    plants.evolve(rules);
    console.log('GEN: ', gen);
    console.log(plants.toString());
  }

  let keys = Object.keys(plants.state)
    .filter(k => plants.state[k])
    .map(i => parseInt(i, 10));
  console.log(keys, sumArr(keys));
}

module.exports = async function main(lines) {
  console.log(solve(lines));
};
