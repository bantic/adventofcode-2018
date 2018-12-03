// example line: #1 @ 432,394: 29x14

const lineRegex = /^#\d+ @ (\d+),(\d+): (\d+)x(\d+)$/;
function toClaim(line) {
  let match = lineRegex.exec(line);
  if (!match) {
    throw new Error(`No match for: ${line}`);
  }
  return {
    left: parseInt(match[1], 10),
    top: parseInt(match[2], 10),
    width: parseInt(match[3], 10),
    height: parseInt(match[4], 10)
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
      row.push(0);
    }
    fabric.push(row);
  }

  claims.forEach(({ left, top, width, height }) => {
    for (let row = top; row < top + height; row++) {
      for (let col = left; col < left + width; col++) {
        fabric[row][col] += 1;
      }
    }
  });

  let overlap = 0;
  let nonOverlap = 0;
  for (let row of fabric) {
    for (let col of row) {
      if (col > 1) {
        overlap += 1;
      } else {
        nonOverlap += 1;
      }
    }
  }
  // let overlap = fabric.reduce((overlap, row) => {
  //   return (
  //     overlap +
  //     row.reduce((_overlap, col) => {
  //       return _overlap + col.filter(sq => sq > 1).length;
  //     }, 0)
  //   );
  // }, 0);
  console.log(overlap, nonOverlap);
};
