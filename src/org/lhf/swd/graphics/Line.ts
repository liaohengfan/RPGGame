/**
 * 线条
 */
import * as d3 from "d3";
import {Vec2} from "../core/Vec2";
import {Styles} from "../core/Styles";
import {DragStage} from "./DragStage";
import {DisplayObjectContainer} from "./DisplayObjectContainer";
import {Anchor} from "../core/Anchor";
import {LHFTools, msg} from "../../tools/LHFTools";
import {ILineMarkerParams} from "../core/Parames";
import {AnchorManager} from "../mana/AnchorManager";
import {LineManager} from "../mana/LineManager";
import {ModuleManager} from "../mana/ModuleManager";
import {DIRECT} from "../core/DIRECT";

/** * 线条 */
class Line extends DisplayObjectContainer{
    static LineFun:d3.Line<any>=null;
    static create(stage:DragStage):Line{
        let line:Line=new Line();
        line.d3_ele=stage.d3_lineHolder.append('path');
        line.d3_sel_line=stage.d3_lineHolder.append("path");

        line.d3_ele.attr('class',Styles.LINE);
        line.d3_sel_line.attr('class',Styles.LINE_SEL);

        line.init();
        return line;
    }
    startAnchor:Anchor=null;
    endAnchor:Anchor;
    always:boolean=false;
    d3_sel_line:any;

    constructor(){
        super();

        if(!Line.LineFun){
            Line.LineFun=d3.line()
                .x(function(d:any){
                    return d.x;
                })
                .y(function(d:any){
                    return d.y;
                });
            //Line.LineFun.curve(d3.curveBasis);
            Line.LineFun.curve(d3.curveStepBefore);
        }
    }

    /**     * 销毁     */
    dispose():void{
        /**         * 如果常驻则不销毁         */
        if(this.always)return;
        this.element=null;
        if(this.startAnchor){
            this.startAnchor.removeLine(this);
        }
        if(this.endAnchor){
            this.endAnchor.removeLine(this);
        }


        this.d3_sel_line.on('mousedown',null);
        this.d3_sel_line.on('mouseup',null);
        this.d3_ele.remove();
        this.d3_sel_line.remove();
        LineManager.getInstance().removeLine(this);//在管理中移除
    }

    /**     * 绑定起点     */
    bindStartAnchor(p:Anchor):void{
        if(this.startAnchor){
            this.startAnchor.removeLine(this);
            this.startAnchor=null;
        }
        if(!p) return;
        this.startAnchor=p;
        this.startAnchor.addLine(this);
    }

    /**     * 绑定终点     */
    bindEndAnchor(p:Anchor):void{
        if(this.endAnchor){
            this.endAnchor.removeLine(this);
            this.endAnchor=null;
        }
        if(!p) return;
        this.endAnchor=p;
        this.endAnchor.addLine(this);
        this.updateLinePath();
    }

    /**     * 刷新线条的路径     */
    updateLinePath():void{
        let controlVec:Vec2=this.controlPoint();
        /*let cx:number=(this.startAnchor.position.x+((this.endAnchor.position.x-this.startAnchor.position.x)/2));
        let cy:number=(this.startAnchor.position.y+((this.endAnchor.position.y-this.startAnchor.position.y)/2));

        let controlVec1:Vec2=new Vec2(this.startAnchor.position.x,cy);

        if(this.startAnchor.direct==DIRECT.L||this.startAnchor.direct==DIRECT.R){
            if(this.endAnchor.position.x<this.startAnchor.position.x){
            }
        }

        let controlVec2:Vec2=new Vec2(this.endAnchor.position.x,cy);*/

        //let controlsVec1:Vec2=new Vec2();
        let data:Vec2[]=[
            this.startAnchor.position,
                controlVec,
                //controlVec1,
                //controlVec2,
            this.endAnchor.position
        ];
        this.draw(Line.LineFun(data));
    }

    /**
     * 控制点纠正
     * @returns {Vec2}
     */
    controlPoint():Vec2{
        let controlVec:Vec2=new Vec2(0,0);
        controlVec.copy(this.startAnchor.position);
        let startPos:Vec2=this.startAnchor.position;
        let endPos:Vec2=this.endAnchor.position;
        let sdis:DIRECT=this.startAnchor.direct;
        let edis:DIRECT=this.endAnchor.direct;

        const X_C:number=(startPos.x+((endPos.x-startPos.x)/2));
        const Y_C:number=(startPos.y+((endPos.y-startPos.y)/2));
        const X_Max:number=Math.max(startPos.x,endPos.x);
        const Y_Max:number=Math.max(startPos.y,endPos.y);

        const X_Min:number=Math.min(startPos.x,endPos.x);
        const Y_Min:number=Math.min(startPos.y,endPos.y);

        switch (sdis){
            case DIRECT.L://起点为左方
                switch (edis){
                    case DIRECT.L://终点向量为左
                        controlVec.x=X_Min-50;
                        controlVec.y=startPos.y;
                        break;
                    case DIRECT.R://终点向量为右
                        controlVec.x=X_Min+50;
                        controlVec.y=startPos.y;
                        break;
                    case DIRECT.T://终点向量为上
                        controlVec.x=endPos.x;
                        controlVec.y=startPos.y;
                        break;
                    case DIRECT.B://终点向量为下方向
                        controlVec.x=X_Min-50;
                        controlVec.y=startPos.y;
                        break;
                }
                break;
            case DIRECT.T://起点为上方
                switch (edis){
                    case DIRECT.L://终点向量为左
                        controlVec.x=startPos.x;
                        controlVec.y=endPos.y;
                        break;
                    case DIRECT.R://终点向量为右
                        controlVec.x=X_Max;
                        if(controlVec.x<=endPos.x){
                            controlVec.x=endPos.x+50;
                        }
                        controlVec.y=Y_C;
                        break;
                    case DIRECT.T://终点向量为上
                        controlVec.x=endPos.x;
                        controlVec.y=endPos.y-50;
                        break;
                    case DIRECT.B://终点向量为下方向
                        controlVec.x=endPos.x;
                        controlVec.y=Y_C;
                        break;
                }
                break;
            case DIRECT.R://起点为右方
                switch (edis){
                    case DIRECT.L://终点向量为左
                        controlVec.x=X_C;
                        controlVec.y=startPos.y;
                        break;
                    case DIRECT.R://终点向量为右
                        controlVec.x=X_Max+50;
                        controlVec.y=startPos.y;
                        break;
                    case DIRECT.T://终点向量为上
                        controlVec.x=X_Max;
                        controlVec.y=startPos.y;
                        break;
                    case DIRECT.B://终点向量为下方向
                        controlVec.x=endPos.x;
                        controlVec.y=Y_Max+50;
                        break;
                }
                break;
            case DIRECT.B://起点为下方
                switch (edis){
                    case DIRECT.L://终点向量为左
                        controlVec.x=startPos.x;
                        controlVec.y=endPos.y;
                        break;
                    case DIRECT.R://终点向量为右
                        controlVec.x=X_Max;
                        if(controlVec.x>startPos.x){
                            controlVec.x+=50;
                        }
                        controlVec.y=Y_C;
                        break;
                    case DIRECT.T://终点向量为上
                        controlVec.x=endPos.x;
                        controlVec.y=startPos.y+50;
                        break;
                    case DIRECT.B://终点向量为下方向
                        controlVec.x=endPos.x;
                        controlVec.y=Y_Max+50;
                        break;
                }
                break;
        }
        return controlVec;
    }

    /**     * 刷新临时终点     */
    updateTempEnd(vec:Vec2):void{
        if(!this.startAnchor){
            msg('起点不存在不能绘制线条')
        }

        let data:Vec2[]=[
            this.startAnchor.position,
            vec
        ];
        this.draw(Line.LineFun(data));
    }

    /**     * 更新线条路径     */
    draw(path_d:any){
        this.d3_ele.attr('d',path_d);
        this.d3_sel_line.attr('d',path_d);
        this.d3_ele.attr('transform',DragStage.TRANSFORM);
        this.d3_sel_line.attr('transform',DragStage.TRANSFORM);
    }

    /**     * 设置箭头样式     */
    activePathArrow(params:ILineMarkerParams){
        LHFTools.msg('active arrow ');
        params.start=(params.start?('url(#'+params.start+')'):'');
        params.mid=(params.mid?('url(#'+params.mid+')'):'');
        params.end=(params.end?('url(#'+params.end+')'):'');
        this.d3_ele.attr('marker-start',params.start);
        this.d3_ele.attr('marker-mid',params.mid);
        this.d3_ele.attr('marker-end',params.end);
    }

    init():void{
        this.d3_sel_line.on('mousedown',()=>{
            ModuleManager.getInstance().unAllAnchor();//移除所有锚点
            ModuleManager.getInstance().unSelStatus();//移除所有选中状态
            LineManager.getInstance().unSelStatus();//移除所有选中状态
            this.sel=true;
        });
        this.d3_sel_line.on('mouseup',()=>{
            AnchorManager.getInstance().removeTempLineStartPoint();//移除临时线条
            d3.event.stopPropagation();
            d3.event.preventDefault();
        });
    }
}
export {Line}