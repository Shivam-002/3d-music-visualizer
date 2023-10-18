import * as CANNON from "cannon-es";
import create_rb from "../utils/Utils";
import { get_collider, get_model } from "../utils/modelloader";

export default class Beach {
    constructor(){
        this.model_name = "beach";
        this.model = get_model(this.model_name);
        this.rb = create_rb(
            get_collider(this.model_name),
            {
                mass : 1000,
                type : CANNON.Body.STATIC
            }
        );
    }
    build(scene,physics_world){
        scene.add(this.model);
        physics_world.addBody(this.rb)
    }
}