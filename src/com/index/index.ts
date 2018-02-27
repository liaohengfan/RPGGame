import '../../styles/common.less';
import '../../styles/index.less';
class Person{
    sayHello():void{
        console.log('Person say hello');
    }
}

let person:Person=new Person();
person.sayHello();
