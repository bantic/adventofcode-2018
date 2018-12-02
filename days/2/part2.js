// Return true if exactly 1 character is different in the strings, else false
function stringDiff(a, b) {
  let diffs = 0;
  if (a.length !== b.length) {
    throw new Error('expected arrays to be same length: ' + a + ',' + b);
  }
  for (let i = 0; i < a.length; i++) {
    if (a[i] !== b[i]) {
      diffs++;
      if (diffs > 1) {
        return false;
      }
    }
  }
  return diffs === 1;
}

module.exports = async function main(lines) {
  let pair = [];
  for (let a of lines) {
    for (let b of lines) {
      if (stringDiff(a, b)) {
        console.log('Found pair:', a, b);
        let common = a.split('').reduce((str, char, idx) => {
          if (b[idx] === char) {
            str += char;
          }
          return str;
        }, '');
        console.log('common: ', common);
        return;
      }
    }
  }
};
