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
