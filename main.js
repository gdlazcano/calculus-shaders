import "./style.css";

import * as THREE from "three";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";

const canvas = document.querySelector("#canvas");

const { width, height } = canvas.getBoundingClientRect();

const aspectRatio = width / height;

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, aspectRatio, 0.1, 1000);

const renderer = new THREE.WebGLRenderer({
  canvas: document.querySelector("#canvas"),
  antialias: true,
});
renderer.setSize(window.innerWidth, window.innerHeight);

const material = new THREE.ShaderMaterial({
  vertexShader: `
varying vec2 vUv;
varying vec3 vPosition;
varying vec3 vNormal;

uniform float uTime;

void main() {
  vUv = uv;
  vPosition = position;

  vPosition.z = sin(pow(vPosition.x, 2.0) + pow(vPosition.y, 2.0) + uTime * 0.1) * 0.4;

  // Modo 1 calcular las tangentes y obteniendo el producto cruz 
  // vec3 xTangent = vec3(1.0, 0.0, 0.0);
  // vec3 yTangent = vec3(0.0, 1.0, 0.0);
  //
  // xTangent.z = 2.0 * vPosition.x * cos(pow(vPosition.x, 2.0) + pow(vPosition.y, 2.0) + uTime * 0.1) * 0.4;
  // yTangent.z = 2.0 * vPosition.y * cos(pow(vPosition.x, 2.0) + pow(vPosition.y, 2.0) + uTime * 0.1) * 0.4;

  // Modo 2 vectores normales proporcionados por libreria
  vNormal = normal;

  gl_Position = projectionMatrix * modelViewMatrix * vec4(vPosition, 1.0);
}
`,
  fragmentShader: `
  
varying vec2 vUv;
varying vec3 vPosition;
varying vec3 vNormal;

void main() {
  vec3 light = vec3(-7.0, -7.0, 7.0);
  vec3 distanceFromEveryPointToLight = normalize(light - vPosition); 

  // Modo 3 calcular las derivadas parciales y normalizar el producto cruz por cada fragmento
  // vec3 vNormal = normalize(cross(dFdx(vPosition), dFdy(vPosition)));

  float lightIntensity = dot (vNormal, distanceFromEveryPointToLight) * 0.8;  
  gl_FragColor = vec4(vec3(lightIntensity), 1.0);
}
`,

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

const marioMaterial = new THREE.ShaderMaterial({
  vertexShader: `
varying vec2 vUv;
varying vec3 vPosition;

uniform float uTime;

void main() {
  vUv = uv;
  vPosition = position;
  vPosition.z = sin(pow(vPosition.x, 2.0) + pow(vPosition.y, 2.0) + uTime * 0.1) * 0.4;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(vPosition, 1.0);
}
`,
  fragmentShader: `
  
varying vec2 vUv;
varying vec3 vPosition;
varying vec3 vNormal;

void main() {
  vec3 light = vec3(-7.0, -7.0, 7.0);
  // mover la luz en el tiempo en forma de circulo
  
  vec3 distanceFromEveryPointToLight = normalize(light - vPosition); 

  // Modo 3 calcular las derivadas parciales y normalizar el producto cruz por cada fragmento
  vec3 vNormal = normalize(cross(dFdx(vPosition), dFdy(vPosition)));

  float lightIntensity = dot (vNormal, distanceFromEveryPointToLight) * 0.8;  
  gl_FragColor = vec4(vec3(lightIntensity), 1.0);
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

let capybara;
let capybaraMaterial = new THREE.MeshPhysicalMaterial({ color: 0xbf743d });

const boundaries = window.innerWidth >= 1280 ? "top center" : "top top";

ScrollTrigger.create({
  trigger: ".txt2",
  start: boundaries,
  end: "bottom bottom",
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
  start: boundaries,
  end: "bottom bottom",
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
  },

  onUpdate: (self) => {
    if (self.progress > 0.5) {
      senMaterial.wireframe = false;
    } else {
      senMaterial.wireframe = true;
    }
  },
});

ScrollTrigger.create({
  trigger: ".txt4",
  start: boundaries,
  end: "bottom bottom",
  onEnter: () => {
    mesh.material = material;

    gsap.to(camera.rotation, {
      duration: 1,
      // 360 degree rotation
      x: -0.7,
      y: 0,
      z: Math.PI,
    });

    gsap.to(camera.position, {
      duration: 1,
      x: 0,
      y: 6,
      z: 5,
    });
  },

  onLeaveBack: () => {
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
});

ScrollTrigger.create({
  trigger: ".txt5",
  start: boundaries,
  end: "bottom bottom",
  onEnter: () => {
    mesh.material = marioMaterial;
  },
  onLeaveBack: () => {
    mesh.material = material;
  },
});

ScrollTrigger.create({
  trigger: ".txt6",
  start: boundaries,
  end: "bottom bottom",
  onEnter: () => {
    scene.remove(mesh);
    gsap.to(camera.rotation, {
      duration: 1,
      x: 0,
      y: 0,
      z: 0,
    });

    gsap.to(camera.position, {
      duration: 1,
      z: 9,
      y: 0,
      x: -0.5,
    });

    // Lights
    const light = new THREE.AmbientLight(0x404040, 2); // soft white light
    scene.add(light);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    scene.add(directionalLight);

    const loader = new GLTFLoader();
    loader.load(
      "capybara.glb", // load the model
      function (gltf) {
        capybara = gltf.scene;

        // change the color of the model
        capybara.traverse((o) => {
          if (!o.isMesh) return;

          o.material = capybaraMaterial;
        });

        // add capybara to the scene
        scene.add(capybara);
      },
      undefined,
      function (error) {
        // handle errors
        console.error(error);
      },
    );
  },
  onLeaveBack: () => {
    scene.add(mesh);
    scene.remove(capybara);

    gsap.to(camera.rotation, {
      duration: 1,
      // 360 degree rotation
      x: -0.7,
      y: 0,
      z: Math.PI,
    });

    gsap.to(camera.position, {
      duration: 1,
      x: 0,
      y: 6,
      z: 5,
    });
  },
}),
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
  marioMaterial.uniforms.uTime.value += 0.1;
  if (capybara) {
    capybara.rotation.y += 0.01;
  }

  renderer.render(scene, camera);
}

animate();
