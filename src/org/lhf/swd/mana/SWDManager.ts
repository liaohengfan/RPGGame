/**
 * 拖动管理类
 */
import '../SWDBasicStyles.scss';
import {DragStage} from "../graphics/DragStage";
import {DragModule} from "../graphics/DragModule";
import {DIRECT} from "../core/DIRECT";
import {Point} from "../graphics/Point";
import {Vec2} from "../core/Vec2";
import {Line} from "../graphics/Line";

class SWDManager{

    /**
     * 创建一个舞台
     * @param {string} domID
     * @returns {DragStage}
     */
    static createStage(domID:string):DragStage{
        let container:HTMLElement=document.querySelector(domID) as HTMLElement;
        let stage:DragStage=new DragStage(container);
        return stage;
    }

    /**
     * 创建一个拖动单项
     */
    static createModule(stage:DragStage,x: number, y: number,w:number=100,h:number=100):DragModule{
        let dragModular:DragModule=DragModule.create(stage);
        dragModular.size=new Vec2(w,h);
        dragModular.position=new Vec2(x,y);
        dragModular.updatePoints();
        return dragModular;
    }

    /**     * 创建一个点     */
    static createPoint(stage:DragStage,x:number,y:number,direct:DIRECT=DIRECT.C):Point{
        let point:Point=Point.create(stage);
        point.position=new Vec2(x,y);
        return point;
    }

    /**     * 创建一个线条     */
    static createLine(stage:DragStage):Line{
        let line:Line=Line.create(stage);
        return line;
    }

    constructor(){
        throw new Error("拖动管理禁止实例化!!");
    }
}
export {SWDManager};