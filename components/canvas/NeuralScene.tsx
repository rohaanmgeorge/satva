"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { orb, neural, text, helix, globe } from "./shapes";
import { scene, onReady } from "@/lib/store";

const vertex = /* glsl */ `
  uniform float uTime;
  uniform float uMorph;
  uniform float uSize;
  uniform float uPixelRatio;
  uniform float uIntro;
  uniform float uVelocity;
  uniform float uScale[5];
  uniform float uHelixVertical;

  attribute vec3 aP1;
  attribute vec3 aP2;
  attribute vec3 aP3;
  attribute vec3 aP4;
  attribute float aRand;

  varying vec3 vColor;
  varying float vAlpha;

  mat3 rotY(float a){ float c=cos(a), s=sin(a); return mat3(c,0.,-s, 0.,1.,0., s,0.,c); }
  mat3 rotX(float a){ float c=cos(a), s=sin(a); return mat3(1.,0.,0., 0.,c,s, 0.,-s,c); }

  vec3 shape(float i){
    if (i < 0.5) return rotY(uTime * 0.12) * position * uScale[0];
    if (i < 1.5) return rotY(sin(uTime * 0.3) * 0.28) * aP1 * uScale[1];
    if (i < 2.5) return aP2 * uScale[2];
    if (i < 3.5) {
      vec3 p = aP3;
      p = uHelixVertical > 0.5 ? rotY(uTime * 0.5) * p : rotX(uTime * 0.5) * p;
      return p * uScale[3];
    }
    return rotY(uTime * 0.15) * rotX(0.35) * aP4 * uScale[4];
  }

  void main(){
    float m = clamp(uMorph, 0., 4.);
    float base = min(floor(m), 3.);
    float f = m - base;
    // staggered, per-particle transition
    float t = smoothstep(0., 1., clamp(f * 1.7 - aRand * 0.7, 0., 1.));
    vec3 a = shape(base);
    vec3 b = shape(base + 1.);
    vec3 pos = mix(a, b, t);

    // mid-transition swirl / explosion
    float burst = sin(t * 3.14159);
    vec3 dir = normalize(vec3(sin(aRand * 91.7), cos(aRand * 53.3), sin(aRand * 27.1 + 1.3)));
    pos += dir * burst * (0.9 + aRand * 1.2);

    // ambient life
    pos += 0.035 * vec3(
      sin(uTime * 0.9 + aRand * 60.),
      cos(uTime * 0.7 + aRand * 40.),
      sin(uTime * 0.8 + aRand * 20.)
    );
    // scroll velocity stretch
    pos.y += uVelocity * 0.004 * (aRand - 0.5) * 6.;

    pos *= uIntro;

    vec4 mv = modelViewMatrix * vec4(pos, 1.);
    gl_Position = projectionMatrix * mv;
    float sz = uSize * (0.45 + aRand * 1.1) * (1. + burst * 0.6);
    gl_PointSize = sz * uPixelRatio * (8. / -mv.z);

    vec3 cyan = vec3(0.133, 0.827, 0.933);
    vec3 violet = vec3(0.545, 0.361, 0.965);
    vec3 lime = vec3(0.639, 0.902, 0.208);
    float k = fract(aRand * 7.31 + pos.x * 0.06);
    vec3 c = k < 0.5 ? mix(cyan, violet, k * 2.) : mix(violet, lime, (k - 0.5) * 2.);
    c = mix(c, vec3(1.), step(0.93, aRand) * 0.7);
    vColor = c;
    vAlpha = 0.55 + 0.45 * aRand;
  }
`;

const fragment = /* glsl */ `
  uniform float uOpacity;
  varying vec3 vColor;
  varying float vAlpha;
  void main(){
    float d = length(gl_PointCoord - 0.5);
    float a = smoothstep(0.5, 0.0, d);
    a *= a;
    if (a < 0.01) discard;
    gl_FragColor = vec4(vColor, a * vAlpha * uOpacity);
  }
`;

function Particles({ count, portrait }: { count: number; portrait: boolean }) {
  const points = useRef<THREE.Points>(null);
  const group = useRef<THREE.Group>(null);
  const { viewport, gl } = useThree();
  const intro = useRef({ v: 0, target: 0 });

  const geometry = useMemo(() => {
    const g = new THREE.BufferGeometry();
    const swap = (arr: Float32Array) => {
      if (!portrait) return arr;
      for (let i = 0; i < arr.length; i += 3) {
        const x = arr[i];
        arr[i] = arr[i + 1];
        arr[i + 1] = x;
      }
      return arr;
    };
    g.setAttribute("position", new THREE.BufferAttribute(orb(count), 3));
    g.setAttribute("aP1", new THREE.BufferAttribute(swap(neural(count)), 3));
    g.setAttribute("aP2", new THREE.BufferAttribute(text(count), 3));
    g.setAttribute("aP3", new THREE.BufferAttribute(swap(helix(count)), 3));
    g.setAttribute("aP4", new THREE.BufferAttribute(globe(count), 3));
    const r = new Float32Array(count);
    for (let i = 0; i < count; i++) r[i] = Math.random();
    g.setAttribute("aRand", new THREE.BufferAttribute(r, 1));
    g.boundingSphere = new THREE.Sphere(new THREE.Vector3(), 20);
    return g;
  }, [count, portrait]);

  const material = useMemo(
    () =>
      new THREE.ShaderMaterial({
        vertexShader: vertex,
        fragmentShader: fragment,
        transparent: true,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
        uniforms: {
          uTime: { value: 0 },
          uMorph: { value: 0 },
          uSize: { value: 1 },
          uPixelRatio: { value: 1 },
          uIntro: { value: 0 },
          uVelocity: { value: 0 },
          uOpacity: { value: 0 },
          uScale: { value: [1, 1, 1, 1, 1] },
          uHelixVertical: { value: 0 },
        },
      }),
    [],
  );

  useEffect(() => () => geometry.dispose(), [geometry]);
  useEffect(() => () => material.dispose(), [material]);
  useEffect(() => onReady(() => (intro.current.target = 1)), []);

  useFrame((state, delta) => {
    const u = material.uniforms;
    const dt = Math.min(delta, 0.05);
    u.uTime.value += dt;
    u.uMorph.value += (scene.morph - u.uMorph.value) * Math.min(1, dt * 4);
    u.uOpacity.value += (scene.opacity * intro.current.target - u.uOpacity.value) * Math.min(1, dt * 3);
    u.uVelocity.value += (scene.velocity - u.uVelocity.value) * Math.min(1, dt * 5);
    intro.current.v += (intro.current.target - intro.current.v) * Math.min(1, dt * 1.6);
    u.uIntro.value = intro.current.v;
    u.uPixelRatio.value = gl.getPixelRatio();
    u.uSize.value = portrait ? 1.6 : 1.9;

    const w = viewport.width;
    const h = viewport.height;
    const round = Math.min(1.15, Math.min(w, h) / 6.4);
    const wide = portrait ? Math.min(1, h / 10.5) : Math.min(1.1, w / 10.5);
    const word = Math.min(1.15, w / (portrait ? 9.2 : 10));
    u.uScale.value = [round, wide, word, wide, round];
    u.uHelixVertical.value = portrait ? 1 : 0;

    if (group.current) {
      group.current.rotation.x += (scene.pointerY * 0.12 - group.current.rotation.x) * dt * 2;
      group.current.rotation.y += (scene.pointerX * 0.22 - group.current.rotation.y) * dt * 2;
    }
    void state;
  });

  return (
    <group ref={group}>
      <points ref={points} geometry={geometry} material={material} frustumCulled={false} />
    </group>
  );
}

export default function NeuralScene() {
  const [cfg, setCfg] = useState<{ count: number; portrait: boolean } | null>(null);

  useEffect(() => {
    const compute = () => {
      const w = window.innerWidth;
      const h = window.innerHeight;
      const portrait = w / h < 0.85;
      const count = w < 768 ? 7000 : w < 1280 ? 12000 : 16000;
      setCfg((prev) => (prev && prev.portrait === portrait && prev.count === count ? prev : { count, portrait }));
    };
    compute();
    window.addEventListener("resize", compute);
    return () => window.removeEventListener("resize", compute);
  }, []);

  if (!cfg) return null;

  return (
    <Canvas
      camera={{ position: [0, 0, 10], fov: 45 }}
      dpr={[1, 1.75]}
      gl={{ antialias: false, alpha: true, powerPreference: "high-performance" }}
      style={{ position: "fixed", inset: 0, pointerEvents: "none" }}
    >
      <Particles count={cfg.count} portrait={cfg.portrait} />
    </Canvas>
  );
}
