import * as d3 from "d3";
import {Vec2} from "../core/Vec2";
import {Styles} from "../core/Styles";
import {DText} from "../graphics/Text";

/** * 文本输入管理 */
class TextManager{
    static instance:TextManager=null;
    static getInstance():TextManager{
        if(!TextManager.instance){
            TextManager.instance=new TextManager();
        }
        return TextManager.instance;
    }

    /**     * HTML容器     */
    container:HTMLElement;

    /**     * d3 容器     */
    d3_container:any=null;

    /**     * 输入标签     */
    d3_input:any;
    input:HTMLInputElement;

    /**     * 正在输入     */
    inputStatus:boolean=false;

    /**     * 绑定文字     */
    curText:DText=null;

    constructor(){
    }

    /**     * 绑定text     */
    bindText(text_:DText):void{
        if(!text_)return;
        this.curText=text_;
        /**         * 文本编辑模式         */
        this.inputStatus=true;
        this.input.value=text_.text;
        this.updatePos(text_.position);
        this.show();//展示输入框
    }

    /**     * 退出文本编辑     */
    exitTextDev():void{
        if(!this.inputStatus)return;
        this.inputStatus=false;
        this.hide();//隐藏输入框
        this.updateSvgTextContent();//更新文本
        this.curText=null;//
    }

    /**     * 更新文本输入内容     */
    updateSvgTextContent():void{
        let inputContent:string=this.d3_input.text();
        inputContent=this.input.value;
        this.input.value='';
        this.curText.text=inputContent;
    }

    /**     * 隐藏输入框     */
    hide():void{
        this.d3_input.classed(Styles.HIDE,true);
        this.d3_input.classed(Styles.SHOW,false);
    }

    /**     * 展示输入框     */
    show():void{
        this.d3_input.classed(Styles.HIDE,false);
        this.d3_input.classed(Styles.SHOW,true);
    }

    /**     * 刷新位置     */
    updatePos(vec2:Vec2):void{
        this.d3_input.style('left',vec2.x+'px');
        this.d3_input.style('top',vec2.y+'px');
    }

    /**     * 绑定     */
    init(id:string){

        //绑定容器
        this.d3_container=d3.select(id);
        this.container=this.d3_container.node();

        //添加退出事件
        this.d3_container.on('click',()=>{
            this.exitTextDev();
        });

        //输入框
        this.d3_input=this.d3_container.append('input');
        this.d3_input.classed('swd-text-input',true);
        this.input=this.d3_input.node();

        /**         * 默认隐藏输入框         */
        this.hide();

        //事件拦截
        this.d3_input.on('click',function(){
            let event:any=d3.event;
            event.stopPropagation();
            event.preventDefault();
        });

        /**         * enter         */
        this.d3_input.on('enter',()=>{
            this.exitTextDev();
        });
    }

}

export {TextManager};