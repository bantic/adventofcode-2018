const assert = require('assert');
let lineRe = /pos=<(-?\d+),(-?\d+),(-?\d+)>, r=(\d+)/;

function manhattanDistance({ x, y, z }, { x: x2, y: y2, z: z2 }) {
  return Math.abs(x - x2) + Math.abs(y - y2) + Math.abs(z - z2);
}

function part1(bots) {
  let maxBot = null;
  let maxR = -1;
  for (let bot of bots) {
    if (bot.r > maxR) {
      maxR = bot.r;
      maxBot = bot;
    }
  }

  let inRange = [];
  for (let bot of bots) {
    let d = manhattanDistance(bot, maxBot);
    if (d <= maxR) {
      inRange.push(bot);
    }
  }

  return inRange.length;
}

module.exports = async function main(lines) {
  let bots = [];
  for (let line of lines) {
    let match = lineRe.exec(line);
    if (!match) {
      throw 'no match';
    }
    let [, x, y, z, r] = match;
    [x, y, z, r] = [x, y, z, r].map(x => parseInt(x, 10));
    bots.push({ x, y, z, r });
  }
  console.log(part1(bots));
};
