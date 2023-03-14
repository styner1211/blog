# 리액트에서 Error Handling

`ErrorBoundary`라는 클래스형 컴포넌트를 만들고, 에러가 발생할 수 있는 자식 컴포넌트(`Child`를 감싸주면, 자식 컴포넌트에서 예외가 발생했을 때, 예외를 캐치하여 `Fallback` 컴포넌트에 정의된 동작으로 넘겨줄 수 있다. (일종의 리액트 컴포넌트에서 사용 가능한 tray-catch 구문이라고 생각하면 편함)

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

      class ErrorBoundary extends React.Component {
        state = {error: null};
        static getDerivedStateFromError(error) {
            return {error}
        }

        render() {
            const { error } this = state;
            if (error) {
                return <this.props.fallback error={error} />;
            }

            return this.props.children;
        }
      }

      const Child = () => {
        throw new Error("Something wrong ... ");
        return <p>Child ...</p>
      }

      const Fallback = ({ error }) => {
        return <p>THERE is some ERROR ...</p>
      }

      const App = () => {
        return (
            <>
                <p>App</p>
                <ErrorBoundary fallback={Fallback}>
                    <Child />
                </ErrorBoundary>
            </>
        )
      }

      ReactDOM.render(<App />, rootElement);
    </script>
  </body>
</html>
```
