import * as THREE from "three";
import { CSG } from "three-csg-ts";

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000,
);

const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

const geometry = new THREE.BoxGeometry(1, 1, 1);
const material = new THREE.MeshNormalMaterial();
const cube = new THREE.Mesh(geometry, material);

const face1 = new THREE.Mesh(new THREE.BoxGeometry(1, 1 / 3, 1 / 3));
const face2 = new THREE.Mesh(new THREE.BoxGeometry(1 / 3, 1, 1 / 3));
const face3 = new THREE.Mesh(new THREE.BoxGeometry(1 / 3, 1 / 3, 1));

const res = CSG.subtract(cube, CSG.union(CSG.union(face1, face2), face3));

scene.add(res);

camera.position.z = 3;
res.rotation.x = 10;

function animate() {
  res.rotation.y += 0.01;
  res.rotation.x += 0.01;
  renderer.render(scene, camera);
}
renderer.setAnimationLoop(animate);
