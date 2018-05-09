/**
 * 缓动管理类
 * by liaohengfan@yeah.net
 * 2017.12.4
 */
import {Tween} from "./Tween";

class TweenMana{
    static tweens:Tween[]=[];
    constructor(){
        throw new Error("缓动管理禁止实例化!");
    }

    /**
     * 获取当前时间
     * @returns {number}
     */
    static now():number{
        return new Date().getTime();
    }
    static getAll():Tween[]{
        return TweenMana.tweens;
    }
    static removeAll():void{
        TweenMana.tweens=[];
    }
    static add(tween:Tween):void{
        TweenMana.tweens.push(tween);
    }
    static remove(tween:Tween):void{
        let index:number=TweenMana.tweens.indexOf(tween);
        if(index!=-1){
            TweenMana.tweens.splice(index,1);
        }
    }

    /**
     * 刷新所有字缓动对象
     * @param {number} time
     * @param {boolean} preserve
     * @returns {boolean}
     */
    static update(time?:number,preserve?:boolean):boolean{
        const tweens:Tween[]=TweenMana.tweens;
        if(!tweens.length){return false}
        let i:number=0;
        time = time !== undefined ? time : TweenMana.now();
        while (i < tweens.length) {

            if (tweens[i].update(time) || preserve) {
                i++;
            } else {
                tweens.splice(i, 1);
            }

        }

        return true;
    }
}

export {TweenMana};