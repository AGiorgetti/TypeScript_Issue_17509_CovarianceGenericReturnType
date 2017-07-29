interface IMyObject {
    id: string;
    name: string
}

class MyObject implements IMyObject {
    id: string;
    name: string;
}

interface IMyFactoryInterface {
    // Covariant return type (IMyObject and its subtypes should be accepted)
    <T extends IMyObject>(name: string): T;
}

// Covariant return type (IMyObject and its subtypes should be accepted)
type IMyFactoryType = <T extends IMyObject>(name: string) => T;  

function MyFactory(name: string): IMyObject {
    return <IMyObject>{
        id: name,
        name: name
    };
}

function MyFactoryClass(name: string): MyObject {
    var obj = new MyObject();
    obj.id = name;
    obj.name = name;
    return obj;
}

// It does not respect covariance on the generic type constraint
// Type 'IMyObject' is not assignable to type 'T'
let factoryFunc: IMyFactoryInterface;
factoryFunc = MyFactory;
console.log(factoryFunc('a').name);
factoryFunc = MyFactoryClass;
console.log(factoryFunc('a').name);

let factoryFunc2: IMyFactoryType;
factoryFunc2 = MyFactory;
console.log(factoryFunc2('a').name);
factoryFunc2 = MyFactoryClass;
console.log(factoryFunc2('a').name);
