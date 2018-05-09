import * as THREE from 'three';
import {OrbitControls} from "../controls/OrbitControls";

class RenderMain {
    static FOV: number = 60;

    //小行星视角配置
    static SPHERE_RADIUS: number = 1000;
    static FOV_MIN: number = 30;
    static FOV_MAX: number = 80;

    //默认摄像头位置
    static defaultCameraPosition: THREE.Vector3 = new THREE.Vector3(0, 100, 0);

    renderer: THREE.WebGLRenderer;
    scene: THREE.Scene = null;
    camera: THREE.PerspectiveCamera;
    V_WIDTH: number = 1280;
    V_HEIGHT: number = 720;
    domContainer: HTMLElement;
    enabled: boolean = false;
    control: OrbitControls;
    curFov: number = RenderMain.FOV;

    constructor(container_: HTMLElement) {
        this.domContainer = container_;
        this.init();
        this.initScaleControl();
    }

    initScaleControl():void{
        this.control.panorama=true;
        this.control.panoramaIn=(val:number)=>{
            let fov:number=this.curFov/=val;
            fov>RenderMain.FOV_MAX?fov=RenderMain.FOV_MAX:fov;
            this.curFov=fov;
            this.camera.fov=fov;
            this.camera.updateProjectionMatrix();
        };
        this.control.panoramaOut=(val:number)=>{
            let fov:number=this.curFov*=val;
            fov<RenderMain.FOV_MIN?fov=RenderMain.FOV_MIN:fov;
            this.curFov=fov;
            this.camera.fov=fov;
            this.camera.updateProjectionMatrix();
        };
    }

    init() {
        //this.renderer = new THREE.WebGLRenderer({antialias: true, alpha: true});
        this.renderer = new THREE.WebGLRenderer({antialias: true, alpha: false});
        let webglRender: THREE.WebGLRenderer = (this.renderer as THREE.WebGLRenderer);
        webglRender.setClearColor(0x666666, 0);
        this.renderer.setPixelRatio(window.devicePixelRatio);

        let aspect_: number = this.V_WIDTH / this.V_HEIGHT;
        this.camera = new THREE.PerspectiveCamera(RenderMain.FOV, aspect_, .1, 20000);
        this.camera.position.copy(RenderMain.defaultCameraPosition);
        let zero: THREE.Vector3 = new THREE.Vector3();
        this.camera.lookAt(zero);
        this.control = new OrbitControls(this.camera, this.domContainer);
        this.control.update();
        this.domContainer.appendChild(this.renderer.domElement);

        //定时刷新.
        setTimeout(() => {
            this.control.updateStatus = true;
        }, 1);
    }

    render() {
        if (!this.enabled) return;
        //if (!this.control.updateStatus) return;
        //this.control.updateStatus = false;
        this.control.tweenUpdate();
        this.renderer.render(this.scene, this.camera);
    }

    resize(w_: number, h_: number) {
        this.V_HEIGHT = h_;
        this.V_WIDTH = w_;
        this.camera.aspect = this.V_WIDTH / this.V_HEIGHT;
        this.renderer.setSize(w_, h_);
        this.camera.updateProjectionMatrix();

    }
}

export default RenderMain;
