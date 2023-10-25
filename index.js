import * as THREE from 'three';
import * as CANNON from "cannon-es";


import { PointerLockControls } from 'three/addons/controls/PointerLockControls.js';
import { Sky } from 'three/addons/objects/Sky.js';
import CannonDebugger from 'cannon-es-debugger';
import Stats from 'stats.js';
import PhysicsHandler from './js/PhysicsHandler';
import load_all_models from './js/utils/modelloader';
import EventEmitter from './js/utils/EventEmitter'; 
import World from './js/World';
import Player from './js/Player';
import { update_delta_time } from './js/Time';

const SHOW_PHY_DEBUG = false;

let listener,world,player,last_call_time,render_target;

const menu_panel = document.getElementById('menuPanel');
const start_button = document.getElementById('startButton');

// Create a renderer
const renderer = new THREE.WebGLRenderer({
    antialias: true,
    powerPreference: "high-performance",
});

//Renderer Configs
const resolution = 1;
renderer.setPixelRatio( window.devicePixelRatio * resolution );
renderer.setSize( window.innerWidth, window.innerHeight );
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 0.5;

document.getElementById('canvas-container').appendChild(renderer.domElement);

// Create a scene
const scene = new THREE.Scene();

// Create cameras
const player_cam = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

player_cam.position.set(0,10,0);

//FPS Camera Controls
const fps_controls = new PointerLockControls(player_cam,renderer.domElement);
scene.add(fps_controls.getObject());

// 0: FPS
// 1: MS (render time)
// 2: MB (allocated memory)
var stats = new Stats();
stats.showPanel(0); 
document.body.appendChild(stats.dom);

//Cannon Physics World
const physics_world = new CANNON.World();
physics_world.gravity.set(0, -9.82, 0); 
last_call_time = performance.now() / 1000;

//Physics Handling
const physics_handler = new PhysicsHandler();
physics_handler.set_physics_world(physics_world);

//Physics Debugger
const cannon_debugger = new CannonDebugger(scene, physics_world);

//Events
const event_emitter = new EventEmitter();

start_button.addEventListener(
    'click',
    async function () {
        
        //FPS Controls
        fps_controls.lock()

        //Listener
        listener = new THREE.AudioListener();
        player_cam.add( listener);
        await start_web();

    },
    false
)

const on_key_down = (event) => {
    switch (event.code) {
        case 'KeyC':
            console_renderer_stats();
            break;
    }
}

const on_window_resize = () => {

    player_cam.aspect = window.innerWidth / window.innerHeight;

    player_cam.updateProjectionMatrix();

    renderer.setSize(window.innerWidth, window.innerHeight);

    render();
}


fps_controls.addEventListener('lock', () => (menu_panel.style.display = 'none'));
fps_controls.addEventListener('unlock', () => (menu_panel.style.display = 'block'));

document.addEventListener('keydown', on_key_down, false);
window.addEventListener('resize', on_window_resize, false);



const sun = new THREE.Vector3();
const sky = new Sky();

sky.scale.setScalar( 10000 );
scene.add( sky );

const sky_uniforms = sky.material.uniforms;

//Sky Configuration
sky_uniforms[ 'turbidity' ].value = 10;
sky_uniforms[ 'rayleigh' ].value = 2;
sky_uniforms[ 'mieCoefficient' ].value = 0.005;
sky_uniforms[ 'mieDirectionalG' ].value = 0.8;

const parameters = {
    elevation: 10,
    azimuth: 180
};

const pmrem_generator = new THREE.PMREMGenerator( renderer );
const scene_env = new THREE.Scene();

async function start_web(){

    //Load Models
    await load_all_models();

    // await new Promise(resolve => {
    //     setTimeout(resolve, 5000); 
    //   });

    world = new World(scene,physics_world,player_cam,listener);
    world.build_scene();

    //Event Handling
    event_emitter.on('update',world.update_objects.bind(world));

    //Player
    player = new Player(physics_world,player_cam,new CANNON.Vec3(7,0,-.5),new CANNON.Quaternion(0,.7,0,.65));

    console.log("Player : ",player);
}


function render(){
    renderer.render(scene, player_cam);
}

function console_renderer_stats(){
    console.log("Scene polycount:", renderer.info.render.triangles);
    console.log("Active Drawcalls:", renderer.info.render.calls);
    console.log("Textures in Memory", renderer.info.memory.textures);
    console.log("Geometries in Memory", renderer.info.memory.geometries);
}

function update_sun() {

    const phi = THREE.MathUtils.degToRad( 90 - parameters.elevation );
    const theta = THREE.MathUtils.degToRad( parameters.azimuth );

    sun.setFromSphericalCoords( 1, phi, theta );

    sky.material.uniforms[ 'sunPosition' ].value.copy( sun );

    if ( render_target !== undefined ) render_target.dispose();

    scene_env.add( sky );
    render_target = pmrem_generator.fromScene( scene_env );
    scene.add( sky );

    scene.environment = render_target.texture;

}

function animate () {

    requestAnimationFrame(animate);    
    physics_world.step(1 / 60);

    //Stats
    stats.begin();

    //Delta Calculation
    const time =  performance.now() / 1000;
    update_delta_time(time - last_call_time);
    last_call_time = time

    //Physics Debugger
    if(SHOW_PHY_DEBUG) cannon_debugger.update();
    
    //Rendering
    render();
    
    //Stats
    stats.end();
}

update_sun();
animate();