interface IMarkerParames{

    /**     * 坐标系的区域     */
    viewBox?:string;

    /**     * 在 viewBox 内的基准点，绘制时此点在直线端点上（要注意大小写）     */
    refX?:string;

    /**     * 在 viewBox 内的基准点，绘制时此点在直线端点上（要注意大小写）     */
    refY?:string;

    /**     * 	标识大小的基准，有两个值：strokeWidth（线的宽度）和userSpaceOnUse（图形最前端的大小）     */
    markerUnits?:string;

    /**     * 标识的大小     */
    markerWidth?:string;

    /**     * 标识的大小     */
    markerHeight?:string;

    /**     * 	绘制方向，可设定为：auto（自动确认方向）和 角度值     */
    orient?:string;

    /**     * 标识的id号     */
    id?:string;

    /**     * 路径样式     */
    url?:string;
}

interface ILineMarkerParams{
    start?:string;
    mid?:string;
    end?:string;
}

export {IMarkerParames,ILineMarkerParams};