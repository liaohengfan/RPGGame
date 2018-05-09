import * as THREE from 'three';
import OBJLoader from "../loaders/OBJLoader";
import {MTLLoader} from "../loaders/MTLLoader";
import {HashMap} from "../../core/HashMap";

/** * 模型资源管理 */
class ResourcesMana {
  resourceComplete: boolean = false;
  texturesSourceComplete: boolean = false;
  modelsSourceComplete: boolean = false;
  /**     * 模型hashmap     */
  modelsMap: HashMap;
  modelsBasePath: string = '';
  modelsLists: Array<any> = [];
  modelsCompleteCount: number = 0;

  /**     * 图片hashmap     */
  textureMap: HashMap;
  textureBasePath: string = '';
  textureLists: Array<any> = [];
  textureCompleteCount: number = 0;

  /**     * 进度输出     */
  curProgress: number = 0;
  curProgressCallBack: Function = null;

  /**     * 加载中?     */
  loadingStatus: boolean = false;

  /**     * success CallBack     */
  endCallBack: Function = null;

  public static instance: ResourcesMana = null;

  public static getInstance(): ResourcesMana {
    if (!this.instance) {
      this.instance = new ResourcesMana();
    }
    return this.instance;
  }

  constructor() {
    if (ResourcesMana.instance) {
      throw new Error("资源管理为单列模式！");
    }
    ResourcesMana.instance = this;
    this.modelsMap = new HashMap();
    this.textureMap = new HashMap();
  }

  /**
   * 加载进度输出
   */
  public progressMsg(str: string) {
    if (this.curProgressCallBack) this.curProgressCallBack(str);
  }

  /**     * 绑定加载进度输出     */
  bindLoadProgress(fun: Function) {
    this.curProgressCallBack = fun;
  }

  /**     * 获取进度     */
  public getProgress(pro: number): number {
    let progress: number = 0;
    let total: number = this.textureCompleteCount + this.modelsCompleteCount;
    progress = pro / total;
    progress = progress < this.curProgress ? this.curProgress : progress;
    this.curProgress = Math.round(progress);
    return this.curProgress;
  }

  /**
   * 绑定回调函数
   * @param {Function} callback_
   */
  setCallBack(callback_: Function = function () {
  }) {
    this.endCallBack = callback_;
  }

  /**     * 绑定模型基础位置     */
  public bindModelsBasePath(basePath_: string) {
    this.modelsBasePath = basePath_;
  }

  /**     * 添加模型数据_     */
  public addModels(key_: string, name_: string, types_: string = "json") {
    this.modelsLists.push({key: key_, name: name_, type: types_});
  }

  /**     * 获取模型数据     */
  public getModels(key_: string, clone: boolean = false): THREE.Object3D {
    let models_: THREE.Object3D = this.modelsMap.get(key_);
    let copy_: THREE.Object3D = null;
    if (models_) {
      if (clone) {
        copy_ = models_.clone();
      } else {
        copy_ = models_;
      }
      return copy_;
    } else {
      copy_ = new THREE.Object3D();
    }
    return copy_;
  }

  /**     * 开始加载模型数据     */
  private startLoadModels() {
    this.modelsCompleteCount = this.modelsLists.length;
    if (!this.modelsCompleteCount) {
      this.onModelsCompleteJudage();
    }
    for (let models_ in this.modelsLists) {
      let modelsIni_: any = this.modelsLists[models_];
      if (modelsIni_.type == "json") {
        this.jsonModelsLoader(modelsIni_.key, modelsIni_.name);
      }

      if (modelsIni_.type == "obj") {
        this.objModelsLoader(modelsIni_.key, modelsIni_.name);
      }
    }
  }

  /**     * 加载obj模型     */
  private jsonModelsLoader(key_: string, name_: string) {
    let that_ = this;

    (function (key: string, name: string) {
      let loader = new THREE.JSONLoader();
      let modelURL: string = that_.modelsBasePath + name + '.js';
      loader.load(
        modelURL,
        (geometry, materials) => {
          materials.forEach(function (item) {
            item.side = THREE.DoubleSide;
          });
          let material = new THREE.MultiMaterial(materials);
          let object = new THREE.Mesh(geometry, material);
          that_.modelsMap.put(key, object);
          that_.onModelsLoadSuccess(key);
        }, that_.onModelsLoadProgress, that_.onModelsLoadError);
    })(key_, name_);
  }

  /**     * 加载obj模型     */
  private objModelsLoader(key_: string, name_: string) {
    let that_ = this;
    (function (key: string, name: string) {

      let mtlLoader_: MTLLoader = new MTLLoader();
      mtlLoader_.setPath(that_.modelsBasePath);
      mtlLoader_.load(name + '.mtl', (materials: any) => {

        materials.preload();

        let objLoader_: OBJLoader = new OBJLoader();
        objLoader_.setMaterials(materials);
        objLoader_.setPath(that_.modelsBasePath);
        objLoader_.load(name + '.obj', (object: any) => {
          that_.modelsMap.put(key, object);
          that_.onModelsLoadSuccess(key);
        }, that_.onModelsLoadProgress, that_.onModelsLoadError);

      });


    })(key_, name_);
  }

  /**     * 资源加载完成度判断     */
  private onModelsCompleteJudage() {
    this.modelsCompleteCount--;
    if (this.modelsCompleteCount < 0) {
      this.modelsCompleteCount = 0;
    }
    if (!this.modelsCompleteCount) {
      this.modelsSourceComplete = true;
      this.onResourceCompleteJuage();
    }
  }

  /**    * 模型加载成功     */
  private onModelsLoadSuccess(key: string) {
    //console.log("Success Model:" + key);
    this.onModelsCompleteJudage();
  }

  /**     * 模型加载失败     */
  private onModelsLoadError(e_: any) {
    //console.log("Error Model:" + e_);
    this.onModelsCompleteJudage();
  }

  /**     * 模型加载中     */
  public onModelsLoadProgress(xhr: any) {
    if (xhr.lengthComputable) {
      //console.log('xhr:', xhr);
      let percentComplete = xhr.loaded / xhr.total * 100;
      //console.log(Math.round(percentComplete) + '% downloaded');
      let pro: number = ResourcesMana.getInstance().getProgress(Math.round(percentComplete));
      ResourcesMana.getInstance().progressMsg(pro + '% downloaded');
    }
  }

  /**     * 纹理资源管理     */
  public bindTextureBasePath(basePath: string) {
    this.textureBasePath = basePath;
  }

  public addTexture(key: string, name: string) {
    this.textureLists.push({key: key, name: name});
  }

  public getTexture(key: string): THREE.Texture {
    let texture: THREE.Texture = this.textureMap.get(key);
    let textureCopy: THREE.Texture = null;
    if (texture) {
      textureCopy = texture;
      textureCopy.needsUpdate = true;
    } else {
      console.warn('textures resources file:' + key + ' not found');
      textureCopy = new THREE.Texture();
    }
    return textureCopy;
  }

  /**     * 开始加载模型数据     */
  private startLoadTextures() {
    this.textureCompleteCount = this.textureLists.length;
    if (!this.textureCompleteCount) {
      this.onTexturesCompleteJudage();
    }
    for (let texture in this.textureLists) {
      let textureIni: any = this.textureLists[texture];
      this.texturesLoader(textureIni.key, textureIni.name);
    }
  }

  /**     * 资源加载完成判断     */
  private onResourceCompleteJuage() {
    if (this.modelsSourceComplete && this.texturesSourceComplete) {
      if (!this.resourceComplete) {
        if (this.endCallBack) this.endCallBack();
      }
      this.loadingStatus = false;
      this.resourceComplete = true;
    }

  }

  /**     * 资源加载完成度判断     */
  private onTexturesCompleteJudage() {
    this.textureCompleteCount--;
    if (this.textureCompleteCount < 0) {
      this.textureCompleteCount = 0;
    }

    if (!this.textureCompleteCount) {
      this.texturesSourceComplete = true;
      this.onResourceCompleteJuage();
    }
    this.onResourceCompleteJuage();
  }

  /**    * 模型加载成功     */
  private onTextureLoadSuccess(key: string) {
    //console.log("Success Textures:"+key);
    this.onTexturesCompleteJudage();
  }

  /**     * 模型加载失败     */
  private onTextureLoadError(e_: any) {
    console.log("Error Textures:" + e_);
    this.onTexturesCompleteJudage();
  }

  /**     * 模型加载中     */
  public onTextureLoadProgress(xhr: any) {
    if (xhr.lengthComputable) {
      let percentComplete = xhr.loaded / xhr.total * 100;
      console.log(Math.round(percentComplete) + '% downloaded');
    }
  }

  /**     * 加载贴图文件     */
  private texturesLoader(key_: string, name_: string) {
    let that_ = this;
    (function (key: string, name: string) {
      let loader = new THREE.TextureLoader();
      let textureURL: string = that_.textureBasePath + name;
      loader.load(textureURL, (texture) => {
        texture.needsUpdate = true;
        that_.textureMap.put(key, texture);
        that_.onTextureLoadSuccess(key)
      }, that_.onTextureLoadProgress, that_.onTextureLoadError);
    })(key_, name_);
  }

  /**     * 开始加载     */
  public startLoad() {
    if (this.loadingStatus) return;
    if (this.resourceComplete) {
      if (this.endCallBack) this.endCallBack();
      return;
    }
    this.loadingStatus = true;
    this.startLoadTextures();
    this.startLoadModels();
  }

}

export default ResourcesMana;
