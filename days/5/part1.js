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

module.exports = async function(lines) {
  let polymer = lines[0];
  console.log(react(polymer).length);
};
