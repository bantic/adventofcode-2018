const assert = require('assert');
const hash = require('crypto').createHash;

function toGrid(lines) {
  let grid = [];
  for (let line of lines) {
    let row = line.split('');
    grid.push(row);
  }
  return grid;
}

let alg = 'sha1',
  digest = 'hex';
function hashGrid(grid) {
  return hash(alg)
    .update(gridToString(grid))
    .digest(digest);
}

let DIRS = [
  [0, 1], //E
  [0, -1], //W
  [-1, 0], //N
  [1, 0], //S
  [1, 1], //SE
  [-1, 1], //NE
  [-1, -1], //NW
  [1, -1] //SW
];
function neighbors(grid, rowIdx, colIdx) {
  let size = grid.length; // assume square
  return DIRS.map(([rowOffset, colOffset]) => {
    return [rowIdx + rowOffset, colIdx + colOffset];
  })
    .filter(
      ([rowIdx, colIdx]) =>
        rowIdx >= 0 && rowIdx < size && colIdx >= 0 && colIdx < size
    )
    .map(([rowIdx, colIdx]) => {
      return grid[rowIdx][colIdx];
    });
}

let grid = toGrid(['...', '.x.', '...']);
debugger;
assert.equal(neighbors(grid, 0, 0).length, 3, '00');
assert.equal(neighbors(grid, 1, 1).length, 8, '11');
assert.equal(neighbors(grid, 0, 2).length, 3, '02');
assert.equal(neighbors(grid, 0, 1).length, 5, '01');

function makeGrid(size) {
  let grid = [];
  for (let rowIdx = 0; rowIdx < size; rowIdx++) {
    let row = new Array(size);
    grid.push(row);
  }
  return grid;
}

function evolveCell(cell, neighbors) {
  let neighborsOfType = neighbors.reduce((memo, type) => {
    memo[type] = (memo[type] || 0) + 1;
    return memo;
  }, {});
  if (cell === '.') {
    return neighborsOfType['|'] >= 3 ? '|' : '.';
  }
  if (cell === '|') {
    return neighborsOfType['#'] >= 3 ? '#' : '|';
  } else if (cell === '#') {
    if (neighborsOfType['#'] >= 1 && neighborsOfType['|'] >= 1) {
      return '#';
    } else {
      return '.';
    }
  }
}

const MEMO_GRID = {};
const MEMO_GRID_NEXT = {};
const memoLookups = {
  MEMO_GRID: 0,
  MEMO_GRID_NEXT: 0,
  gridMiss: 0,
  nextMiss: 0
};
function evolve(grid, gridHash = null) {
  gridHash = gridHash || hashGrid(grid);
  if (!MEMO_GRID[gridHash]) {
    memoLookups.gridMiss += 1;
    let nextGrid = makeGrid(grid.length);
    for (let rowIdx = 0; rowIdx < grid.length; rowIdx++) {
      for (let colIdx = 0; colIdx < grid.length; colIdx++) {
        nextGrid[rowIdx][colIdx] = evolveCell(
          grid[rowIdx][colIdx],
          neighbors(grid, rowIdx, colIdx)
        );
      }
    }
    MEMO_GRID[gridHash] = nextGrid;
  } else {
    memoLookups['MEMO_GRID'] += 1;
  }
  if (!MEMO_GRID_NEXT[gridHash]) {
    memoLookups.nextMiss += 1;
    MEMO_GRID_NEXT[gridHash] = hashGrid(MEMO_GRID[gridHash]);
  } else {
    memoLookups['MEMO_GRID_NEXT'] += 1;
  }
  return { grid: MEMO_GRID[gridHash], gridHash: MEMO_GRID_NEXT[gridHash] };
}

function gridToString(grid) {
  return grid.map(r => r.join('')).join('\n');
}

function part2(lines) {
  const num = 1000000000;
  let grid = toGrid(lines);
  let gridHash = hashGrid(grid);
  let now = new Date();
  let elapsed = () => new Date() - now;
  // console.log(gridToString(grid));
  for (let i = 0; i < num; i++) {
    ({ grid, gridHash } = evolve(grid, gridHash));
    if (i % (num * 0.01) === 0) {
      console.log(i, elapsed(), memoLookups);
    }
    // console.log(gridToString(grid));
  }

  let byType = grid.reduce((memo, row) => {
    row.forEach(i => {
      memo[i] = (memo[i] || 0) + 1;
    });
    return memo;
  }, {});
  return byType['|'] * byType['#'];
}

module.exports = async function main(lines) {
  console.log('This will take about 5 minutes to run');
  console.log(part2(lines));
};
