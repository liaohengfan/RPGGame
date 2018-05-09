import OBJLoader from "../loaders/OBJLoader";
import {MTLLoader} from "../loaders/MTLLoader";
import {HashMap} from "../../core/HashMap";
import {Object3D} from "three";

declare let zip: any;
// waring import zip .js
// <script src="assets/js/zip/zip.js"></script>
// <script src="assets/js/zip/zip-fs.js"></script>
// <script src="assets/js/zip/zip-ext.js"></script>

/** * Zip 模型压缩解析 */
class ZipModelsParse {
    static instance: ZipModelsParse = null;

    static getInstance(): ZipModelsParse {
        if (!ZipModelsParse.instance) {
            ZipModelsParse.instance = new ZipModelsParse();
        }
        return ZipModelsParse.instance;
    }

    path: string = '';
    texturesBasic: string = '';
    meshNames: string[] = [];

    curProgressCallBack: Function = null;

    /**     * 模型HashMap     */
    hashMap: HashMap = new HashMap();

    /**     * zip解析     */
    zipFs: any = null;

    /**     * 需要解析的总和     */
    parseCount: number = 0;
    parseCur: number = 0;

    /**     * 解压完成回调     */
    endCallBack: Function = function () {
        console.log('zip models parse success')
    };

    /**     * 解析回调     */
    parseCallBack: Function = function () {
        console.log('models parse')
    };

    parseStatus:boolean=false;

    /**     * 加载中?     */
    loadingStatus: boolean = false;

    /**     * 解析状态     */
    status: boolean = false;

    constructor() {
        if (ZipModelsParse.instance) {
            throw new Error("Zip 压缩模型解析 为单例模式");
        }
    }

    /**     * 获取模型数据     */
    public getModels(key_: string, clone: boolean = false): Object3D {
        let models_: Object3D = this.hashMap.get(key_);
        let copy_: Object3D = null;
        if (models_) {
            if (clone) {
                copy_ = models_.clone();
            } else {
                copy_ = models_;
            }
            return copy_;
        } else {
            copy_ = new Object3D();
        }
        return copy_;
    }

    /**     * 解析     */
    parseMeshs(): void {
        if (this.parseCallBack) this.parseCallBack();
        this.parseStatus=true;
        let i: number = 0;
        let l: number = this.meshNames.length;

        //解析进度
        this.parseCount = l;
        this.parseCur = 0;

        let meshName: string = '';
        //压缩数据
        let objZipFile: any = null;
        let mtlZipFile: any = null;
        let firstEntry = this.zipFs.root.children[0];

        for (i = 0; i < l; i++) {
            meshName = this.meshNames[i];
            objZipFile = firstEntry.getChildByName(meshName + '.obj');
            mtlZipFile = firstEntry.getChildByName(meshName + '.mtl');
            this.parseItemMesh(meshName, objZipFile, mtlZipFile);
        }
    }

    /**     * 绑定加载进度输出     */
    bindLoadProgress(fun: Function) {
        this.curProgressCallBack = fun;
    }

    /**     * 解析单项     */
    parseItemMesh(name: string, objZip:any, mtlZip: any) {

        let materials: any = null;
        //模型数据
        let objDatas: string = null;
        let mtlDatas: string = null;
        //模型数据
        let object3D: any = null;

        let objParse: OBJLoader = new OBJLoader();
        let mtlParse: MTLLoader = new MTLLoader();

        /**             * 解析             */
        objParse = new OBJLoader();
        mtlParse = new MTLLoader();
        mtlParse.setPath(this.texturesBasic);

        mtlZip.getText((text: string) => {
            mtlDatas = text;

            //材质数据
            materials = mtlParse.parse(mtlDatas);

            //解析obj
            objZip.getText((objStr: string) => {
                objDatas = objStr;
                this.zipFs.remove(objZip);
                this.zipFs.remove(mtlZip);
                objZip = null;
                mtlZip = null;
                objParse.setMaterials(materials);
                object3D = objParse.parse(objDatas);

                //添加到hashmap
                this.hashMap.put(name, object3D);
                this.parseJudage();//解析完成进度判断
            });

        });
    }

    /**     * 解析判断     */
    parseJudage(): void {
        this.parseCur++;
        if (this.parseCur >= this.parseCount) {
            this.zipFs.remove(this.zipFs.root.children[0]);
            this.zipFs.root=null;
            this.zipFs.entries=[];
            delete this.zipFs.root;
            delete this.zipFs.entries;
            delete this.zipFs;
            this.zipFs = null;
            this.status = true;
            this.loadingStatus = false;
            if (this.endCallBack) this.endCallBack();
        }
    }

    /**     * 设置模型路径     */
    setModelsPath(path: string, texturepath: string): void {
        this.texturesBasic = texturepath;
        this.path = path;
    }

    /**     * 设置模型名称     */
    setModelNames(names: string[]) {
        this.meshNames = names;
    }

    /**     * 开始加载     */
    startLoad(): void {

        if (this.loadingStatus) {
            console.warn('zip 加载中...');
            return;
        }

        //历史加载完成
        if (this.status) {
            this.endCallBack();
            return;
        }
        this.loadingStatus = true;//加载中

        //初始化
        if (!this.zipFs) {
            this.initZipLoaders();
        }

        //加载
        this.zipFs.importHttpContent(this.path, false, () => {
            this.parseMeshs();
        });
    }

    /**     * 初始化zip加载解析     */
    initZipLoaders(): void {
        zip.useWebWorkers = true;
        zip.workerScriptsPath = './assets/js/zip/';
        this.zipFs = new zip.fs.FS();
    }

}

export {ZipModelsParse};