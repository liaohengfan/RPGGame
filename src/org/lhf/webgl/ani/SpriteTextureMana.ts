/**
 * Sprite 图像 纹理管理
 */
import {HashMap} from "../../core/HashMap";
import {ClampToEdgeWrapping, EventDispatcher, FileLoader, Texture} from "three";

class SpriteTextureMana extends EventDispatcher {
    public static instance: SpriteTextureMana = null;

    public static getInstance(): SpriteTextureMana {
        if (!this.instance) {
            this.instance = new SpriteTextureMana();
        }
        return this.instance;
    }

    /**     * 纹理hash表     */
    textureHash: HashMap;

    /**     * 详情hash表     */
    framesHash: HashMap;

    loader: FileLoader;
    enabled: boolean = false;

    image: HTMLImageElement = null;
    imageW: number = 0;
    imageH: number = 0;
    imageTotal: number = 0;

    constructor() {
        super();
        if (SpriteTextureMana.instance) {
            throw new Error("资源管理为单列模式！");
        }
        this.init();
    }

    init(): void {
        this.loader = new FileLoader();
        this.textureHash = new HashMap();
        this.framesHash = new HashMap();
    }

    /**     * 获取纹理配置     */
    getFramesJson(url: string): void {
        if(this.enabled)return;
        this.loader.load(url,
            (data: any) => {
                this.parseFrames(data);
            },
            (xhr: any) => {
                console.log((xhr.loaded / xhr.total * 100) + '% loaded');
            },
            (err: any) => {
                console.error('An error happened');
            }
        );
    }

    /**     * 处理纹理配置     */
    parseFrames(data: any): void {
        let jsons: any = JSON.parse(data);
        let frames: ISpriteTextureIni[] = jsons.frames || [];
        let frame: ISpriteTextureIni = null;
        this.imageW = jsons.meta.size.w;
        this.imageH = jsons.meta.size.h;
        this.imageTotal = jsons.frames.length;
        for (var i = 0; i < frames.length; i++) {
            frame = frames[i];
            this.framesHash.put(frame.filename, frame);
        }
        this.enabled=true;
    }

    /**     * 绑定图片     */
    bindImage(image: HTMLImageElement) {
        console.log('bind image');
        this.image = image;
    }

    /**     * 获取纹理     */
    getTexture(name: string): Texture {
        let texture: Texture = this.textureHash.get(name);
        if (!texture) {
            texture = this.createTexture(name);
        }
        return texture;
    }

    /**     * 创建纹理     */
    private createTexture(name: string): Texture {
        let texture: any = this.textureHash.get(name);
        if (texture) {
            return texture;
        }
        if (!this.image) {
            throw new Error('缺少纹理原始图片');
        }
        texture = new Texture(this.image);
        texture.wrapT = texture.wrapS = ClampToEdgeWrapping;
        texture.needsUpdate = true;
        let ini: ISpriteTextureIni = this.framesHash.get(name);
        let repeatY: number = (1 / (this.imageH / ini.frame.h));
        let offy: number = (1 - ((ini.frame.y + ini.frame.h) / this.imageH));
        let offx: number = (-30 / this.imageW) - .5;
        texture.repeat.set(1.21, repeatY);
        texture.offset.set(offx, offy);
        this.textureHash.put(name, texture);
        return texture;
    }

}

interface ISpriteTextureIni {
    filename: string;
    frame: { x: number, y: number, w: number, h: number };
    rotated: boolean;
    trimmed: boolean;
    spriteSourceSize: { x: number, y: number, w: number, h: number };
    sourceSize: { w: number, h: number };
}

export {SpriteTextureMana, ISpriteTextureIni};