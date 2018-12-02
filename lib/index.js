const fs = require('fs');

let dayNum = process.argv[2];
if (!dayNum) {
  throw new Error(`Need to pass day`);
}

let problemPart = '1';
if (dayNum.includes('b')) {
  dayNum = dayNum.replace('b', '');
  problemPart = '2';
}
const main = require(`../days/${dayNum}/part${problemPart}.js`);

async function run() {
  const input = fs.readFileSync(`./days/${dayNum}/input.txt`, {
    encoding: 'utf8'
  });
  await main(input.split('\n'));
}

run();
