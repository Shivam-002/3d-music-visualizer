import * as CANNON from "cannon-es";
import create_rb from "../utils/Utils";
import { get_collider, get_model } from "../utils/modelloader";
import { add_interactable_objects } from "../Handler";
import AudioSource from "../AudioSource";
// import { edit_hint, show_hint } from "../..";

const hint_text = document.getElementById("hint-text");

export default class BoomBox {
    constructor(position=CANNON.Vec3.ZERO,quaternion=CANNON.Quaternion.ZERO){
        this.model_name = "boom_box";
        this.model = get_model(this.model_name);
        this.model.position.set(position.x,position.y,position.z);
        this.hinted = false;
        this.rb = create_rb(
            get_collider(this.model_name),
            {
                mass : 50,
                position: position,
                quaternion : quaternion,
                type : CANNON.Body.KINEMATIC,
                fixedRotation : true,
            }
        );
        this.audio_sources = []
        add_interactable_objects(this);
    }

    add_audio_source(audio_source){
        this.audio_sources.push(audio_source);
    }

    build(scene,physics_world){
        scene.add(this.model);
        physics_world.addBody(this.rb)
        return this;
    }

    update(){
        this.model.position.copy(this.rb.position);
        this.model.quaternion.copy(this.rb.quaternion);
    }

    on_hover(){ 
        const instruction = (this.is_playing) ? "stop" : "play";
        const hint = "Press Y to "+instruction+" song.";
        this.edit_hint(hint);
        this.show_hint();
    }
    on_exit(){
        this.hide_hint();
    }
    edit_hint(hint){
        hint_text.textContent = hint;
    }
    
    show_hint(){
        hint_text.style.display = 'block';
    }
    
    hide_hint(){
        hint_text.style.display = 'none';
    }
    on_interact(){
        this.is_playing = !this.is_playing;
        if(this.is_playing) {
            for(const audio_source of this.audio_sources){
                audio_source.play();
            }
            
            // for(const audio_source of this.audio_sources){
            //     audio_source.start();
            // }
            const sync_play = function(){
                console.log(this.audio_sources);
                this.audio_sources[0].song.seek(0);
                this.audio_sources[1].song.seek(0);
            }
            sync_play();

        }else{
            for(const audio_source of this.audio_sources){
                audio_source.stop();
            }
        }
    }
}