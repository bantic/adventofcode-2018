let readline = require('readline');
let rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
  terminal: false
});

let sum = 0;
function processLine(s) {
  let val = parseInt(s, 10);
  console.log(s, val);
  sum += val;
}
rl.on('line', processLine).on('close', () => {
  console.log('done', sum);
});
