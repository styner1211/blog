# Custom Hook 만들기

> use{Name}와 같은 형태의 컨벤션을 따름

## React의 Side Effect

> useState / useEffect를 반복하는 경우 custom hook을 고려하자

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

      // custom hook
      function useLocalStorage(itemName, value = "") {
        const [state, setState] = React.useState(
            () => {
                return window.localStorage.getItem(itemName) || ""
            }
        );

         React.useEffect(() => {
            window.localStorage.setItem(itemName, state);
        }. [state])
      }

      const App = () => {
        const [keyword, setKeyword] = useLocalStorage("keyword")
        const [result, setResult] = useLocalStorage("result")
        const [typing, setTyping] = useLocalStorage("typing", false)

        function handleChange(event) {
            window.localStorage.setItem("keyword", event.target.value)
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

        ReactDOM.render(<App />, rootElement);
      }
    </script>
  </body>
</html>
```
