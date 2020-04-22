import * as kmean from './k-mean';
import * as tome from 'chromotome';

const palette = tome.get('empusa');
const cols = palette.colors;

let sketch = function (p) {
  let THE_SEED;

  const w = 800;
  const h = 800;
  const pad = 40;

  const n = 50;

  let k;
  let pnts;

  p.setup = function () {
    p.createCanvas(w + 300, h);
    THE_SEED = p.floor(p.random(9999999));
    p.randomSeed(THE_SEED);
    p.strokeWeight(3);
    //p.frameRate(0.5);
    p.noLoop();

    reset();
    //p.draw();
  };

  p.draw = function () {
    if (k > cols.length) {
      reset();
    }
    p.noStroke();
    p.fill(palette.background);
    p.rect(0, 0, w, h);

    const [res_pnts, res_clstr, cost] = kmean.run_kmean(pnts, k, 50);

    display_points(p, res_pnts, true);
    display_points(p, res_clstr, false);
    display_bar(p, k, cost, pad);

    console.log('cost at K=', k, ': ', cost);
    k++;
  };

  p.keyPressed = function () {
    if (p.keyCode === 80) p.saveCanvas('sketch_' + THE_SEED, 'jpeg');
  };

  p.mousePressed = function () {
    p.draw();
  };

  function reset() {
    p.background(palette.background);
    pnts = random_points(n, w, h, pad);
    k = 1;
  }
};
new p5(sketch);

const random_points = (n, w, h, pad) => {
  return Array.from([...Array(n)], () => [
    pad + Math.random() * (w - pad * 2),
    pad + Math.random() * (h - pad * 2),
  ]);
};

const display_points = (p, pnts, fill) => {
  for (const pnt of pnts) {
    display_point(p, pnt, fill);
  }
};

const display_point = (p, pnt, clusterpoint) => {
  const col = pnt[2] != null ? cols[pnt[2]] : 255;
  const size = clusterpoint ? 15 : 8;
  if (clusterpoint) p.fill(col);
  else p.noFill();
  p.stroke(col);
  p.ellipse(pnt[0], pnt[1], size, size);
};

const display_bar = (p, y, cost, pad) => {
  const y1 = pad + 12 * (y - 1);
  const width = cost / 20;
  p.fill(cols[y - 1]);
  p.noStroke();
  p.rect(800, y1, width, 8);
};
