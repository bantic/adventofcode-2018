class Node {
  constructor(label) {
    this.label = label;
    this.parents = [];
    this.children = [];
  }

  addChild(child) {
    child.parents.push(this);
    this.children.push(child);
  }

  removeChild(child) {
    if (!this.children.includes(child)) {
      throw new Error(
        `Cannot remove child ${child.label} from ${
          this.label
        } because it is not a child. This children: ${this.children.map(
          p => p.label
        )}. Child parents: ${child.parents.map(p => p.label)}`
      );
    }
    this.children = this.children.filter(c => c !== child);
    child.parents = child.parents.filter(p => p !== this);
  }

  toString() {
    return `[${this.label} ^${this.parents.map(
      p => p.label
    )}, |${this.children.map(c => c.label)}}]`;
  }
}

class Graph {
  constructor() {
    this.root = new Node();
    this.nodes = [];
  }

  findNode(label) {
    return this.nodes.find(n => n.label === label);
  }

  addNode(parentLabel, childLabel) {
    let parent = this.findNode(parentLabel);
    if (!parent) {
      parent = new Node(parentLabel);
      this.root.addChild(parent);
      this.nodes.push(parent);
    }
    let child = this.findNode(childLabel);
    if (!child) {
      child = new Node(childLabel);
      parent.addChild(child);
      this.nodes.push(child);
    } else {
      if (child.parents.includes(this.root)) {
        if (child.parents.length !== 1) {
          throw new Error(`Child has root and other parents:${child}`);
        }
        console.log(
          `removing ${child.label} from root and adding to ${
            parent.label
          }. Child: ${child}, parent: ${parent}`
        );
        this.root.removeChild(child);
      } else {
        console.log(
          `adding child ${child.label} to ${
            parent.label
          }. Child: ${child}, parent: ${parent}`
        );
      }
      parent.addChild(child);
    }
  }

  traverse() {
    let seenNodes = [];
    let nodes = [this.root];
    let sortNodes = nodes => {
      return nodes.sort((a, b) => {
        return a.label < b.label ? -1 : a.label === b.label ? 0 : 1;
      });
    };
    while (nodes.length) {
      nodes = sortNodes(nodes);
      //    console.log(`AVAIL ${nodes.map(n => n.label)}`);
      let seenNode = nodes.shift();
      //     console.log(`Remove ${seenNode.label}`);
      seenNodes.push(seenNode);
      let children = seenNode.children;
      let availChildren = children.filter(c =>
        c.parents.every(p => seenNodes.includes(p))
      );
      //      console.log(`Push ${availChildren.map(c => c.label)}`);
      nodes.push(...availChildren);
    }

    return seenNodes;
  }
}

module.exports = async function(lines) {
  let re = /^Step (.) must be finished before step (.) can begin\.$/;
  let pairs = lines.map(l => {
    let [, parent, child] = re.exec(l);
    return [parent, child];
  });

  let graph = new Graph();
  for (let [parentLabel, childLabel] of pairs) {
    console.log(`Adding ${parentLabel}->${childLabel}`);
    graph.addNode(parentLabel, childLabel);
  }

  let nodes = graph.traverse();
  console.log(nodes.map(n => n.label).join(''));
};
