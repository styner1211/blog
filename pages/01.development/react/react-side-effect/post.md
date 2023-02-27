# React의 사이드 이펙트

## useEffect 의 return 함수의 동작 순서

1. props 나 state 가 업데이트
2. 컴포넌트 리렌더링
3. 이전 이펙트 클린업
4. 새로운 이펙트 실행

> 만약에 props.value 가 10 에서 20으로 업데이트 된 예를 들어보면, 이펙트는 아래와 같이 동작한다.
>
> 1. props.value = 20 으로 업데이트
> 2. 컴포넌트 리렌더링
> 3. 이전 이펙트 클린업 (이전 이펙트 함수는 props.value = 10 을 바라보고 있다.)
> 4. 새로운 이펙트 실행 (이 이펙트 함수는 변경된 props.value = 20 을 바라보고 있다.)

> 이전 이펙트 클린업 함수가 이전 값을 보고 있는 이유는 클로저의 특성 때문

컴포넌트가 언마운트 되거나 업데이트 되기 직전에 어떤 작업을 수행하고 싶다면, clean-up 함수를 반환해주어야 한다.

### Hook의 호출 타이밍

- useEffect: render가 끝난 뒤
  > 최초로 render 되고나서는 useEffect에 정의된 동작만 실행 되고, clean up 함수는 동작하지 않는다. 하지만, 그 이후 업데이트 되고, 새로운 render 이후, clean up 함수가 동작하고 나서 useEffect에 정의된 동작이 실행 된다.

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

      const Child = () => {
        console.log("  Child render start);
        const [text, setText] = useState(() => {
          console.log("  CHild useState);
          return "";
        })

        React.useEffect(() => {
          console.log("  Child useEffect, no deps no deps");
          return () => {
            console.log("  Child useEffect, [Cleanup], no deps");
          }
        })

        React.useEffect(() => {
          console.log("  Child useEffect, empty deps");
          return () => {
            console.log("  Child useEffect, [Cleanup], empty deps");
          }
        }, [])

        React.useEffect(() => {
          console.log("  Child useEffect, [text]");
          return () => {
            console.log("  Child useEffect, [Cleanup], [text]");
          }
        }, [text])

        function handleChange(event) {
          setText(event.target.value);
        }

        const element = (
          <>
            <input />
            <p></p>
          </>
        )

        console.log("  Child render end");
        return element;
      }

      const App = () => {
        console.log("APP render start);
        const [show, setShow] = React.useState(() => {
          console.log("APP useState);
          return false;
        });

        React.useEffect(() => {
          console.log("APP useEffect, no deps);

          return () => {
            console.log("APP useEffect [Cleanup], no deps");
          }
        });

        React.useEffect(() => {
          console.log("APP useEffect, empty deps);
          return () => {
            console.log("APP useEffect [Cleanup], empty deps");
          }
        }, []);

        React.useEffect(() => {
          console.log("APP useEffect, [show]);
          return () => {
            console.log("APP useEffect [Cleanup], [show]");
          }
        }, [show]);

        function handleClick() {

          setShow((prev) => !prev);
        }

        console.log("APP render end);

        return (
            <>
                <button onclick={handleClick}>Search</button>
                { show ? <Child /> : null}
            </>
        )

        ReactDOM.render(<App />, rootElement);

      }
    </script>
  </body>
</html>
```

### 실행 결과

```
APP render start
APP render end
  Child render start
  Child useState
  Child render end
  Child useEffect, no deps
  Child useEffect, empty dpes
  Child useEffect, [text]
APP useEffect, no deps
APP useEffect, [show]
```
