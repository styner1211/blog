# React와 Event

## Vanila Javascript를 이용한 Event 처리

### Inline 방식과 Event Listener 방식

```html
<!DOCTYPE html>
<html>
  <body>
    <button onclick="document.getElementById('demo').innerHTML=Date()">
      The time is?
    </button>

    <p id="demo"></p>
    <script>
      const button = document.getElementById("button");
      button.addEventListener("mouseout", () => alert("bye"));
    </script>
  </body>
</html>
```

## React에서 Event 처리

> https://ko.reactjs.org/docs/events.html

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
      const handleClick = () => alert("pressed");
      const handleMouseOut = () => alert("bye");
      const element = (
        <button onCLick={handleClick} onMouseOut={handleMouseOut}>
            Press
        </button>;
      );
      ReactDOM.render(element, rootElement);
    </script>
  </body>
</html>
```

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
      const handleClick = () => alert("pressed");
      const handleMouseOut = () => alert("bye");

      const state = { keyword: "", typing: false, result: "" };

      const App = () => {
        function handleChange(event) {
          setState({ keyword: event.target.value });
        }

        function handleClick() {
          setState({
            typing: false,
            result: `We find results of ${state.keyword}`,
          });
        }

        return (
          <>
            <input />
            <button>search</button>
            <p>
              {state.typing
                ? `Looking for ... ${state.keyword}...`
                : state.result}
            </p>
          </>
        );

        function setState(newState) {
          Object.assign(state, newState); // 객체의 변경 사항 반영
          render(); // setState 할 때 마다 render!
        }

        function render() {
          ReactDOM.render(element, rootElement); // 변경이 있는 부분 만 render
        }
      };
    </script>
  </body>
</html>
```

# 이벤트 Capturing과 Bubbling

```javascript
function Event() {
  const handleButtonClick = () => {
    console.log('handleButtonClick')
  }

  cconst handleClickCapture = () => {
    console.log('handleClickCapture')
  }

  const handleClickCapture2 = () => {
    console.log('handleClickCapture2')
  }

  const handleButtonBubble = () => {
    console.log('handleClickBubble')
  }


  return (
    <div onClickCapture={handleClickCapture}> // 자식보다 부모가 먼저 클릭 이벤트를 인지하고 싶을 때
      <div onClickCapture={handleClickCapture2} onClick={handleClickBubble}>
        <button onClick={handleButtonClick}>Button</button>
      </div>
    </div>
  )
}
```

실행 결과

```
handleClickCapture
handleClickCapture2
handleButtonClick
handleClickBubble
```
