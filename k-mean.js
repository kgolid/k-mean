import * as util from './util';

export const run_kmean = (pnts, k, runs) => {
  const results = [];
  for (let i = 0; i < runs; i++) {
    const clstr = initialize_cluster(pnts, k);
    results.push(get_cluster(pnts, clstr));
  }
  const [_, minindex] = util.min(results.map((r) => r[2]));
  return results[minindex];
};

export const get_cluster = (pnts, clstr) => {
  let old_cost = 99999999;
  let new_cost = old_cost - 1;

  while (old_cost - new_cost != 0) {
    old_cost = new_cost;
    [pnts, clstr, new_cost] = run_iteration(pnts, clstr);
  }

  return [clstr, pnts, new_cost];
};

const run_iteration = (pnts, clstr) => {
  const new_pnts = assign_points(pnts, clstr);
  const new_clstr = update_cluster(new_pnts, clstr);

  return [new_pnts, new_clstr, util.cost(new_pnts, new_clstr)];
};

export const assign_points = (pnts, clstr) => {
  return pnts.map((pnt) => [pnt[0], pnt[1], util.closest(pnt, clstr)[1]]);
};

export const update_cluster = (pnts, clstr) => {
  return clstr.map((_, i) => [...util.mean(pnts.filter((p) => p[2] === i)), i]);
};

export const initialize_cluster = (pnts, k) => {
  return util
    .shuffle(pnts)
    .slice(0, k)
    .map((c, i) => [...c, i]);
};
