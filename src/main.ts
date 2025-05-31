import * as THREE from "three";
import { CSG } from "three-csg-ts";

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000,
);

function unionAll(meshes: THREE.Mesh[][]) {
  const [first, ...rest] = meshes.flat();
  return rest.reduce((mesh, total) => CSG.union(mesh, total), first);
}

const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

const geometry = new THREE.BoxGeometry(1, 1, 1);
const material = new THREE.MeshNormalMaterial();
const cube = new THREE.Mesh(geometry, material);

const allLevels = [] as THREE.Mesh[][];
const maxLevel = 2;

for (let level = 1; level <= maxLevel; ++level) {
  let levelObjects = [] as THREE.Mesh[];
  const levelExp = 3 ** level;
  const levelExpLower = 3 ** (level - 1);
  const epsilon = 1e-6;

  for (
    let i = -1 / levelExpLower;
    i < 1 / levelExpLower + epsilon;
    i += 1 / levelExpLower
  ) {
    for (
      let j = -1 / levelExpLower;
      j < 1 / levelExpLower + epsilon;
      j += 1 / levelExpLower
    ) {
      if (i == j && Math.abs(i) <= epsilon && level > 1) {
        continue;
      }
      levelObjects.push(
        new THREE.Mesh(
          new THREE.BoxGeometry(1 / levelExp, 1 / levelExp, 1).translate(
            i,
            j,
            0,
          ),
        ),
      );
      levelObjects.push(
        new THREE.Mesh(
          new THREE.BoxGeometry(1 / levelExp, 1, 1 / levelExp).translate(
            i,
            0,
            j,
          ),
        ),
      );
      levelObjects.push(
        new THREE.Mesh(
          new THREE.BoxGeometry(1, 1 / levelExp, 1 / levelExp).translate(
            0,
            i,
            j,
          ),
        ),
      );
    }
  }
  allLevels.push(levelObjects);
}

const res = CSG.subtract(cube, unionAll(allLevels));

scene.add(res);

camera.position.z = 3;
//res.rotation.x = 10;

function animate() {
  res.rotation.y += 0.01;
  res.rotation.x += 0.01;
  renderer.render(scene, camera);
}
renderer.setAnimationLoop(animate);
