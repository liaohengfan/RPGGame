import * as d3 from 'd3';
import {DisplayObjectContainer} from "./DisplayObjectContainer";
import {Styles} from "../core/Styles";
import {Vec2} from "../core/Vec2";

class Grid extends DisplayObjectContainer {
    parames: IGridParames = null;
    d3_svg: any;

    gridG: any;

    constructor(d3_svg: any, parames?: IGridParames) {
        super();
        parames = parames || {};
        parames.width = parames.width ? parames.width : 10000;
        parames.height = parames.height ? parames.height : 10000;
        parames.x_step = parames.x_step ? parames.x_step : 15;
        parames.y_step = parames.y_step ? parames.y_step : 15;
        parames.str_StepScale = parames.str_StepScale ? parames.str_StepScale : 7;

        this.d3_svg = d3_svg;
        this.parames = parames;
        this.init();
    }

    init(): void {
        this.gridG = this.d3_svg.append('g');
        this.gridG.attr('class', "swd-grid");
        let axisX: any = d3.scaleLinear().domain([0, this.parames.width]).ticks(this.parames.width / this.parames.x_step);
        let axisY: any = d3.scaleLinear().domain([0, this.parames.height]).ticks(this.parames.height / this.parames.y_step);
        const lineFun:d3.Line<any>=d3.line()
            .x(function(d:any){
                return d.x;
            })
            .y(function(d:any){
                return d.y;
            });


        const W:number=this.parames.width;
        const W_HALF:number=W/2;
        const H:number=this.parames.height;
        const H_HALF:number=H/2;
        const X_STRONG:number=this.parames.x_step*this.parames.str_StepScale;
        const Y_STRONG:number=this.parames.y_step*this.parames.str_StepScale;

        //添加X轴坐标系
       this.gridG.selectAll(Styles.GRID_X)
            .data(axisX)
            .enter()
            .append('path')
            .attr('d',function(d:number,i:number){
                let data:Vec2[]=[
                    new Vec2(d-W_HALF,-H_HALF),
                    new Vec2(d-W_HALF,H_HALF)
                ];
                return lineFun(data);
            })
           .attr('class',function(d:number,i:number){
               if(d%X_STRONG==0){
                   return Styles.GRID_LINE_STR+' '+Styles.GRID_X;
               }else{
                   return Styles.GRID_LINE+' '+Styles.GRID_X;
               }
           });

        //添加Y轴坐标系
       this.gridG.selectAll(Styles.GRID_Y)
            .data(axisY)
            .enter()
            .append('path')
            .attr('d',function(d:number,i:number){
                let data:Vec2[]=[
                    new Vec2(-W_HALF,d-H_HALF),
                    new Vec2(W_HALF,d-H_HALF)
                ];
                return lineFun(data);
            })
           .attr('class',function(d:number,i:number){
               if(d%X_STRONG==0){
                   return Styles.GRID_LINE_STR+' '+Styles.GRID_Y;
               }else{
                   return Styles.GRID_LINE+' '+Styles.GRID_Y;
               }
           });


    }
}

interface IGridParames {
    width?: number;
    height?: number;
    x_step?: number;
    y_step?: number;
    str_StepScale?: number;
}

export {Grid};