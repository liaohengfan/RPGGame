import {DisplayObjectContainer} from "./DisplayObjectContainer";
import {Align} from "../core/Align";
import {Styles} from "../core/Styles";
import {DragStage} from "./DragStage";

class Icon extends DisplayObjectContainer{
    private _url:string;
    /**     * 对齐方向     */
    protected _align: Align = Align.LT;
    static create(d3ele:any):Icon{
        let icon:Icon=new Icon();
        icon.d3_ele=d3ele.append('image');
        icon.d3_ele.attr('class',Styles.ICON);
        icon.d3_ele.attr('transform',DragStage.TRANSFORM);
        icon.init();
        //点管理
        return icon;
    }

    constructor(){
        super();
    }

    dispose():void{
        this.d3_ele.remove();
    }

    /**     * 地址     */
    set url(v:string){
        this._url=v;
        this.d3_ele.attr('xlink:href',v);
        this.d3_ele.attr('src',v);
    }

    /**     * 地址     */
    get url():string{
        return this._url;
    }

    setWH(w:number,h:number){
        this._size.set(w, h);
        this.d3_ele.attr('width', w).attr('height', h);
    }
}

export {Icon};