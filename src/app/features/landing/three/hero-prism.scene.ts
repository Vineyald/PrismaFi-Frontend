import type * as Three from 'three';
import { PRISM_PALETTE } from '../../../shared/three/prism-palette';
import type { ThreeScene, ThreeSceneFactory } from '../../../shared/three/three-canvas';

/** Normalized pointer position over the hero, -1..1 on each axis. Written by the hero. */
export interface PointerState {
  x: number;
  y: number;
}

const SIGNALS = { full: 72, lite: 28 };
const TRAIL = 0.42; // length of each incoming signal streak
const OUTPUT_OFFSETS = [-0.42, -0.14, 0.14, 0.42]; // the four structured rays
const PACKETS_PER_RAY = 3;
const RAY_LENGTH = 8;

/**
 * The PrismaFi hero: scattered financial signals drift in from the left, converge on a dark
 * glass prism and leave on the right as four calm, evenly spaced rays.
 * Complexity in, clarity out. Engineered, not magical: no bloom, no rainbow, slow motion.
 */
export function heroPrismScene(pointer: PointerState): ThreeSceneFactory {
  return (three) => build(three, pointer);
}

function build(three: typeof Three, pointer: PointerState): ThreeScene {
  // Small screens: fewer signals and no transmission (refraction) pass.
  const detail = window.matchMedia('(min-width: 48rem)').matches ? 'full' : 'lite';
  const scene = new three.Scene();
  const camera = new three.PerspectiveCamera(32, 1, 0.1, 100);
  camera.position.set(0, 0.35, 10);

  // Everything moves together so the composition can shift right on wide screens.
  const rig = new three.Group();
  scene.add(rig);

  // --- Prism ---------------------------------------------------------------------------
  // A triangular prism lying along the depth axis, apex up, seen at three quarters.
  const prismGroup = new three.Group();
  prismGroup.rotation.set(0.32, -0.78, 0);
  rig.add(prismGroup);

  const prismGeometry = new three.CylinderGeometry(1.05, 1.05, 2.4, 3, 1);
  prismGeometry.rotateX(-Math.PI / 2);
  const glass =
    detail === 'full'
      ? new three.MeshPhysicalMaterial({
          color: PRISM_PALETTE.glass,
          roughness: 0.16,
          metalness: 0,
          transmission: 0.82,
          thickness: 1.4,
          ior: 1.45,
          transparent: true,
        })
      : new three.MeshStandardMaterial({
          color: PRISM_PALETTE.glass,
          roughness: 0.3,
          metalness: 0.25,
          transparent: true,
          opacity: 0.72,
        });
  prismGroup.add(new three.Mesh(prismGeometry, glass));

  const edges = new three.LineSegments(
    new three.EdgesGeometry(prismGeometry),
    new three.LineBasicMaterial({ color: PRISM_PALETTE.edge, transparent: true, opacity: 0.55 }),
  );
  prismGroup.add(edges);

  scene.add(new three.AmbientLight(0xffffff, 0.18));
  const key = new three.PointLight(PRISM_PALETTE.keyLight, 38, 14, 1.6);
  key.position.set(-2.6, 2.4, 3.2);
  const rim = new three.DirectionalLight(PRISM_PALETTE.rimLight, 1.1);
  rim.position.set(3, -1.5, -3);
  const fill = new three.DirectionalLight(0xffffff, 0.35);
  fill.position.set(0, 3, 5);
  rig.add(key, rim, fill);

  // Signals enter at the left face and leave at the right face (prism-local x).
  const entry = new three.Vector3(-0.5, 0, 0);
  const exit = new three.Vector3(0.55, 0, 0);

  // --- Incoming signals: scattered streaks converging on the prism -------------------------
  const count = SIGNALS[detail];
  const positions = new Float32Array(count * 6);
  const colors = new Float32Array(count * 6);
  const signals = Array.from({ length: count }, () => spawn(three, entry, true));
  const streakGeometry = new three.BufferGeometry();
  streakGeometry.setAttribute('position', new three.BufferAttribute(positions, 3));
  streakGeometry.setAttribute('color', new three.BufferAttribute(colors, 3));
  const streaks = new three.LineSegments(
    streakGeometry,
    new three.LineBasicMaterial({ vertexColors: true, transparent: true, opacity: 0.9 }),
  );
  rig.add(streaks);

  const head = new three.Color(PRISM_PALETTE.edge);
  const tail = new three.Color(PRISM_PALETTE.background);
  const writeSignals = () => {
    signals.forEach((signal, i) => {
      const back = signal.direction.clone().multiplyScalar(-TRAIL).add(signal.position);
      positions.set([signal.position.x, signal.position.y, signal.position.z], i * 6);
      positions.set([back.x, back.y, back.z], i * 6 + 3);
      // Invisible far out, sharpening as they approach the prism: noise becoming signal.
      // Keeps the area behind the headline calm.
      const closeness = 1 - Math.min(signal.position.distanceTo(entry) / 3.6, 1);
      const strength = 0.6 * closeness * closeness;
      const near = tail.clone().lerp(head, strength);
      colors.set([near.r, near.g, near.b, tail.r, tail.g, tail.b], i * 6);
    });
    streakGeometry.attributes['position'].needsUpdate = true;
    streakGeometry.attributes['color'].needsUpdate = true;
  };
  writeSignals();

  // --- Outgoing rays: four ordered lines, two violet and two cyan, fading to the right ------
  const rayColors = [
    PRISM_PALETTE.keyLight,
    PRISM_PALETTE.keyLight,
    PRISM_PALETTE.rimLight,
    PRISM_PALETTE.rimLight,
  ];
  const rays = OUTPUT_OFFSETS.map((offset, i) => {
    const start = exit.clone().add(new three.Vector3(0, offset * 0.35, 0));
    const end = new three.Vector3(exit.x + RAY_LENGTH, offset * 2.4, 0);
    const geometry = new three.BufferGeometry().setFromPoints([start, end]);
    const color = new three.Color(rayColors[i]);
    geometry.setAttribute(
      'color',
      new three.Float32BufferAttribute([color.r, color.g, color.b, tail.r, tail.g, tail.b], 3),
    );
    rig.add(
      new three.Line(
        geometry,
        new three.LineBasicMaterial({ vertexColors: true, transparent: true, opacity: 0.85 }),
      ),
    );
    return { start, end };
  });

  // Packets travel the rays at a steady, even spacing: order after the prism.
  const packetPositions = new Float32Array(rays.length * PACKETS_PER_RAY * 3);
  const packetGeometry = new three.BufferGeometry();
  packetGeometry.setAttribute('position', new three.BufferAttribute(packetPositions, 3));
  rig.add(
    new three.Points(
      packetGeometry,
      new three.PointsMaterial({
        color: PRISM_PALETTE.edge,
        size: 0.05,
        transparent: true,
        opacity: 0.8,
      }),
    ),
  );
  const writePackets = (elapsed: number) => {
    let i = 0;
    for (const ray of rays) {
      for (let p = 0; p < PACKETS_PER_RAY; p++) {
        const t = ((elapsed * 0.08 + p / PACKETS_PER_RAY) % 1) * 0.7;
        const point = ray.start.clone().lerp(ray.end, t);
        packetPositions.set([point.x, point.y, point.z], i++ * 3);
      }
    }
    packetGeometry.attributes['position'].needsUpdate = true;
  };
  writePackets(0);

  const baseRotation = { x: prismGroup.rotation.x, y: prismGroup.rotation.y };

  return {
    scene,
    camera,
    update(delta, elapsed) {
      for (const signal of signals) {
        signal.position.addScaledVector(signal.direction, signal.speed * delta);
        // Steer towards the prism: scattered at first, converging as they near it.
        const toEntry = entry.clone().sub(signal.position).normalize();
        signal.direction.lerp(toEntry, Math.min(delta * 0.9, 1)).normalize();
        if (signal.position.distanceTo(entry) < 0.18) Object.assign(signal, spawn(three, entry));
      }
      writeSignals();
      writePackets(elapsed);

      // A slow sway plus a restrained response to the pointer (desktop only).
      prismGroup.rotation.y = baseRotation.y + Math.sin(elapsed * 0.25) * 0.06 + pointer.x * 0.1;
      prismGroup.rotation.x = baseRotation.x + Math.sin(elapsed * 0.18) * 0.03 - pointer.y * 0.06;
      camera.position.x += (pointer.x * 0.35 - camera.position.x) * Math.min(delta * 2, 1);
      camera.position.y += (0.35 - pointer.y * 0.2 - camera.position.y) * Math.min(delta * 2, 1);
      camera.lookAt(rig.position.x * 0.5, 0, 0);
    },
    resize(width, height) {
      const aspect = width / height;
      // Laptops up (canvas behind the copy): the prism sits in the right half, the camera
      // backing off on squarer screens. Smaller screens (canvas under the copy): centered.
      if (width >= 1024) {
        const square = aspect < 1.7;
        camera.position.z = square ? 13 : 10;
        const halfWidth = Math.tan(((camera.fov / 2) * Math.PI) / 180) * camera.position.z * aspect;
        rig.position.x = halfWidth * (square ? 0.62 : 0.5);
      } else {
        rig.position.x = 0;
        camera.position.z = 10 * Math.min(1.9, Math.max(1, 1.35 / aspect));
      }
      camera.lookAt(rig.position.x * 0.5, 0, 0);
    },
  };
}

interface Signal {
  position: Three.Vector3;
  direction: Three.Vector3;
  speed: number;
}

/** A new signal far to the left, heading roughly (not exactly) towards the prism. */
function spawn(three: typeof Three, target: Three.Vector3, anywhere = false): Signal {
  const position = new three.Vector3(
    anywhere ? -5.5 + Math.random() * 4.5 : -5.5 - Math.random(),
    (Math.random() - 0.5) * 4.5,
    (Math.random() - 0.5) * 3,
  );
  const direction = target
    .clone()
    .sub(position)
    .normalize()
    .add(
      new three.Vector3(
        Math.random() * 0.3,
        (Math.random() - 0.5) * 1.1,
        (Math.random() - 0.5) * 0.8,
      ),
    )
    .normalize();
  return { position, direction, speed: 0.55 + Math.random() * 0.55 };
}
