# 타입스크립트의 데이터 타입

타입스크립트의는 자바스크립트의 기본 자료형을 포함하고, 타입스크립트에서 별도의 자료형이 추가 되었다.

다음은, ESMAScript 표준에 따른 기본 자료형(primitive tpyes)은 6가지를 설명하고 있다.


## 1. primitive type: ECMAScript 표준에 따른 기본 자료형

> Wrapper Object 방식(ex. `new Boolean(true)`)으로 Primitive Type을 사용할 수 있지만 사용하지 말자!

### boolean
### number: 부동 소수점
### string
- 문자열 데이터를 둘러싸기 위해 큰 따옴표 (`"`) 나, 작은 따옴표 (`'`) 를 사용
- Template String (ES6 이후)
- backtick(=backquote)
``` javascript
`Hello, my name is ${fullName}`
```
### null
```javascript
typeof(null) # object
```
### undefined
```javascript
typeof(undefined) # undefined
```
### symbol (ECMAScript 2015 에 추가)
Symbol을 사용하기 위해서는 아래와 같이 `tsconfig.json` 설정이 필요하다.
```
...
"compilerOptions": {
    ...
     "lib": ["ES2015", "DOM"]
    ...
}
...
```
- Symbol을 함수로 사용해서 symbol 타입을 만들 수 있음
- Primitive Type 값을 담아서 사용
- 고유하고 수정 불가능한 값으로 만듦
- 주로 접근을 제어 하는데 쓰임

```javascript
console.log(Symbol('foo') === Symbol('foo')); // false

let sym = Symbol();

let obj = {
    [sym]: "value"
};

console.log(obj[sym]); // "value"
```

## 2. object
> primitive type이 아닌 것을 나타내고 싶을 때 사용하는 타입
``` javascript
let obj: object = {};

obj = {name: 'Mark'};

obj = [{name: 'Mark'}];

obj = 39; // Error

obj = 'Mark'; // Error

obj = true; // Error

obj = 100n; // Error

obj = Symbol(); // Error

obj = null; // Error

obj = undefined; // Error

// array
let list1: number[] = [1, 2, 3];
let list2: (number | string)[] = [1, 2, 3, "4"]

```

## 3. 타입스크립트에서 추가된 타입

### tuple
```javascript
// tuple
let x: [string, number];
x = ["hello", 39];

const person: [string, number] = ["Mark", 39]
const [first, second] = person;
```

### any

리턴 타입이 any인 변수는 어떤 것이든 할 수 있다.

> any는 최대한 안쓰는게 좋음, unknown을 쓰되 타입을 한정시키는 것을 추천

```javascript
function returnAny(message: any): any {
    console.log(message)
}

const any1 = returnAny("리턴은 아무거나")
any1.toString() // 가능...
```

```javascript
let looselyTyped: any = {};

let d = looselyTyped.a.b.c.d; // any는 객체를 통해 전파됨
//  ^ = let d: any
```

### unknown

> 타입을 한정 시켜야만 쓸 수 있다.

typeof 검사, 비교 검사 또는 고급 타입 가드를 수행하여 보다 구체적인 변수로 좁힐 수 있다.

```javascript
declare const maybe: unknown;
// 'maybe' could be a string, object, boolean, undefined, or other types
const aNumber: number = maybe; // Type 'unknown' is not assignable to type 'number'.

if (maybe === true) {
  // TypeScript knows that maybe is a boolean now
  const aBoolean: boolean = maybe;
  // So, it cannot be a string
  const aString: string = maybe; // Type 'boolean' is not assignable to type 'string'.
}

if (typeof maybe === "string") {
  // TypeScript knows that maybe is a string
  const aString: string = maybe;
  // So, it cannot be a boolean
  const aBoolean: boolean = maybe; // Type 'string' is not assignable to type 'boolean'.
}
```

### never
> 리턴에 사용됨, 몇 가지로 한정되어 있음

```javascript
// Function returning never must have unreachable end point
function error(message: string): never { // 어떠한 형태도 리턴되지 않는다 -> never
    throw new Error(message);
}

// Inferred return type is never
function fail() {
    return error("Something failed");
}

// Function returning never must have unreachable end point
function infiniteLoop(): never {
    while (true) {
    }
}
```

> never는 모든 타입의 subtype, 따라서 any 조차도 never에 할당 할 수 없다.

```javascript
let a: string = 'hello';

if (typeof a !== 'string') {
    let b: never = a;
}
```

### void
값은 없고 타입만 있다.
일반적으로 값을 반환하지 않는(undefined) 함수의 리턴 타입으로 사용한다.


```javascript
function returnVoid(message): void {
    console.log(message);

    return undefined; // undefined만 void에 할당할 수 있다.
}

returnVoid('리턴이 없다');

let unusable: void = undefined;
```
