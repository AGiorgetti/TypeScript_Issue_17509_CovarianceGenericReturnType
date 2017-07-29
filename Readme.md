# Covariance problem on generic return type with constraint

Covariance should be allowed

```
type IMyFactoryType = <T extends IMyObject>(name: string) => T;  

function MyFactory(name: string): IMyObject {
...
}

let factoryFunc: IMyFactoryInterface;
factoryFunc = MyFactory; // Error ?!?
```

 instead with TypeScript 2.4.1+ I get the error:

 ```
 Type 'IMyObject' is not assignable to type 'T'
 ```

 this was working in 2.4.0 and previous compiler versions.

 Workaround:

 use "noStrictGenericChecks" in tsconfig.json

 ```
 "noStrictGenericChecks" : true
 ```