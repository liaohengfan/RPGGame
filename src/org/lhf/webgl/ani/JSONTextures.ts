/**
 * texturepacker 帧配置
 * 2018.03.01
 */
interface IJSONTexturesFrame {
    /**     * 文件名称     */
    filename: string;

    /**     * 单帧数据     */
    frame: { x: number, y: number, w: number, h: number }

    /**     * 是否旋转     */
    rotated: false,
    trimmed: true,
    /**     * 精灵源大小     */
    spriteSourceSize: { x: number, y: number, w: number, h: number },
    /**     * 精灵源大小     */
    sourceSize: { w: number, h: number }
}

/**
 * texturepacker文件信息
 * 2018.03.01
 */
interface IJSONTexturePack{
    frames:IJSONTexturesFrame[];
    meta:any;
}

export {IJSONTexturesFrame,IJSONTexturePack};