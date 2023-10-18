import * as CANNON from "cannon-es";
import create_rb from "../utils/Utils";
import { get_collider, get_model } from "../utils/modelloader";


export default class WatchTower {
    constructor(position=CANNON.Vec3.ZERO,quaternion=CANNON.Quaternion.ZERO){
        this.model_name = "watch_tower";
        this.model = get_model(this.model_name);
        this.model.position.set(position.x,position.y,position.z);
        this.rb = create_rb(
            get_collider(this.model_name),
            {
                mass : 100,
                position: position,
                quaternion : quaternion,
                type : CANNON.Body.STATIC
            }
        );
    }
    build(scene,physics_world){
        scene.add(this.model);
        physics_world.addBody(this.rb)
    }
}