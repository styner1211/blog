# 리액트 (React) 시작하기

## React 개발 환경 구축

### 1. node.js 설치

#### 1.1 Linux or Mac OS 환경

[nvm](https://github.com/nvm-sh/nvm)을 설치 스크립트 다운로드 및 실행

```sh
$ curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.1/install.sh | bash
```

nvm을 이용한 Node.js 설치

> node.js를 설치하면 npm 및 npx가 함께 설치된다.

```sh
$ nvm install --lts
```

#### 1.2 Windows 환경

[Node.js 공식 홈페이지](https://nodejs.org/en/) 참고
윈도우 환경에서는 [Git for Windows](https://gitforwindows.org/)를 설치하고 Git Bash를 통해 아래 명령어를 사용한다.

### 2. yarn 설치

npm(Node.js의 패키지 관리자)을 이용하여 yarn 설치

```sh
$ npm install --global yarn
```

### 4. CRA를 이용한 리액트 프로젝트 생성

```sh
$ npx create-react-app my-app
```

### 5. 리액트 앱 실행

아래 명령어는 개발 서버를 실행하고 브라우저에 자동으로 페이지가 열리면서 리액트 앱[(http://localhost:3000/)](http://localhost:3000/)이 실행된다.

```sh
$ cd my-app
$ yarn start
```

<img width="600" src="/assets/development/react/react-app.png" />
<figcaption align="center">
  <b>React App이 실행된 모습</b>
</figcaption>
