/**
 * 线条管理
 */
import {Line} from "../graphics/Line";
import {DragStage} from "../graphics/DragStage";
import {Anchor} from "../core/Anchor";
import {msg} from "../../tools/LHFTools";

class LineManager{
    static instance:LineManager=null;
    static getInstance():LineManager{
        if(!LineManager.instance){
            LineManager.instance=new LineManager();
        }
        return LineManager.instance;
    }

    /**     * 所有线条的数组     */
    lines:Line[]=[];



    /**     * 舞台     */
    stage:DragStage=null;

    constructor(){
        if(LineManager.instance){
            throw new Error('线条管理为单例模式,禁止直接实例化');
        }
    }

    init(stage:DragStage):void{
        this.stage=stage;
    }



    /**     * 删除选中的线条     */
    deleteSelLine():void{
        let i:number=0;
        let line:Line;
        for (i; i < this.lines.length; i++) {
            line=this.lines[i];
            if(line.sel){
                line.dispose();
            }
        }
    }



    /**     * 移除所有选中     */
    unSelStatus():void{
        let i:number=0;
        let line:Line;
        for (i; i < this.lines.length; i++) {
            line = this.lines[i];
            line.sel=false;
        }
    }

    /**     * 创建线条     */
    createLine(a1:Anchor,a2:Anchor):void{
        /**         * 包含重复线条         */
        if(this.repeatLineJudage(a1,a2)){
            msg('start p:'+a1.uuid+' ~ end p:'+a2.uuid+'连线重复,为无效连线');
            return;
        }

        let line:Line=Line.create(this.stage);
        line.bindStartAnchor(a1);
        line.bindEndAnchor(a2);
        line.activePathArrow({
            start:'swd_def_arrow',
            end:'swd_def_arrow'
        });
        this.lines.push(line);
    }

    removeLine(line:Line):void{
        this.lines.splice(this.lines.indexOf(line),1);
    }

    /**     * 判断是否为重复的线条     */
    repeatLineJudage(a1:Anchor,a2:Anchor):boolean{
        let returnValue:boolean=false;
        let i:number=0;
        let l:number=this.lines.length;
        let line:Line=null;
        for (i = 0; i < l; i++) {
            line = this.lines[i];
            if((line.startAnchor.uuid==a1.uuid)&&(line.endAnchor.uuid==a2.uuid)){
                returnValue=true;
            }
        }
        return returnValue;
    }

}

export {LineManager};