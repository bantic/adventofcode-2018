let readline = require('readline');
let rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
  terminal: false
});

let lines = [];
function processLine(s) {
  lines.push(s);
}

function solve() {
  lines = lines.map(l => parseInt(l, 10));
  let sums = new Set();
  let sum = 0;
  let idx = 0;
  while (true) {
    sum += lines[idx];
    if (sums.has(sum)) {
      console.log(sum);
      break;
    }
    console.log('adding sum', sum);
    sums.add(sum);
    idx++;
    if (idx >= lines.length) {
      idx = 0;
    }
  }
}

rl.on('line', processLine).on('close', solve);
