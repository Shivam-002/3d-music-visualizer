import * as THREE from 'three';     
import * as CANNON from "cannon-es";
import create_rb from "../utils/Utils";
import { get_animations, get_collider, get_model } from "../utils/modelloader";
import { add_interactable_objects } from "../Handler";
import Hint from '../utils/Hint';


export default class Clock {
    constructor(boom_box,position=CANNON.Vec3.ZERO,quaternion=CANNON.Quaternion.ZERO){
        this.model_name = "clock";

        const model = get_model(this.model_name);
        this.model = model;

        this.hinted = false;
        const collider = get_collider(this.model_name);
        this.rb = create_rb(
            collider,
            {
                mass : 50,
                position: position,
                quaternion : quaternion,
                type : CANNON.Body.KINEMATIC,
                fixedRotation : true,
            }
        );

        this.boom_box = boom_box;
        this.clock = new THREE.Clock();

        this.mixer = new THREE.AnimationMixer(this.model);
        this.clock_animations = get_animations(this.model_name);
        this.action = this.mixer.clipAction(this.clock_animations[0]);

        this.animation_duration = 60;
                
        add_interactable_objects(this);

        this.on_scroll = (event) =>{

            const amount = (event.deltaY<0) ? 1 : -1;
            this.skip(amount);
        }

        this.on_key_down = (event) =>{
            switch (event.code) {
                case 'KeyN':
                    this.skip(30);
                    break;
    
                case 'KeyP':
                    this.skip(-30);
                    break;
    
            }
        }

        this.on_scroll = this.on_scroll.bind(this);
        this.on_key_down = this.on_key_down.bind(this);
        this.play_clock_animation();

    }

    skip(amount){
        this.clock.elapsedTime += amount;
        this.mixer.update(amount);
        this.boom_box.seek(amount);
    }

    build(scene,physics_world){
        scene.add(this.model);
        physics_world.addBody(this.rb)
        return this;
    }

    update(){
        this.mixer.update(this.clock.getDelta());
    }

    get_time(){
        
    }
    play_clock_animation(){
        this.action.play();
    }

    display_hint(){ 
        const hint = `Scroll to Seek Song.<br>
                      Press N to skip 30 sec.<br>
                      Press P to revert 30 sec.`
        
        Hint.edit(hint);
        Hint.show();
    }
    on_enter(){
        document.addEventListener( 'wheel', this.on_scroll,false);
        document.addEventListener('keydown',this.on_key_down,false);
        this.display_hint();
    }
    on_exit(){
        document.removeEventListener( 'wheel', this.on_scroll,false);
        document.removeEventListener('keydown',this.on_key_down,false);

        Hint.hide();
    }

    on_interact(){

    }
}