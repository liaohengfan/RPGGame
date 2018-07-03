/**
 * 节点管理
 */
import {Point} from "../graphics/Point";
import {SWDManager} from "./SWDManager";
import {DragStage} from "../graphics/DragStage";
import {LineManager} from "./LineManager";
import {Line} from "../graphics/Line";
import * as d3 from "d3";
import {Vec2} from "../core/Vec2";
import {Anchor} from "../core/Anchor";
import {DragModule} from "../graphics/DragModule";
import {ModuleManager} from "./ModuleManager";

class AnchorManager{
    static instance:AnchorManager=null;
    static getInstance():AnchorManager{
        if(!AnchorManager.instance){
            AnchorManager.instance=new AnchorManager();
        }
        return AnchorManager.instance;
    }

    /**     * 当前所有点     */
    points:Point[]=[];

    /**     * 空闲点     */
    freePoints:Point[]=[];

    /**     * 点击的点/起点     */
    startPoint:Point=null;

    /**     * 松开的点/终点     */
    endPoint:Point=null;

    /**     * 舞台     */
    stage:DragStage=null;

    /**     * 临时的线条     */
    tempLine:Line;
    tempLineEnable:boolean=false;

    constructor(){
        if(AnchorManager.instance){
            throw new Error('节点管理为单例模式,禁止直接实例化');
        }
    }

    init(stage:DragStage):void{
        this.stage=stage;
        this.tempLine=SWDManager.createLine(stage);
        this.tempLine.activePathArrow({
            start:'swd_def_arrow',
            end:'swd_def_arrow'
        });
        this.tempLine.always=true;
    }

    /**
     * 获取锚点
     * @returns {Point}
     */
    getAnchorPoint():Point{
        let point:Point=null;
        if(this.freePoints.length){
            point=this.freePoints.pop();
        }else{
            point=SWDManager.createPoint(this.stage,0,0);
            point.setWH(15,15);
        }
        point.show();
        point.anchor=null;
        point.uuid='';
        return point;
    }

    /**     * 回收锚点     */
    recAnchorPoint(p:Point):void{
        p.anchor=null;
        p.uuid="";
        p.hide();
        this.freePoints.push(p);
    }

    /**     * 绑定临时点线     */
    bindTempLineStartPoint(a:Anchor):void{
        this.tempLineEnable=true;
        this.tempLine.bindStartAnchor(a);
    }

    /**     * 移除临时点线     */
    removeTempLineStartPoint():void{
        this.tempLineEnable=false;
        this.tempLine.bindStartAnchor(null);//清除绑定
        this.tempLine.draw('');//绘制一个空起点
    }

    /**     * 刷新临时连线     */
    updateConnectTemp(){
        if(!this.tempLineEnable)return;
        let event:any=d3.event;

        let vec2:Vec2=DragStage.PosTransform(event.x,event.y);

        /**         * 刷新临时的目标点         */
        this.tempLine.updateTempEnd(vec2);
    }

    /**     * 判断连线     */
    judageLink(){
        if(!this.startPoint||!this.endPoint)return;
        if(this.startPoint.anchor.uuid==this.endPoint.anchor.uuid)return;
        /**         * 创建连线         */
        LineManager.getInstance().createLine(this.startPoint.anchor,this.endPoint.anchor);

        /**         * 重置         */
        this.startPoint=null;
        this.endPoint=null;
    }

    /**     * 添加一个点     */
    addPoint(p:Point):void{
        p.d3_ele.on('mousedown',()=>{
            this.startPoint=p;
            /**             * 绑定临时起点             */
            this.bindTempLineStartPoint(p.anchor);
            d3.event.stopPropagation();
        });
        p.d3_ele.on('mouseup',()=>{
            this.endPoint=p;
            this.judageLink();
        });
        this.points.push(p);
    }

    /**     * 移除一个点     */
    removePoint(p:Point):void{
        let i:number=0;
        let l:number=this.points.length;
        let point:Point=null;
        let index:number=-1;
        for (i = 0; i < l; i++) {
            point = this.points[i];
            if(point.uuid=p.uuid){
                index=i;
            }
        }

        p.d3_ele.on('mousedown',null);
        p.d3_ele.on('mouseup',null);

        /**         * 存在该线         */
        if(index!=-1){
            point=this.points.splice(index,1)[0];
            point.dispose();
        }
    }
}
export {AnchorManager};