import * as THREE from 'three';

import * as CANNON from "cannon-es";
import { get_collider } from "./utils/modelloader";
import PhysicsHandler from "./PhysicsHandler";
import { delta_time } from "./Time";
import { interactable_objects } from './Handler';
import {Howler} from 'howler';
import create_rb from './utils/Utils';

const PLAYER_CAM_OFFSET = new CANNON.Vec3(0, 1.45, 0);
const PLAYER_REACH = 13;

export default class Player{
    constructor(physics_world,player_cam,position=CANNON.Vec3.ZERO,quaternion=CANNON.Quaternion.ZERO){
        this.model_name = "player";
        this.player_cam = player_cam;
        this._vector = new CANNON.Vec3();
        this.moving = false;
        this.move_speed = 400;
        this.ray_caster = new THREE.Raycaster();
        this.ray_caster.far = PLAYER_REACH;
        this.audio_listener = new THREE.AudioListener();
        this.player_cam.add(this.audio_listener);

        this.head_bob = false;
        this.head_bob_speed = .11;
        this.current_head_bob_amount = 0;
        this.max_head_bob = .075;
        this.bob_cam_offset = new CANNON.Vec3();

        const collider = get_collider(this.model_name);
        this.rb = create_rb(
            collider,
            {
                mass : 50,
                position: position,
                type : CANNON.Body.DYNAMIC,
                fixedRotation : true,
            }
        );
        this.player_cam.quaternion.set(quaternion.x,quaternion.y,quaternion.z,quaternion.w);

        physics_world.addBody(this.rb);
        PhysicsHandler.get_instance().add_physics_object(this);
        this.is_interactable = false;
        this.interactable_object = null;

        this.last_quat = this.player_cam.quaternion;
        this.on_key_up = (event) => {
            switch (event.code) {
                case 'KeyW':
                case 'KeyA':
                case 'KeyS':
                case 'KeyD':
                case 'ArrowUp':
                case 'ArrowDown':
                case 'ArrowLeft':
                case 'ArrowRight':
                    this.moving = false;
                    this.head_bob = false;
                    break;
                default:
                    break;
            }
        }
        this.on_key_down = (event) => {
            switch (event.code) {
                case 'KeyW':
                case 'ArrowUp':
                    this.move_forward(1);
                    this.moving = true;
                    this.head_bob = true;
                    break;
        
                case 'KeyA':
                case 'ArrowLeft':
                    this.move_left(1);
                    this.moving = true;
                    this.head_bob = true;
                    break;
        
                case 'KeyS':
                case 'ArrowDown':
                    this.move_forward(-1);
                    this.moving = true;
                    this.head_bob = true;
                    break;
        
                case 'KeyD':
                case 'ArrowRight':
                    this.move_left(-1);
                    this.moving = true;
                    this.head_bob = true;
                    break;
        
                case 'KeyP':
                    this.player_log();
                    break;
                default:
                    break;
            }
    
        }
        document.addEventListener('keydown', this.on_key_down.bind(this), false)
        document.addEventListener('keyup', this.on_key_up.bind(this), false)
    }

    
    
    fixed_update(){

        this.handle_interactions();

        this.head_bobing();

        // const cam_pos = this.rb.position.vadd(PLAYER_CAM_OFFSET).vadd(this.bob_cam_offset)
        this.player_cam.position.copy(this.rb.position.vadd(PLAYER_CAM_OFFSET).vadd(this.bob_cam_offset));
        this.rb.quaternion.copy(this.player_cam.quaternion);

        const playerQuaternion = this.rb.quaternion;
        const cameraQuaternion = this.player_cam.quaternion;

        playerQuaternion.y = cameraQuaternion.y;

        const frontDirection = new THREE.Vector3(0, 0, -1);
        frontDirection.applyQuaternion(cameraQuaternion);

        Howler.orientation(frontDirection.x, frontDirection.y, frontDirection.z, 0, 1, 0);
    }   
    head_bobing(){
        if(this.head_bob){
            this.current_head_bob_amount += this.head_bob_speed;
            const bob = this.max_head_bob * Math.sin(this.current_head_bob_amount);
            this.bob_cam_offset = new CANNON.Vec3(0,bob,0);
        }

        else{
            this.current_head_bob_amount = 0;
            this.bob_cam_offset = new CANNON.Vec3();
        }
        // console.log("Cam Y : ",this.player_cam.position.y," current_bob : ",this.current_head_bob_amount," bobing : ",this.head_bob);
        console.log("Cam Y : ",this.player_cam.position.y);
        
    }
    player_log(){
        console.log("Player : ",this);
        console.log("Position : ",this.rb.position);
        console.log("Quad : ",this.rb.quaternion);
    }

    handle_interactions(){
        const origin = this.player_cam.position.clone();
        const cam_direction = (new THREE.Vector3(0,0,-1)).applyQuaternion(this.player_cam.quaternion).normalize();
        
        this.ray_caster.set(origin,cam_direction);

        const interactable_models = interactable_objects.map(obj => obj.model);
        const intersections = this.ray_caster.intersectObjects(interactable_models, true);

        if(intersections.length > 0){
            const first_interacted_model = intersections[0].object;
            this.interactable_object = interactable_objects.find(obj => obj.model === this.get_model_from_mesh(first_interacted_model));
            if(!this.is_interactable) this.interactable_object.on_enter();
            this.is_interactable = true;    
        }
        else{
            
            if(this.interactable_object){
                this.interactable_object.on_exit();
                this.interactable_object = null;
            }
            this.is_interactable = false;
        }
    }

    get_model_from_mesh(mesh){
        if(mesh.name == "Scene") return mesh;
        else return this.get_model_from_mesh(mesh.parent);
    }
    move_forward(direction) {
 
		// move forward parallel to the xz-plane
		// assumes camera.up is y-up
        const distance = this.move_speed * delta_time * direction; 


        this._vector.set(0,0,distance);
        
        let world_velocity = this.rb.quaternion.vmult(this._vector);
        // console.log("World Velocity : ",world_velocity);
        this.rb.velocity.x = - world_velocity.x;
        this.rb.velocity.z = - world_velocity.z;

        Howler.pos(this.player_cam.position.x, this.player_cam.position.y, this.player_cam.position.z);
	}

	move_left (direction) {

        const distance = this.move_speed * delta_time * direction; 


        this._vector.set(distance,0,0);
        
        let world_velocity = this.rb.quaternion.vmult(this._vector);
        // console.log("World Velocity : ",world_velocity);
        this.rb.velocity.x = - world_velocity.x;
        this.rb.velocity.z = - world_velocity.z;

        Howler.pos(this.player_cam.position.x, this.player_cam.position.y, this.player_cam.position.z);
	}

}