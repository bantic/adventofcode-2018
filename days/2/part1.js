function solve(lines) {
  let counts = { 2: 0, 3: 0 };
  lines.forEach(l => {
    let lineCounts = l.split('').reduce((memo, char) => {
      memo[char] = (memo[char] || 0) + 1;
      return memo;
    }, {});
    counts[2] += Object.values(lineCounts).includes(2) ? 1 : 0;
    counts[3] += Object.values(lineCounts).includes(3) ? 1 : 0;
  });
  return counts[2] * counts[3];
}

module.exports = async function main(lines) {
  console.log(solve(lines));
};
