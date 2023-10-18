import Beach from "./objects/Beach";
import BoomBox from "./objects/BoomBox";
import House from "./objects/House";
import Ocean from "./objects/Ocean";
import SmallTower from "./objects/SmallTower";
import WatchTower from "./objects/WatchTower";
import * as CANNON from "cannon-es";
import Props from "./objects/props";

export default class World{
    constructor(scene,physics_world,listener){
        this.scene = scene;
        this.physics_world = physics_world;
        this.listener = listener;
        this.objects = [];
    }

    build_scene(){
        
        //Ocean
        const ocean = new Ocean().build(this.scene);

        //Beach
        const beach = new Beach().build(this.scene,this.physics_world,new CANNON.Vec3(0,5,0));
        this.objects.push(beach);

        //Watch Tower
        // const watch_tower = new WatchTower(new CANNON.Vec3(0,1,5)).build(this.scene,this.physics_world);

        
        //Small Tower
        const small_tower = new SmallTower(new CANNON.Vec3(0,2,-5)).build(this.scene,this.physics_world);
        this.objects.push(small_tower);

        //Boombox
        const boom_box = new BoomBox(this.listener,new CANNON.Vec3(0,0,-1)).build(this.scene,this.physics_world);
        this.objects.push(boom_box);

        //House
        const house = new House().build(this.scene,this.physics_world,new CANNON.Vec3(0,0,0));
        this.objects.push(house);

        //Props
        const props = new Props().build(this.scene,this.physics_world);
        this.objects.push(props);
    }

    update_objects(){
            for (const object of this.objects){
            object.update();
        }
    }
}