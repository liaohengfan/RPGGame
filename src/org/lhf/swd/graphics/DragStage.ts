import * as d3 from "d3";
import {Styles} from "../core/Styles";
import {CommonModule} from "../../core/CommonModule";
import {DisplayObject} from "../core/DisplayObject";
import {IMarkerParames} from "../core/Parames";
import {ModuleManager} from "../mana/ModuleManager";
import {AnchorManager} from "../mana/AnchorManager";
import {DragModule} from "./DragModule";
import {LineManager} from "../mana/LineManager";
import {Grid} from "./Grid";
import {LHFTools} from "../../tools/LHFTools";
import {Vec2} from "../core/Vec2";

/**
 * 拖动舞台
 * 创建一个svg
 */
class DragStage {
    d3_container: any;
    container: HTMLElement;
    svg: SVGElement = null;
    d3_svg: any;

    /**     * 栅格背景     */
    grid:Grid;


    /**     * 点容器     */
    pointHolder: SVGGElement;
    d3_pointHolder: any;

    /**     * 模块容器     */
    modularHolder: SVGGElement;
    d3_modularHolder: any;

    /**     * 线条容器     */
    lineHolder: SVGGElement;
    d3_lineHolder: any;


    d3_defs: any;
    defs: SVGDefsElement;

    /**     * 添加箭头     */
    arrows: SVGMarkerElement[] = [];
    d3_arrows: any[] = [];

    /**     * cur scale zoom     */
    static TRANSFORM:any="";

    /**
     * client
     */
    static ClientRect:ClientRect;

    /**
     * 屏幕坐标转换SVG缩放坐标
     * @param {number} x
     * @param {number} y
     * @constructor
     */
    static PosTransform(x:number,y:number):Vec2{
        let vec2:Vec2=new Vec2(x,y);
        vec2.x-=DragStage.ClientRect.left;
        vec2.y-=DragStage.ClientRect.top;

        vec2.x-=DragStage.TRANSFORM.x||0;
        vec2.y-=DragStage.TRANSFORM.y||0;
        vec2.x=(vec2.x/(DragStage.TRANSFORM.k||1))*1;
        vec2.y=(vec2.y/(DragStage.TRANSFORM.k||1))*1;
        return vec2;
    }

    constructor(container: HTMLElement) {
        this.d3_container = d3.select(container);
        this.d3_container.classed(Styles.CONTAINER, true);
        this.container = container;
        DragStage.ClientRect=this.container.getBoundingClientRect();
        this.d3_svg = d3.select(container).append('svg');

        //舞台  -svg
        this.d3_svg.attr('class', Styles.STAGE);
        this.svg = this.d3_svg.node();

        //定义
        this.d3_defs = this.d3_svg.append('defs');
        this.defs = this.d3_defs.node();

        //背景栅格
        this.grid=new Grid(this.d3_svg);

        //模块容器
        this.d3_modularHolder = this.d3_svg.append('g');
        this.d3_modularHolder.attr('class', Styles.MODULAR_STAGE);
        this.modularHolder = this.d3_modularHolder.node();

        //线容器
        this.d3_lineHolder = this.d3_svg.append('g');
        this.d3_lineHolder.attr('class', Styles.LINES_STAGE);
        this.lineHolder = this.d3_lineHolder.node();

        //点容器
        this.d3_pointHolder = this.d3_svg.append('g');
        this.d3_pointHolder.attr('class', Styles.POINT_STAGE);
        this.pointHolder = this.d3_pointHolder.node();

        this.init();

        //于公共模块添加重新设置大小
        CommonModule.getInstance().addWDWResize(() => {
            this.resize();
        });
    }

    private init(): void {
        this.initEvents();
    }

    private initEvents():void{
        /**         * 添加事件         */
        this.d3_svg.on('mousemove',()=>{
            AnchorManager.getInstance().updateConnectTemp();
        });

        /**         * 鼠标抬起清除临时线条         */
        this.d3_svg.on('mouseup',()=>{
            LHFTools.msg('stage mouse up');
            AnchorManager.getInstance().removeTempLineStartPoint();//移除临时线条
            ModuleManager.getInstance().unAllAnchor();//移除所有锚点
            ModuleManager.getInstance().unSelStatus();//移除所有选中状态
            LineManager.getInstance().unSelStatus();//移除所有选中状态
        });
        /**         * 键盘事件         */
        d3.select(document.body).on('keydown',()=>{
            if(d3.event.keyCode==8||d3.event.keyCode==46){
                ModuleManager.getInstance().deleteSelModule();
                LineManager.getInstance().deleteSelLine();
            }
        });

        /**         * 缩放         */
        this.d3_svg.call(d3.zoom().scaleExtent([1,1]).on("zoom", this.zoomed));

    }

    zoomed=()=>{
        this.d3_svg.selectAll('path')
            .attr("transform",d3.event.transform);
        this.d3_svg.selectAll('text')
            .attr("transform",d3.event.transform);
        this.d3_svg.selectAll('rect')
            .attr("transform",d3.event.transform);
        this.d3_svg.selectAll('circle')
            .attr("transform",d3.event.transform);

        this.d3_svg.selectAll('.'+Styles.ICON)
            .attr("transform",d3.event.transform);
        DragStage.TRANSFORM=d3.event.transform;
    };

    /**
     * 添加标记
     * @param {string} markerStr
     * @param {string} id
     * @returns {string}
     */
    addMarkers(markerOption: IMarkerParames): string {
        markerOption.id = (markerOption.id ? markerOption.id : DisplayObject.getUUID());
        markerOption.viewBox = (markerOption.viewBox ? markerOption.viewBox : "0 0 15 15");
        markerOption.refX = (markerOption.refX ? markerOption.refX : "7");
        markerOption.refY = (markerOption.refY ? markerOption.refY : "7");
        markerOption.markerUnits = (markerOption.markerUnits ? markerOption.markerUnits : "strokeWidth");
        markerOption.markerWidth = (markerOption.markerWidth ? markerOption.markerWidth : "15");
        markerOption.markerHeight = (markerOption.markerHeight ? markerOption.markerHeight : "15");
        markerOption.orient = (markerOption.orient ? markerOption.orient : "auto");
        markerOption.url = (markerOption.url ? markerOption.url : "data:img/png;base64,iVBORw0KGgoAAAANSUhEUgAAAA8AAAAPCAMAAAAMCGV4AAAABGdBTUEAALGPC/xhBQAAACBjSFJNAAB6JgAAgIQAAPoAAACA6AAAdTAAAOpgAAA6mAAAF3CculE8AAAAh1BMVEUAAAB7hpJ7hpJ7hpJ7hpJ7hpJ7hpJ7hpJ7hpJ7hpJ7hpJ7hpJ7hpJ7hpJ7hpJ7hpJ7hpKmrrba3eCCjJi9w8n////k5umFj5q1u8L+///q7O2Jk56ss7v9/v7u8PGOmKLN0dbc3+K5v8Xl5+m+xMrh4+aDjZjCx83d4OOBjJfX2t6Ai5YAAAB9UyuWAAAAEHRSTlMAAlmy6iLM6ctat+vm+SPlr5PMUgAAAAFiS0dEAIgFHUgAAAAJcEhZcwAACxIAAAsSAdLdfvwAAACHSURBVAjXTU9XFsIwDFOarpQ2hGHKKHvD/e+HYxMe+ogc+cm2AMBkNg+5zQwERRkUZSHfKiRULJiai8l0JkJt4CLPadGL4NAIL1frTeQGI7UO292eqUWadaAjv13qn+jcS1/9F7re1C/z7/R4fufL/uH1Tvvh/+7z8WD/u99rIM437lrrYr4PkJYMTD17jXYAAAAASUVORK5CYII=");


        let marker: any = this.d3_defs.append('marker');
        marker.attr("id", markerOption.id);
        marker.attr("viewBox", markerOption.viewBox);
        marker.attr("refX", markerOption.refX);
        marker.attr("refY", markerOption.refY);
        marker.attr("markerUnits", markerOption.markerUnits);
        marker.attr("markerWidth", markerOption.markerWidth);
        marker.attr("markerHeight", markerOption.markerHeight);
        marker.attr("orient", markerOption.orient);
        let img: any = marker.append('image');
        img.attr('xlink:href', markerOption.url);
        img.attr('width', markerOption.markerWidth);
        img.attr('height', markerOption.markerHeight);
        return markerOption.id;
    }

    /**     * 绑定一个图片填充     */
    addImageFill(url: string, fillID: string): string {
        let pattern: any = this.d3_defs.append('pattern');
        pattern.attr('id', fillID);
        pattern.attr('width', '100%');
        pattern.attr('height', '100%');
        let image: any = pattern.append('image');
        image.attr('width', 100);
        image.attr('height', 100);
        image.attr('xlink:href', url);
        return 'url(#' + fillID + ')';
    }

    /**
     * 设置舞台宽高
     * @param {number} w
     * @param {number} h
     */
    stageWH(w: number, h: number) {
        this.d3_svg.attr('width', w).attr('height', h);
    }

    /**
     * 窗口发生更改
     */
    resize(): void {
        DragStage.ClientRect=this.container.getBoundingClientRect();
        let w: number = this.container.clientWidth;
        let h: number = this.container.clientHeight;
        this.stageWH(w, h);
    }
}

export {DragStage};