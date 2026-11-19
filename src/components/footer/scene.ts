// Footer 2: procedural 3D architectural showcase (three.js, no React inside the render loop).
// Each property is a real 3D massing (body, roof slab, plinth, glazed side walls) whose front elevation carries the
// project's exterior render as a texture. Buildings glide left -> right on four depth lanes for parallax.
import {
  AdditiveBlending,
  BoxGeometry,
  BufferGeometry,
  CanvasTexture,
  Color,
  DirectionalLight,
  Fog,
  Group,
  HemisphereLight,
  LinearFilter,
  Material,
  Mesh,
  MeshBasicMaterial,
  MeshStandardMaterial,
  NeutralToneMapping,
  PCFShadowMap,
  PerspectiveCamera,
  PlaneGeometry,
  PMREMGenerator,
  RepeatWrapping,
  Scene,
  SRGBColorSpace,
  Texture,
  TextureLoader,
  WebGLRenderer,
} from "three";
import { RoomEnvironment } from "three/addons/environments/RoomEnvironment.js";
import { mergeGeometries } from "three/addons/utils/BufferGeometryUtils.js";
import { showcaseProperties, showcaseTexture, type ShowcaseProperty } from "./properties";

export type Showcase = {
  /** Start/stop rendering (call with false when the section is off screen). */
  setActive(active: boolean): void;
  /** Reduced motion renders a single still frame instead of animating. */
  setReducedMotion(reduced: boolean): void;
  dispose(): void;
};

type Options = {
  canvas: HTMLCanvasElement;
  container: HTMLElement;
  reducedMotion: boolean;
  /** Called (rarely) with the name of the property currently crossing the centre of the foreground lane. */
  onCaption?: (name: string) => void;
};

type Lane = { z: number; scale: number; speed: number; max: number };
type Actor = { prop: ShowcaseProperty; group: Group; width: number; lane: number; x: number; yaw: number; phase: number };

const rand = (a: number, b: number) => a + Math.random() * (b - a);

// ---------- shared procedural materials ----------

function noiseTexture(base: string, speckle: string, stripes: "none" | "vertical" | "horizontal" = "none") {
  const size = 128;
  const c = document.createElement("canvas");
  c.width = c.height = size;
  const g = c.getContext("2d")!;
  g.fillStyle = base;
  g.fillRect(0, 0, size, size);
  g.fillStyle = speckle;
  for (let i = 0; i < 900; i++) {
    g.globalAlpha = rand(0.03, 0.14);
    g.fillRect(rand(0, size), rand(0, size), rand(1, 3), rand(1, 3));
  }
  g.globalAlpha = 0.18;
  g.fillStyle = "#000";
  if (stripes === "vertical") for (let x = 0; x < size; x += 16) g.fillRect(x, 0, 2, size);
  if (stripes === "horizontal") for (let y = 0; y < size; y += 32) g.fillRect(0, y, size, 1.5);
  const t = new CanvasTexture(c);
  t.colorSpace = SRGBColorSpace;
  t.wrapS = t.wrapT = RepeatWrapping;
  t.repeat.set(2, 2);
  return t;
}

function radialShadowTexture() {
  const size = 128;
  const c = document.createElement("canvas");
  c.width = c.height = size;
  const g = c.getContext("2d")!;
  const grad = g.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2);
  grad.addColorStop(0, "rgba(0,0,0,0.75)");
  grad.addColorStop(0.55, "rgba(0,0,0,0.35)");
  grad.addColorStop(1, "rgba(0,0,0,0)");
  g.fillStyle = grad;
  g.fillRect(0, 0, size, size);
  return new CanvasTexture(c);
}

function backdropTexture() {
  const c = document.createElement("canvas");
  c.width = 4;
  c.height = 256;
  const g = c.getContext("2d")!;
  const grad = g.createLinearGradient(0, 0, 0, 256);
  grad.addColorStop(0, "#37302a");
  grad.addColorStop(0.55, "#221f1b");
  grad.addColorStop(1, "#141310");
  g.fillStyle = grad;
  g.fillRect(0, 0, 4, 256);
  const t = new CanvasTexture(c);
  t.colorSpace = SRGBColorSpace;
  t.magFilter = LinearFilter;
  return t;
}

export async function createShowcase(opts: Options): Promise<Showcase> {
  const { canvas, container } = opts;
  const small = () => container.clientWidth < 700;
  let mobile = small();

  const renderer = new WebGLRenderer({ canvas, antialias: window.devicePixelRatio < 2, powerPreference: "high-performance" });
  renderer.outputColorSpace = SRGBColorSpace;
  renderer.toneMapping = NeutralToneMapping;
  renderer.toneMappingExposure = 1.05;
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = PCFShadowMap;

  const scene = new Scene();
  const bg = backdropTexture();
  scene.background = bg;
  scene.fog = new Fog(0x1a1815, 46, 120);

  // Soft studio reflections for the glass; generated once, then the generator is released.
  const pmrem = new PMREMGenerator(renderer);
  const envScene = new RoomEnvironment();
  const envTarget = pmrem.fromScene(envScene, 0.04);
  scene.environment = envTarget.texture;
  scene.environmentIntensity = 0.35;
  envScene.traverse((o) => {
    if (o instanceof Mesh) {
      o.geometry.dispose();
      (o.material as Material).dispose();
    }
  });
  pmrem.dispose();

  const camera = new PerspectiveCamera(32, 1, 0.5, 220);

  // ----- lights -----
  scene.add(new HemisphereLight(0xffe8d0, 0x1b1815, 0.85));
  const key = new DirectionalLight(0xffe0bc, 2.6);
  key.position.set(-16, 26, 30);
  key.castShadow = true;
  key.shadow.bias = -0.0004;
  key.shadow.normalBias = 0.06;
  key.shadow.radius = 3;
  scene.add(key, key.target);
  const rim = new DirectionalLight(0x9db8ff, 0.7);
  rim.position.set(18, 12, -30);
  scene.add(rim);

  // ----- floor (no roads, no scenery: only a matte stage the models stand on) -----
  const floor = new Mesh(
    new PlaneGeometry(500, 260),
    new MeshStandardMaterial({ color: 0x1c1a17, roughness: 0.85, metalness: 0.05 }),
  );
  floor.rotation.x = -Math.PI / 2;
  floor.position.set(0, 0, -50);
  floor.receiveShadow = true;
  scene.add(floor);

  // ----- shared materials -----
  const finishTex: Record<ShowcaseProperty["finish"], Texture> = {
    concrete: noiseTexture("#bdb8ae", "#6e6a62"),
    stone: noiseTexture("#cdbfa8", "#7d6d55", "horizontal"),
    timber: noiseTexture("#8a5a3b", "#3e2514", "vertical"),
    charcoal: noiseTexture("#4a4845", "#1d1c1a", "horizontal"),
  };
  const finishMat = Object.fromEntries(
    (Object.keys(finishTex) as ShowcaseProperty["finish"][]).map((k) => [
      k,
      new MeshStandardMaterial({ map: finishTex[k], roughness: k === "timber" ? 0.6 : 0.85, metalness: 0.02 }),
    ]),
  ) as Record<ShowcaseProperty["finish"], MeshStandardMaterial>;
  const roofMat = new MeshStandardMaterial({ color: 0x2a2927, roughness: 0.45, metalness: 0.7 });
  const plinthMat = new MeshStandardMaterial({ color: 0xcfc5b4, roughness: 0.7, metalness: 0.02 });
  const glowMat = new MeshBasicMaterial({ color: 0xffc27a });
  const glassMat = new MeshStandardMaterial({
    color: 0x1b2631,
    emissive: 0x4a3118,
    roughness: 0.1,
    metalness: 0.85,
    envMapIntensity: 2.2,
  });
  // Reflection-only sheen laid over the photographic facade: adds highlights without washing the render out.
  const sheenMat = new MeshStandardMaterial({
    color: 0x000000,
    roughness: 0.06,
    metalness: 1,
    envMapIntensity: 0.9,
    transparent: true,
    blending: AdditiveBlending,
    depthWrite: false,
  });
  const shadowTex = radialShadowTexture();
  const blobMat = new MeshBasicMaterial({ map: shadowTex, transparent: true, depthWrite: false, opacity: 0.85 });

  // ----- shared geometries -----
  const unitBox = new BoxGeometry(1, 1, 1);
  const unitPlane = new PlaneGeometry(1, 1);
  const disposables: { dispose(): void }[] = [unitBox, unitPlane];

  // ----- load facade textures (small WebP crops) -----
  const loader = new TextureLoader();
  const maxAniso = Math.min(4, renderer.capabilities.getMaxAnisotropy());
  const facadeTex = new Map<string, Texture>();
  await Promise.all(
    showcaseProperties.map(
      (p) =>
        new Promise<void>((resolve) => {
          loader.load(
            showcaseTexture(p.id),
            (t) => {
              t.colorSpace = SRGBColorSpace;
              t.anisotropy = maxAniso;
              facadeTex.set(p.id, t);
              resolve();
            },
            undefined,
            () => resolve(), // a missing texture just leaves that property out of rotation
          );
        }),
    ),
  );
  const available = showcaseProperties.filter((p) => facadeTex.has(p.id));

  // ---------- building factory ----------
  function buildModel(prop: ShowcaseProperty): { group: Group; width: number } {
    // Roughly constant facade area so tall towers and wide mansions feel equally weighty.
    let h = Math.sqrt(38 / prop.aspect);
    h = Math.min(8.5, Math.max(3.6, h));
    const w = Math.min(11.5, h * prop.aspect);
    h = w / prop.aspect;
    const d = Math.min(6, Math.max(3.2, w * 0.45));
    const plinthH = 0.35;

    const group = new Group();
    const side = finishMat[prop.finish];

    const photo = new MeshStandardMaterial({
      map: facadeTex.get(prop.id)!,
      emissiveMap: facadeTex.get(prop.id)!,
      emissive: new Color(0xffffff),
      emissiveIntensity: 0.55,
      color: 0xc8c8c8,
      roughness: 0.6,
      metalness: 0,
    });
    disposables.push(photo);

    // BoxGeometry face order: +x, -x, +y, -y, +z (front), -z
    const body = new Mesh(unitBox, [side, side, roofMat, side, photo, side]);
    body.scale.set(w, h, d);
    body.position.set(0, plinthH + h / 2, 0);
    body.castShadow = body.receiveShadow = true;
    group.add(body);

    // Cantilevered roof slab + service core.
    const roof = new Mesh(unitBox, roofMat);
    roof.scale.set(w + 0.7, 0.26, d + 0.7);
    roof.position.set(0, plinthH + h + 0.13, 0.1);
    roof.castShadow = roof.receiveShadow = true;
    group.add(roof);
    const core = new Mesh(unitBox, side);
    core.scale.set(Math.min(2.4, w * 0.22), 0.8, d * 0.34);
    core.position.set(w * 0.22, plinthH + h + 0.26 + 0.4, -d * 0.2);
    core.castShadow = true;
    group.add(core);

    // Travertine plinth with a warm LED reveal along its front edge.
    const plinth = new Mesh(unitBox, plinthMat);
    plinth.scale.set(w + 1.4, plinthH, d + 1.4);
    plinth.position.set(0, plinthH / 2, 0);
    plinth.castShadow = plinth.receiveShadow = true;
    group.add(plinth);
    const led = new Mesh(unitBox, glowMat);
    led.scale.set(w + 1.4, 0.04, 0.04);
    led.position.set(0, plinthH + 0.02, (d + 1.4) / 2 + 0.01);
    group.add(led);

    // Glass sheen over the facade.
    const sheen = new Mesh(unitPlane, sheenMat);
    sheen.scale.set(w * 0.98, h * 0.98, 1);
    sheen.position.set(0, plinthH + h / 2, d / 2 + 0.02);
    group.add(sheen);

    // Glazed ribbons on both side walls (merged into one draw call).
    const floors = Math.max(1, Math.round(h / 2.7));
    const panes: BufferGeometry[] = [];
    for (let f = 0; f < floors; f++) {
      for (const sx of [-1, 1]) {
        for (const zc of [-0.22, 0.2]) {
          const g = new PlaneGeometry(d * 0.3, h / floors * 0.42);
          g.rotateY(sx * Math.PI / 2);
          g.translate(sx * (w / 2 + 0.015), plinthH + (f + 0.55) * (h / floors), zc * d);
          panes.push(g);
        }
      }
    }
    const glassGeo = mergeGeometries(panes)!;
    panes.forEach((g) => g.dispose());
    disposables.push(glassGeo);
    group.add(new Mesh(glassGeo, glassMat));

    // Soft ambient contact shadow.
    const blob = new Mesh(unitPlane, blobMat);
    blob.rotation.x = -Math.PI / 2;
    blob.scale.set((w + 1.4) * 1.55, (d + 1.4) * 2.4, 1);
    blob.position.set(0, 0.02, 0.4);
    blob.renderOrder = -1;
    group.add(blob);

    group.visible = false;
    scene.add(group);
    return { group, width: w + 1.4 };
  }

  // ---------- lanes (depth layers for parallax) ----------
  const lanes: Lane[] = mobile
    ? [
        { z: 6, scale: 0.95, speed: 2.4, max: 1 },
        { z: -3, scale: 0.88, speed: 1.9, max: 1 },
        { z: -13, scale: 0.8, speed: 1.4, max: 1 },
        { z: -24, scale: 0.72, speed: 1.05, max: 1 },
      ]
    : [
        { z: 6, scale: 0.95, speed: 2.4, max: 2 },
        { z: -3, scale: 0.88, speed: 1.9, max: 2 },
        { z: -13, scale: 0.8, speed: 1.4, max: 2 },
        { z: -24, scale: 0.72, speed: 1.05, max: 2 },
      ];

  const actors: Actor[] = available.map((prop) => {
    const { group, width } = buildModel(prop);
    return { prop, group, width, lane: -1, x: 0, yaw: 0, phase: rand(0, 6.28) };
  });
  const active = new Set<Actor>();
  const recent: Actor[] = [];

  // ---------- camera framing ----------
  const camBase = { x: 0, y: 4.4, z: 28 };
  let halfWidthAt = (_z: number) => 20;

  function resize() {
    mobile = small();
    const w = Math.max(1, container.clientWidth);
    const h = Math.max(1, container.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, mobile ? 1.5 : 2));
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    // Portrait screens: pull back so the foreground property still fits across the width.
    const vFov = (camera.fov * Math.PI) / 180;
    const needDist = 12.5 / (2 * Math.tan(vFov / 2) * camera.aspect);
    camBase.z = Math.max(28, 6 + needDist);
    camera.updateProjectionMatrix();
    halfWidthAt = (z) => Math.tan(vFov / 2) * (camBase.z - z) * camera.aspect;
    const span = mobile ? 26 : 38;
    key.shadow.mapSize.set(mobile ? 1024 : 2048, mobile ? 1024 : 2048);
    key.shadow.map?.dispose();
    key.shadow.map = null;
    key.shadow.camera.left = -span;
    key.shadow.camera.right = span;
    key.shadow.camera.top = 26;
    key.shadow.camera.bottom = -26;
    key.shadow.camera.near = 1;
    key.shadow.camera.far = 110;
    key.shadow.camera.updateProjectionMatrix();
    key.target.position.set(0, 0, -8);
  }

  // ---------- actor placement ----------
  const laneActors = (i: number) => [...active].filter((a) => a.lane === i);

  function pick(): Actor | undefined {
    // Never an actor that is already in frame; avoid the last few retirees so the line-up keeps changing.
    const free = actors.filter((a) => !active.has(a));
    const fresh = free.filter((a) => !recent.includes(a));
    const pool = fresh.length ? fresh : free;
    return pool[Math.floor(Math.random() * pool.length)];
  }

  function place(a: Actor, laneIndex: number, x: number) {
    const l = lanes[laneIndex];
    a.lane = laneIndex;
    a.x = x;
    a.yaw = rand(-0.12, 0.12);
    a.group.scale.setScalar(l.scale);
    a.group.position.set(x, 0, l.z);
    a.group.visible = true;
    active.add(a);
  }

  function retire(a: Actor) {
    a.group.visible = false;
    active.delete(a);
    a.lane = -1;
    recent.push(a);
    while (recent.length > Math.min(4, actors.length - 6)) recent.shift();
  }

  function entryX(laneIndex: number, a: Actor) {
    return -(halfWidthAt(lanes[laneIndex].z) + (a.width * lanes[laneIndex].scale) / 2 + 1);
  }

  function populate() {
    // Pre-fill the stage so the first frame already looks like the loop is mid-flow.
    lanes.forEach((l, i) => {
      const half = halfWidthAt(l.z);
      for (let k = 0; k < l.max; k++) {
        const a = pick();
        if (!a) return;
        const slot = (2 * half) / l.max;
        place(a, i, -half + slot * (k + 0.5) + rand(-0.15, 0.15) * slot + (i % 2 ? slot * 0.15 : -slot * 0.1));
      }
    });
  }

  function spawn(i: number) {
    const l = lanes[i];
    const a = pick();
    if (!a) return;
    const x = entryX(i, a);
    const gap = 4 * l.scale;
    // Wait until whoever is already in this lane has cleared the entrance by a comfortable gap.
    for (const o of laneActors(i)) {
      if (o.x - (o.width * l.scale) / 2 < x + (a.width * l.scale) / 2 + gap) return;
    }
    place(a, i, x);
  }

  // ---------- animation ----------
  let raf = false;
  let running = false;
  let reduced = opts.reducedMotion;
  let last = 0;
  let t = 0;
  let caption = "";

  function updateCaption() {
    if (!opts.onCaption) return;
    let best: Actor | undefined;
    for (const a of laneActors(0)) if (!best || Math.abs(a.x) < Math.abs(best.x)) best = a;
    const name = best && Math.abs(best.x) < halfWidthAt(lanes[0].z) ? best.prop.name : "";
    if (name && name !== caption) {
      caption = name;
      opts.onCaption(name);
    }
  }

  function step(dt: number) {
    t += dt;
    for (const a of [...active]) {
      const l = lanes[a.lane];
      a.x += l.speed * dt;
      const exit = halfWidthAt(l.z) + (a.width * l.scale) / 2 + 1;
      if (a.x > exit) {
        retire(a);
        continue;
      }
      a.group.position.x = a.x;
      a.group.rotation.y = a.yaw + Math.sin(t * 0.35 + a.phase) * 0.035;
    }
    for (let i = 0; i < lanes.length; i++) if (laneActors(i).length < lanes[i].max) spawn(i);
    // Controlled, slow camera drift.
    camera.position.set(camBase.x + Math.sin(t * 0.11) * 1.4, camBase.y + Math.sin(t * 0.07) * 0.3, camBase.z);
    camera.lookAt(Math.sin(t * 0.11) * 0.6, 3.6, 0);
  }

  function frame(now: number) {
    const dt = Math.min(0.05, (now - last) / 1000 || 0.016);
    last = now;
    step(dt);
    renderer.render(scene, camera);
    if (!raf) return;
    updateCaptionThrottled(now);
  }
  let lastCaptionCheck = 0;
  function updateCaptionThrottled(now: number) {
    if (now - lastCaptionCheck > 400) {
      lastCaptionCheck = now;
      updateCaption();
    }
  }

  function renderStill() {
    step(0);
    renderer.render(scene, camera);
    updateCaption();
  }

  function start() {
    if (raf || reduced) return;
    raf = true;
    last = performance.now();
    renderer.setAnimationLoop(frame);
  }
  function stop() {
    raf = false;
    renderer.setAnimationLoop(null);
  }

  resize();
  populate();
  // Warm-up so shaders compile before the section scrolls into view.
  camera.position.set(camBase.x, camBase.y, camBase.z);
  camera.lookAt(0, 3.6, 0);
  renderStill();

  const ro = new ResizeObserver(() => {
    resize();
    if (!raf) renderStill();
  });
  ro.observe(container);

  return {
    setActive(active) {
      running = active;
      if (active && !reduced) start();
      else stop();
    },
    setReducedMotion(r) {
      reduced = r;
      if (r) {
        stop();
        renderStill();
      } else if (running) start();
    },
    dispose() {
      stop();
      ro.disconnect();
      scene.traverse((o) => {
        if (o instanceof Mesh && o.geometry && !disposables.includes(o.geometry)) o.geometry.dispose();
      });
      disposables.forEach((d) => d.dispose());
      facadeTex.forEach((tex) => tex.dispose());
      Object.values(finishTex).forEach((tex) => tex.dispose());
      Object.values(finishMat).forEach((m) => m.dispose());
      [roofMat, plinthMat, glowMat, glassMat, sheenMat, blobMat, floor.material as Material].forEach((m) => m.dispose());
      floor.geometry.dispose();
      shadowTex.dispose();
      bg.dispose();
      envTarget.dispose();
      key.shadow.map?.dispose();
      renderer.dispose();
      renderer.forceContextLoss();
    },
  };
}
