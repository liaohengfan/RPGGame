import {Line} from "../graphics/Line";
import {Vec2} from "./Vec2";
import { DisplayObject} from "./DisplayObject";
import {Point} from "../graphics/Point";
import {DIRECT} from "./DIRECT";

class Anchor extends DisplayObject{
    _pos:Vec2;

    lines:Line[]=[];

    point:Point=null;
    direct:DIRECT=DIRECT.L;
    constructor(){
        super();
        this._pos=new Vec2();
    }

    set position(v:Vec2){
        this._pos.copy(v);
        if(this.point){
            this.point.position=this._pos;
        }
    }

    get position():Vec2{
        return this._pos;
    }

    /**     * 添加线条关联     */
    addLine(line:Line):void{
        this.lines.push(line);
    }

    /**     * 移除线条关联     */
    removeLine(line:Line):void{
        this.lines.splice(this.lines.indexOf(line),1);
    }

    /***     * 移除所有线条     */
    removeAllLines():void{
        while (this.lines.length){
            this.lines.pop().dispose();
        }
    }

    /**     * 刷新相关的线条     */
    updateLines():void{
        let i:number=0;
        let l:number=this.lines.length||0;
        let line:Line=null;
        for (i = 0; i < l; i++) {
            line = this.lines[i];
            line.updateLinePath();
        }
    }
}

export {Anchor};