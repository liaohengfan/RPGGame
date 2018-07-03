import {DisplayObjectContainer} from "./DisplayObjectContainer";
import {Styles} from "../core/Styles";
import {TextManager} from "../mana/TextManager";
import {DragStage} from "./DragStage";

class DText extends DisplayObjectContainer{
    static create(d3ele:any):DText{
        let text:DText=new DText();
        text.d3_ele=d3ele.append('text');
        text.d3_ele.attr('transform',DragStage.TRANSFORM);
        text.init();
        //点管理
        return text;
    }

    constructor(){
        super();
    }

    init(){
        this.d3_ele.attr('class',Styles.TEXT);
        this.element = this.d3_ele.node();
        /*this.d3_ele.on('dblclick',()=>{
            TextManager.getInstance().bindText(this);
        });*/
    }

    dispose(){
        this.d3_ele.on('dblclick',null);
        this.d3_ele.remove();
    }

    private _text:string="";
    set text(val:string){
        this._text=val;
        this.d3_ele.text(val);
    }
    get text():string{
        return this._text;
    }
}

export {DText}