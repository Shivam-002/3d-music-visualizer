import * as CANNON from "cannon-es";
import create_rb from "../utils/Utils";
import { get_collider, get_model } from "../utils/modelloader";
import { add_interactable_objects } from "../Handler";
import AudioSource from "../AudioSource";

const hint_text = document.getElementById("hint-text");

export default class Speaker {
    constructor(listener,boom_box,is_clone=false,position=CANNON.Vec3.ZERO,quaternion=CANNON.Quaternion.ZERO){
        this.model_name = "speaker";
        if(is_clone) this.model = get_model(this.model_name).clone();
        else this.model = get_model(this.model_name).clone();
        this.model.position.set(position.x,position.y,position.z);
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
        this.audio_source = new AudioSource(this.model,listener);
        boom_box.add_audio_source(this.audio_source);

        add_interactable_objects(this);
        
        document.addEventListener( 'wheel', (event)=>{
            const amount = (event.deltaY>0) ? .1 : -.1;
            var volume = this.audio_source.song.gain.gain.value + amount;
            volume = Math.min(1, Math.max(0, volume));
            this.audio_source.song.gain.gain.value = volume;
            console.log(volume);
            this.hinted = true;
        },false);
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
        let hint;
        if(!this.hinted){
            hint = "Scroll to change volume!";
        } 
        else {
            hint = "Volume : " + this.audio_source.gain.gain.value;
        }
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
    }
}