/** * 哈希表 */
class HashMap{
    length:number=0;
    constructor(){}
    obj:Object=new Object();

    /**     * 是否为空     */
    public isEmpty(){
        return length==0;
    }

    /**     * 判断对象中是否包含给定key     */
    public containsKey(key_:string){
        return (key_ in this.obj);
    }

    /**     * 判断对象中是否包含给定的Value     */
    public containsValue(value:any){
        for(var key_ in this.obj){
            if(this.obj[key_]==value){
                return true;
            }
        }
        return false;
    }

    /**     * 向map中添加数据     */
    public put(key:any,value:any){
        if(!this.containsKey(key)){
            this.length++;
        }
        this.obj[key] = value;
    };

    /**     * 根据给定的Key获得Value     */
    public get(key:any){
        return this.containsKey(key)?this.obj[key]:null;
    }

    /**     * 根据给定的Key删除一个值     */
    public remove(key:any){
        if(this.containsKey(key)&&(delete this.obj[key])){
            this.length--;
        }
    }
    /**     * 获得Map中的所有Value     */
    public values(){
        var _values= new Array();
        for(var key in this.obj){
            _values.push(this.obj[key]);
        }
        return _values;
    }

    /**     * 获得Map中的所有Key     */
    public keySet(){
        var _keys = new Array();
        for(var key in this.obj){
            _keys.push(key);
        }
        return _keys;
    }

    /**     * 获得Map的长度     */
    public size(){
        return this.length;
    };

    /**
     * 清空Map
     */
    public clear(){
        this.length = 0;
        this.obj = new Object();
    }
}
export {HashMap};