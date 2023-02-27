# 리액트 컴포넌트 상태 다루기

> 컴포넌트: 엘리먼트(Element)의 집합

## React에서 제공하는 상태 관리, useState

> useState: 상태를 관리해주는 리액트의 훅(Hook)

```html
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
        const [keyword, setKeyword] = React.useState("");
        const [result, setResult] = React.useState(");
        const [typing, setTyping] = React.useState(false);

        function handleChange(event) {
            setKeyword(event.target.value)
            setTyping(true);
        }

        function handleClick() {
            setTypeing(false)
            setResult(`We find result of ${keyword}`);
        }

        return (
            <>
                <input onChange={handleChange}/>
                <button onclick={handleClick}>search</button>
                <p>{typing ? `Looking for ${keyword}...`}</p>
            </>
        )

        ReactDOM.render(<App />, rootElement); // 변경이 있는 부분 만 render
      }
    </script>
  </body>
</html>
```

## React의 Side Effect

```html
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
        const [keyword, setKeyword] = React.useState(
            () => {
                return window.localStorage.getItem("keyword")
            } // (오래걸리는 작업일 경우) 함수를 넣는 것이 좋음 <- 초기값 셋팅을 lazy하게
        ); //
        const [result, setResult] = React.useState("");
        const [typing, setTyping] = React.useState(false);

        // 인자가 없으면 렌더링 할때마다 실행 됨
        // []: 빈 배열을 넣으면 최초 한번만 실행됨
        // [keyword]: keyword 상태가 바뀔 때에만 실행 됨
        React.useEffect(() => {
            console.log("effect")
            window.localStorage.setItem("keyword", keyword);
        }. [])

        function handleChange(event) {
            window.localStorage.setItem("keyword", event.target.value) //
            setKeyword(event.target.value)
            setTyping(true);
        }

        function handleClick() {
            setTypeing(false)
            setResult(`We find result of ${keyword}`);
        }

        return (
            <>
                <input onChange={handleChange} value={keyword}> //
                <button onclick={handleClick}>search</button>
                <p>{typing ? `Looking for ${keyword}...`}</p>
            </>
        )

        ReactDOM.render(<App />, rootElement); // 변경이 있는 부분 만 render
      }
    </script>
  </body>
</html>
```
