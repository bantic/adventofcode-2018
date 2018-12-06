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

module.exports = async function(lines) {
  let coords = lines.map(l =>
    l
      .split(',')
      .map(l => l.trim())
      .map(i => parseInt(i, 10))
  );

  let maxX = Math.max(...coords.map(([x, y]) => x));
  let maxY = Math.max(...coords.map(([x, y]) => y));
  let grid = createGrid(maxX, maxY);

  for (let x = 0; x <= maxX; x++) {
    for (let y = 0; y <= maxY; y++) {
      let distances = coords.map(coord => manhattanDistance(coord, [x, y]));
      let minDistance = Math.min(...distances);
      if (distances.filter(d => d === minDistance).length > 1) {
        // tie
        grid[y][x] = '.';
      } else {
        grid[y][x] = distances.indexOf(minDistance);
      }
    }
  }

  let coordDistances = {};
  for (let x = 0; x <= maxX; x++) {
    for (let y = 0; y <= maxY; y++) {
      let coordId = grid[y][x];
      if (coordId === '.') {
        continue;
      } else {
        if (typeof coordDistances[coordId] === 'undefined') {
          coordDistances[coordId] = 0;
        }
        coordDistances[coordId] += 1;
      }
    }
  }

  let infiniteCoords = new Set();
  for (let x = 0; x <= maxX; x++) {
    infiniteCoords.add(grid[0][x]);
    infiniteCoords.add(grid[maxY][x]);
  }
  for (let y = 0; y <= maxY; y++) {
    infiniteCoords.add(grid[y][0]);
    infiniteCoords.add(grid[y][maxX]);
  }
  console.log(coordDistances);
  console.log(infiniteCoords);

  let maxArea = -1;
  let maxAreaCoordId = null;
  for (let [coordId, area] of Object.entries(coordDistances)) {
    coordId = coordId === '.' ? '.' : parseInt(coordId, 10);
    if (infiniteCoords.has(coordId)) {
      console.log('skipping', coordId);
    } else {
      if (area > maxArea) {
        maxArea = area;
        maxAreaCoordId = coordId;
      }
    }
  }

  console.log(maxArea, maxAreaCoordId);
};
