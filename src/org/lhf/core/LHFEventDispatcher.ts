/**
 * 事件派送
 */
class LHFEventDispatcher {

    private _listeners: any;

    public addEventListener(type: string, listener: Function): void {
        this._listeners?this._listeners:this._listeners={};
        const listeners: any = this._listeners;
        if (listeners[type] === undefined) {
            listeners[type] = [];
        }

        if (listeners[type].indexOf(listener) === -1) {
            listeners[type].push(listener);
        }
    }

    public hasEventListener(type: string, listener: Function) {
        if (this._listeners === undefined) return false;
        const listeners: any = this._listeners;
        return listeners[type] !== undefined && listeners[type].indexOf(listener) !== -1;
    }

    public removeEventListener(type: string, listener: Function): void {
        if (this._listeners === undefined) return;

        const listeners: any = this._listeners;
        const listenerArray: any[] = listeners[type];

        if (listenerArray !== undefined) {
            const index: number = listenerArray.indexOf(listener);
            if (index !== -1) {
                listenerArray.splice(index, 1);
            }
        }
    }

    public dispatchEvent(event: ILHFEventType): void {
        if (this._listeners === undefined) return;
        const listeners: any = this._listeners;
        const listenerArray: any[] = listeners[event.type];
        if (listenerArray !== undefined) {
            event.target = this;
            const array:any[] = listenerArray.slice(0);
            for (let i:number = 0, l = array.length; i < l; i++) {
                array[i].call(this, event);
            }

        }
    }

}

interface ILHFEventType{
    target?:any;
    type:string;
    [attr:string]:any;
}

export {ILHFEventType,LHFEventDispatcher}