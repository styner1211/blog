# Interface

## Interface 예시

```typescript
interface Person1 {
    name: string;
    age: number
}

funtion hello1(person: Person1): void {
    console.log(`안녕하세요! ${person.name} 입니다.`);
}

const p1: Person1 = {
    name: "Mark",
    age: 39,
};

```

위 타입스크립트 파일을 `npx tsc` 명령어로 컴파일 하면 아래와 같은 자바스크립트 파일이 만들어진다.

``` javascript
"use strict"
function hello1(person) {
    console.log("\uC548\uB155\uD558\uC138\uC694! " + person.name + " \uC785\uB2C8\uB2E4.")
}
var p1 = {
    name: "Mark",
    age:39,
};
hello(p1);
```

자바스크립트 파일에서는 Interface가 보이지 않는다.

즉, Interface는 컴파일 타임에 Interface를 이용해서 타입 에러가 발생하는지 안발생하는지를 체크한다.


## Optional Property


```typescript
interface Person2 {
    name: string;
    age?: number // Optioanl Property
}

funtion hello2(person: Person1): void {
    console.log(`안녕하세요! ${person.name} 입니다.`);
}

hello2({ name: "Mark", age: 39})
hello2({ name: "Anna"})

```


### Indexable Type

> 프로퍼티 이름이 어떤 것이 와도 상관 없음!

```typescript
interface Person3 {
    name: string;
    age?: number // Optioanl Property
    [index: string]: any // Indexable Type
}

funtion hello3(person: Person3): void {
    console.log(`안녕하세요! ${person.name} 입니다.`);
}


const p31: Person3 = {
    name: "Mark",
    age: 39,
};

const p32: Person3 = {
    name: "Mark",
    systers: ["Sung", "Chan"]
};

const p33: Person3 = {
    name: "Bokdaengi",
    father: p31,
    mother: p32,
};

hello3(p31)
hello3(p32)
hello3(p33)
```

## funtion in interface

```typescript
interface Person2 {
    name: string;
    age: number;
    hello(): void; // 매개변수 없이 hello라는 함수를 실행했을 때 리턴 타입은 void
}

const p41: Person41 = {
    name = "Mark",
    age = 39,
    hello: function(): void {
        console.log(`안녕하세요! ${this.name} 입니다.`);
    }
}


const p41: Person42 = {
    name = "Mark",
    age = 39,
    hello(): void {
        console.log(`안녕하세요! ${this.name} 입니다.`);
    }
}

// const p41: Person43 = {
//     name = "Mark",
//     age = 39,
//     hello: (): void => {
//         console.log(`안녕하세요! ${this.name} 입니다.`);
//         // 화살표 함수에서는 this를 사용할 수 없음
//         // this 는 객체를 가르키는게 아닌, global this 를 가리키게 됨
//     }
// }
```

## class implements interface

```typescript
interface IPerson1 {
    name: string;
    age: number;
    hello(): void;
}

class Person implements IPerson1 {
    name: string;
    age?: number | undefined;

    constructor(name: string) {
        this.name = name;
    }

    hello(): void {
        console.log(`안녕하세요! ${this.name} 입니다.`)
    }
}


const person: IPerson1 = new Person("Mark"); //클래스도 타입 처럼 사용할 수 있다.
person.hello();

```


## interface extends interface

```typescript
interface IPerson2 {
    name: string;
    age?: number;
}

interface IKorean extends IPerson2 {
    city: string;
}

const k: IKorean = {
    name: "이름"
    city: "도시"
}

```

## function interface

> 함수를 타이핑

```typescript
interface HelloPerson {
    (name: string, age?: number): void // 인자를 name, age를 받고 void 출력
}

helloPerson: HelloPerson = function (name: string, age: number) {
    console.log(`안녕하세요! ${name} 입니다.`);
}

helloPerson("Mark", 39)
```

## readonly interface properties

```typescript
interface Person8 {
    name: string;
    age?: number;
    readonly gender: string;
}

const p81: Person8 = {
    name: "Mark",
    gender: "male",
};

p81.gender = "feamale" ## 컴파일 에러
```

## type alias vs interface

### function
```typescript
type EatType = (food: string) => void

interface IEat {
    (food: string): void
}
```

### array
```typescript
type PersonList = string[];

interface IPersonList {
    [index: number]: string
}
```

### intersection

```typescript
interface ErrorHandling {
    success: boolean;
    error?: {message: string};
}

interface ArtistsData {
    artists: { name: string }[];
}

type ArtistsResponseType = ArtistsData & ErrorHandling;

interface IArtistResponse extends ArtistsData, ErrorHandling {} // 다중 상속

let art: AritistsResponseType;
let iar: IArtistsResponse;
```

### union type

```typescript
interface Bird {
    fly(): void
    layEggs(): void;
}

interface Fish {
    swim(): void
    layEggs(): void
}

// union 타입은 interface로 표현할 수 없다.

type PetType = Bird | Fish

// union 타입은 클래스한테 implement으로 넣어줄 수 없다.
interface IPet extends PetType {} // error
class Pet impelements PetType {} // error
```

### Declaraion Merging - interface

동일한 인터페이스 선언 시 두 인터페이스는 병합 된다.

> 별도의 서드파티 라이브러리를 수정해서 사용할 때 사용

```typescript
interface MergingInterface {
    a: string;
}

interface MergingInterface {
    b: string;
}

let mi: MergingInterface;
mi. // a와 b 둘다 접근 가능
``` 

동일한 타입 선언 시 중복 에러가 발생한다.

```typescript
type MergingInterface = {
    a: string;
}

type MergingInterface = {
    b: string;
}

let mi: MergingInterface;
mi. // a와 b 둘다 접근 가능
``` 