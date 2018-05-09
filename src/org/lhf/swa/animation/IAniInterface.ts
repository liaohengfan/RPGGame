interface ITweenAttr{
    name:string;
    initVal:number;
    targetVal:number;
}
interface ITweenStep{
    values:number[];
    duration:number;
}
export {ITweenAttr,ITweenStep};