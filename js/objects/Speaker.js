
import * as THREE from 'three';
import * as CANNON from "cannon-es";

import { get_collider, get_model } from "../utils/modelloader";
import { add_interactable_objects } from "../Handler";
import Hint from "../utils/Hint";
import create_rb, { SONG_DIR } from '../utils/Utils';

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

        // console.log("Speaker pos : ",this.model.position," rb : ", this.rb.position);
        // console.log("Speaker quad : ",this.model.quaternion," rb : ", this.rb.quaternion);
        boom_box.add_speaker(this);

        this.volume = DEFAULT_VOLUME;

        this.playlist = [
            {
                title : "Faded By Alan Walker",
                file : 'fade',
                howl : null,
            },
            {
                title : "Play Date",
                file : 'play_date',
                howl : null,
            },
        ];
        this.index = 0;
        this.id = 0;

        this.on_scroll = (event)=>{
            const amount = (event.deltaY<0) ? .01 : -.01;
            this.change_volume(amount);
        }

        this.on_scroll = this.on_scroll.bind(this);
        add_interactable_objects(this);

        

    }
    play(index){
        var song;

        index = typeof index === 'number' ? index : this.index;
        var data = this.playlist[index];

        if (data.howl) {
            song = data.howl;
        } else {
            song = data.howl = new Howl({
                src: ['./assets/songs/' + data.file + '.mp3'],

            });
        }
        this.id = song.play();
        song.volume(this.volume,this.id);
        song.pos(this.rb.position.x,this.rb.position.y,this.rb.position.z,this.id); 
        song.pannerAttr({
            panningModel: 'HRTF',
            refDistance: 5,
            rolloffFactor: 2,
            distanceModel: 'exponential'
        },this.id);
        this.index = index;
    }
    pause(){
        var song = this.playlist[this.index].howl;
        song.pause();
    }

    skip(direction){
        var index = 0;
        if (direction === SONG_DIR.PREV) {
          index = this.index - 1;
          if (index < 0) {
            index = this.playlist.length - 1;
          }
        } else {
          index = this.index + 1;
          if (index >= this.playlist.length) {
            index = 0;
          }
        }

        this.skip_to(index);
    }
    skip_to(index){
        if (this.playlist[this.index].howl) {
            this.playlist[this.index].howl.stop();  
        }
    
        this.play(index);
    }

    change_volume(amount=0){

        this.volume += amount;
        this.volume = Math.max(0, Math.min(1, this.volume));

        const song = this.playlist[this.index].howl;
        song.volume(this.volume,this.id);

        this.hinted = true;
        this.display_hint();
    }

    seek(amount){
        const song = this.playlist[this.index].howl;
        const current_time = song.seek();        
        var new_time = current_time + amount;
        const duration = song.duration();
        new_time = Math.max(0, Math.min(new_time, duration));
        
        song.seek(new_time);
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