import {EventDispatcher} from "three";
import RenderMain from "./RenderMain";
/**
 * 场景管理
 */
class SceneMana extends EventDispatcher{
    renderMain:RenderMain;
    domContainer:HTMLElement;
    curScene:ILHFScene;
    scenes:any={};
    constructor(main:RenderMain,domContainer:HTMLElement){
        super();
        this.domContainer=domContainer;
        this.renderMain=main;
    }

    changeScene(scene:string='main'){
        let getScene:ILHFScene=null;
        let renderScene:THREE.Scene=null;
        getScene=this.getScene(scene);
        if(!getScene){
            throw new Error("场景("+scene+")创建失败!");
        }
        this.curScene=getScene;
        renderScene=(getScene as THREE.Scene);
        if(!renderScene){
            throw new Error("场景("+scene+") Base 非 Three.js THREE.Scene base!");
        }
        this.renderMain.scene=renderScene;
        this.renderMain.enabled=true;
    }

    getScene(scene:string):ILHFScene{
        let iscene:ILHFScene=null;
        iscene=this.scenes[scene];
        if(!iscene){
            throw new Error(`没有场景<<${scene}>>`);
        }
        return iscene;
    }

    setScene(name:string,scene:ILHFScene):void{
        this.scenes[name]=scene;
    }

    updata(){
        if(this.curScene){
            this.curScene.update();
        }
    }
}

interface ILHFScene extends THREE.Scene{
    enabled:boolean;
    update():void;
}

export {SceneMana,ILHFScene};
export default SceneMana;