import * as kmean from './k-mean';
import * as tome from 'chromotome';

const palette = tome.get('harvest');
const cols = [].concat(palette.colors, palette.colors);

let sketch = function (p) {
  const w = 800;
  const h = 800;
  const pad = 40;

  const n = 500;

  let k;
  let pnts;

  p.setup = function () {
    p.createCanvas(w + 300, h);
    p.strokeWeight(3);
    p.noLoop();

    reset();
  };

  p.draw = function () {
    if (k > cols.length) {
      reset();
    }
    run(k);
    k++;
  };

  p.keyPressed = function () {
    if (p.keyCode === 80) p.saveCanvas('sketch_' + THE_SEED, 'jpeg');
    if (p.keyCode === 38) p.draw();
    if (p.keyCode === 39) {
      reset();
      p.draw();
    }
  };

  function run(k) {
    p.noStroke();
    p.fill(palette.background);
    p.rect(0, 0, w, h);

    const [res_pnts, res_clstr, cost] = kmean.run_kmean(pnts, k, 50);

    display_points(p, res_pnts, true);
    display_points(p, res_clstr, false);
    display_bar(p, k, cost, pad);

    console.log('cost at K=', k, ': ', Math.round(cost));
  }

  function reset() {
    p.background(palette.background);
    pnts = random_points(p, n, w, h, pad);
    k = 1;
  }
};
new p5(sketch);

const random_points = (p, n, w, h, pad) => {
  p.noiseSeed(p.random(2000));
  return Array.from([...Array(n)], () => [
    pad + Math.random() * (w - pad * 2),
    pad + Math.random() * (h - pad * 2),
  ]).filter((pos) => p.noise(pos[0] / 50, pos[1] / 50) > 0.62);
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
  const width = cost / 400;
  p.fill(cols[y - 1]);
  p.noStroke();
  p.rect(800, y1, width, 8);
};
