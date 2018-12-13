class Node {
  constructor() {
    this.metadata = [];
    this.children = [];
  }

  get sum() {
    if (this.children.length === 0) {
      return arraySum(this.metadata);
    } else {
      let sum = 0;
      for (let idx of this.metadata) {
        if (this.children[idx - 1]) {
          sum += this.children[idx - 1].sum;
        }
      }
      return sum;
    }
  }
}

function parseNode(tokens) {
  let childCount = tokens.shift();
  let metadataCount = tokens.shift();
  let node = new Node();

  while (childCount > 0) {
    childCount -= 1;
    let result = parseNode(tokens);
    let child = result.node;
    tokens = result.tokens;
    node.children.push(child);
  }

  while (metadataCount > 0) {
    metadataCount -= 1;
    node.metadata.push(tokens.shift());
  }

  return { node, tokens };
}

function parse(line) {
  let tokens = line.split(' ').map(i => parseInt(i, 10));
  let result = parseNode(tokens);
  console.log(result);
  return result.node;
}

function arraySum(arr) {
  return arr.reduce((memo, i) => memo + i, 0);
}

function sumMetadata(tree) {
  let sum = 0;
  let children = [tree];
  while (children.length) {
    let child = children.shift();
    sum += arraySum(child.metadata);
    children.push(...child.children);
  }
  return sum;
}

module.exports = async function(lines) {
  let line = lines[0];
  let tree = parse(line);
  console.log(tree.sum);
};
