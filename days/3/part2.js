// example line: #1 @ 432,394: 29x14

const lineRegex = /^#(\d+) @ (\d+),(\d+): (\d+)x(\d+)$/;
function toClaim(line) {
  let match = lineRegex.exec(line);
  if (!match) {
    throw new Error(`No match for: ${line}`);
  }
  return {
    id: parseInt(match[1], 10),
    left: parseInt(match[2], 10),
    top: parseInt(match[3], 10),
    width: parseInt(match[4], 10),
    height: parseInt(match[5], 10)
  };
}

module.exports = async function main(lines) {
  let claims = lines.map(toClaim);

  // origin is upper-left
  let maxCol = Math.max(...claims.map(({ left, width }) => left + width));
  let maxRow = Math.max(...claims.map(({ top, height }) => top + height));
  console.log({ maxCol, maxRow });

  let fabric = [];
  for (let r = 0; r < maxRow; r++) {
    let row = [];
    for (let c = 0; c < maxCol; c++) {
      row.push([]);
    }
    fabric.push(row);
  }

  // fill fabric
  claims.forEach(({ id, left, top, width, height }) => {
    for (let row = top; row < top + height; row++) {
      for (let col = left; col < left + width; col++) {
        fabric[row][col].push(id);
      }
    }
  });

  claims.forEach(({ id, left, top, width, height }) => {
    let hasOverlap = false;
    for (let row = top; row < top + height; row++) {
      if (hasOverlap) {
        break;
      }
      for (let col = left; col < left + width; col++) {
        let ids = fabric[row][col];
        if (!ids.includes(id)) {
          throw new Error(`id ${id} not where it should be...`);
        }
        if (ids.length > 1) {
          hasOverlap = true;
          break;
        }
      }
    }

    if (!hasOverlap) {
      console.log(`id ${id} has no overlap`);
    }
  });
};
