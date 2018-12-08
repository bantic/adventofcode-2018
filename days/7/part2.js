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
    const WORKER_COUNT = 5;
    const TIME_ADJUSTMENT = 60;

    let workers = [];
    for (let i = 0; i < WORKER_COUNT; i++) {
      workers.push(new Worker(TIME_ADJUSTMENT));
    }

    let totalTime = 0;
    let completedNodes = [];
    let activeNodes = [];
    let availableNodes = [];
    let pendingNodes = []; // their parent(s) are not all done yet

    let sortNodes = nodes => {
      return nodes.sort((a, b) => {
        return a.label < b.label ? -1 : a.label === b.label ? 0 : 1;
      });
    };

    // When a node is completed, add its children to availableNodes and remove from active

    availableNodes = this.root.children;
    while (availableNodes.length || activeNodes.length || pendingNodes.length) {
      let info = {};
      workers.forEach((w, idx) => {
        info[idx] = {
          working: w.node && w.node.label,
          timeNeeded: w.timeNeeded,
          time: w.time,
          done: w.isDone()
        };
      });
      console.log('TIME:', totalTime, info);

      let completedNow = [];
      workers
        .filter(w => w.isDone())
        .forEach(w => {
          let node = w.complete();
          activeNodes = activeNodes.filter(n => n !== node);
          completedNodes.push(node);

          completedNow.push(node);
        });

      // Move any pending to avail
      pendingNodes.forEach(node => {
        if (node.parents.every(p => completedNodes.includes(p))) {
          console.log('pushing', node.label, ' onto avail from pending');
          if (!availableNodes.includes(node)) {
            availableNodes.push(node);
          }
          pendingNodes = pendingNodes.filter(n => n !== node);
        }
      });

      // Check the ones completed this cycle and add their children to pending or available
      completedNow.forEach(node => {
        node.children.forEach(c => {
          if (c.parents.every(p => completedNodes.includes(p))) {
            if (!availableNodes.includes(c)) {
              availableNodes.push(c);
            }
          } else {
            pendingNodes.push(c);
          }
        });
      });

      availableNodes = sortNodes(availableNodes);

      workers
        .filter(w => w.isFree())
        .forEach(w => {
          if (!availableNodes.length) {
            return;
          }
          let node = availableNodes.shift();
          w.workOn(node);
          activeNodes.push(node);
        });

      workers.forEach(w => w.work());
      totalTime += 1;
    }

    return [completedNodes, totalTime];
  }
}

const ALPHA = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';

class Worker {
  constructor(timeAdjustment = 0) {
    this.node = null;
    this.time = 0;
    this.timeNeeded = null;
    this.timeAdjustment = timeAdjustment;
  }

  workOn(node) {
    if (!!this.node) {
      throw new Error(
        `Worker tried to work on ${node.label} but was already working on ${
          this.node.label
        }`
      );
    }
    console.log('working on', node.label);
    this.time = 0;
    this.node = node;
    if (ALPHA.indexOf(node.label) === -1) {
      throw new Error(`Failed to work on ${node.label}`);
    }
    this.timeNeeded = this.timeAdjustment + ALPHA.indexOf(node.label) + 1;
  }

  work() {
    if (this.node) {
      this.time += 1;
    }
  }

  isFree() {
    return !this.node;
  }

  isDone() {
    return this.node && this.time >= this.timeNeeded;
  }

  complete() {
    let node = this.node;
    this.node = null;
    this.time = 0;
    this.timeNeeded = null;
    return node;
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
    graph.addNode(parentLabel, childLabel);
  }

  let [nodes, time] = graph.traverse();
  console.log(nodes.map(n => n.label).join(''));
  console.log(time);
};
