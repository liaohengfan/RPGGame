/**
 * 二维坐标
 */
class Vec2 {
    x:number;
    y:number;
    w:number;
    h:number;
    constructor(x:number=0,y:number=0){
        this.set(x,y);
    }

    /**
     * 设置位置
     * @param {number} x
     * @param {number} y
     */
    set(x:number,y:number){
        this.x=this.w=x;
        this.y=this.h=y;
    }

    /**     * 复制     */
    copy(vec:Vec2){
        this.set(vec.x||0,vec.y||0);
    }
}
export {Vec2};