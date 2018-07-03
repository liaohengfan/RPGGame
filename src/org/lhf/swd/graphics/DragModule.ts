/**
 * 拖动模块,
 * 创建一个单项
 */
import * as d3 from "d3";
import {Styles} from "../core/Styles";
import {Vec2} from "../core/Vec2";
import {DragStage} from "./DragStage";
import {DisplayObjectContainer} from "./DisplayObjectContainer";
import {Align} from "../core/Align";
import {DText} from "./Text";
import {Icon} from "./Icon";
import {Anchor} from "../core/Anchor";
import {SWDEvents} from "../events/SWDEvents";
import {ModuleManager} from "../mana/ModuleManager";
import {AnchorManager} from "../mana/AnchorManager";
import {Point} from "./Point";
import {LineManager} from "../mana/LineManager";
import {DIRECT} from "../core/DIRECT";

class DragModule extends DisplayObjectContainer{

    static create(stage: DragStage): DragModule {
        let modular: DragModule = new DragModule();
        modular.d3_ele = stage.d3_modularHolder.append('g');
        modular.init();
        ModuleManager.getInstance().addModule(modular);
        return modular;
    }

    lAnchor: Anchor;
    tAnchor: Anchor;
    rAnchor: Anchor;
    bAnchor: Anchor;

    rect: SVGRect;
    d3_rect: any;

    /**     * 文字内容     */
    text:DText;

    /**     * 图标     */
    icon:Icon;

    /**     * 锚点激活状态     */
    anchorStatus:boolean=false;

    /**     * 临时锚点激活     */
    anchorStatus_t:boolean=false;

    constructor() {
        super();
        this._align = Align.LT;
    }

    /**
     * 绑定模式填充
     * @param {string} fillID
     */
    bindImageFill(fillID: string) {
        this.d3_rect.classed(Styles.MODULAR_DEFAULT_FILL, false);//移除默认填充色
        this.d3_rect.attr('fill', fillID);
    }

    /**     * 初始化     */
    init(): void {
        this.element = this.d3_ele.node();
        this.d3_rect = this.d3_ele.append('rect');
        this.d3_rect.classed(Styles.MODULAR, true);

        //绑定默认填充色
        this.d3_rect.classed(Styles.MODULAR_DEFAULT_FILL, true);
        this.d3_rect.attr('transform',DragStage.TRANSFORM);

        /**         * 选中模块删除         */
        this.d3_ele.on('mousedown',()=>{
            ModuleManager.getInstance().unSelStatus();//移除所有选中状态
            LineManager.getInstance().unSelStatus();//移除所有选中状态
            this.sel=true;
        });

        this.initAnchors();//初始化锚点
        this.addEvents();//添加事件
    }

    /**
     * 添加事件
     */
    private addEvents():void{
        let dragFun: any = d3.drag()
            .on('start', () => {
                this.dragStart();
            })
            .on('drag', () => {
                this.dragMove();
            })
            .on('end', () => {
                this.dragEnd();
            });
        this.d3_ele.call(dragFun);

        this.d3_ele.on('mousemove',()=>{
            if(this.anchorStatus||this.anchorStatus_t){
                return;
            }
            if(AnchorManager.getInstance().tempLineEnable) {
                this.dispatchEvent({type:SWDEvents.REMOVE_TEMP_ANCHOR});
                this.anchorStatus_t = true;
                this.activeAnchor();//激活锚点
            }
        });

        /**         * 双击         */
        this.d3_ele.on('dblclick',()=>{
            this.dispatchEvent({type:SWDEvents.DB_CLICK});
        });

    }


    /**     * 添加样式     */
    addStyleClass(cls:string){
        this.d3_rect.classed(cls,true);
    }

    /**     * 激活对应的锚点     */
    activeAnchor():void{
        let am:AnchorManager=AnchorManager.getInstance();
        let a_arr:Anchor[]=[this.lAnchor,this.tAnchor,this.rAnchor,this.bAnchor];
        let i:number=0;
        let anchor:Anchor;
        let p:Point=null;
        for (i; i < a_arr.length; i++) {
            anchor = a_arr[i];
            if(anchor.point){
                continue;
            }
            p=am.getAnchorPoint();
            p.anchor=anchor;
            anchor.point=p;
            p.updatePositionForAnchor();
        }
    }

    /**
     * 取消锚点激活
     */
    unAnchor():void{
        this.anchorStatus=false;
        this.anchorStatus_t=false;
        let am:AnchorManager=AnchorManager.getInstance();
        let a_arr:Anchor[]=[this.lAnchor,this.tAnchor,this.rAnchor,this.bAnchor];
        let i:number=0;
        let anchor:Anchor;
        for (i; i < a_arr.length; i++) {
            anchor = a_arr[i];
            if(anchor.point){
                am.recAnchorPoint(anchor.point);
                anchor.point=null;
            }
        }
    }

    /**
     * 激活文字？
     * @param {string} val
     */
    activeText(val:string):void{
        this.text=DText.create(this.d3_ele);
        this.text.setWH(0,0);
        this.text.text=val;
        this.position=this.position;
    }

    /**     * 激活图标     */
    activeIcon(url:string,w:number,h:number){
        this.icon=Icon.create(this.d3_ele);
        this.icon.url=url;
        this.icon.setWH(w,h);
        this.position=this.position;
    }

    /**     * 开始拖动     */
    dragStart(): void {
        if(this.anchorStatus)return;
        this.dispatchEvent({type:SWDEvents.ACTIVE});
        this.anchorStatus=true;
        this.activeAnchor();//激活锚点
    }

    /**     * 拖动移动     */
    dragMove(): void {
        let vec2: Vec2 = new Vec2();
        vec2.copy(this.position);

        let moveVec2:Vec2=new Vec2();

        moveVec2.x = d3.event.dx;
        moveVec2.y = d3.event.dy;

        moveVec2.x=(moveVec2.x/(DragStage.TRANSFORM.k||1))*1;
        moveVec2.y=(moveVec2.y/(DragStage.TRANSFORM.k||1))*1;

        vec2.x+=moveVec2.x;
        vec2.y+=moveVec2.y;
        this.position = vec2;
        this.updatePointsLine();
    }

    /**     * 拖动结束     */
    dragEnd(): void {
        this.dispatchEvent({type:SWDEvents.DRAG_END});
    }

    /**     * 宽高     */
    public get size(): Vec2 {
        return this._size;
    }

    public set size(vec: Vec2) {
        this._size.copy(vec);
        this.d3_rect.attr('width', vec.w).attr('height', vec.h);
    }

    /**     * 初始化周边点     */
    private initAnchors(): void {

        this.lAnchor=new Anchor();
        this.lAnchor.direct=DIRECT.L;

        this.tAnchor=new Anchor();
        this.tAnchor.direct=DIRECT.T;

        this.rAnchor=new Anchor();
        this.rAnchor.direct=DIRECT.R;

        this.bAnchor=new Anchor();
        this.bAnchor.direct=DIRECT.B;

        this.updatePoints();
    }

    /**     * 刷新点的位置     */
    updatePoints(): void {
        let whalf: number = this.size.w >> 1;
        let hhalf: number = this.size.h >> 1;
        let w: number = this.size.w;
        let h: number = this.size.h;
        //let x:number=this._pos.x+ts.x+this._w_pos.x;
        //let y:number=this._pos.y+ts.y+this._w_pos.y;

        let x:number=this._pos.x+this._w_pos.x;
        let y:number=this._pos.y+this._w_pos.y;

        this.lAnchor.position=new Vec2(x, y + hhalf);
        this.tAnchor.position=new Vec2(x + whalf, y);
        this.rAnchor.position=new Vec2(x + w, y + hhalf);
        this.bAnchor.position=new Vec2(x + whalf, y + h);
    }

    updateChildPosition():void{
        let ts:Vec2=this.getTrans();
        let x:number=this._pos.x+ts.x+this._w_pos.x;
        let y:number=this._pos.y+ts.y+this._w_pos.y;
        let i:number=0;
        let l:number=this.childs.length;
        let item:DisplayObjectContainer=null;
        let child:DragModule=null;
        for (i; i < this.childs.length; i++) {
            item= this.childs[i];
            item.w_position=new Vec2(x,y);
            child=(item as DragModule);
            if(child){
                child.updatePointsLine();
            }
        }
    }

    /**     * 刷新点关联的线条     */
    updatePointsLine() {
        this.updatePoints();
        this.lAnchor.updateLines();
        this.tAnchor.updateLines();
        this.rAnchor.updateLines();
        this.bAnchor.updateLines();
    }

    dispose():void{
        this.rect=null;
        this.d3_rect.remove();

        /**     * 文字内容     */
        this.text.dispose();

        /**     * 图标     */
        this.icon.dispose();

        //移除锚点
        this.unAnchor();

        let child:DragModule=null;
        while (this.childs.length){
            child=this.childs[0] as DragModule;
            if(child) {
                child.dispose();
            }
        }

        //移除连线
        this.lAnchor.removeAllLines();
        this.tAnchor.removeAllLines();
        this.rAnchor.removeAllLines();
        this.bAnchor.removeAllLines();

        this.lAnchor=null;
        this.tAnchor=null;
        this.rAnchor=null;
        this.bAnchor=null;

        this.d3_ele.on('mousemove',null);
        this.d3_ele.on('dblclick',null);
        this.d3_ele.remove();
        ModuleManager.getInstance().removeModule(this);//在管理中移除
        this.dispatchEvent({type:SWDEvents.DISPOSE});
    }

    public get position(): Vec2 {
        return this._pos;
    }

    public set position(vec: Vec2) {
        this._pos.copy(vec);
        let ts:Vec2=this.getTrans();
        let x:number=vec.x+ts.x+this._w_pos.x;
        let y:number=vec.y+ts.y+this._w_pos.y;

        this.d3_rect.attr('x', x).attr('y', y);
        if(this.text){
            this.text.position=new Vec2(x,y);
        }
        if(this.icon){
            this.icon.position=new Vec2(x,y);
        }
        this.updateChildPosition();
    }

    /**     * 判断是否可以添加为子集     */
    checkAddChild(target:DragModule,pos: Vec2, size: Vec2):boolean {
        //判断是否在区域内
        let thisPos:Vec2=new Vec2(this.position.x+this.w_position.x,this.position.y+this.w_position.y);
        let thisSize:Vec2=this.size;

        let childXMax:number=pos.x+size.w;
        let childYMax:number=pos.y+size.h;

        let parentXMax:number=thisPos.x+thisSize.w;
        let parentYMax:number=thisPos.y+thisSize.h;

        //宽度在区域内？
        if((childXMax<=parentXMax)&&(pos.x>=thisPos.x)){
            //高度在区域内？
            if((childYMax<=parentYMax)&&(pos.y>=thisPos.y)){
                return true;
            }
        }
        return false;
    }
}

export {DragModule};