import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

// Set up the scene, camera, and renderer
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setClearColor(0xfff5e1); // Background color (#fff5e1)
renderer.gammaOutput = true; // Enable gamma output

document.body.appendChild(renderer.domElement);

// Set up lighting
const ambientLight = new THREE.AmbientLight(0xffffff, 1.82); // Ambient light
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0xffffff, 1.71); // Directional light
directionalLight.position.set(1, 1, 1);
scene.add(directionalLight);

// Load the GLB model
const loader = new GLTFLoader();
const modelUrl = '/master1.glb'; // Adjust path as per your project structure

let mixer; // Animation mixer variable

loader.load(
  modelUrl,
  function (gltf) {
    console.log('Model loaded:', gltf);
    const model = gltf.scene;
    scene.add(model);

    // Find animation clips and set up mixer
    const clips = gltf.animations;
    mixer = new THREE.AnimationMixer(model);

    // Play all animation clips
    clips.forEach((clip) => {
      const action = mixer.clipAction(clip);
      action.play(); // Start playing the animation
    });

    // Initialize OrbitControls after model is loaded
    initOrbitControls();
    animate(); // Start animation loop after model is loaded
  },
  undefined,
  function (error) {
    console.error('An error happened', error);
  }
);

// Animation loop
function animate() {
  requestAnimationFrame(animate);

  // Update animation mixer
  if (mixer) {
    mixer.update(0.006); // Adjust delta time as needed
  }

  renderer.render(scene, camera);
}

// Initialize OrbitControls
let controls;
function initOrbitControls() {
  controls = new OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true; // Optional: Enable smooth camera movement
  controls.update();

  // Set initial camera position close to the center of the scene
  camera.position.set(0, 3, 6); // Adjust as needed

  // Smooth transition towards the target upon initialization
  const target = new THREE.Vector3(); // Replace with your scene's target point
  camera.lookAt(target);
}

// Add floor
const floorGeometry = new THREE.PlaneGeometry(10, 10); // Adjust size as needed
const floorMaterial = new THREE.MeshStandardMaterial({ color: 0xD8EFD3 }); // Adjust color as needed
const floor = new THREE.Mesh(floorGeometry, floorMaterial);
floor.rotation.x = -Math.PI / 2; // Rotate to lay flat
floor.position.y = -2; // Adjust position based on your scene
floor.receiveShadow = true; // Receive shadows if applicable
scene.add(floor);

// Handle window resize
window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});

// Start the animation loop
animate();
