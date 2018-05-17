import {ILHFScene} from "../../org/lhf/webgl/core/SceneMana";
import {
    AmbientLight, AxesHelper, BackSide, DoubleSide, Material, Mesh, MeshBasicMaterial, MeshPhongMaterial, Object3D,
    Scene,
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
        this.citys=this.resourcesMana.getModels('xingxiu');
        /*let guanmu:Mesh=this.citys.getObjectByName('daguan_6_mesh_0_110207') as Mesh;
        console.log('citys:',this.citys);
        if(guanmu){
            let p:MeshPhongMaterial=guanmu.material as MeshPhongMaterial;
            console.log('guanmu:',guanmu);
            if(p){
                p.transparent=true;
                //p.alphaMap=p.map;
            }
        }*/
        this.citys.traverse(function(obj:Object3D){

            let guanmu:Mesh=obj as Mesh;
            if(guanmu){
                let p:MeshPhongMaterial=guanmu.material as MeshPhongMaterial;
                console.log('guanmu:',guanmu);
                if(p){
                    p.transparent=true;
                    //p.alphaMap=p.map;
                }
            }

        });

        this.add(this.citys);
    }

    private initEnv():void{
        this.add(new AxesHelper(1000));
        this.add(new AmbientLight(0xFFFFFF,1));
        let skyGeo:SphereBufferGeometry=new SphereBufferGeometry(100000,32,16);
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