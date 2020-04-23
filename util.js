export const cost = (pnts, clstr) => {
  return (
    (1 / pnts.length) *
    sum(clstr.map((c, i) => sum(pnts.filter((pnt) => pnt[2] == i).map((pnt) => dist(pnt, c)))))
  );
};

export const closest = (a, pnts) => {
  const dists = pnts.map((pnt) => dist(a, pnt));
  return min(dists);
};

export const mean = (pnts) => {
  const x = sum(pnts.map((pnt) => pnt[0])) / pnts.length;
  const y = sum(pnts.map((pnt) => pnt[1])) / pnts.length;
  return [x, y];
};

export const shuffle = (a) => {
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
};

const sum = (arr) => {
  return arr.reduce((a, c) => a + c, 0);
};

export const min = (arr) => {
  return arr.reduce((a, c, i) => (c < a[0] ? [c, i] : a), [9999999, -1]);
};

const dist = (a, b) => {
  return Math.pow(b[0] - a[0], 2) + Math.pow(b[1] - a[1], 2);
};
