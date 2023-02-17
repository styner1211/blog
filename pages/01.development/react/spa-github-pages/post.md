# GitHub Pages에 SPA(Singe Page App) 배포하기

## 1. 문제 상황

GitHub Pages는 기본적으로 정적 페이지를 호스팅 할 수 있지만, 리액트 앱과 같은 SPA는 해결해야하는 문제가 있다.

먼저 GitHub Pages에서 리액트 앱을 호스팅을 위한 셋팅을 완료 했다면, 사용자는 아래와 같은 퍼블리시 된 사이트 주소를 통해 해당 페이지에 접근이 가능하다.

```
https://깃허브_아이디.github.io/저장소_이름
```

**만약 호스팅한 리액트 앱이 react-router-dom을 이용하여 라우팅이 적용되어 있다면 문제가 발생하게 된다.**

즉, 아래 처럼 기본 경로 이외에 다른 경로를 통해 해당 페이지에 직접 접근 하려고 하면,

```
https://깃허브_아이디.github.io/저장소_이름 (기본 경로)
https://깃허브_아이디.github.io/저장소_이름/path1
https://깃허브_아이디.github.io/저장소_이름/path2/path3
...
```

GitHub Pages는 아래와 같은 404 Not Found 페이지를 반환하게 된다.

<img width="600" src="/assets/development/react/spa-github-pages/github-pages-404.JPG" />
<figcaption align="center">
  <b>404 Not Found</b>
</figcaption>

## 2. 문제 원인

이는 해당 경로에 대한 페이지(index.html)를 서버에 요청했지만 실제 빌드되어 배포된 환경에는 해당 파일이 존재하지 않기 때문에 발생하는 현상이다.

SPA 형태인 리액트의 경우에는 라우팅 처리 로직이 서버가 아닌 리액트 앱 내부에서 처리되므로 실제로는 기본 경로에 있는 껍데기 index.html 하나로만 모든 페이지를 렌더링 하게 된다. 따라서 그 외 다른 경로에는 반환할 수 있는 페이지가 없는 것이다.

## 3. 해결 방법

이 문제를 해결한 방법을 찾았는데 아래를 참고하기 바란다.

> [Single Page Apps for GitHub Pages](https://github.com/rafgraph/spa-github-pages#how-it-works) 참고

상당히 영리한 솔루션인데 대략적인 방식은 다음과 같다.

1. 기본 경로가 아닌 다른 경로로 접근했을 때, GitHub Pages는 404.html 페이지를 반환 한다. (일반적으로 웹서버의 일종의 규약?이라고 할 수 있음)
2. 이때 참조하게 되는 404.html의 script를 수정하여 요청이 들어온 (기본 경로가 아닌) url을 파싱하여 기본 url 부분 + query string(나머지 부분) 형태로 가공한다.
3. Github Pages 서버는 기본 url 부분 만을 요청 받게되므로 index.html을 반환할 수 있다.
4. 이 index.html의 script를 수정하여 나머지 query string 부분을 이용해 redirect 한다.
5. 리액트 앱은 마치 기본 경로가 아닌 다른 경로의 요청이 제대로 수행된 것과 같은 효과를 가지게 된다.

위 솔루션을 적용하는 법은 다음과 같다.

### 3.1 404.html 커스터마이징

리액트 프로젝트 디렉토리에 `public/404.html` 파일을 만들고 아래와 같이 작성한다.

```html
<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8" />
    <title>Single Page Apps for GitHub Pages</title>
    <script type="text/javascript">
      // Single Page Apps for GitHub Pages
      // MIT License
      // https://github.com/rafgraph/spa-github-pages
      // This script takes the current url and converts the path and query
      // string into just a query string, and then redirects the browser
      // to the new url with only a query string and hash fragment,
      // e.g. https://www.foo.tld/one/two?a=b&c=d#qwe, becomes
      // https://www.foo.tld/?/one/two&a=b~and~c=d#qwe
      // Note: this 404.html file must be at least 512 bytes for it to work
      // with Internet Explorer (it is currently > 512 bytes)

      // If you're creating a Project Pages site and NOT using a custom domain,
      // then set pathSegmentsToKeep to 1 (enterprise users may need to set it to > 1).
      // This way the code will only replace the route part of the path, and not
      // the real directory in which the app resides, for example:
      // https://username.github.io/repo-name/one/two?a=b&c=d#qwe becomes
      // https://username.github.io/repo-name/?/one/two&a=b~and~c=d#qwe
      // Otherwise, leave pathSegmentsToKeep as 0.
      var pathSegmentsToKeep = 1;

      var l = window.location;
      l.replace(
        l.protocol +
          "//" +
          l.hostname +
          (l.port ? ":" + l.port : "") +
          l.pathname
            .split("/")
            .slice(0, 1 + pathSegmentsToKeep)
            .join("/") +
          "/?/" +
          l.pathname
            .slice(1)
            .split("/")
            .slice(pathSegmentsToKeep)
            .join("/")
            .replace(/&/g, "~and~") +
          (l.search ? "&" + l.search.slice(1).replace(/&/g, "~and~") : "") +
          l.hash
      );
    </script>
  </head>
  <body></body>
</html>
```

### 3.2 index.html의 script 추가

리액트 프로젝트 디렉토리에 `public/index.html`의 script에 아래 내용을 추가한다.

```html
<script type="text/javascript">
  // Single Page Apps for GitHub Pages
  // MIT License
  // https://github.com/rafgraph/spa-github-pages
  // This script checks to see if a redirect is present in the query string,
  // converts it back into the correct url and adds it to the
  // browser's history using window.history.replaceState(...),
  // which won't cause the browser to attempt to load the new url.
  // When the single page app is loaded further down in this file,
  // the correct url will be waiting in the browser's history for
  // the single page app to route accordingly.
  (function (l) {
    if (l.search[1] === "/") {
      var decoded = l.search
        .slice(1)
        .split("&")
        .map(function (s) {
          return s.replace(/~and~/g, "&");
        })
        .join("?");
      window.history.replaceState(
        null,
        null,
        l.pathname.slice(0, -1) + decoded + l.hash
      );
    }
  })(window.location);
</script>
```

여기까지 하면 SPA 형태의 리액트 앱을 GitHub Pages에 배포해도 정상적으로 라우팅이 적용된다.


## 4. SEO를 위한 추가 작업
위 솔루션의 저자에 따르면, 2019년 부터는 구글의 정책이 바뀌어, ```404.html``` 에서의 redirect를 더이상 크롤링 하지 않는다고 한다.
이를 해결하기 위해 다음의 두 가지 과정이 필요하다.

### 4.1 robots.txt 수정
`public/robots.txt` 파일에 다음과 같이 작성하여 sitemap.txt 위치를 크롤러가 인지하도록 한다.

```
Sitemap: https://깃허브_아이디.github.io/저장소_이름/sitemap.txt
```

### 4.2. sitemap.txt 작성
`public/sitemap.txt` 파일에는 자신의 리액트 앱에서 라우팅 가능한 모든 페이지 링크에 대한 redirect link를 명시하여야 한다.
예시는 다음과 같다.
```
https://깃허브_아이디.github.io/저장소_이름/?/
https://깃허브_아이디.github.io/저장소_이름/?/path1
https://깃허브_아이디.github.io/저장소_이름/?/path2
https://깃허브_아이디.github.io/저장소_이름/?/path3
...

```


이렇게 까지 하다보니, 빌드할 때 각 페이지마다 html 파일을 만들어주는 static site generator를 쓰는게 나을 것 같다는...

Gatsby나 Next.js를 사용해 볼 예정이다.