const assert = require('assert');

const NEXT_RECIPES_MAP = {};
function nextRecipes(a, b) {
  if (!NEXT_RECIPES_MAP[`${a}-${b}`]) {
    let res = ('' + (a + b)).split('').map(i => parseInt(i, 10));
    NEXT_RECIPES_MAP[`${a}-${b}`] = res;
  }
  return NEXT_RECIPES_MAP[`${a}-${b}`];
}

assert.deepEqual(nextRecipes(7, 3), [1, 0]);
assert.deepEqual(nextRecipes(1, 0), [1]);
assert.deepEqual(nextRecipes(2, 5), [7]);
assert.deepEqual(nextRecipes(8, 5), [1, 3]);

function display(recipes, elves) {
  return recipes
    .map((r, idx) => {
      if (elves.includes(idx)) {
        let delim = elves[0] === idx ? ['(', ')'] : ['[', ']'];
        return `${delim[0]}${r}${delim[1]}`;
      } else {
        return `${r}`;
      }
    })
    .join(' ');
}

function arrayEndsWith(bigArray, smallArray) {
  let bLen = bigArray.length;
  let sLen = smallArray.length;
  for (let i = 0; i < sLen; i++) {
    if (bigArray[bLen - 1 - i] !== smallArray[sLen - 1 - i]) {
      return false;
    }
  }
  return true;
}

assert.ok(arrayEndsWith([1, 2, 3, 4], [3, 4]));
assert.ok(arrayEndsWith([1, 2, 3, 4, -1, -2], [3, 4, -1, -2]));
assert.ok(!arrayEndsWith([1, 2, 3, 4, -1, -2], [3, -1, -1]));

function solve(searchArray) {
  let recipes = [3, 7];
  let elves = [0, 1];

  function iterate() {
    let _nextRecipes = nextRecipes(recipes[elves[0]], recipes[elves[1]]);
    for (let _nextRecipe of _nextRecipes) {
      recipes.push(_nextRecipe);
      if (arrayEndsWith(recipes, searchArray)) {
        return true;
      }
    }
    elves[0] = (elves[0] + (1 + recipes[elves[0]])) % recipes.length;
    elves[1] = (elves[1] + (1 + recipes[elves[1]])) % recipes.length;
    return false;
  }

  // console.log(display(recipes, elves));

  let start = new Date();
  let found = false;
  while (!found) {
    if (recipes.length % 1000000 === 0) {
      console.log('Length:', recipes.length, new Date() - start, elves);
    }
    found = iterate();
  }

  return recipes.length - searchArray.length;
}

module.exports = async function main(lines) {
  let SEARCH = '920831'.split('').map(i => parseInt(i, 10));
  console.log(solve(SEARCH));
};
