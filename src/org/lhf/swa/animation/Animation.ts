import {ITweenAttr, ITweenStep} from "./IAniInterface";
import {Tween} from "../tween/Tween";
import {TweenMana} from "../tween/TweenMana";
import {Easing} from "../tween/Easing";
import {DIRECT} from "../core/Core";
import {Interpolation} from "../tween/Interpolation";
import {warn} from "../../tools/LHFTools";

class Animation {
    constructor() {
        throw new Error("动画管理主类禁止实例化")
    }

    /**
     * 获取缓动对象
     * @param {number} duration 缓动持续时间
     * @param {ITweenAttr} args  缓动需要调整的属性
     * @returns {Tween} 缓动对象
     */
    private static getTween(duration: number, ...args: ITweenAttr[]): Tween {
        let initIni: any = {};
        let i: number = 0;
        let l: number = args.length;
        let ini: ITweenAttr = null;
        for (i = 0; i < args.length; i++) {
            ini = args[i];
            initIni[ini.name] = ini.initVal;
        }

        let targetIni: any = {};
        for (i = 0; i < args.length; i++) {
            ini = args[i];
            targetIni[ini.name] = ini.targetVal;
        }
        let tween: Tween = new Tween(initIni);
        tween.to(targetIni, duration);
        return tween;
    }

    /**
     * 获取缓动函数
     * @returns {Function}
     */
    private static getEasing(easing: string): Function {
        let easings: string[] = easing.split('|');
        let type: string = easings[0];
        let inout: string = easings[1];
        let easingObj: any = Easing[type];
        if (!easingObj) {
            warn('过度公式:' + easing + ' 不存在 使用默认线性过度');
            return Easing.Linear.None;
        }
        let easingInOut: Function = easingObj[inout];
        if (!easingInOut && !easingObj['In']) {
            warn('过度公式:' + easing + ' 不存在 使用默认线性过度');
            return Easing.Linear.None;
        }
        return easingInOut;
    }

    /**     * 绑定缓动函数     */
    private static bindEasing(easing: string, tween: Tween): boolean {
        if (easing) {
            let ease: any = Animation.getEasing(easing);
            if (ease) {
                tween.easing(ease);
            }
        } else {
            return false;
        }
        return true;
    }

    /**     * 获取定位方向     */
    public static getDirect(direct: DIRECT): string {
        let directStr: string = 'left';
        switch (direct) {
            case DIRECT.L:
                directStr = 'left';
                break;
            case DIRECT.T:
                directStr = 'top';
                break;
            case DIRECT.R:
                directStr = 'right';
                break;
            case DIRECT.B:
                directStr = 'bottom';
                break;
        }
        return directStr;
    }

    /**     * 获取中心点     */
    public static getCenter(direct: DIRECT): string {
        let center: string = '';
        switch (direct) {
            case DIRECT.L:
                center = '0% 50%';
                break;
            case DIRECT.LT:
                center = '0% 0%';
                break;
            case DIRECT.T:
                center = '50% 0%';
                break;
            case DIRECT.RT:
                center = '100% 0%';
                break;
            case DIRECT.R:
                center = '100% 50%';
                break;
            case DIRECT.RB:
                center = '100% 100%';
                break;
            case DIRECT.B:
                center = '50% 100%';
                break;
            case DIRECT.LB:
                center = '0% 100%';
                break;
            default:
                center = '50% 50%';
                break;
        }
        return center;
    }

    /**     * 获取Axis方向     */
    public static getAxisDirect(axis: string): number {
        let sv: number = 0;
        axis = axis.toUpperCase();
        if (axis.indexOf('X|Y') != -1) {
            sv = 0;
        } else if (axis.indexOf('X') != -1) {
            sv = 1;
        } else if (axis.indexOf('Y') != -1) {
            sv = 2;
        } else {
            sv = 0;
        }
        return sv;
    }

    /**     * 创建连续缓动     */
    private static getChainTween(attrNames:string[],initValues:number[],...args:ITweenStep[]):Tween{
        let ini:any={};
        let target:any={};
        let count:number=0;
        let l:number=args.length;
        let step:ITweenStep=null;
        step=args[0];

        let i:number=0;
        let il:number=attrNames.length;
        let attrName:string='';
        for (i = 0; i < il; i++) {
            attrName = attrNames[i];
            ini[attrName]=initValues[i];
            target[attrName]=step.values[i];
        }
        let tween:Tween=new Tween(ini);
        tween.to(target,step.duration);
        tween.onComplete(function () {
            count++;
            if(count>=l){
                return;
            }
            step=args[count];
            for (i = 0; i < il; i++) {
                attrName = attrNames[i];
                target[attrName]=step.values[i];
            }
            tween.to(target,step.duration);
            tween.start();
        });
        return tween;
    }

    /**
     * 获取进入 小时透明度配置
     * @param {boolean} inOut
     * @returns {ITweenAttr}
     */
    private static getInOutOpacity(inOut: boolean): ITweenAttr {
        let opacity: ITweenAttr = {name: "opacity", initVal: 0, targetVal: 1};
        if (!inOut) {
            opacity.initVal = 1;
            opacity.targetVal = 0;
        }
        return opacity;
    }

    /**     * 销毁dom     */
    private static disposeDom(dispose: boolean, domItem: any): boolean {
        try {
            if (dispose == true) {
                let dom: Element = (domItem as Element);
                dom.parentNode.removeChild(dom);
                dom = null;
            }
        } catch (e) {
            return false;
        }
        return true;
    }

    /**
     * 淡入 淡出
     * @param target 缓动对象
     * @param {number} duration  持续时间
     * @param {boolean} disposeDom 完成后是否移除dom
     * @param {string} easing 过度函数
     * @returns {boolean} 创建是否成功
     */
    public static createFade(inOut: boolean, target: any, duration: number = 1000, disposeDom?: boolean, easing?: string): boolean {
        let opacityIni: ITweenAttr = Animation.getInOutOpacity(inOut);
        let tween: Tween = Animation.getTween(
            duration,
            opacityIni
        );
        tween.onUpdate(function () {
            target.style.opacity = this.opacity;
        })
            .onComplete(function () {
                Animation.disposeDom(disposeDom, target);//销毁dom
                tween = null;
            });
        /**         * 绑定缓动         */
        Animation.bindEasing(easing, tween);
        tween.start();
        return true;
    }


    /**
     * 移入
     * @param target
     * @param {number} duration
     * @param {string} direct
     * @param {number} distance
     * @param {boolean} disposeDom
     * @param {string} easing
     * @returns {boolean}
     */
    public static createMove(inOut: boolean,
                             target: any,
                             duration: number = 1000,
                             direct: DIRECT,
                             sDistance: number,
                             eDistance: number,
                             uint: string,
                             transparent: boolean = true,
                             disposeDom?: boolean,
                             easing?: string): boolean {
        let moveItem: ITweenAttr = {name: "", initVal: sDistance, targetVal: eDistance};
        moveItem.name = Animation.getDirect(direct);//获取方向
        let opacity: ITweenAttr = Animation.getInOutOpacity(inOut);
        if (!transparent) {
            opacity.initVal = 1;
            opacity.targetVal = 1;
        }
        let tween: Tween = Animation.getTween(
            duration,
            moveItem,
            opacity
        );
        tween.onUpdate(function () {
            target.style.opacity = this.opacity;
            target.style[moveItem.name] = this[moveItem.name] + uint;
        })
            .onComplete(function () {
                Animation.disposeDom(disposeDom, target);//销毁dom
                tween = null;
            });
        /**         * 绑定缓动         */
        Animation.bindEasing(easing, tween);
        tween.start();
        return true;
    }

    /**
     * 弹入
     * @param target
     * @param {number} duration
     * @param {DIRECT} direct
     * @param {number} sDistance
     * @param {number} eDistance
     * @param {string} uint
     * @param {boolean} transparent
     * @param {boolean} disposeDom
     * @param {string} easing
     * @returns {boolean}
     */
    static createBounce(inOut: boolean,
                        target: any,
                        duration: number = 1000,
                        st: string,
                        sScale: number,
                        eScale: number,
                        transparent?: boolean,
                        disposeDom?: boolean,
                        easing?: string): boolean {
        let scaleIni: ITweenAttr = {name: "scale", initVal: sScale, targetVal: eScale};
        let tween: Tween = null;
        let opacityIni: ITweenAttr = Animation.getInOutOpacity(inOut);
        if (!transparent) {
            opacityIni.initVal = 1;
            opacityIni.targetVal = 1;
        }
        tween = Animation.getTween(
            duration,
            scaleIni,
            opacityIni
        );
        let sv: number = Animation.getAxisDirect(st);
        let s1: string = '';
        let s2: string = '';
        if (sv == 1) {
            s1 = 'scale3d(';
            s2 = ',1,1)';
        } else if (sv == 2) {
            s1 = 'scale3d(1,';
            s2 = ',1)';
        } else {
            s1 = 'scale(';
            s2 = ')'
        }
        tween.onUpdate(function () {
            target.style.opacity = this.opacity;
            target.style.transform = s1 + this.scale + s2;
        })
            .onComplete(function () {
                Animation.disposeDom(disposeDom, target);//销毁dom
                tween = null;
            });
        /**         * 绑定缓动         */
        Animation.bindEasing(easing, tween);
        tween.start();
        return true;
    }

    /**
     * 翻转 进入 / 消失
     * @param target
     * @param {number} duration
     * @param {string} st
     * @param {number} sScale
     * @param {number} eScale
     * @param {boolean} disposeDom
     * @param {string} easing
     * @returns {boolean}
     */
    static createRotate(inOut: boolean,
                        target: any,
                        duration: number = 1000,
                        st: string,
                        perspective?: string,
                        disposeDom?: boolean,
                        easing?: string): boolean {
        perspective = perspective || 'perspective(600px)';
        let rotateIni: ITweenAttr = {name: "rotate", initVal: 90, targetVal: 0};
        if (!inOut) {
            rotateIni.initVal = 0;
            rotateIni.targetVal = 90;
        }
        let opacityIni: ITweenAttr = Animation.getInOutOpacity(inOut);
        let tween: Tween = Animation.getTween(
            duration,
            rotateIni,
            opacityIni
        );
        let sv: number = Animation.getAxisDirect(st);
        sv == 0 ? sv = 1 : sv;
        let r1: string = '';
        let r2: string = 'deg)';
        if (sv == 1) {
            r1 = perspective + ' rotateX(';
        } else {
            r1 = perspective + ' rotateY('
        }
        tween.onUpdate(function () {
            target.style.opacity = this.opacity;
            target.style.transform = r1 + this.rotate + r2;
        })
            .onComplete(function () {
                Animation.disposeDom(disposeDom, target);//销毁dom
                tween = null;
            });
        /**         * 绑定缓动         */
        Animation.bindEasing(easing, tween);
        tween.start();
        return true;
    }

    /**
     * 滚动进入
     * @param target
     * @param {number} duration
     * @param {string} st
     * @param {number} sScale
     * @param {number} eScale
     * @param {boolean} disposeDom
     * @param {string} easing
     * @returns {boolean}
     */
    static createRoll(inOut: boolean,
                      target: any,
                      duration: number = 1000,
                      direct: DIRECT,
                      sDistance: number,
                      eDistance: number,
                      uint: string,
                      deg: number = 180,
                      transparent: boolean = true,
                      disposeDom?: boolean,
                      easing?: string): boolean {
        let moveItem: ITweenAttr = {name: "", initVal: sDistance, targetVal: eDistance};
        moveItem.name = Animation.getDirect(direct);//获取方向

        //旋转配置
        let initR: number = 0;
        let endR: number = 0;
        if (moveItem.initVal > moveItem.targetVal) {//
            initR = deg;
        } else {
            initR = -deg;
        }
        let rotateItem: ITweenAttr = {name: "rotateZ", initVal: initR, targetVal: endR};
        let opacity: ITweenAttr = Animation.getInOutOpacity(inOut);
        if (!inOut) {
            rotateItem.initVal = 0;
            rotateItem.targetVal = deg;
        }
        if (!transparent) {
            opacity.initVal = 1;
            opacity.targetVal = 1;
        }
        let tween: Tween = Animation.getTween(
            duration,
            rotateItem,
            moveItem,
            opacity
        );
        tween.onUpdate(function () {
            target.style.opacity = this.opacity;
            target.style.transform = 'rotateZ(' + this.rotateZ + 'deg)';
            target.style[moveItem.name] = this[moveItem.name] + uint;
        })
            .onComplete(function () {
                Animation.disposeDom(disposeDom, target);//销毁dom
                tween = null;
            });
        /**         * 绑定缓动         */
        Animation.bindEasing(easing, tween);
        tween.start();
        return true;
    }

    /**
     * 偏移  倾斜进入
     * @param target
     * @param {number} duration
     * @param {DIRECT} direct
     * @param {number} sDistance
     * @param {number} eDistance
     * @param {string} uint
     * @param {boolean} transparent
     * @param {boolean} disposeDom
     * @param {string} easing
     * @returns {boolean}
     */
    static createSkew(inOut: boolean,
                      target: any,
                      duration: number = 1000,
                      direct: DIRECT,
                      sDistance: number,
                      eDistance: number,
                      uint: string,
                      transparent: boolean = true,
                      disposeDom?: boolean,
                      easing?: string): boolean {
        let moveItem: ITweenAttr = {name: "", initVal: sDistance, targetVal: eDistance};
        moveItem.name = Animation.getDirect(direct);//获取方向
        let skewIni: ITweenAttr = {name: "skew", initVal: 40, targetVal: 0};

        let opacity: ITweenAttr = Animation.getInOutOpacity(inOut);
        if (!inOut) {
            skewIni.initVal = 0;
            skewIni.targetVal = 40;
        }
        if (!transparent) {
            opacity.initVal = 1;
            opacity.targetVal = 1;
        }

        let skewStr1: string = 'skew(';
        let skewStr2: string = 'deg,0deg)';
        let tween: Tween = Animation.getTween(
            duration,
            moveItem,
            skewIni,
            opacity
        );
        tween.interpolation(Interpolation.Bezier);
        tween.onUpdate(function () {
            target.style.opacity = this.opacity;
            target.style[moveItem.name] = this[moveItem.name] + uint;
            target.style.transform = skewStr1 + this.skew + skewStr2;
        })
            .onComplete(function () {
                Animation.disposeDom(disposeDom, target);//销毁dom
                tween = null;
            });
        /**         * 绑定缓动         */
        Animation.bindEasing(easing, tween);
        tween.start();
        return true;
    }

    /**
     * 旋转 缩放进入  魔幻进入...
     * @param target
     * @param {number} duration
     * @param {boolean} transparent
     * @param {boolean} disposeDom
     * @param {string} easing
     * @returns {boolean}
     */
    static createRotateScaleIn(target: any,
                               duration: number = 1000,
                               transparent: boolean = true,
                               disposeDom?: boolean,
                               easing?: string): boolean {
        //旋转配置
        let initR: number = -360;
        let endR: number = 0;
        let rotateItem: ITweenAttr = {name: "rotateZ", initVal: initR, targetVal: endR};
        let opacity: ITweenAttr = {name: "opacity", initVal: 0, targetVal: 1};
        let scale: ITweenAttr = {name: "scale", initVal: .1, targetVal: 1};
        let centerIniL: ITweenAttr = {name: "centerL", initVal: 50, targetVal: 0};
        let centerIniT: ITweenAttr = {name: "centerT", initVal: 150, targetVal: 100};
        if (!transparent) {
            opacity.initVal = 1;
        }
        let tween: Tween = Animation.getTween(
            duration,
            rotateItem,
            centerIniL,
            centerIniT,
            scale,
            opacity
        );
        tween.onUpdate(function () {
            target.style.opacity = this.opacity;
            target.style.transform = 'rotateZ(' + this.rotateZ + 'deg) scale(' + this.scale + ')';
            target.style.transformOrigin = this.centerL + '% ' + this.centerT + "%";
        })
            .onComplete(function () {
                Animation.disposeDom(disposeDom, target);//销毁dom
                tween = null;
            });
        /**         * 绑定缓动         */
        Animation.bindEasing(easing, tween);
        tween.start();
        return true;
    }

    /**
     * 创建掉落效果
     * @param {Element} div
     * @param {number} durtion
     * @param {DIRECT} direct
     */
    static createDrop(target: any, rt: number, dt: number, dDistance: number, uint: string, direct: DIRECT, disposeDom: boolean) {
        let center: string = Animation.getCenter(direct);
        target.style.transformOrigin = center;//设置中心点
        let deg: number = 0;
        switch (direct) {
            case DIRECT.LT:
                deg = 45;
                break;
            case DIRECT.RT:
                deg = -45;
                break;
            case DIRECT.LB:
                deg = 135;
                break;
            case DIRECT.RB:
                deg = -135;
                break;
        }

        //旋转
        let rotateIni: ITweenAttr = {name: 'rotateZ', initVal: 0, targetVal: deg};
        let rotateTween: Tween = Animation.getTween(rt, rotateIni);
        rotateTween.onUpdate(function () {
            target.style.transform = 'rotateZ(' + this.rotateZ + 'deg)';
        });
        Animation.bindEasing('Back|Out', rotateTween);//绑定缓动

        //掉落
        let dropIni: ITweenAttr = {name: 'top', initVal: 0, targetVal: dDistance};
        let dropTween: Tween = Animation.getTween(dt, dropIni);
        dropTween.delay(200);
        dropTween.onUpdate(function () {
            console.log('top:', this.top);
            target.style.top = this.top + uint;
        });
        dropTween.onComplete(function () {
            Animation.disposeDom(disposeDom, target);//销毁dom
            dropTween = null;
            rotateTween = null;
        });

        //关联
        rotateTween.chain(dropTween);
        rotateTween.start();
    }

    /**     * 摇摆     */
    static createSwing(target:any):boolean{
        let center:string='50% 300%';
        target.style.transformOrigin=center;
        let tween:Tween=Animation.getChainTween(['rotate'],[0],
            {values:[2],duration:200},
            {values:[-2],duration:200},
            {values:[1],duration:200},
            {values:[-1],duration:200},
            {values:[0],duration:200}
            );
        tween.onUpdate(function () {
            target.style.transform='rotateZ('+this.rotate+'deg)';
        });
        tween.start();
        return true;
    }

    /**     * 缩放抖动     */
    static createScaleShake(target:any):boolean{
        let tween:Tween=Animation.getChainTween(['scaleX','scaleY'],[1,1],
            {values:[1.2,.8],duration:600},
            {values:[.7,1.3],duration:200},
            {values:[1.1,.8],duration:300},
            {values:[.9,1.1],duration:200},
            {values:[1,1],duration:200},
            );
        tween.onUpdate(function () {
            target.style.transform='scale('+this.scaleX+','+this.scaleY+')';
        });
        tween.start();
        return true;
    }

    /**
     * 翻转效果
     * @param target
     */
    static createFlip(target: any):boolean {
        let tween:Tween=Animation.getChainTween(['rotateY','transZ'],[0,0],
            {values:[180,200],duration:600},
            {values:[360,0],duration:600}
        );
        tween.onUpdate(function () {
            target.style.transform='perspective(600px) translateZ('+this.transZ+'px) rotateY('+this.rotateY+'deg)';
        });
        tween.start();
        return true;

    }

    /**     * 悬摆     */
    static createSusRotate(target:any):boolean{
        target.style.transformOrigin=Animation.getCenter(DIRECT.C);
        let tween:Tween=Animation.getChainTween(['rotateZ'],[0,0],
            {values:[-20],duration:200},
            {values:[20],duration:180},
            {values:[-10],duration:150},
            {values:[10],duration:130},
            {values:[-5],duration:100},
            {values:[5],duration:80},
            {values:[0],duration:50}
        );
        tween.onUpdate(function(){
            target.style.transform='rotateZ('+this.rotateZ+'deg)';
        });
        tween.start();
        return true;
    }

    /**     * 闪烁     */
    static createFlash(target:any):boolean{
        let tween:Tween=Animation.getChainTween(['opacity'],[1],
            {values:[0],duration:230},
            {values:[1],duration:230},
            {values:[0],duration:220},
            {values:[1],duration:210}
        );
        tween.onUpdate(function(){
            target.style.opacity=this.opacity;
        });
        tween.start();
        return true;
    }

    /**     * 向下滑动     */
    static createSlideDown(target:any):boolean{
        let height:number=target.clientHeight;
        let tween:Tween=Animation.getChainTween(['top'],[0],
            {values:[height],duration:1000},
            {values:[0],duration:10}
        );
        tween.onUpdate(function(){
            target.style.top=this.top+'px';
        });
        tween.start();
        return true;
    }

    /**     * 向上滑动     */
    static createSlideUp(target:any):boolean{
        let height:number=-target.clientHeight;
        let tween:Tween=Animation.getChainTween(['top'],[0],
            {values:[height],duration:1000},
            {values:[0],duration:10}
        );
        tween.onUpdate(function(){
            target.style.top=this.top+'px';
        });
        tween.start();
        return true;
    }

    /**     * 放大抖动     */
    static createScaleSus(target:any):boolean{
        target.style.transformOrigin=Animation.getCenter(DIRECT.C);
        let tween:Tween=Animation.getChainTween(['s','r'],[1,0],
            {values:[.9,-10],duration:200},
            {values:[1.2,0],duration:300},
            {values:[1.2,10],duration:200},
            {values:[1.2,-10],duration:200},
            {values:[1.2,10],duration:200},
            {values:[1,0],duration:200},
        );
        tween.onUpdate(function(){
            target.style.transform='scale('+this.s+') rotateZ('+this.r+'deg)';
        });
        tween.start();
        return true;
    }

    /**     * 拉升摆动     */
    static createSkewSus(target:any):boolean{
        let step:number=10;
        let tween:Tween=Animation.getChainTween(['sx','sy'],[0,0],
            {values:[-step,-step*2],duration:200},
            {values:[step,step*2],duration:200},
            {values:[-step,-step*2],duration:200},
            {values:[step,step*2],duration:200},
            {values:[0,0],duration:200}
        );
        tween.onUpdate(function(){
            target.style.transform='skew('+this.sx+'deg,'+this.sy+'deg)';
        });
        tween.start();
        return true;
    }

    /**     * 动画刷新     */
    static update() {
        TweenMana.update();
    }
}

export {Animation};