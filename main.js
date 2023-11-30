import "./style.css";

import * as THREE from "three";
import dFdx from "./shaders/dFdx.js";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";

const canvas = document.querySelector("#canvas");

const { width, height } = canvas.getBoundingClientRect();

const aspectRatio = width / height;

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, aspectRatio, 0.1, 1000);

const renderer = new THREE.WebGLRenderer({
  canvas: document.querySelector("#canvas"),
});
renderer.setSize(window.innerWidth, window.innerHeight);

const material = new THREE.ShaderMaterial({
  vertexShader: dFdx.vertexShader,
  fragmentShader: dFdx.fragmentShader,
  uniforms: {
    uTime: { value: 0.0 },
  },
});

const senMaterial = new THREE.ShaderMaterial({
  vertexShader: `
varying vec3 vPosition;
uniform float uTime;
void main() {
  vPosition = position;
  vPosition.z = sin(pow(vPosition.x, 2.0) + pow(vPosition.y, 2.0) + uTime * 0.1) * 0.4;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(vPosition, 1.0);
}
`,
  fragmentShader: `
void main() {
  gl_FragColor = vec4(1.0);
}
`,
  uniforms: {
    uTime: { value: 0.0 },
  },
  wireframe: true,
});

const voidMaterial = new THREE.ShaderMaterial({
  vertexShader: `
uniform float uTime;
varying vec2 vUv;
void main() {
  vUv = uv;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
  `,
  fragmentShader: `
uniform float uTime;
varying vec2 vUv;
void main() {
  // only if animate is true
  gl_FragColor = vec4(sin(vUv + uTime * 0.3),1.0, 1.0);
}
  `,
  uniforms: {
    uTime: { value: 0.0 },
  },
});

const geometry = new THREE.PlaneGeometry(10, 10, 10, 10);

const mesh = new THREE.Mesh(geometry, voidMaterial);

scene.add(mesh);

camera.position.z = 5;
camera.rotation.x = 1;
camera.position.y = -9;

gsap.registerPlugin(ScrollTrigger);

ScrollTrigger.create({
  trigger: ".txt2",
  start: "top center",
  end: "bottom center",
  markers: true,
  onEnter: () => {
    gsap.to(camera.rotation, {
      duration: 1,
      x: 0,
      y: 0,
      z: 0,
    });

    gsap.to(camera.position, {
      duration: 1,
      z: 10,
      y: 0,
      x: 0,
    });

    voidMaterial.wireframe = true;
  },
  onLeaveBack: () => {
    voidMaterial.wireframe = false;

    gsap.to(camera.position, {
      duration: 1,
      z: 5,
      y: -9,
    });

    gsap.to(camera.rotation, {
      duration: 1,
      x: 1,
    });
  },
});

ScrollTrigger.create({
  trigger: ".txt3",
  start: "top center",
  end: "bottom center",
  markers: true,
  onEnter: () => {
    gsap.to(camera.rotation, {
      duration: 1,
      x: 0.5,
      y: 0.5,
      z: 0.7,
    });

    gsap.to(camera.position, {
      duration: 1,
      z: 5,
      y: -5.5,
      x: 6,
    });

    mesh.material = senMaterial;
  },
  onLeaveBack: () => {
    gsap.to(camera.rotation, {
      duration: 1,
      x: 0,
      y: 0,
      z: 0,
    });

    gsap.to(camera.position, {
      duration: 1,
      z: 10,
      y: 0,
      x: 0,
    });

    mesh.material = voidMaterial;
  }
});

window.addEventListener("resize", () => {
  renderer.setSize(width, height);
  camera.aspect = aspectRatio;
  camera.updateProjectionMatrix();
});

function animate() {
  requestAnimationFrame(animate);

  material.uniforms.uTime.value += 0.1;
  senMaterial.uniforms.uTime.value += 0.1;
  voidMaterial.uniforms.uTime.value += 0.1;

  renderer.render(scene, camera);
}

animate();
