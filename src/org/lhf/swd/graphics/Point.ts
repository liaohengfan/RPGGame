import {Styles} from "../core/Styles";
import {DragStage} from "./DragStage";
import {DisplayObjectContainer} from "./DisplayObjectContainer";
import {AnchorManager} from "../mana/AnchorManager";
import {Vec2} from "../core/Vec2";
import {Anchor} from "../core/Anchor";

/** * 点 */
class Point extends DisplayObjectContainer{

    anchor:Anchor=null;

    static Circle:string="Circle";
    static Rect:string="Rect";

    type:string=Point.Circle;
    static create(stage:DragStage,type:string=Point.Circle):Point{
        let point:Point=new Point();
        point.type=type;
        if(type==Point.Circle){
            point.d3_ele=stage.d3_pointHolder.append('circle');
            point.d3_ele.attr('class',Styles.POINT_C);
        }else{
            point.d3_ele=stage.d3_pointHolder.append('rect');
            point.d3_ele.attr('class',Styles.POINT_R);
        }
        point.d3_ele.attr('transform',DragStage.TRANSFORM);

        point.init();

        //点管理
        AnchorManager.getInstance().addPoint(point);

        return point;
    }
    constructor(){
        super();
    }

    init():void{
        this.element=this.d3_ele.node();
        this.setWH(10,10);
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
        if(this.type==Point.Circle){
            ts.x=0;
            ts.y=0;
            this.d3_ele.attr('cx', pos.x+ts.x).attr('cy', pos.y+ts.y);
        }else{
            this.d3_ele.attr('x', pos.x+ts.x).attr('y', pos.y+ts.y);
        }
    }

    updatePositionForAnchor():void{
        if(this.anchor){
            this.position=this.anchor.position;
        }
    }

    setWH(w:number,h:number){
        this._size.set(w, h);
        if(this.type==Point.Circle){
            this.d3_ele.attr('r',w/2);
        }else{
            this.d3_ele.attr('width', w).attr('height', h);
        }
    }

}
export {Point}