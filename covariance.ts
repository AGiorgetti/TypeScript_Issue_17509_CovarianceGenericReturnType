// common interface that exposes methods available to all services
interface IMyService {
    id: string;
    name: string;
    method(): string;
}

class MyService1 implements IMyService {
    id: string;
    name: string;
    method(): string {
        return "common";
    }
    method1() {
        return "1";
    }
}

class MyService2 implements IMyService {
    id: string;
    name: string;
    method(): string {
        return "common";
    }
    method2() {
        return "2";
    }
}

interface IMyFactoryInterface {
    // Covariant return type (IMyObject and its subtypes should be accepted)
    <T extends IMyService>(name: string): T;
}

// Covariant return type (IMyObject and its subtypes should be accepted)
type IMyFactoryType = <T extends IMyService>(name: string) => T;

function MyFactory1(name: string): MyService1 {
    // immagine code generated against a remote http endpoint or similar
    var obj = new MyService1();
    obj.id = name;
    obj.name = name;
    return obj;
}

function MyFactory2(name: string): MyService2 {
    // immagine code generated against a remote http endpoint or similar
    var obj = new MyService2();
    obj.id = name;
    obj.name = name;
    return obj;
}

// It does not respect covariance on the generic type constraint
// Type 'IMyService' is not assignable to type 'T'
let factoryFunc: IMyFactoryInterface;
factoryFunc = MyFactory1;
console.log(factoryFunc<MyService1>('a').name);
factoryFunc = MyFactory2;
console.log(factoryFunc<MyService2>('a').name);
factoryFunc = getTheFactoryFuncFromJS("1");
console.log(factoryFunc<MyService1>('a').name);

let factoryFunc2: IMyFactoryType;
factoryFunc2 = MyFactory1;
console.log(factoryFunc2<MyService1>('a').name);
factoryFunc2 = MyFactory2;
console.log(factoryFunc2<MyService2>('a').name);
factoryFunc2 = getTheFactoryFuncFromJS("1");
console.log(factoryFunc2<MyService1>('a').name);

// a better (and more correct) way of doing it:

type IMyServiceFactoryType = (name: string) => IMyService;

let myServiceFactoryFunc: IMyServiceFactoryType;
myServiceFactoryFunc = MyFactory1;
myServiceFactoryFunc = MyFactory2;

// Ok I'll admit this is a hack to avoid an explicit type assertion in the code.
// The correct code should have been:
// const f = getServiceFactory("service1") as (name: string) => MyService1;
// This is very ugly to write, so I did this:
// const f = getServiceFactory<MyService1>("service1"); // ofc you can create e service and assert it to the wring type
function getServiceFactory<T extends IMyService>(name: string): (name: string) => T {
    let myServiceFactoryFunc: (name: string) => IMyService; // <- explicitly return the common interface

    myServiceFactoryFunc = getTheFactoryFuncFromJS(name); // immagine some code to retrieve an instace of a factory function from 'name'

    return myServiceFactoryFunc as (name: string) => T;
}

function getTheFactoryFuncFromJS(name: string): IMyServiceFactoryType {
    switch (name) {
        case "1":
            return MyFactory1;
        default:
            return MyFactory2;
    }
}

const f = getServiceFactory<MyService1>("1");
console.log(f("a").name);


