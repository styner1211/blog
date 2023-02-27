# 리액트와 JSX

## Vanila Javascript를 이용한 Element 생성

```html
<!DOCTYPE html>
<html lang="en">
  <body>
    <div id="root"></div>
    <script>
      const rootElement = document.getElementById("root");
      const element = document.createElement("h1");
      element.textContent = "Hello, world!";
      rootElement.appendChild(element);
    </script>
  </body>
</html>
```

## React를 이용한 Element 생성

```html
<!DOCTYPE html>
<html lang="en">
  <body>
    <script
      crossorigin
      src="https://unpkg.com/react@18/umd/react.development.js"
    ></script>
    <script
      crossorigin
      src="https://unpkg.com/react-dom@18/umd/react-dom.development.js"
    ></script>
    <div id="root"></div>
    <script>
      const element = React.createElement("h1, { childeren: "Hello, world!"})
      // const element = React.createElement("h1, null, "Hello, world!")
      ReactDOM.render(element, rootElement)
    </script>
  </body>
</html>
```

## JSX를 이용한 Element 생성

> JSX란 `const element = <h1>Hello, world!</h1>` 과 같은 HTML 태그 처럼 쓸 수 있는 JavaScript 확장 문법
> JSX를 쓰기 위해서는 Babel이라는 JavaScript 컴파일러가 필요

````html
<!DOCTYPE html>
<html lang="en">
  <body>
    <script
      crossorigin
      src="https://unpkg.com/react@18/umd/react.development.js"
    ></script>
    <script
      crossorigin
      src="https://unpkg.com/react-dom@18/umd/react-dom.development.js"
    ></script>
    <script
      crossorigin
      src="https://unpkg.com/@babel/standalone/babel.min.js"
    ></script>
    <div id="root"></div>
    <script type="text/babel">
      const rootElement = document.getElementById("root");
      const element = <h1 className="title">Hello, world!</h1>;
      ReactDOM.render(element, rootElement);
    </script>
  </body>
</html>
``` ## 템플릿 ```html
<!DOCTYPE html>
<html lang="en">
  <body>
    <div id="root"></div>
    <script
      crossorigin
      src="https://unpkg.com/react@18/umd/react.development.js"
    ></script>
    <script
      crossorigin
      src="https://unpkg.com/react-dom@18/umd/react-dom.development.js"
    ></script>
    <script
      crossorigin
      src="https://unpkg.com/@babel/standalone/babel.min.js"
    ></script>

    <script type="text/babel">
      const rootElement = document.getElementById("root");

      const App = () => {
        return (
          <>
            <button onclick={handleClick}>search</button>
          </>
        );

        ReactDOM.render(<App />, rootElement);
      };
    </script>
  </body>
</html>
```
````
