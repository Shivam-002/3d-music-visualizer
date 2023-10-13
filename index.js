import * as THREE from 'three';

import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

import { get_skybox_mesh } from '/js/skybox.js';

// Create a scene
const scene = new THREE.Scene();

// Create a camera
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.set(1200, -250, 20000);

// Create a renderer
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.getElementById('canvas-container').appendChild(renderer.domElement);

var model;
const loader = new GLTFLoader();
loader.load('boombox_4k.gltf', (gltf) => {
  model = gltf.scene;
  model.position.set(1200,-250,20000-3);
  scene.add(model);
});

const directionalLight = new THREE.DirectionalLight(0xffffff, 1); // Color: white, Intensity: 1
directionalLight.position.set(1, 1, 1); // Set the light's direction
scene.add(directionalLight);

const ambientLight = new THREE.AmbientLight(0x404040); 
ambientLight.intensity = 20;
scene.add(ambientLight);

const skybox = get_skybox_mesh("bluecloud");
scene.add(skybox);

// Create an animation loop
const animate = () => {
    requestAnimationFrame(animate);

    if(model) model.rotation.y += 0.01;
    if(skybox){
      skybox.rotation.x += .1;
      skybox.rotation.y += .1;
    }
    renderer.render(scene, camera);
};

// Call the animate function to start the animation loop
animate();