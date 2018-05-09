import {PerspectiveCamera, Spherical, Vector3} from 'three';
import {Tween} from '../../swa/tween/Tween';
import {LHFEventDispatcher} from '../../core/LHFEventDispatcher';
import {ZYEvent} from '../../../../com/events/ZYEvents';

/**
 * 小行星视角入场动画
 */
class OutLittlePlane extends LHFEventDispatcher{
    camera: PerspectiveCamera;
    tweenIni: LittlePlaneSpherical;
    tween: Tween;
    centerPos: Vector3 = null;
    completeFun:Function=null;
    constructor(camera: PerspectiveCamera,
                littleS: { radius: number, phi: number, theta: number, fov: number },
                initS: { radius: number, phi: number, theta: number, fov: number },
                centerVec3: Vector3 = new Vector3()) {
        super();
        this.camera = camera;
        this.centerPos = centerVec3;
        this.tweenIni = new LittlePlaneSpherical();

        //小行星视角位置
        this.tweenIni.little_radius = littleS.radius;
        this.tweenIni.little_phi = littleS.phi;
        this.tweenIni.little_theta = littleS.theta;
        this.tweenIni.little_fov = littleS.fov;

        //视角正常位置
        this.tweenIni.init_radius = initS.radius;
        this.tweenIni.init_phi = initS.phi;
        this.tweenIni.init_theta = initS.theta;
        this.tweenIni.init_fov = initS.fov;
        this.init();
    }

    /**     * 小行星视角退出完成     */
    outComplete = () => {
        this.dispatchEvent({type:ZYEvent.LITTLE_IN_SCENE_END});//小行星入场效果完成
    };

    /**     * 小行星视角退出刷新     */
    outUpdate = () => {
        this.updateCameraPos();
    };

    /**     * 刷新摄像头位置     */
    updateCameraPos(): void {
        this.camera.fov = this.tweenIni.fov;
        this.camera.position.setFromSpherical(this.tweenIni);
        this.camera.lookAt(this.centerPos);
        this.camera.updateProjectionMatrix();
    }

    /**     * 开始退出动画     */
    public startAni(time: number = 3000, delay: number = 0): void {
        this.tweenIni.inLittlePos();//切换到小行星视角位置
        this.updateCameraPos();//刷新摄像头配置
        this.tween.to(this.tweenIni.getInitSpherical(), time);
        this.tween.delay(delay);
        this.tween.start();
    }

    private init(): void {
        this.tween = new Tween(this.tweenIni);
        this.tween.onComplete(this.outComplete);
        this.tween.onUpdate(this.outUpdate);
    }
}

/** * 小行星球体 */
class LittlePlaneSpherical extends Spherical {

    /**     * 小行星半径     */
    little_radius: number;

    /**     * 水平面位置     */
    little_phi: number;

    /**     * 垂直面位置     */
    little_theta: number;

    /**     * 小行星视角fov     */
    little_fov: number;


    /**     * 正常视角半径     */
    init_radius: number;

    /**     * 水平面位置     */
    init_phi: number;

    /**     * 垂直面位置     */
    init_theta: number;

    /**     * 正常视角fov     */
    init_fov: number;

    /**     * 视角fov     */
    fov: number;

    constructor() {
        super();
    }

    /**
     * 获取正常视角空间极坐标
     * @returns {{radius: number; phi: number; theta: number}}
     */
    getInitSpherical(): { radius: number, phi: number, theta: number, fov: number } {
        return {
            radius: this.init_radius,
            phi: this.init_phi,
            theta: this.init_theta,
            fov: this.init_fov
        };
    }

    /**
     * 获取小行星视角空间极坐标
     * @returns {{radius: number; phi: number; theta: number}}
     */
    getLittleSpherical(): { radius: number, phi: number, theta: number, fov: number } {
        return {
            radius: this.init_radius,
            phi: this.little_phi,
            theta: this.little_theta,
            fov: this.little_fov
        };
    }

    /**     * 切换到小行星视角坐标     */
    inLittlePos(): void {
        this.phi = this.little_phi;
        this.theta = this.little_theta;
        this.radius = this.little_radius;
        this.fov = this.little_fov;
    }

    /**     * 切换到正常视角空间极坐标     */
    inInitPos(): void {
        this.phi = this.init_phi;
        this.theta = this.init_theta;
        this.radius = this.init_radius;
        this.fov = this.init_fov;
    }

}

export {OutLittlePlane, LittlePlaneSpherical};