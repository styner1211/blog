# TypeScript: 타입스크립트

## 타입스크린트 란?
- Typed Superset of JavaScript
- 자바스크립트에 타입을 적용함
- 코드를 실행하기 전에 오류를 발견할 수 있음 (Compile or Transpile)
- 타입스크립트 컴파일러에 의해 자바스크립트 파일로 변경됨
  - 브라우저 혹은 node.js 같은 런타임 환경에서 해석 가능

## 타입스크립트 설치 및 사용

### 자바스크립트 실행 환경
- node.js
  - 크롬의 V8 JavaScript Engine
- 브라우저

### [node.js 설치](/00.development/react)

### 타입스크립트 설치

> npm: node.js 패키지 매니저

#### global 설치
```sh
npm i typescript -g
```

#### local 설치

> local 설치를 추천한다.

- `node_modules/typescript/bin/tsc`에 설치됨
- `node_modules/.bin/tsc`를 심볼릭 링크로 사용 가능함
- `npx tsc` 로 실행 가능함
   > 단, 아래 명령어로 초기화 하여 tsconfig.js 파일이 생성되어야 사용 가능
   ```sh
   $ npx tsc --init
   ```
- package.json 파일의 scripts 수정
  ```
  ...
  "scripts": {
    "build": "tsc"
  }
  ...
  ```
  위 설정 추가 후 `npm run build` 컴파일 가능하다.

```sh
$ npm i typescript
```

### 타입스크립트 컴파일러 실행
아래 명령어로 컴파일 하면 `source.js`파일이 생성된다.
```sh
tsc source.ts
```
