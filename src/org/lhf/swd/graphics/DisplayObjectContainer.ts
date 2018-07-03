/**
 * 显示 基类
 */
import {Align} from "../core/Align";
import {Vec2} from "../core/Vec2";
import { DisplayObject} from "../core/DisplayObject";
import {Styles} from "../core/Styles";
import {SWDEvents} from "../events/SWDEvents";
import {ILHFEventType} from "../../core/LHFEventDispatcher";

class 	DisplayObjectContainer extends DisplayObject{

    /**     * 状态     */
    enabled: boolean = true;

    /**     * 用户数据     */
    userData:any=null;

    /**     * svg     */
    element: Element;

    /**     * d3选择器     */
    d3_ele: any;

    /**     * 父级     */
    parent:DisplayObjectContainer=null;

    /**
     * 选中状态
     * @type {boolean}
     * @private
     */
    _sel:boolean=false;
    set sel(val:boolean){
        this._sel=val;
        if(val){
            this.d3_ele.classed(Styles.SEL,true);
        }else{
            this.d3_ele.classed(Styles.SEL,false);
        }
    }
    get sel():boolean{
        return this._sel;
    }

    protected _pos: Vec2;
    protected _w_pos: Vec2;
    protected _size: Vec2;
    protected _translate:Vec2;

    childs:DisplayObjectContainer[]=[];

    set translate(vec:Vec2){
        this._translate=vec;
    }

    get translate():Vec2{
        return this._translate;
    }

    /**     * 对齐方向     */
    protected _align: Align = Align.C;

    public set align(val: Align) {
        this._align = val;
    }

    public get align(): Align {
        return this._align;
    }

    constructor() {
        super();
        this._pos = new Vec2();
        this._w_pos = new Vec2();
        this._size = new Vec2();
        this._translate = new Vec2();
    }

    init(): void {
        this.element = this.d3_ele.node();
    }

    /**     * 添加子选项     */
    addChild(item:DisplayObjectContainer):void{
        this.childs.push(item);
        item.parent=this;
        item.w_position=this.w_position;
        item.addEventListener(SWDEvents.DISPOSE,this.disposeHandler);
    }

    /**     * dispose handler     */
    disposeHandler=(e:ILHFEventType)=>{
        this.removeChild(e.target);
    };


    /**     * 移除子选项     */
    removeChild(item:DisplayObjectContainer):DisplayObjectContainer{
        item.parent=null;
        item.removeEventListener(SWDEvents.DISPOSE,this.disposeHandler);
        return this.childs.splice(this.childs.indexOf(item),1)[0] as DisplayObjectContainer;
    }

    /**
     * 设置宽高
     * @param {number} w
     * @param {number} h
     */
    setWH(w: number, h: number) {
        this._size.set(w, h);
        this.d3_ele.attr('width', w).attr('height', h);
    }

    /**     * 添加样式     */
    addStyleClass(cls:string){
        this.d3_ele.classed(cls,true);
    }

    hide():void{
        this.d3_ele.classed('swd-hide',true);
        this.d3_ele.classed('swd-show',false);
    }

    show():void{
        this.d3_ele.classed('swd-hide',false);
        this.d3_ele.classed('swd-show',true);
    }

    /**
     * 获取相对坐标
     * @returns {Vec2}
     */
    public get position(): Vec2 {
        return this._pos;
    }

    public set position(pos: Vec2) {
        this._pos.copy(pos);
        let ts:Vec2=this.getTrans();
        let x:number=pos.x+ts.x+this._w_pos.x;
        let y:number=pos.y+ts.y+this._w_pos.y;
        this.d3_ele.attr('x', x).attr('y', y);
        this.updateChildPosition();
    }

    updateChildPosition():void{
        let ts:Vec2=this.getTrans();
        let x:number=this._pos.x+ts.x+this._w_pos.x;
        let y:number=this._pos.y+ts.y+this._w_pos.y;
        let i:number=0;
        let l:number=this.childs.length;
        let item:DisplayObjectContainer=null;
        for (i; i < this.childs.length; i++) {
            item= this.childs[i];
            item.w_position=new Vec2(x,y);
        }
    }

    /**
     * 世界坐标
     * @param {Vec2} pos
     */
    public set w_position(pos:Vec2){
        this._w_pos.copy(pos);
        this.position=this.position;
    }

    public get w_position():Vec2{
        return this._w_pos;
    }

    public getTrans():Vec2{
        let x:number=0;
        let y:number=0;
        switch (this._align){
            case Align.L:
                y=this._size.h/2;
                break;
            case Align.T:
                x=-this._size.w/2;
                break;
            case Align.RT:
                x=-this._size.w;
                break;
            case Align.R:
                x=-this._size.w;
                y=-this._size.h/2;
                break;
            case Align.RB:
                x=-this._size.w;
                y=-this._size.h;
                break;
            case Align.C:
                x=-this._size.w/2;
                y=-this._size.h/2;
                break;
            case Align.B:
                x=-this._size.w/2;
                y=-this._size.h;
                break;
            case Align.LB:
                y=-this._size.h;
                break;
        }
        x+=this._translate.x;
        y+=this._translate.y;
        return new Vec2(x,y);
    }


    dispose(): void {
        this.dispatchEvent({type:SWDEvents.DISPOSE});
    }

}

export {	DisplayObjectContainer};