import * as CANNON from "cannon-es";
import create_rb from "../utils/Utils";
import { get_collider, get_model } from "../utils/modelloader";



export default class Props {
    constructor(position=CANNON.Vec3.ZERO,quaternion=CANNON.Quaternion.ZERO){
        this.model_name = "props";
        this.model = get_model(this.model_name);
        this.model.position.set(position.x,position.y,position.z);
        const collider = get_collider(this.model_name);
        this.rb = create_rb(
            collider,
            {
                mass : 500,
                position: position,
                quaternion : quaternion,
                type : CANNON.Body.KINEMATIC
            }
        );        
    }
    build(scene,physics_world){
        scene.add(this.model);
        physics_world.addBody(this.rb)
        return this;
    }
    update(){

    }
}