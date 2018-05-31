import {
    AdditiveBlending, BackSide, DoubleSide, Geometry, Mesh, MeshBasicMaterial, RepeatWrapping, Texture,
    Vector2
} from "three";

/** * 流动效果 */
class FlowEffect extends Mesh{
    enabled:boolean=false;
    material:MeshBasicMaterial;
    params:FlowEffectParameters;
    texture:Texture;
    offset:Vector2=new Vector2();
    constructor(geo:Geometry,texture:Texture,params?:FlowEffectParameters){
        super(geo);

        //属性默认值
        params = params ? params : {};
        params.repetX=params.repetX||1;
        params.repetY=params.repetY||1;
        params.direct=params.direct||"X";
        params.offset_step=params.offset_step||.1;
        this.params=params;

        //材质重复
        this.texture=texture;
        texture.repeat.set(params.repetX,params.repetY);
        texture.wrapT=texture.wrapS=RepeatWrapping;

        this.init();
    }

    private init():void{
        this.material=new MeshBasicMaterial({
            color:0xFFFFFF,
            map:this.texture,
            depthWrite:false,
            blending:AdditiveBlending,
            transparent:true
        });
        this.material.needsUpdate=true;
    }

    update(dt:number):void{
        this.texture.offset.copy(this.offset);
        if(this.params.direct=="Y"){
            this.offset.y+=this.params.offset_step;
            if(this.offset.y>this.params.repetY){
                this.offset.y=0;
            }
        }else{
            this.offset.x+=this.params.offset_step;
            if(this.offset.x>this.params.repetX){
                this.offset.x=0;
            }
        }
    }
}

interface FlowEffectParameters{
    repetX?:number;
    repetY?:number;
    direct?:"X"|"Y";
    offset_step?:number;
}

export {FlowEffect};