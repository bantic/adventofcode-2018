function react(str) {
  let idx = 0;
  while (idx < str.length - 1) {
    let a = str[idx];
    let b = str[idx + 1];
    if (a !== b && a.toUpperCase() === b.toUpperCase()) {
      str = str.slice(0, idx) + str.slice(idx + 2);
      idx = idx - 1;
      if (idx < 0) {
        idx = 0;
      }
    } else {
      idx += 1;
    }
  }
  return str;
}

function removeUnit(char, str) {
  let re = new RegExp(char, 'ig');
  return str.replace(re, '');
}

let alpha = 'abcdefghijklmnopqrstuvwxyz';

module.exports = async function(lines) {
  let polymer = lines[0];
  let lengths = {};
  for (let char of alpha) {
    lengths[char] = react(removeUnit(char, polymer)).length;
  }
  console.log(lengths);
  console.log(Math.min(...Object.values(lengths)));
};
