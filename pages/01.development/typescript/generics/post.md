# Generics

## Generacs, Any와 다른점

```typescript
function helloString(message: string): string {
    return message;
}

function helloNumber(message: number): number {
    return message;
}
```

> 컴파일 타임에는 문제가 없지만 런타임에는 undefined
```typescript
function hello(message: any): any {
    return messgae;
}

console.log(hello("Mark").length); // any 타입에 대한 length로 인식
console.log(hello(39.length));
```


```typescript
function helloString<T>(message: T): T {
    return message;
}

console.log(helloGeneric("Mark").length); // string으로 추론됨
console.log(helloGeneric(39)); // int로 추론됨
console.log(helloGeneric(true)); // true로 추론됨
```

## Generic Basics

```typescript
function helloBasic<T>(message: T): T {
    return message;
}

helloBasic<string>("Mark"); // 명시적으로 타입을 명시
helloBasic(36); // 타입이 추론됨
```




## Generics Array & Tuple
```typescript
function helloArray<T>(message: T[]): T {
    return messsage[0];
}

helloArray(["Hello", "World"]);
helloArray(["Hello", 5]); // T는 string | number 의 union 타입

function helloTuple<T, K>(message: [T, K]): T {
    return message[0];
}

helloArray(["Hello", "World"]);
helloArray(["Hello", 5]); // T는 string 타입
```


## Generics Funtion

> 함수의 타입을 설정

```typescript
type HelloFunctionGeneric1 = <T>(message: T) => T;

const helloFunction1: HelloFuctionGeneric1 = <T>(message: T): T => {
    return message;
}


interface HelloFunctionGeneric2 {
    <T>(message: T): T;
}

const helloFunction2: HelloFuctionGeneric1 = <T>(message: T): T => {
    return message;
}
```

## Generic Class
> 클래스의 타입을 설정
```typescript
class Person<T, K> {
    private _name: T;
    private _age: K;

    constructor(name: T, age: K) {
        this._name = name;
        this._age = age;
    }
}

new Person<string, number>("Mark", 39);

```

## Generics with extends

> `extends` 키워드를 통해 제네릭을 제한하는 것이 좋음

```typescript
class PErsonExtends<T extends string | number> { // T는 string 또는 number만 가능
    private _name: T;

    constructor(name: T) {
        this._name = name;
    }
}
```


## keyof & type lookup system

```typescript
interface IPerson {
    name: string;
    age: nubmer;
}

const person: IPerson = {
    name: "Mark",
    age: 39,
}

// 리턴 타입이 key에 의존성을 가짐
function getProp(obj: IPerson, key: "name" | "age"): string | number {
    return obj[key]
}

// 리턴 타입이 key에 의존성을 가짐
function setProp(obj: IPerson, key: "name" | "age", value: string | number): void {
    obj[key] = value;
}
```

위와 같은 경우, 리턴 타입이 key에 의존성을 가지게 된다. 이 때 keyof를 사용할 수 있다.

```typescript
...
type Keys = keyof Iperson // IPerson의 key의 union을 가져옴 ("name" | "age")

function getProp(obj: IPerson, key: keyof IPerson): IPerson[keyof IPerson] {
    return obj[key]
}

function setProp(obj: IPerson, key: keyof IPerson, value: IPerson[keyof IPerson]): void {
    obj[key] = value;
}
```

```
IPerson[keyof IPerson]
=> IPerson["name" | "age"]
=> IPerson["name"] | IPerson["age"]
=> string | number
```

keyof를 적용했지만, 여전히 리턴 타입이 key에 의존한다는 것은 해소되지 않음.

해결 방법
> IPerson -> T
> K extends keyof T


```typescript
function getProp<T, K extends keyof T>(obj: T, key: K): T[K] {
    return obj[key]
}

getProp(person, "name");
getProp(person, "age");

function setProp<T, K extends keyof T>(obj: T, key: K, value: T[K]): void {
    obj[key] = value;
}

setProp(person, "name", "Anna");
```
