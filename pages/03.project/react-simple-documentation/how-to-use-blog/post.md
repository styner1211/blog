# 설치 및 사용 방법

> 내 블로그 템플릿 설치와 사용법

## Prerequsite

- [React 개발 환경 구축](/docs/development/react)
- 블로그 템플릿 설치하기
- Github 계정 (Github Pages를 통한 호스팅의 경우)

## 블로그 템플릿 설치 및 실행

### 1. React 프로젝트(템플릿) 내려받기

다음 명령어를 실행하면 react-simple-documentation라는 디렉토리에 리액트 프로젝트가 다운로드 됨

```sh
$ git clone https://github.com/saerok0305/react-simple-documentation.git
```

### 2. 내려받은 React 프로젝트 디렉토리에서 package.json에 등록된 의존성 설치

cd 명령어로 react-simple-documentation 디렉토리로 이동하고 yarn 명령어를 실행하여 필요한 의존성을 설치

```sh
$ cd react-simple-documentation
$ yarn
```

### 3. 리액트 앱(블로그 템플릿) 실행

아래 명령어는 개발 서버를 실행하고 브라우저에 [http://localhost:3000/react-simple-documentation](http://localhost:3000/react-simple-documentation)이 열리면서 블로그 템플릿을 실행시킨다.

```sh
$ yarn start
```

실행하면 아래와 같은 블로그 템플릿이 브라우저에 나타난다.

<img width="600" src="/assets/project/react-simple-documentation/how-to-use-blog/desktop.JPG" />
<figcaption align="center">
  <b>블로그 템플릿 (데스크탑 환경)</b>
</figcaption>

모바일에서는 다음과 같은 모습이다.

<div class="flex">
<img width="160" src="/assets/project/react-simple-documentation/how-to-use-blog/mobile1.JPG" />
<img width="160" src="/assets/project/react-simple-documentation/how-to-use-blog/mobile2.JPG" />
</div>

<figcaption align="center">
  <b>블로그 템플릿 (모바일 환경)</b>
</figcaption>

## 블로그 작성하기

이 블로그 템플릿을 이용해서 블로그를 작성하기 위해서는 **src/pages 디렉토리의 내용을 수정**하는 것으로 블로그를 구성할 수 있다.

### 1. mappings.json 작성

```json
[
  {
        "header": {"label": "헤더 메뉴 라벨","path": "path1", "md": "path1.md", "meta":{}},
        "side_bar": [
            {
                "label": "사이드바 메뉴 라벨", "path": "path2", "md": "path2.md", "meta":{} ,
                "sub":[
                    {"label":"사이드바 서브 메뉴 라벨", "path": "path3", "md": "path3.md", "meta":{}}
                ]
            },
            ...
        ]
    },
    ...
]
```

- *헤더 메뉴*는 여러개의 *사이드바 메뉴*를 가질 수 있다.
- *사이드바 메뉴*는 여러개의 *사이드바 서브 메뉴*를 가질 수 있다.
- 각 메뉴는 컨텐츠를 보여주는 md 파일을 지정해야한다.
  - 실제 컨텐츠의 작성은 markdown 언어로 작성한다.
- 각 메뉴는 아래의 형태로 라우팅 된다.
  - http://[baseUrl]/[headerPath]
  - http://[baseUrl]/[headerPath]/[sidebarPath]
  - http://[baseUrl]/[headerPath]/[sidebarPath]/[sidebarSubPath]

### 2. 마크다운(Markdown) 작성법 (실제 컨텐츠 작성하기)

각 메뉴를 클릭했을 때 보여지는 내용은 mappings.json에 지정된 md 파일을 마크다운 표현법으로 작성했을 때, 해당 내용이 렌더링 된다.
본 블로그 템플릿에서는 react-markdown 컴포넌트를 사용하고 있고, 추가적으로 아래와 같은 플러그인을 추가해 놓은 상태이다.

> - remark-gfm: GitHub에서 사용하는 마크다운 표현식 지원
> - rehype-raw: 마크다운 대신 html tag 사용 가능
> - remark-math / rehype-katex: katex 방식의 수식 입력

유용한 작성법 몇가지를 아래 소개한다.

---

### 글머리: 1~6까지만 지원

```
# H1
## H2
### H3
#### H4
##### H5
###### H6
```

# H1

## H2

### H3

#### H4

##### H5

###### H6

---

### BlockQuote

```
> blockqute.
```

> blockqute.

---

### 목록

```
1. 첫번째
2. 두번째
3. 세번째
```

1. 첫번째
2. 두번째
3. 세번째

```
- 첫번째
  - 두번째
    - 세번째
```

- 빨강
  - 녹색
    - 파랑

---

### 코드 블럭

```
public class HelloWorld {
  public static void main(String[] args) {
    System.out.println("Hello World!");
  }
}
```

---

### 이미지 삽입

이미지 삽입 시 사용되는 markdown 문법이 있지만 아래처럼 html 태그 이용을 추천한다. (사이즈 조절 과 같은 attribute 활용이 용이함)

> 주의 사항: 아래 img 태그의 src 속성 값의 이미지 경로는, 리엑트 프로젝트 디렉토리의 public 디렉토리가 루트가 되고, base url이 /docs 인 경우에 해당한다. ([src/index.js: base url 지정](/docs/project/react-simple-documentation/github-hosting) 참조)

실제 내 프로젝트에서 desktop.JPG 파일은, [프로젝트 루트]/public/asset/project/react-simple-documentation/how-to-use-blog/desktop.JPG에 위치해 있다.

```
<img width="200" src="/assets/project/react-simple-documentation/how-to-use-blog/desktop.JPG" />
<figcaption align="center">
  <b>이미지 캡션</b>
</figcaption>
```

<img width="200" src="/assets/project/react-simple-documentation/how-to-use-blog/desktop.JPG" />
<figcaption align="center">
  <b>이미지 캡션</b>
</figcaption>

---

### 마크다운 표현에 대한 CSS 커스터마이징

본 블로그 템플릿에서는 **src/markdown-style.css** 에서 관련된 스타일을 지정할 수 있다.
현재 내가 사용하고 있는 css 파일은 다음과 같다. 개인 취향에 맞게 수정하면 된다.

```
.markdown {
  display: block;
  word-wrap: break-word;
  color: #333;
  line-height: 1.7;
  text-size-adjust: 100%;
  -ms-text-size-adjust: 100%;
  -webkit-text-size-adjust: 100%;
  -moz-text-size-adjust: 100%;
}

.markdown h1 {
  margin-bottom: 1em;
}

.markdown h2 {
  margin-top: 2em;
  margin-bottom: 1em;
}

.markdown h3,
h4,
h5,
h6 {
  margin-bottom: 0.85em;
}

.markdown blockquote {
  margin: 0;
  margin-bottom: 0.85em;
  padding: 0 15px;
  color: #858585;
  border-left: 4px solid #e5e5e5;
}

.markdown p code {
  padding: 0.2em 0.4em;
  margin: 0;
  font-size: 85%;
  background-color: #e5e5e5;
  border-radius: 6px;
}

.markdown pre {
  overflow: auto;
  word-wrap: normal;
  margin: 0;
  padding: 0.85em 1em;
  margin-bottom: 1.275em;
  background: #f7f7f7;
}

.markdown img {
  display: block;
  margin: 40px auto 10px;
  border: 1px solid #d3d3d3;
}

.markdown figcaption {
  margin: 0 0 40px 0;
}

.markdown .flex {
  display: flex;
}

```
