/** * 缓动对象 */
import {Easing} from "./Easing";
import {Interpolation} from "./Interpolation";
import {TweenMana} from "./TweenMana";

class Tween {
    object: any;
    valuesStart: any = {};
    valuesEnd: any = {};
    valuesStartRepeat: any = {};
    duration: number = 1000;
    repeatVal: number = 0;
    repeatDelayTime: number = 0;
    yoyoVal: boolean = false;
    isPlaying: boolean = false;
    reversed: boolean = false;
    delayTime: number = 0;
    startTime: number = null;
    easingFunction: Function = Easing.Linear.None;
    interpolationFunction: Function = Interpolation.Linear;
    chainedTweens: any = [];
    onStartCallback: Function = null;
    onStartCallbackFired: boolean = false;
    onUpdateCallback: Function = null;
    onCompleteCallback: Function = null;
    onStopCallback: Function = null;

    constructor(object_:any){
        this.object=object_;
    }

    to(properties: any, duration: number): Tween {
        this.valuesEnd = properties;
        if (typeof duration != 'undefined') {
            this.duration = duration;
        }
        return this;
    }

    start(time?: number): Tween {
        TweenMana.add(this);
        this.isPlaying = true;
        this.onStartCallbackFired = false;
        this.startTime = (time !== undefined ? time : TweenMana.now());
        this.startTime += this.delayTime;
        let valuesStart: any = this.valuesStart;
        let valuesEnd: any = this.valuesEnd;
        let object: any = this.object;
        for (let property in valuesEnd) {

            /**             * 判断数组是否为属性值             */
            if (valuesEnd[property] instanceof Array) {

                if (valuesEnd[property].length === 0) {
                    continue;
                }

                /**                 * 创建属性副本                 */
                valuesEnd[property] = [object[property]].concat(valuesEnd[property]);

            }

            /**             * 过度指定的一个对象属性不存在 则跳过             */
            if (object[property] === undefined) {
                continue;
            }

            /**             * 存储初始值             */
            valuesStart[property] = object[property];

            if ((valuesStart[property] instanceof Array) === false) {
                /**                 * 警告 ! 使用过程中确保为数值  而不是字符串                 */
                valuesStart[property] *= 1.0;
            }

            this.valuesStartRepeat[property] = valuesStart[property] || 0;

        }
        return this;
    }

    stop(): Tween {
        if (!this.isPlaying) {//非播放状态返回  不执行下面代码
            return this;
        }
        TweenMana.remove(this);
        this.isPlaying = false;
        if (this.onStopCallback != null) {
            this.onStopCallback.call(this.object, this.object);
        }
        this.stopChainedTweens();
        return this;
    }

    end(): Tween {
        this.update(this.startTime+this.duration);
        return this;
    }

    stopChainedTweens() {
        let i: number = 0;
        let numChainedTweens: number = this.chainedTweens.length;
        for (i = 0; i < numChainedTweens; i++) {
            this.chainedTweens[i].stop();
        }
    }

    delay(amount: number): Tween {
        this.delayTime = amount;
        return this;
    }

    repeat(times: number): Tween {
        this.repeatVal = times;
        return this;
    }

    repeatDelay(amount: number): Tween {
        this.repeatDelayTime = amount;
        return this;
    }

    yoyo(val: boolean): Tween {
        this.yoyoVal = val;
        return this;
    }

    easing(easing: Function): Tween {
        this.easingFunction = easing;
        return this;
    }

    interpolation(interVal: Function): Tween {
        this.interpolationFunction = interVal;
        return this;
    }

    chain(...args:any[]): Tween {
        this.chainedTweens = args;
        return this;
    }

    onStart(cb: Function): Tween {
        this.onStartCallback = cb;
        return this;
    }

    onUpdate(cb: Function): Tween {
        this.onUpdateCallback = cb;
        return this;
    }

    onComplete(cb: Function): Tween {
        this.onCompleteCallback = cb;
        return this;
    }

    onStop(cb: Function): Tween {
        this.onStopCallback = cb;
        return this;
    }

    update(time: number) {
        let property: any;
        let elapsed: number;
        let value: number;
        let object: any = this.object;
        let valuesStart: any = this.valuesStart;
        let valuesEnd: any = this.valuesEnd;
        let valuesStartRepeat: any = this.valuesStartRepeat;
        let duration: number = this.duration;
        let repeatVal: number = this.repeatVal;
        let repeatDelayTime: number = this.repeatDelayTime;
        let yoyoVal: boolean = this.yoyoVal;
        let isPlaying: boolean = this.isPlaying;
        let reversed: boolean = this.reversed;
        let delayTime: number = this.delayTime;
        let startTime: number = this.startTime;
        let easingFunction: Function = this.easingFunction;
        let interpolationFunction: Function = this.interpolationFunction;
        let chainedTweens: any = this.chainedTweens;
        let onStartCallback: Function = this.onStartCallback;
        let onStartCallbackFired: boolean = this.onStartCallbackFired;
        let onUpdateCallback: Function = this.onUpdateCallback;
        let onCompleteCallback: Function = this.onCompleteCallback;
        let onStopCallback: Function = this.onStopCallback;

        if (time < startTime) {
            return true;
        }

        if (onStartCallbackFired === false) {

            if (onStartCallback !== null) {
                onStartCallback.call(object, object);
            }

            onStartCallbackFired = true;
        }

        elapsed = (time - startTime) / duration;
        elapsed = elapsed > 1 ? 1 : elapsed;

        value = easingFunction(elapsed);

        for (property in valuesEnd) {

            /**             * 对象中不存在的属性 则跳过             */
            if (valuesStart[property] === undefined) {
                continue;
            }

            let start = valuesStart[property] || 0;
            let end = valuesEnd[property];

            if (end instanceof Array) {

                object[property] = interpolationFunction(end, value);

            } else {

                /**                 * 处理结束值                 */
                if (typeof (end) === 'string') {

                    if (end.charAt(0) === '+' || end.charAt(0) === '-') {
                        end = start + parseFloat(end);
                    } else {
                        end = parseFloat(end);
                    }
                }

                /**                 * 确保为数值                 */
                if (typeof (end) === 'number') {
                    object[property] = start + (end - start) * value;
                }

            }

        }

        if (onUpdateCallback !== null) {
            onUpdateCallback.call(object, value);
        }

        if (elapsed === 1) {

            if (repeatVal > 0) {

                if (isFinite(repeatVal)) {
                    repeatVal--;
                }

                /**                 * 重新设置参数值 设置时间                 */
                for (property in valuesStartRepeat) {

                    if (typeof (valuesEnd[property]) === 'string') {
                        valuesStartRepeat[property] = valuesStartRepeat[property] + parseFloat(valuesEnd[property]);
                    }

                    if (yoyoVal) {
                        let tmp = valuesStartRepeat[property];

                        valuesStartRepeat[property] = valuesEnd[property];
                        valuesEnd[property] = tmp;
                    }

                    valuesStart[property] = valuesStartRepeat[property];

                }

                if (yoyoVal) {
                    reversed = !reversed;
                }

                if (repeatDelayTime !== undefined) {
                    startTime = time + repeatDelayTime;
                } else {
                    startTime = time + delayTime;
                }

                return true;

            } else {

                if (onCompleteCallback !== null) {

                    onCompleteCallback.call(object, object);
                }

                for (let i = 0, numChainedTweens = chainedTweens.length; i < numChainedTweens; i++) {

                    /**                     * 链式启动                     */
                    chainedTweens[i].start(startTime + duration);
                }

                return false;

            }

        }

        return true;
    }
}

export {Tween};