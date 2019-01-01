// cell: x,y,n,e,w,s
const map = {};
const UNKNOWN = {};
const WALL = {};

function makeCell({ x, y }) {
  if (map[`${x},${y}`]) {
    throw `Tried to make cell that exists: ${x},${y}`;
  }
  let cell = { x, y };
  map[`${x},${y}`] = cell;
  return cell;
}

const DIRS = {
  N: [0, 1],
  E: [1, 0],
  S: [0, -1],
  W: [-1, 0]
};

const OPP_DIR = {
  N: 'S',
  E: 'W',
  S: 'N',
  W: 'E'
};

function move(fromCell, dir) {
  let delta = DIRS[dir];
  let [x, y] = [fromCell.x + delta[0], fromCell.y + delta[1]];
  let toCell = map[`${x},${y}`] || makeCell({ x, y });
  if (fromCell[dir] === WALL) {
    throw `Tried to move in dir that was already wall`;
  }
  fromCell[dir] = toCell;
  toCell[OPP_DIR[dir]] = fromCell;
  return toCell;
}

module.exports = async function main(lines) {
  let regex = lines[0];
  let origin = makeCell({ x: 0, y: 0 });
  origin = move(origin, 'W');
  origin = move(origin, 'N');
  origin = move(origin, 'E');
  map;
  debugger;
};
