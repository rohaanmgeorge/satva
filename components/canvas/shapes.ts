// Target point clouds for the morphing particle scene. Each returns N*3 floats.

const TAU = Math.PI * 2;
const rand = (a = -1, b = 1) => a + Math.random() * (b - a);
const gauss = () => {
  let u = 0;
  let v = 0;
  while (u === 0) u = Math.random();
  while (v === 0) v = Math.random();
  return Math.sqrt(-2 * Math.log(u)) * Math.cos(TAU * v);
};

/** 0 — a glowing orb wrapped in a thin planetary ring */
export function orb(n: number) {
  const out = new Float32Array(n * 3);
  for (let i = 0; i < n; i++) {
    let x: number, y: number, z: number;
    if (Math.random() < 0.68) {
      const u = rand();
      const th = rand(0, TAU);
      const r = 2.2 + gauss() * 0.06;
      const s = Math.sqrt(1 - u * u);
      x = r * s * Math.cos(th);
      y = r * u;
      z = r * s * Math.sin(th);
    } else {
      const th = rand(0, TAU);
      const r = 3.0 + Math.pow(Math.random(), 1.6) * 1.8;
      x = r * Math.cos(th);
      y = gauss() * 0.04;
      z = r * Math.sin(th);
      // tilt the ring
      const tilt = 0.42;
      const y2 = y * Math.cos(tilt) - z * Math.sin(tilt);
      const z2 = y * Math.sin(tilt) + z * Math.cos(tilt);
      y = y2;
      z = z2;
    }
    out.set([x, y, z], i * 3);
  }
  return out;
}

/** 1 — a layered neural network: nodes + synapse edges */
export function neural(n: number) {
  const out = new Float32Array(n * 3);
  const layers = [4, 7, 9, 7, 4];
  const width = 8.4;
  const nodes: [number, number, number][][] = layers.map((count, li) => {
    const x = -width / 2 + (li / (layers.length - 1)) * width;
    return Array.from({ length: count }, (_, k) => {
      const y = (k - (count - 1) / 2) * 0.72;
      return [x, y, rand(-0.4, 0.4)] as [number, number, number];
    });
  });
  for (let i = 0; i < n; i++) {
    if (Math.random() < 0.38) {
      const L = nodes[Math.floor(Math.random() * nodes.length)];
      const p = L[Math.floor(Math.random() * L.length)];
      out.set([p[0] + gauss() * 0.07, p[1] + gauss() * 0.07, p[2] + gauss() * 0.07], i * 3);
    } else {
      const li = Math.floor(Math.random() * (nodes.length - 1));
      const a = nodes[li][Math.floor(Math.random() * nodes[li].length)];
      const b = nodes[li + 1][Math.floor(Math.random() * nodes[li + 1].length)];
      const t = Math.random();
      out.set(
        [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t + gauss() * 0.012, a[2] + (b[2] - a[2]) * t],
        i * 3,
      );
    }
  }
  return out;
}

/** 2 — the word, sampled from an offscreen canvas */
export function text(n: number, word = "SATVA", worldWidth = 9) {
  const out = new Float32Array(n * 3);
  const W = 1200;
  const H = 300;
  const c = document.createElement("canvas");
  c.width = W;
  c.height = H;
  const ctx = c.getContext("2d")!;
  ctx.fillStyle = "#fff";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  let size = 260;
  ctx.font = `900 ${size}px "Arial Black", "Helvetica Neue", Arial, sans-serif`;
  while (ctx.measureText(word).width > W * 0.94 && size > 40) {
    size -= 8;
    ctx.font = `900 ${size}px "Arial Black", "Helvetica Neue", Arial, sans-serif`;
  }
  ctx.fillText(word, W / 2, H / 2);
  const data = ctx.getImageData(0, 0, W, H).data;
  const pts: number[] = [];
  for (let y = 0; y < H; y += 2) {
    for (let x = 0; x < W; x += 2) {
      if (data[(y * W + x) * 4 + 3] > 128) pts.push(x, y);
    }
  }
  const scale = worldWidth / W;
  for (let i = 0; i < n; i++) {
    const k = Math.floor(Math.random() * (pts.length / 2)) * 2;
    out.set(
      [(pts[k] - W / 2) * scale + rand(-0.01, 0.01), -(pts[k + 1] - H / 2) * scale + rand(-0.01, 0.01), gauss() * 0.08],
      i * 3,
    );
  }
  return out;
}

/** 3 — a double helix with base-pair rungs ("code is our DNA") */
export function helix(n: number) {
  const out = new Float32Array(n * 3);
  const len = 9;
  const turns = 2.6;
  const R = 1.15;
  for (let i = 0; i < n; i++) {
    const r = Math.random();
    if (r < 0.8) {
      const t = Math.random();
      const strand = r < 0.4 ? 0 : Math.PI;
      const a = t * turns * TAU + strand;
      out.set([(t - 0.5) * len, Math.cos(a) * R + gauss() * 0.03, Math.sin(a) * R + gauss() * 0.03], i * 3);
    } else {
      const rungs = 34;
      const k = Math.floor(Math.random() * rungs);
      const t = (k + 0.5) / rungs;
      const a = t * turns * TAU;
      const s = rand(-1, 1);
      out.set([(t - 0.5) * len, Math.cos(a) * R * s, Math.sin(a) * R * s], i * 3);
    }
  }
  return out;
}

/** 4 — a wireframe globe: meridians + parallels + scattered "cities" */
export function globe(n: number) {
  const out = new Float32Array(n * 3);
  const R = 2.5;
  const meridians = 14;
  const parallels = 9;
  for (let i = 0; i < n; i++) {
    const r = Math.random();
    let lat: number, lon: number, rr = R;
    if (r < 0.45) {
      lon = (Math.floor(Math.random() * meridians) / meridians) * TAU;
      lat = rand(-Math.PI / 2, Math.PI / 2);
    } else if (r < 0.85) {
      lat = ((Math.floor(Math.random() * parallels) + 1) / (parallels + 1) - 0.5) * Math.PI;
      lon = rand(0, TAU);
    } else {
      lat = Math.asin(rand(-1, 1));
      lon = rand(0, TAU);
      rr = R * (1 + Math.abs(gauss()) * 0.05);
    }
    out.set([rr * Math.cos(lat) * Math.cos(lon), rr * Math.sin(lat), rr * Math.cos(lat) * Math.sin(lon)], i * 3);
  }
  return out;
}
