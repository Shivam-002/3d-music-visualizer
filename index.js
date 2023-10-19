import * as THREE from 'three';
import * as CANNON from "cannon-es";


// import { FirstPersonControls } from 'three/addons/controls/FirstPersonControls.js';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { PointerLockControls } from 'three/addons/controls/PointerLockControls.js';
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/addons/postprocessing/UnrealBloomPass.js';
import { OutputPass } from 'three/addons/postprocessing/OutputPass.js';
import { Sky } from 'three/addons/objects/Sky.js';
import CannonDebugger from 'cannon-es-debugger';
import Stats from 'stats.js';
import PhysicsHandler from './js/PhysicsHandler';
import load_all_models from './js/utils/modelloader';
import EventEmitter from './js/utils/EventEmitter'; 
import World from './js/World';
import Player from './js/Player';
import { update_delta_time } from './js/Time';
import { get_skybox_mesh } from './js/Skybox';

const SHOW_PHY_DEBUG = false;

let listener,world,player;

const menu_panel = document.getElementById('menuPanel');
const start_button = document.getElementById('startButton');
const hint_text = document.getElementById('hint-text');
// Create a renderer
const renderer = new THREE.WebGLRenderer();
renderer.setPixelRatio( window.devicePixelRatio );
renderer.setSize( window.innerWidth, window.innerHeight );
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 0.5;

document.getElementById('canvas-container').appendChild(renderer.domElement);

// Create a scene
const scene = new THREE.Scene();

// Create camera's
const fps_camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const orbital_camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
var is_fps_active = true;

orbital_camera.position.set(0,10,10);
fps_camera.position.set(0,10,0);

//Orbital Camera Controls
const orbital_controls = new OrbitControls(orbital_camera, renderer.domElement);
orbital_controls.movementSpeed = 100;
orbital_controls.lookSpeed = 0.05;

//FPS Camera Controls
const fps_controls = new PointerLockControls(fps_camera,renderer.domElement);
scene.add(fps_controls.getObject());

// 0: FPS
// 1: MS (render time)
// 2: MB (allocated memory)
var stats = new Stats();
stats.showPanel(0); 
document.body.appendChild(stats.dom);

//Clock
const clock = new THREE.Clock();

//Cannon Physics World
const physics_world = new CANNON.World();
physics_world.gravity.set(0, -9.82, 0); 

//Physics Handling
const physics_handler = new PhysicsHandler();
physics_handler.set_physics_world(physics_world);

//Physics Debugger
const cannon_debugger = new CannonDebugger(scene, physics_world);

//Event Handling
const event_emitter = new EventEmitter();

start_button.addEventListener(
    'click',
    async function () {
        
        //FPS Controls
        fps_controls.lock()

        //Listener
        listener = new THREE.AudioListener();
        fps_camera.add( listener);
        await start_web();
    },
    false
)

// const params = {
//     exposure: 1,
//     bloomStrength: .3,
//     bloomThreshold: 0,
//     bloomRadius: .1,
// };
// const render_scene = new RenderPass( scene, fps_camera );
// const bloomPass = new UnrealBloomPass(new THREE.Vector2(window.innerWidth, window.innerHeight), 1.5, 0.4, 0.85);
// bloomPass.threshold = params.bloomThreshold;
// bloomPass.strength = params.bloomStrength;
// bloomPass.radius = params.bloomRadius;

// const outputPass = new OutputPass();

// // var copyPass = new ShaderPass( CopyShader );
// // copyPass.renderToScreen = true;

// const composer = new EffectComposer( renderer );
// composer.addPass( render_scene );
// composer.addPass( bloomPass );
// composer.addPass( outputPass );
// // composer.addPass( copyPass );

// renderer.toneMappingExposure = Math.pow( 2, 4.0 );
//Testing
// const plane = new CANNON.Body({
//     mass : 0,
//     position : new CANNON.Vec3(0,0,0),
//     shape : new CANNON.Plane()
// });
// plane.quaternion.setFromEuler(-Math.PI/2,0,0);
// physics_world.addBody(plane);

// const box = new CANNON.Body({
//     mass : 0,
//     position : new CANNON.Vec3(4,2,4),
// });

// const shape_1 =  new CANNON.Box(new CANNON.Vec3(1,1,1));
// const pos_1 = new CANNON.Vec3(-5,0,5);

// const shape_2 =  new CANNON.Box(new CANNON.Vec3(1,1,1));
// const pos_2 = new CANNON.Vec3(-5,0,2);

// box.addShape(shape_1,pos_1);
// box.addShape(shape_2,pos_2);

// physics_world.addBody(box);

fps_controls.addEventListener('lock', () => (menu_panel.style.display = 'none'));
fps_controls.addEventListener('unlock', () => (menu_panel.style.display = 'block'));

window.addEventListener('resize', onWindowResize, false);
async function start_web(){

    //Load Models
    await load_all_models();

    world = new World(scene,physics_world,listener);
    world.build_scene();

    //Event Handling
    event_emitter.on('update',world.update_objects.bind(world));

    //Player
    player = new Player(physics_world,fps_camera,new CANNON.Vec3(0,5,2));
    player.create_input_events(document);

    //testing 
    // const _model = get_collider("small_tower");
    // console.log("Mode Scale : ",_model.children[0].scale);
    // const boundingBox = new THREE.Box3();
    // boundingBox.setFromObject(_model); // 'model' is your Three.js 3D model
    
    // const size = new THREE.Vector3();
    // boundingBox.getSize(size);
    // console.log("Model size: ", size);
    
    // const _boombox = new CANNON.Body({
    //     mass : 5,
    //     type : CANNON.Body.STATIC,
    //     shape : new CANNON.Box(size),
    //     position : new CANNON.Vec3(-5,0,0), 
    // });
    // physics_world.addBody(_boombox);

    const on_key_down = (event) => {
        switch (event.code) {
            case 'KeyX':
                switch_cam();
                break;
        }
    }

    document.addEventListener('keydown', on_key_down, false)

}


function onWindowResize() {
    fps_camera.aspect = window.innerWidth / window.innerHeight;
    orbital_camera.aspect = window.innerWidth / window.innerHeight;
    fps_camera.updateProjectionMatrix();
    orbital_camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
    render();
}

// const directionalLight = new THREE.DirectionalLight(0xffffff, 1); // Color: white, Intensity: 1
// directionalLight.position.set(1, 1, 1); // Set the light's direction
// scene.add(directionalLight);

const ambientLight = new THREE.AmbientLight(0x404040); 
ambientLight.intensity = 10;
scene.add(ambientLight);

// const skybox = get_skybox_mesh("bluecloud");
// scene.add(skybox);
// Create an animation loop


let lastCallTime = performance.now() / 1000
function animate () {
    requestAnimationFrame(animate);    
    stats.begin();

    const delta = clock.getDelta();
    const time =  performance.now() / 1000;
    update_delta_time(time - lastCallTime);
    lastCallTime = time
    // controls.update(delta);

    
    physics_world.step(1 / 60);
    if(SHOW_PHY_DEBUG) cannon_debugger.update();
    
    event_emitter.emit('update');

    // composer.render();
    render();
    stats.end();
}

function render(){
    renderer.render(scene, get_active_cam());
}
function get_active_cam(){
    return (is_fps_active) ? fps_camera : orbital_camera;
}

function switch_cam(){
    is_fps_active = !is_fps_active;
    if(is_fps_active){
        scene.remove(orbital_camera);
        scene.add(fps_camera);
        start_button.style.display = 'block';
        menu_panel.style.display = 'block';
    }else{
        fps_controls.unlock();
        scene.remove(fps_camera);
        scene.add(orbital_camera);
        start_button.style.display = 'none';
        menu_panel.style.display = 'none';
    }
}





// Call the animate function to start the animation loop
animate();