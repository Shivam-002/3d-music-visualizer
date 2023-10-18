import Beach from "./objects/Beach";
import Ocean from "./objects/Ocean";
import SmallTower from "./objects/SmallTower";
import WatchTower from "./objects/WatchTower";
import * as CANNON from "cannon-es";

export default class World{
    constructor(scene,physics_world,listener){
        this.scene = scene;
        this.physics_world = physics_world;
        this.listener = listener;
        this.objects = [];
    }

    build_scene(){
        
        //Ocean
        // const ocean = new Ocean().build(this.scene);

        //Beach
        // const beach = new Beach().build(this.scene,this.physics_world);

        //Watch Tower
        // const watch_tower = new WatchTower(new CANNON.Vec3(0,1,5)).build(this.scene,this.physics_world);

        
        //Small Tower
        const small_tower = new SmallTower(this.listener,new CANNON.Vec3(0,2,-5)).build(this.scene,this.physics_world);

        
    }

    update_objects(){
        for (const object of this.objects){
            object.update();
        }
    }
}