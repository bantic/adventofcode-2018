// cell: x,y,n,e,w,s
const MAP = {};

function makeCell({ x, y }) {
  if (MAP[`${x},${y}`]) {
    throw `Tried to make cell that exists: ${x},${y}`;
  }
  let cell = { x, y };
  MAP[`${x},${y}`] = cell;
  return cell;
}

function getCell({ x, y }) {
  if (!MAP[`${x},${y}`]) {
    MAP[`${x},${y}`] = makeCell({ x, y });
  }
  return MAP[`${x},${y}`];
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
  let toCell = getCell({ x, y });
  fromCell[dir] = toCell;
  toCell[OPP_DIR[dir]] = fromCell;
  return toCell;
}

function parse(input) {
  return eval(
    input
      .replace(/\(/g, `",["`)
      .replace(/\)/g, `"],"`)
      .replace(/\|/g, `","`)
      .replace('^', `["`)
      .replace('$', `"]`)
  );
}

function toGraph(nodes) {
  let origin = getCell({ x: 0, y: 0 });
  follow(nodes, origin);
  return origin;
}

function follow(nodesOrNode, from) {
  let origin = from;

  if (Array.isArray(nodesOrNode)) {
    for (let node of nodesOrNode) {
      if (Array.isArray(node)) {
        from = follow(node, from);
      } else {
        from = follow(node, origin);
      }
    }
    return origin;
  } else {
    console.log(`Moving ${nodesOrNode} from ${from.x},${from.y}`);
    let dirs = nodesOrNode.split('');
    for (let dir of dirs) {
      from = move(from, dir);
    }
    return from;
  }
}

function traverse(origin) {
  let seen = new Map();
  let distances = new Map();
  let getNeighbors = cell =>
    Object.keys(DIRS)
      .filter(d => !!cell[d])
      .filter(c => !seen.get(c))
      .map(d => cell[d]);
  let queue = [origin];
  origin.distance = 0;

  while (queue.length) {
    let cell = queue.shift();
    getNeighbors(cell).forEach(n => {
      if (!seen.has(n)) {
        n.distance = cell.distance + 1;
        distances.set(n, n.distance);
        queue.push(n);
        seen.set(n, true);
      }
    });
  }

  return [seen, distances];
}

module.exports = async function main(lines) {
  debugger;
  let graph = toGraph(parse(lines[0]));
  debugger;
  let [seen, distances] = traverse(graph);
  console.log(Math.max(...Array.from(distances.values())));
};
