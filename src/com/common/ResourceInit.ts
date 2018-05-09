import ResourcesMana from "../../org/lhf/webgl/resouces/ResourcesMana";

class ResourceInit {
    static status: boolean = false;

    constructor() {

    }

    public static init(): void {
        if (ResourceInit.status) return;
        ResourceInit.status = true;

        //素材加载
        let resources: ResourcesMana = ResourcesMana.getInstance();
        resources.textureBasePath = '';
        resources.modelsBasePath = './assets/models/';

        /**         * 添加城池模型         */
        resources.addModels('luoyang','citys/luoyang/luoyang','obj');
        resources.addModels('luoyang_floor','citys/luoyang/luoyang_floor','obj');

        resources.addTexture('sky','./assets/textures/sky.jpg');

    }
}

export {ResourceInit};
