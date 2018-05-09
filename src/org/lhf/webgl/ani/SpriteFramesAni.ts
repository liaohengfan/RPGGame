/**
 * 精灵图序列帧
 * 2018.03.01
 */
import {FileLoader, ImageLoader, LinearFilter, Sprite, SpriteMaterial, Texture} from 'three';
import {IJSONTexturePack, IJSONTexturesFrame} from "./JSONTextures";

class SpriteFramesAni extends Sprite{
    iniPath:string;
    texturePath:string;
    framePacks:IJSONTexturePack;

    image:HTMLImageElement;
    canvas:HTMLCanvasElement;
    context:CanvasRenderingContext2D;
    enable:Boolean=false;
    textures:Texture[]=[];
    spriteMaterial:SpriteMaterial;
    constructor(json_:string,textures_:string){
        super();

        this.spriteMaterial=new SpriteMaterial({
            depthTest:false
            //depthWrite:false
        });
        this.material=this.spriteMaterial;

        this.iniPath=json_;
        this.texturePath=textures_;

        let jsonLoader:FileLoader=new FileLoader();
        jsonLoader.load(json_,(res_:string)=>{
            this.framePacks=(JSON.parse(res_) as IJSONTexturePack);
            let imageLoader:ImageLoader=new ImageLoader();
            imageLoader.load(textures_,(img:HTMLImageElement)=>{
                this.image=img;
                this.resComplete();
            });
        });
    }

    /**     * 解析帧     */
    parseFrames():void{
        //创建canvas解析
        this.canvas=document.createElement('canvas');
        this.canvas.width=this.framePacks.meta.size.w;
        this.canvas.height=this.framePacks.meta.size.h;
        this.context=this.canvas.getContext('2d');
        this.context.drawImage(this.image,0,0);


        //创建序列
        let packFrames:IJSONTexturesFrame[]=this.framePacks.frames;
        let frame_: IJSONTexturesFrame =null;
        let texture_:Texture=null;
        let imageData:ImageData=null;
        let ofx:number=0;
        let ofy:number=0;
        for (let i = 0; i < packFrames.length; i++) {
            frame_= packFrames[i];
            texture_=new Texture();
            ofx=frame_.spriteSourceSize.x;
            ofy=frame_.spriteSourceSize.y;
            imageData=this.context.getImageData(frame_.frame.x-ofx,frame_.frame.y-ofy,frame_.sourceSize.w,frame_.sourceSize.h);
            texture_.image=imageData;
            texture_.minFilter=LinearFilter;
            texture_.needsUpdate=true;
            this.textures.push(texture_);
        }
        this.enable=true;
        let i:number=0;
        this.skipFrame(0);
        let max:number=this.textures.length-1;
        let fps:number=60;
        let delay:number=1000/60;
        //delay=200;
        setInterval(()=>{
            i++;
            if(i>max){
                i=0;
            }
            this.skipFrame(i);
        },delay);
    }

    skipFrame(i:number):void{
        this.spriteMaterial.map= this.textures[i];
    }

    /**     * 资源准备完成     */
    resComplete():void{
        this.parseFrames();
    }
}
export {SpriteFramesAni}