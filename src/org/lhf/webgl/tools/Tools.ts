import * as THREE from 'three';
import {CanvasTexture, Texture} from 'three';

/**
 * 工具类
 */
class Tools {
    constructor() {
    }

    public static roundedRect(x: number = 0, y: number = 0, width: number = 100, height: number = 100, radius: number = 25): THREE.Geometry {
        let shape = new THREE.Shape();
        shape.moveTo(x, y + radius);
        shape.lineTo(x, y + height - radius);
        shape.quadraticCurveTo(x, y + height, x + radius, y + height);
        shape.lineTo(x + width - radius, y + height);
        shape.quadraticCurveTo(x + width, y + height, x + width, y + height - radius);
        shape.lineTo(x + width, y + radius);
        shape.quadraticCurveTo(x + width, y, x + width - radius, y);
        shape.lineTo(x + radius, y);
        shape.quadraticCurveTo(x, y, x, y + radius);
        let geometry = new THREE.ShapeGeometry(shape);
        return geometry;
    }

    /**
     * 经纬度 笛卡尔坐标转换
     * @param lat_
     * @param lon_
     * @param radius_
     * @returns {Vector3}
     */
    public static lat_lon2Decare(lat_: number, lon_: number, radius_: number) {
        let y: number = Math.sin(Math.abs(lat_ * Math.PI / 180)) * radius_;
        y = lat_ < 0 ? -y : y;
        let tr: number = Math.cos(Math.abs(lat_ * Math.PI / 180)) * radius_;
        lon_ = lon_ * Math.PI / 180 + Math.PI * 0.5;
        let x: number = Math.sin(lon_) * tr;
        let z: number = Math.cos(lon_) * tr;
        return new THREE.Vector3(x, y, z);
    }

    /**     * 创建虚线轮廓     */
    public static createDottOutLine(shape: THREE.Shape, color: number, x: number, y: number, z: number, rx: number, ry: number, rz: number, s: number) {
        shape.autoClose = true;
        let points = shape.createPointsGeometry(200);
        let line = new THREE.LineSegments(points, new THREE.LineDashedMaterial({
            color: 0xffffff,
            dashSize: 1, gapSize: 3
        }));
        line.scale.set(s, s, s);
        return line;
    }

    /**
     * 添加文字广告牌
     * @param message
     * @param parameters
     * @returns {Sprite}
     */
    public static makeTextTexture(msg_: string, parameters_: IMakeTextTextureParmes = {}): { texture: Texture, tMetrics: TextMetrics } {
        let font: string = parameters_.hasOwnProperty('font') ? parameters_['font'] : 'normal normal normal 30px Airal';
        let color_: string = parameters_.hasOwnProperty('color') ? parameters_['color'] : '#FFFFFF';
        let borderWeight: number = parameters_.hasOwnProperty('borderWeight') ? parameters_['borderWeight'] : 0;
        let borderColor: string = parameters_.hasOwnProperty('borderColor') ? parameters_['borderColor'] : 'rgba(0,0,0,0)';
        let h_align: string = parameters_.hasOwnProperty('h_align') ? parameters_['h_align'] : 'center';
        let v_align: string = parameters_.hasOwnProperty('v_align') ? parameters_['v_align'] : 'middle';
        let w_: number = parameters_.hasOwnProperty('width') ? parameters_['width'] : 300;
        let h_: number = parameters_.hasOwnProperty('height') ? parameters_['height'] : 50;
        let x_: number = parameters_.hasOwnProperty('x') ? parameters_['x'] : 150;
        let y_: number = parameters_.hasOwnProperty('y') ? parameters_['y'] : 25;
        let canvas: HTMLCanvasElement = document.createElement('canvas');
        canvas.width = w_;
        canvas.height = h_;
        let context: CanvasRenderingContext2D = canvas.getContext('2d');
        context.font = font;
        //debugger;
        context.textAlign = h_align;
        context.textBaseline = v_align;
        context.lineWidth = borderWeight;
        context.strokeStyle = borderColor;
        context.strokeText(msg_, x_, y_);
        context.fillStyle = color_;
        let tMetrics: TextMetrics = context.measureText(msg_);
        context.fillText(msg_, x_, y_);
        let texture: CanvasTexture = new CanvasTexture(canvas);
        return {texture: texture, tMetrics: tMetrics};
    }

}

interface IMakeTextTextureParmes {

    /**     * 字体样式     */
    font?: string;

    /**     * 字体颜色     */
    color?: string;

    /**     * 描边粗细     */
    borderWeight?: number;

    /**     * 描边颜色     */
    borderColor?: string;

    /**
     * 水平位置
     * @param start center end left right
     */
    h_align?: string;


    /**
     * 垂直位置
     * @param top middle bottom alphabetic ideographic hanging
     */
    v_align?: string;

    /**     * canvas大小     */
    width?: number;

    /**     * canvas高度     */
    height?: number;

    /**     * 文字在舞台位置     */
    x?: number;

    /**     * 文字在舞台位置     */
    y?: number;
}

export {IMakeTextTextureParmes, Tools};