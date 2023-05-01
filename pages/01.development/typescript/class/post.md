# Class

> JavaScript에도 class는 es6부터 사용 가능

```typescript
class Person {}

const p1 = new Persion();

console.log(p1)
```

`npx tsc` 로 컴파일


## `tsconfig.json` 확인해보면 `"target": "es5"` 로 설정 되어 있을 경우

> es5의 경우 class는 funtion으로 변경 된다.

```javascript
"use strict"
val Person = /** @class */ (function() {
    funtion Person() {
    }
    return Person;
 }());

 var p1 = new Person();
 console.log(p1)
```

## `tsconfig.json` 확인해보면 `"target": "es6"` 로 설정 되어 있을 경우

```javascript
class Person {    
}

const p1 = new Persion();
console.log(p1)
```

## constructor initialize

> constructor를 이용하여 object를 생성하면서 값을 전달할 수 있다.

```typescript
class Persion {
    public name: string = "Mark" // 접근제어자가 없으면 기본적으로 public
    private _age: number; // private 변수는 보통 언더바(_)를 붙인다.

    construction)name: stirng, _age: number) {
        this.name = name;
        this._age = _age;
    }
}

const p1 = new Person("Mark", 39);
console.log(p1)
```

위와 동일한 표현은 다음과 같다.

```typescript
class Persion {
    construction)public name: stirng, private _age: number) {}
}
```

클래스는 그 자체가 타입이기 때문에 프로퍼티를 선언하는 곳 또는 생성자에서 값을 할당하지 않는 경우에는 !를 붙여서 위험을 표현한다.

```typescript
class Persion {
    name: string = "Mark";
    age!: number; // !를 안달면 빨간색 밑줄이 그어진다. 즉 객체 생성 이후 값을 직접 할당해 줘야한다!
}

const p1: Person = new Person();
console.log(p1)
p1.age = 39 // 값을 직접 할당
console.log(p1.age)
```

## getter와 setter

```typescript
class Persion {
    construction)private _name: stirng, private _age: number) {}

    get name() {
        return this._name;
    }

    se name(n: string) {
        this._name = n;
    }
}

const p1: Person = new Person("Mark", 39)
console.log(p1.name) // getter
p1.name = "Mark2" // setter: private 이지만 값을 Set 할 수 있음
```

## Index Signatures

> 프로퍼티가 동적으로 만들어 질 수 있다.

```typescript
class Students {
    [index: string]: "male" | "female" // 속성 값을 한정 시킬 수도 있음
}

const a = new Students();
a.mark = "male";
a.jade = "male";

const b = new Students();
b.chloe = "femail";
b.alex = "male";
b.anna = "female";

```

## Static 프로퍼티와 메소드
```typescript
class Person {
    private static CITY = "Seoul"
    public static hello() {
        console.log("안녕하세요", Person.CITY);
    }
}

const p1 = new Person();
// p1.hello() // X
Person.hello() // O
```

## Singletons

> 어플리케이션 내에서 클래스로부터 단 하나의 오브젝트만 생성

```typescript
class ClassName {
    private constructor() {} // new 키워드로 오브젝트 생성하는 것을 막음
    private static instance: ClsassName | null = null ;
    public static getInstance(): ClassName {
        // ClassName 으로부터 만든 object가 있으면 그걸 리턴
        // 없으면, 만들어서 리턴
        if(ClassName.instance === null) {
            ClassName.instance = new ClassName();
        }

        return ClassName.instance;
    }
}

// const a = new ClassName(); // 이렇게 오브젝트 생성하는 것을 막아야한다.

const a = ClassName.getInstance();
const b = ClassName.getInstance();

console.log(a === b)
```


## 상속

```typescript
class Parent {
    constructor(protected _name: string, private _age: number) {}

    public print(): void {
        console.log(`이름은 ${this._name} 이고, 나이는 ${this._age} 입니다.`);
    }
}

const p = new Parent("Mark", 39);
p.print();

class Child extends Parent {
    public gender = "male";
    constructor(age: number) {
        super("Mark Jr.", age)
    }
}

const c = new Child(5);
c.print();
```

## 추상 클래스

```typescript
abstrct class AbstractPerson {
    protected _name: stirng = "Mark";

    abstract setName(name: string): void // 구현이 필요함
}

// new AbastractPerson() // 객체 생성이 불가능

class Person extends AbstractPerson {
    setName(name: string): void {
        this._name = name;
    }
}

const p = new Person();
p.setName("새 이름");
```