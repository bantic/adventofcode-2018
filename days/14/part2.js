const assert = require('assert');

// "looping" arr idx
function at(arr, idx) {
  return arr[idx >= arr.length ? idx % arr.length : idx];
}

assert.equal(at([1, 2, 3], 0), 1);
assert.equal(at([1, 2, 3], 1), 2);
assert.equal(at([1, 2, 3], 2), 3);
assert.equal(at([1, 2, 3], 3), 1);
assert.equal(at([1, 2, 3], 4), 2);
assert.equal(at([1, 2, 3], 5), 3);
assert.equal(at([1, 2, 3], 6), 1);

function solve(iterations) {}

module.exports = async function main(lines) {
  let ITERATIONS = 5;
  console.log(solve(ITERATIONS));
};
