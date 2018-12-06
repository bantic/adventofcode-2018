function createGrid(maxX, maxY) {
  let grid = [];
  for (let r = 0; r <= maxY; r++) {
    let row = [];
    for (let c = 0; c <= maxX; c++) {
      row.push('?');
    }
    grid.push(row);
  }
  return grid;
}

function manhattanDistance([x1, y1], [x2, y2]) {
  return Math.abs(x1 - x2) + Math.abs(y1 - y2);
}

function sum(array) {
  return array.reduce((memo, i) => memo + i, 0);
}

module.exports = async function(lines) {
  const MAX_SUM_DISTANCES = 10000;
  let coords = lines.map(l =>
    l
      .split(',')
      .map(l => l.trim())
      .map(i => parseInt(i, 10))
  );

  let maxX = Math.max(...coords.map(([x, y]) => x));
  let maxY = Math.max(...coords.map(([x, y]) => y));
  let grid = createGrid(maxX, maxY);

  let area = 0;
  for (let x = 0; x <= maxX; x++) {
    for (let y = 0; y <= maxY; y++) {
      let distances = coords.map(coord => manhattanDistance(coord, [x, y]));
      let totalDistance = sum(distances);

      if (totalDistance < MAX_SUM_DISTANCES) {
        grid[y][x] = 'X';
        area += 1;
      } else {
        grid[y][x] = '.';
      }
    }
  }

  //console.log(grid.map(row => row.join('')).join('\n'));
  console.log(area);
};
