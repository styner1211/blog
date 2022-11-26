# GitHub를 이용한 호스팅

GitHub 계정이 있다면 자신이 생성한 저장소(Repository)를 통해 자신이 만든 리액트로 만든 블로그를 무료로 호스팅 할 수 있다.

> GitHub에서는 [GitHub Pages](https://pages.github.com/)라는 서비스를 통해 Jekyll과 같은 도구를 이용하여 블로깅을 할 수 있지만,
> 나는 내가 원하는 대로 커스터마이징 하고 싶어서 리액트로 개발을 했기 때문에 호스팅을 위한 몇가지 과정이 필요하다.
> 또한 라우팅이 적용된 SPA(Single Page Application)을 GitHub Pages에 배포하려면 추가적으로 해결해야 할 문제가 있다. 이는 맨 뒤에서 별도 설명으로 첨부한다.

간단하게 과정을 설명하면,

1. Github 저장소 생성
2. 자신의 웹 프로젝트 빌드 결과물을 저장소에 업로드

## 1. GitHub 저장소 만들기

아래 그림 처럼 자신의 Github에서 새로운 저장소를 만든다.
<img width="600" src="/assets/project/react-simple-documentation/github-hosting/github-repo.JPG" />

<figcaption align="center">
  <b>GitHub 저장소 만들기</b>
</figcaption>

## 2. 리액트 웹 프로젝트(블로그 템플릿) 설정

Github를 통해서 **https[]()://깃허브_아이디.github.io/저장소_이름** 으로 호스팅을 하기 위해서 아래와 같은 설정이 필요하다.

앞서 내려받은 프로젝트([블로그 템플릿](/docs/project/react-simple-documentation/how-to-use-blog)) 루트 디렉토리의 package.json과 src/index.js 파일에 다음을 추가한다.

### 2.1 package.json: homepage / script 항목 추가

```json
{
  "homepage": "https://깃허브_아이디.github.io/저장소_이름",
  "name": "저장소_이름",
  ...
  "scripts": {
    "predeploy": "npm run build",
    "deploy": "gh-pages -d build",
    ...
  },
  ...
}

```

### 2.2 src/index.js: base url 지정

아래 basenaem에 앞서 만든 저장소 이름을 동일하게 입력한다.

> 이는 이미지 같은 웹 프로젝트의 asset을 참조할 때 base url의 일관성을 위해 적용한 방법이다. (다른 더 좋은 방법이 있을 수도)

```js
import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import { BrowserRouter } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";

ReactDOM.render(
  <React.StrictMode>
    <BrowserRouter basename="/자장소_이름">
      <HelmetProvider>
        <App />
      </HelmetProvider>
    </BrowserRouter>
  </React.StrictMode>,
  document.getElementById("root")
);
```

### 3.3 원격 저장소 주소 설정 및 git-pages 설치

위에서 만든 저장소 이름을 이용하여 앞서 내려받은 프로젝트([블로그 템플릿](/docs/project/react-simple-documentation/how-to-use-blog)) 루트 디렉토리에서 아래 git 명령어로 원격 저장소를 지정한다.

```sh
$ git remote add origin https://github.com/깃허브_아이디/저장소_이름.git
```

그리고 GitHub로 빌드 결과물 배포를 위한 도구인 git-pages를 설치한다.

```sh
$ yarn add gh-pages
```

## 3. Github 호스팅을 위한 빌드 배포

프로젝트 루트 디렉토리에서 아래 명령어를 실행한다.

```sh
$ yarn deploy
```

> 블로그 내용을 작성하거나 수정한 뒤에도 위 명령어로 다시 배포하면 된다.

## 4. GitHub Pages 설정

GitHub 저장소의 Settings에 보면 Pages 항목이 있는데, 앞서 진행한 배포 작업이 정상적으로 이루어 졌다면,
아래와 같이 설정이 가능하고 최종적으로 아래와 같은 주소로 GitHub로 호스팅 된 자신의 블로그에 접속 할 수 있다.

> **https[]()://깃허브_아이디.github.io/저장소_이름**

<img width="600" src="/assets/project/react-simple-documentation/github-hosting/github-pages.JPG" />

<figcaption align="center">
  <b>GitHub Pages 설정</b>
</figcaption>


## 5. 블로그 수정 및 재배포
앞서 언급했듯이, 블로그 내용을 작성하거나 수정한 뒤에도 아래 명령어로 다시 배포하면 된다.
> yarn deploy
