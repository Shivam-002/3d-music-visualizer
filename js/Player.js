import * as THREE from 'three';

import * as CANNON from "cannon-es";
import { get_collider } from "./utils/modelloader";
import create_rb from "./utils/Utils";
import PhysicsHandler from "./PhysicsHandler";
import { delta_time } from "./Time";
import { interactable_objects } from './Handler';

const player_cam_offset = new CANNON.Vec3(0, 2, 0);
const player_reach = 2;


export default class Player{
    constructor(physics_world,player_cam,position=CANNON.Vec3.ZERO,quaternion=CANNON.Quaternion.ZERO){
        this.model_name = "player";
        this.player_cam = player_cam;
        this._vector = new CANNON.Vec3();
        this.moving = false;
        this.move_speed = 1500;
        this.ray_caster = new THREE.Raycaster();
        this.ray_caster.far = player_reach;
        this.audio_listener = new THREE.AudioListener();
        this.player_cam.add(this.audio_listener);
        this.rb = create_rb(
            get_collider(this.model_name),
            {
                mass : 75,
                position: position,
                quaternion : quaternion,
                type : CANNON.Body.DYNAMIC,
                fixedRotation : true,
            }
        );
        physics_world.addBody(this.rb);
        PhysicsHandler.get_instance().add_physics_object(this);
    }
    create_input_events(document){
        document.addEventListener('keydown', this.on_key_down, false)
        document.addEventListener('keyup', this.on_key_up, false)
    }

    on_key_up = function (event) {
        switch (event.code) {
            case 'KeyW':
            case 'KeyA':
            case 'KeyS':
            case 'KeyD':
                this.moving = false;
                break
        }
    }
    on_key_down = (event) => {
        this.moving = true;
        switch (event.code) {
            case 'KeyW' || 'up':
                this.move_forward(1);
                break;
            case 'KeyA' || 'left':
                this.move_left(1);
                break;
            case 'KeyS' || 'right':
                this.move_forward(-1);
                break;
            case 'KeyD' || 'up':
                this.move_left(-1);
                break;
            default:
                this.moving = false;
        }
    }
    
    fixed_update(){
        // console.log(delta_time);

        this.handle_interactions();

        this.player_cam.position.copy(this.rb.position.vadd(player_cam_offset));
        // this.rb.quaternion.copy(this.player_cam.quaternion);

        const playerQuaternion = this.rb.quaternion;
        const cameraQuaternion = this.player_cam.quaternion;

        // Copy the x and z axes from the camera's quaternion to the player's quaternion
        playerQuaternion.y = cameraQuaternion.y;

    }

    handle_interactions(){
        const origin = this.player_cam.position.clone();
        const cam_direction = (new THREE.Vector3(0,0,-1)).applyQuaternion(this.player_cam.quaternion).normalize();
        
        this.ray_caster.set(origin,cam_direction);

        const intersections = this.ray_caster.intersectObjects(interactable_objects, true);

        if(intersections.length > 0){
            const first_intersection = intersections[0];
            console.log("Working");
        }
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
	}

	move_left (direction) {

        const distance = this.move_speed * delta_time * direction; 


        this._vector.set(distance,0,0);
        
        let world_velocity = this.rb.quaternion.vmult(this._vector);
        // console.log("World Velocity : ",world_velocity);
        this.rb.velocity.x = - world_velocity.x;
        this.rb.velocity.z = - world_velocity.z;

	}
}