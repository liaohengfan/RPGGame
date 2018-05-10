/**
 * author liaohengfan@yeah.net
 * 2018.05.09
 */

import '../styles/main.scss';
import {Common} from "../org/lhf/tools/Common";
import {ResourceInit} from "./common/ResourceInit";
import ResourcesMana from "../org/lhf/webgl/resouces/ResourcesMana";
import RenderMain from "../org/lhf/webgl/core/RenderMain";
import SceneMana from "../org/lhf/webgl/core/SceneMana";
import {MainScene} from "./scenes/MainScene";
import {PanoramaControl} from "../org/lhf/webgl/controls/PanoramaControl";

class Main{
    /**     * div容器     */
    container:HTMLDivElement=null;

    enabled:boolean=true;

    /**     * 公共模块     */
    common:Common;

    /**     * 渲染主管理     */
    renderMain:RenderMain;

    /**     * 场景管理     */
    sceneMana:SceneMana;

    /**     * 主场景     */
    mainScene:MainScene;

    /**     * 控制器     */
    controls:PanoramaControl;

    constructor(){
        console.log('RPG-Game learn');
        this.common=new Common();
        this.resourcesLoad();
    }

    /**     * 初始化公共     */
    private init():void{
        this.container=document.getElementById('webgl_container') as HTMLDivElement;
    }

    /**     * 初始化webgl     */
    private initWebGL():void{
        this.renderMain=new RenderMain(this.container);
        this.sceneMana=new SceneMana(this.renderMain);
        this.controls=new PanoramaControl(this.renderMain.camera,this.container);
        this.mainScene=new MainScene();
        this.sceneMana.setScene('main',this.mainScene);
        this.sceneMana.changeScene('main');
    }

    /**     * 资源加载完成     */
    private resourcesComplete=()=>{
        this.init();
        this.initWebGL();
        this.enterframe();
        this.windowResize();
        this.common.addWDWResize(this.windowResize);
    };

    /**     * 开始加载资源     */
    private resourcesLoad():void{
        ResourceInit.init();

        //绑定事件监听
        let resources: ResourcesMana = ResourcesMana.getInstance();
        //资源加载进度
        resources.setCallBack(this.resourcesComplete);
        resources.startLoad();
    }

    /**     * 循环     */
    enterframe=()=>{
        if(!this.enabled)return;
        this.sceneMana.updata();
        this.controls.tweenUpdate();
        this.renderMain.render();
        requestAnimationFrame(this.enterframe);
    };

    /**     * 窗口大小变化     */
    private windowResize = () => {
        let width_: number = this.container.clientWidth;
        let height_: number = this.container.clientHeight;
        this.renderMain.resize(width_, height_);
    };

}
window.onload=()=>{
  new Main();
};