import * as CANNON from "cannon-es";
import create_rb, { SONG_DIR } from "../utils/Utils";
import { get_collider, get_model } from "../utils/modelloader";
import { add_interactable_objects } from "../Handler";
import Hint from "../utils/Hint";


export default class Sign {
    constructor(boom_box,is_clone,sign_type,position=CANNON.Vec3.ZERO,quaternion=CANNON.Quaternion.ZERO){

        this.model_name = "sign";

        if(is_clone) this.model = get_model(this.model_name).clone();
        else this.model = get_model(this.model_name);

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

        this.on_click = () =>{
            if(this.sign_type==SONG_DIR.NEXT){
                this.next();
            }else{
                this.prev();
            }
        }

        this.boom_box = boom_box;
        this.sign_type = sign_type;

        this.hinted = false;

        this.on_click = this.on_click.bind(this);
        add_interactable_objects(this);


        this.model.position.copy(this.rb.position);
        this.model.quaternion.copy(this.rb.quaternion);
    }

    build(scene,physics_world){
        scene.add(this.model);
        physics_world.addBody(this.rb)
        return this;
    }

    on_enter(){
        document.addEventListener('click', this.on_click, false);
        this.display_hint();
    }
    on_exit(){
        Hint.hide();
        document.removeEventListener('click', this.on_click, false);
    }

    next(){
        this.boom_box.next_song();
    }
    prev(){
        this.boom_box.prev_song();
    }

    display_hint(){
        const instruction = (this.sign_type == SONG_DIR.NEXT) ? "next" : "previous";
        const hint = `Click to play ${instruction} song.`;
        
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
