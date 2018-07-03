import {LHFEventDispatcher} from "../../core/LHFEventDispatcher";

class DisplayObject extends LHFEventDispatcher{

    /**     * 唯一标示符     */
    uuid: string = '';

    constructor(){
        super();

        /**         * 生成唯一标识         */
        this.uuid = DisplayObject.getUUID();

    }

    static getUUID():string{
        let uuid:string=Date.now().toString() + Math.random() * 100;
        return uuid;
    }
}
export {DisplayObject};