function distance(p1, p2) {
  let [x1, y1, z1, w1] = p1;
  let [x2, y2, z2, w2] = p2;
  return (
    Math.abs(x1 - x2) +
    Math.abs(y1 - y2) +
    Math.abs(z1 - z2) +
    Math.abs(w1 - w2)
  );
}

const CONSTELLATION_DISTANCE = 3;

module.exports = async function main(lines) {
  let points = lines.map(l => {
    return l.split(',').map(x => parseInt(x, 10));
  });

  let clusters = [];
  while (points.length) {
    let point = points.shift();
    let c = clusters.find(c => {
      return c.some(p => distance(point, p) <= CONSTELLATION_DISTANCE);
    });
    if (c) {
      c.push(point);
    } else {
      clusters.push([point]);
    }
  }

  let constellations = [];
  while (clusters.length) {
    let cluster = clusters.shift();
    let c = clusters.find(c => {
      return c.some(p => {
        return cluster.some(_p => distance(p, _p) <= CONSTELLATION_DISTANCE);
      });
    });
    if (c) {
      c.push(...cluster);
    } else {
      constellations.push(cluster);
    }
  }

  console.log(constellations.length);
};
