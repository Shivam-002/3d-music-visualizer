import * as CANNON from "cannon-es";
import create_rb from "../utils/Utils";
import { get_collider, get_model } from "../utils/modelloader";

export default class Beach {
    constructor(position=CANNON.Vec3.ZERO,quaternion=CANNON.Quaternion.ZERO){
        this.model_name = "beach";
        this.model = get_model(this.model_name);
        this.rb = create_rb(
            get_collider(this.model_name),
            {
                mass : 10000,
                type : CANNON.Body.KINEMATIC,
                position : position,
                quaternion : quaternion,
            }
        );
    }
    build(scene,physics_world){
        scene.add(this.model);
        physics_world.addBody(this.rb);
        return this;
    }

    update(){

    }
}