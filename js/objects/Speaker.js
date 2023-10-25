
import * as THREE from 'three';
import * as CANNON from "cannon-es";

import { get_collider, get_model } from "../utils/modelloader";
import { add_interactable_objects } from "../Handler";
import Hint from "../utils/Hint";
import AudioHandler from '../AudioHandler';
import create_rb from '../utils/Utils';

const DEFAULT_VOLUME = .1;

export default class Speaker {
    constructor(boom_box,is_clone=false,position,quaternion){
        
        this.model_name = "speaker";
        
        if(is_clone) this.model = get_model(this.model_name).clone();
        else this.model = get_model(this.model_name);
        
        if(!position) position = new CANNON.Vec3();
        if(!quaternion) quaternion = new CANNON.Quaternion();
        
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

        this.is_clone = is_clone;

        this.rb.position.copy(position);
        this.model.position.copy(this.rb.position);

        this.rb.quaternion.copy(quaternion);
        this.model.quaternion.copy(quaternion);

        console.log("Speaker pos : ",this.model.position," rb : ", this.rb.position);
        console.log("Speaker quad : ",this.model.quaternion," rb : ", this.rb.quaternion);
        boom_box.add_speaker(this);

        this.volume = DEFAULT_VOLUME
        this.song = new Howl({
            src : AudioHandler.get_songs(),
            volume : this.volume
        })

        this.id = this.song.play();

        this.song.pause();

        this.song.pannerAttr({
            panningModel: 'HRTF',
            refDistance: 5,
            rolloffFactor: 2,
            distanceModel: 'exponential'
          }, this.id);

        this.song.pos(this.rb.position.x,this.rb.position.y,this.rb.position.z,this.id);

        this.on_scroll = (event)=>{
            const amount = (event.deltaY<0) ? .01 : -.01;

            this.volume += amount;
            this.volume = Math.max(0, Math.min(1, this.volume));
            this.song.volume(this.volume,this.id);

            this.hinted = true;
            this.display_hint();
        }

        this.on_scroll = this.on_scroll.bind(this);
        add_interactable_objects(this);

        

    }

    play(){
        this.song.play();
    }
    stop(){
        this.song.stop();
    }
    pause(){
        this.song.pause();
    }
    seek(amount){
        const current_time = this.song.seek();
        var new_time = current_time + amount;
  
        const duration = this.song.duration();
        new_time = Math.max(0, Math.min(new_time, duration));
        
        this.song.seek(new_time);
    }

    build(scene,physics_world){
        scene.add(this.model);
        physics_world.addBody(this.rb)
        return this;
    }

    update(){

    }

  
    on_enter(){
        document.addEventListener( 'wheel', this.on_scroll,false);
        this.display_hint();
    }

    on_exit(){
        document.removeEventListener( 'wheel', this.on_scroll,false);
        Hint.hide();
    }

    display_hint(){
        let hint;
        if(!this.hinted){
            hint = "Scroll to change volume!";
        } 
        else {
            // const vol = Math.round(this.audio_source.song.gain.gain.value*100);
            hint = "Volume : " +Math.round(this.volume * 100) + "%";
        }
        Hint.edit(hint);
        Hint.show();
    }
}