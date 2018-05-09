import {ILHFScene} from "../../org/lhf/webgl/core/SceneMana";
import {
    AmbientLight, AxesHelper, BackSide, DoubleSide, Material, Mesh, MeshBasicMaterial, Object3D, Scene,
    SphereBufferGeometry
} from "three";
import ResourcesMana from "../../org/lhf/webgl/resouces/ResourcesMana";

class MainScene extends Scene implements ILHFScene{
    enabled:boolean=true;
    resourcesMana:ResourcesMana;
    sky:Mesh;
    citys:Object3D;
    constructor(){
        super();

        this.init();
    }

    private init():void{
        this.resourcesMana=ResourcesMana.getInstance();
        this.initEnv();
        this.initCitys();
    }

    private initCitys():void{
        this.citys=this.resourcesMana.getModels('luoyang');
        this.citys.traverse((obj:Object3D)=>{
            let mesh:Mesh=(obj as Mesh);
            if(mesh){
                let material:Material=(mesh.material as Material);
                if(material) {
                    material.side = DoubleSide;
                }
            }
        });
        this.add(this.citys);
    }

    private initEnv():void{
        this.add(new AxesHelper(1000));
        this.add(new AmbientLight(0xFFFFFF,2));
        let skyGeo:SphereBufferGeometry=new SphereBufferGeometry(1000,32,16);
        let skyMaterial:MeshBasicMaterial=new MeshBasicMaterial({
            color:0xFFFFFF,
            side:BackSide,
            map:this.resourcesMana.getTexture('sky')
        });
        this.sky=new Mesh(skyGeo,skyMaterial);
        this.add(this.sky);
    }

    update(){

    }

}
export {MainScene};