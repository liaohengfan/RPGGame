import * as THREE from 'three';
import {OrbitControls} from "../controls/OrbitControls";

class RenderMain {

    static FOV: number = 60;

    //默认摄像头位置
    static defaultCameraPosition: THREE.Vector3 = new THREE.Vector3(0, 100, 0);

    renderer: THREE.WebGLRenderer;
    scene: THREE.Scene = null;
    camera: THREE.PerspectiveCamera;
    V_WIDTH: number = 1280;
    V_HEIGHT: number = 720;
    domContainer: HTMLElement;
    enabled: boolean = false;

    constructor(container_: HTMLElement) {
        this.domContainer = container_;
        this.init();
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
        this.domContainer.appendChild(this.renderer.domElement);
    }

    render() {
        if (!this.enabled) return;
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
