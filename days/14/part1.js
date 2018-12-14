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

function solve(minRecipeCount) {
  let recipes = [3, 7];
  let elves = [0, 1];

  function iterate() {
    let _nextRecipes = nextRecipes(recipes[elves[0]], recipes[elves[1]]);
    recipes.push(..._nextRecipes);
    elves[0] = (elves[0] + (1 + recipes[elves[0]])) % recipes.length;
    elves[1] = (elves[1] + (1 + recipes[elves[1]])) % recipes.length;
  }

  // console.log(display(recipes, elves));

  let start = new Date();
  while (recipes.length < minRecipeCount + 10) {
    if (recipes.length % 1000 === 0) {
      console.log('Length:', recipes.length, new Date() - start);
    }
    iterate();
    // console.log(display(recipes, elves));
  }

  console.log(recipes.slice(minRecipeCount, minRecipeCount + 10).join(''));
}

module.exports = async function main(lines) {
  let MIN_RECIPE_COUNT = 920831;
  console.log(solve(MIN_RECIPE_COUNT));
};
