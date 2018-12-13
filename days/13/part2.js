const assert = require('assert');
const CARDINAL_DIRS = 'NESW'.split('');

// relativeDir: 1 if 'right', -1 if left, 0 if straight
function turn(facingDir, relativeDir) {
  let nextIndex = CARDINAL_DIRS.indexOf(facingDir) + relativeDir;
  if (nextIndex < 0) {
    nextIndex = CARDINAL_DIRS.length - 1;
  }
  if (nextIndex === CARDINAL_DIRS.length) {
    nextIndex = 0;
  }
  return CARDINAL_DIRS[nextIndex];
}

assert.equal(turn('N', 1), 'E');
assert.equal(turn('N', -1), 'W');
assert.equal(turn('E', 1), 'S');
assert.equal(turn('E', -1), 'N');
assert.equal(turn('S', 1), 'W');
assert.equal(turn('S', -1), 'E');
assert.equal(turn('W', -1), 'S');
assert.equal(turn('W', 1), 'N');
assert.equal(turn('W', 0), 'W');
assert.equal(turn('E', 0), 'E');
assert.equal(turn('N', 0), 'N');
assert.equal(turn('S', 0), 'S');

const CART_DIRS = [-1, 0, 1];

let CARTS = [];

class Cart {
  constructor(dir, cell) {
    this.dir = dir;
    this.cell = cell;
    this.nextRelativeDirIdx = -1;
    this.isCrashed = false;
    CARTS.push(this);
  }

  get row() {
    return this.cell.row;
  }

  get col() {
    return this.cell.col;
  }

  move() {
    let dir;
    if (!this.cell.isIntersection) {
      dir = this.cell.followDir(this.dir);
      if (dir !== this.dir) {
        // we followed a bend
        this.dir = dir;
      }
    } else {
      dir = this.turn();
    }
    let nextCell = this.cell.dir(dir);
    if (nextCell.cart) {
      this.handleCollision(nextCell);
    } else {
      this.cell.cart = null;
      nextCell.cart = this;
      this.cell = nextCell;
    }
  }

  handleCollision(cellWithCollision) {
    this.cell.cart = null;
    cellWithCollision.cart.isCrashed = true;
    cellWithCollision.cart = null;
    this.cell = null;
    this.isCrashed = true;
  }

  turn() {
    this.nextRelativeDirIdx++;
    if (this.nextRelativeDirIdx === CART_DIRS.length) {
      this.nextRelativeDirIdx = 0;
    }
    this.dir = turn(this.dir, CART_DIRS[this.nextRelativeDirIdx]);
    return this.dir;
  }

  get nextRelativeDir() {
    return CART_DIRS[this.nextRelativeDir];
  }

  toString() {
    if (this.dir === 'N') {
      return '^';
    } else if (this.dir === 'S') {
      return 'v';
    } else if (this.dir === 'E') {
      return '>';
    } else if (this.dir === 'W') {
      return '<';
    }
  }
}

const TYPES = ['HORIZ', 'VERT', 'NE', 'SE', 'EMPTY', 'INT'];

class Cell {
  constructor(symbol, { col, row }, grid) {
    this.grid = grid;
    this.col = col;
    this.row = row;
    this.cart = null;

    switch (symbol) {
      case '/':
        this.type = 'NE';
        break;
      case '-':
        this.type = 'HORIZ';
        break;
      case '|':
        this.type = 'VERT';
        break;
      case '\\':
        this.type = 'SE';
        break;
      case '>':
        this.cart = new Cart('E', this);
        this.type = 'HORIZ';
        break;
      case '<':
        this.cart = new Cart('W', this);
        this.type = 'HORIZ';
        break;
      case 'v':
        this.cart = new Cart('S', this);
        this.type = 'VERT';
        break;
      case '^':
        this.cart = new Cart('N', this);
        this.type = 'VERT';
        break;
      case '+':
        this.type = 'INT';
        break;
      case ' ':
        this.type = 'EMPTY';
        break;
      default:
        throw new Error(`Unexpected symbol: "${symbol}"`);
    }
  }

  get isIntersection() {
    return this.type === 'INT';
  }

  dir(dir) {
    return this.grid.dir(dir, this);
  }

  followDir(dir) {
    assert.ok(!this.isEmpty);
    assert.ok(!this.isIntersection);
    if (this.isOrthogonal) {
      return dir;
    } else {
      // follow the bend in the dir provided
      return {
        NE: {
          N: 'E',
          S: 'W',
          E: 'N',
          W: 'S'
        },
        SE: {
          N: 'W',
          S: 'E',
          E: 'S',
          W: 'N'
        }
      }[this.type][dir];
    }
  }

  get isOrthogonal() {
    return ['HORIZ', 'VERT', 'INT'].includes(this.type);
  }

  get isEmpty() {
    return this.type === 'EMPTY';
  }

  toString() {
    if (this.isEmpty) {
      return ' ';
    } else if (!!this.cart) {
      return this.cart.toString();
    } else {
      if (this.type === 'HORIZ') {
        return '-';
      } else if (this.type === 'VERT') {
        return '|';
      } else if (this.type === 'NE') {
        return '/';
      } else if (this.type === 'SE') {
        return '\\';
      } else if (this.type === 'INT') {
        return '+';
      }
    }
  }
}

function sortCartsFromULtoBR(CARTS) {
  return CARTS.sort((a, b) => {
    if (a.row !== b.row) {
      return a.row < b.row ? -1 : 1;
    } else {
      return a.col < b.col ? -1 : a.col === b.col ? 0 : 1;
    }
  });
}

class Grid {
  constructor({ rows, cols }) {
    this.rows = rows;
    this.cols = cols;
    this.cells = [];
    for (let r = 0; r < this.rows; r++) {
      let row = new Array(this.cols);
      this.cells.push(row);
    }
  }

  dir(dir, cell) {
    let { col, row } = cell;
    col += ['E', 'W'].includes(dir) ? (dir === 'E' ? 1 : -1) : 0;
    row += ['N', 'S'].includes(dir) ? (dir === 'S' ? 1 : -1) : 0;
    let nextCell = this.cells[row][col];
    assert.ok(!!nextCell, `Failed to get cell in dir "${dir}" from ${cell}`);
    assert.ok(
      !nextCell.isEmpty,
      `Got empty cell when moving in dir "${dir}" from ${cell}"`
    );
    return nextCell;
  }

  tick() {
    sortCartsFromULtoBR(CARTS).forEach(c => {
      if (c.isCrashed) {
        return;
      }
      console.log(`Moving cart at ${c.col},${c.row}`);
      c.move();
    });
    CARTS = CARTS.filter(c => !c.isCrashed);
  }

  toString() {
    return this.cells
      .map(row => row.map(cell => cell.toString()).join(''))
      .join('\n');
  }
}

function loadGrid(lines) {
  let rows = lines.length;
  let cols = lines[0].length;
  for (let l of lines) {
    if (l.length !== cols) {
      throw new Error(`Line doesn't match width`);
    }
  }

  let g = new Grid({ rows, cols });
  lines.forEach((l, row) => {
    l.split('').forEach((char, col) => {
      g.cells[row][col] = new Cell(char, { row, col }, g);
    });
  });

  return g;
}

function solve(lines) {
  let grid = loadGrid(lines);
  while (CARTS.length > 1) {
    grid.tick();
  }
  console.log(`Last cart at: ${CARTS[0].col},${CARTS[0].row}`);
}

module.exports = async function main(lines) {
  console.log(solve(lines));
};
