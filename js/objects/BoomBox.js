import * as CANNON from "cannon-es";
import create_rb from "../utils/Utils";
import { get_collider, get_model } from "../utils/modelloader";
import { add_interactable_objects } from "../Handler";
import Hint from "../utils/Hint";

export default class BoomBox {
    constructor(position=CANNON.Vec3.ZERO,quaternion=CANNON.Quaternion.ZERO){

        this.model_name = "boom_box";

        this.model = get_model(this.model_name);
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

        this.speakers = []

        this.on_key_down = (event) =>{
            switch (event.code) {
                case 'KeyR':
                    this.replay_song();
                    break;
    
                case 'KeyP':
                    this.play_song();
                    break;
    
            }
        }

        this.on_key_down = this.on_key_down.bind(this);
        add_interactable_objects(this);


        this.model.position.copy(this.rb.position);
        this.model.quaternion.copy(this.rb.quaternion);
    }

    add_speaker(speaker){
        this.speakers.push(speaker);
    }

    build(scene,physics_world){
        scene.add(this.model);
        physics_world.addBody(this.rb)
        return this;
    }

    seek(amount){ 
        for(const speaker of this.speakers){
            speaker.seek(amount);
        }
    }
    on_enter(){
        document.addEventListener('keydown', this.on_key_down, false);
        this.display_hint();
    }
    on_exit(){
        Hint.hide();
        document.removeEventListener('keydown', this.on_key_down, false);
    }
    display_hint(){
        const instruction = (this.is_playing) ? "stop" : "play";
        const hint = `Press P to ${instruction} song.<br>
                      Press R to replay the song.`;

        
        Hint.edit(hint);
        Hint.show();
    }

    play_song(){
        this.is_playing = !this.is_playing;
        if(this.is_playing) {
            for(const speaker of this.speakers){
                speaker.play();
            }

        }else{
            for(const speaker of this.speakers){
                speaker.pause();
            }
        }


    }

    replay_song(){
        this.is_playing = true;
        for(const speaker of this.speakers){
            speaker.stop();
        }
        
        for(const speaker of this.speakers){
            speaker.play();
        }
    }


}