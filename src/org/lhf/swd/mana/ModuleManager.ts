/** * 模块管理 */
import {DragModule} from "../graphics/DragModule";
import {SWDEvents} from "../events/SWDEvents";
import {LHFTools} from "../../tools/LHFTools";
import {ILHFEventType} from "../../core/LHFEventDispatcher";
import {Vec2} from "../core/Vec2";

class ModuleManager{

    private static _instance:ModuleManager;
    static getInstance():ModuleManager{
        if(!ModuleManager._instance){
            new ModuleManager();
        }
        return ModuleManager._instance;
    }
    modules:DragModule[]=[];
    constructor(){
        if(ModuleManager._instance){
            throw new Error("模块管理为单例模式")
        }
        ModuleManager._instance=this;
    }

    /**     * 删除选中的模块     */
    deleteSelModule():void{
        LHFTools.msg('delete sel module');
        let i:number=0;
        let module:DragModule;
        for (i; i < this.modules.length; i++) {
            module = this.modules[i];
            if(module.sel){
                module.dispose();
            }
        }
    }



    /**     * 移除所有选中     */
    unSelStatus():void{
        let i:number=0;
        let module:DragModule;
        for (i; i < this.modules.length; i++) {
            module = this.modules[i];
            module.sel=false;
        }
    }

    /**     * 移除所有锚点激活状态     */
    unAllAnchor=()=>{
        let i:number=0;
        let module:DragModule;
        for (i; i < this.modules.length; i++) {
            module = this.modules[i];
            module.unAnchor();
        }
    };

    /**     * 移除临时锚点激活     */
    unTempAllAnchor=()=>{
        let i:number=0;
        let module:DragModule;
        for (i; i < this.modules.length; i++) {
            module = this.modules[i];
            if(module.anchorStatus_t) {
                LHFTools.msg('un TempAll anchor');
                module.unAnchor();
            }
        }
    };


    /**     * 拖动结束     */
    dragEnd=(e:ILHFEventType)=>{
        //子集判断
        let target:DragModule=(e.target as DragModule);
        if(!target)return;
        //位置
        let pos:Vec2=new Vec2();
        pos.x=target.position.x+target.w_position.x;
        pos.y=target.position.y+target.w_position.y;

        //宽高
        let size:Vec2=new Vec2();
        size.copy(target.size);

        //比对是否可以添加为子集
        let i:number=0;
        let l:number=this.modules.length;
        let targetModule:DragModule=null;
        let lookParentModule:DragModule=null;
        for (i; i < l; i++) {
            targetModule=this.modules[i];
            if(targetModule==target){
                continue;
            }
            if(targetModule.checkAddChild(target,pos,size)){
                lookParentModule=targetModule;
            }
        }

        //如果在当前父子集移动则退出
        if(target.parent==lookParentModule)return;

        //在父级中移除
        if(target.parent)target.parent.removeChild(target);

        //没有有目标父级则返回
        if(!lookParentModule)return;
        let x:number=20;
        let y:number=(lookParentModule.childs.length*50)+50;
        //重新设置父级
        lookParentModule.addChild(target);
        target.position=new Vec2(x,y);
        lookParentModule.updateChildPosition();

    };

    addModule(module:DragModule){
        this.modules.push(module);
        module.addEventListener(SWDEvents.ACTIVE,this.unAllAnchor);
        module.addEventListener(SWDEvents.REMOVE_TEMP_ANCHOR,this.unTempAllAnchor);

        module.addEventListener(SWDEvents.DRAG_END,this.dragEnd);

    }

    removeModule(module:DragModule){
        this.modules.splice(this.modules.indexOf(module),1);
        module.removeEventListener(SWDEvents.ACTIVE,this.unAllAnchor);
        module.removeEventListener(SWDEvents.REMOVE_TEMP_ANCHOR,this.unTempAllAnchor);
        module.removeEventListener(SWDEvents.DRAG_END,this.dragEnd);
    }

}

export {ModuleManager};