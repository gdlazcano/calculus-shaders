export default {
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

  // Modo 2 central difference method
  // float eps = 0.01; // Small epsilon value
  // vec3 xTangent = vec3(eps, 0.0, vPosition.z) - vec3(0.0, 0.0, vPosition.z);
  // vec3 yTangent = vec3(0.0, eps, vPosition.z) - vec3(0.0, 0.0, vPosition.z);
  // vNormal = normalize(cross(xTangent, yTangent));

  vNormal = normal;

  gl_Position = projectionMatrix * modelViewMatrix * vec4(vPosition, 1.0);
}
`,
  fragmentShader: `
  
varying vec2 vUv;
varying vec3 vPosition;
varying vec3 vNormal;

void main() {
  vec3 light = vec3(7.0, 7.0, 7.0);
  // mover la luz en el tiempo en forma de circulo
  
  vec3 distanceFromEveryPointToLight = normalize(light - vPosition); 

  // Modo 3 calcular las derivadas parciales y normalizar el producto cruz por cada fragmento
  // vec3 vNormal = normalize(cross(dFdx(vPosition), dFdy(vPosition)));

  float lightIntensity = dot (vNormal, distanceFromEveryPointToLight) * 0.8;  
  gl_FragColor = vec4(vec3(lightIntensity), 1.0);
}
`,
};
