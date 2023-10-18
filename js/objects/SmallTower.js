import * as CANNON from "cannon-es";
import create_rb from "../utils/Utils";
import { get_collider, get_model } from "../utils/modelloader";
import { add_interactable_objects } from "../Handler";
import AudioSource from "../AudioSource";


export default class SmallTower {
    constructor(listener,position=CANNON.Vec3.ZERO,quaternion=CANNON.Quaternion.ZERO){
        this.model_name = "small_tower";
        this.model = get_model(this.model_name);
        this.model.position.set(position.x,position.y,position.z);
        this.rb = create_rb(
            get_collider(this.model_name),
            {
                mass : 5000,
                position: position,
                quaternion : quaternion,
                type : CANNON.Body.DYNAMIC
            }
        );

        this.audio_source = new AudioSource(this.model,listener);
        add_interactable_objects(this.model);
        
    }
    build(scene,physics_world){
        scene.add(this.model);
        physics_world.addBody(this.rb)
    }
}