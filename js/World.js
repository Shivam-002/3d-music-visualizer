import Beach from "./objects/Beach";
import BoomBox from "./objects/BoomBox";
import House from "./objects/House";
import Ocean from "./objects/Ocean";
import SmallTower from "./objects/SmallTower";
import WatchTower from "./objects/WatchTower";
import * as CANNON from "cannon-es";
import Props from "./objects/props";
import Speaker from "./objects/Speaker";

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
        const small_tower = new SmallTower(new CANNON.Vec3(0,-1,-5)).build(this.scene,this.physics_world);
        this.objects.push(small_tower);



        //Boombox
        const boom_box = new BoomBox(new CANNON.Vec3(0,0,-1)).build(this.scene,this.physics_world);
        this.objects.push(boom_box);

        //Speaker
        const speaker_1 = new Speaker(
                                        this.listener,
                                        boom_box,
                                        false,
                                        new CANNON.Vec3(.5,0,-1.7),
                                    )
                                    .build(this.scene,this.physics_world);

        this.objects.push(speaker_1);

        //Speaker
        const speaker_2 = new Speaker(
                                        this.listener,
                                        boom_box,
                                        false,
                                        new CANNON.Vec3(.5,0.1,2),
                                        new CANNON.Quaternion(0.688942,0,-0,0)
                                    )
                                    .build(this.scene,this.physics_world);

        const rotationQuaternion = new CANNON.Quaternion();
        rotationQuaternion.setFromAxisAngle(new CANNON.Vec3(0, 1, 0), Math.PI / 2); // Rotate 90 degrees (PI/2 radians)
        
        // Apply the rotation to the body's quaternion
        speaker_2.rb.quaternion.copy(rotationQuaternion);
        console.log("Quat : ",speaker_2.rb.quaternion);
        this.objects.push(speaker_2);

        
        //House
        const house = new House().build(this.scene,this.physics_world,new CANNON.Vec3(0,0,0));
        // this.objects.push(house);

        //Props
        const props = new Props().build(this.scene,this.physics_world);


    }

    update_objects(){
            for (const object of this.objects){
            object.update();
        }
    }
}