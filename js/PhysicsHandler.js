
const physics_objects = []   

export default class PhysicsHandler{

    constructor(){
    }
    set_physics_world(physics_world){
        this.physics_world = physics_world;
        this.physics_world.addEventListener('postStep',() => this.fixed_update());
    }
    add_physics_object(physics_object){
        physics_objects.push(physics_object);
    }

    fixed_update(){
        for(const physics_object of physics_objects){
            physics_object.fixed_update();
        }
    }
    static get_instance(){
        if(!this.instance){
            this.instance = new PhysicsHandler();
        }
        return this.instance;
    }
}