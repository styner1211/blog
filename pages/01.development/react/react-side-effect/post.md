# React의 사이드 이펙트

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

## useEffect 의 이펙트와 클린업 동작 방식

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

## useEffect 의 이펙트와 클린업 예시

### count가 딱 한번만 증가되는 예시

```javascript
function Counter() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    const id = setInterval(() => {
      setCount(count + 1);
    }, 1000);

    return () => clearInterval(id);
  }, []); // empty depth

  return <h1>{count}</h1>;
}
```

- deps에 아무것도 들어있지 않기 때문에 이펙트는 첫 렌더링 직후 딱 한번만 실행 됨
- 이때 `setInterval()`이 실행되는데, 여기서 참조하는 count 값은 항상 0
- `secCount(0+1)`이 실행되는 순간, 컴포넌트는 두번째 렌더링을 시작하고, count가 1이 된 상태로 렌더링 완료
- 이 두번째 렌더링 이후, 이펙트는 실행되지 않음 (empty deps)
- 이 두번째 렌더링 이후, 클린업(`clearInterval(id)`)도 실행되지 않음
- 따라서 1초마다, `setCount(0+1)`이 반복됨
- 무한 반복...

### count가 정상적으로 증가되는 예시

```javascript
function Counter() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    const id = setInterval(() => {
      setCount(count + 1);
    }, 1000);

    return () => clearInterval(id);
  }, [count]); // deps: [count]

  return <h1>{count}</h1>;
}
```

- 하지만, 매 랜더링 마다, 이전 렌더링에서 설정했던 타이머가 초기화되고 다시 설정되는 과정이 쓸데없이 반복됨 (비효율적)

###

```javascript
useEffect(() => {
  const id = setInterval(() => {
    setCount((c) => c + 1); // 람다
  }, 1000);

  return () => clearInterval(id);
}, []);
```

- 이전 방식의 업데이트(`setCount(count + 1)`) 인 경우, 기존 렌더링 스코프 안에 갇힌 count값을 참조해야만 했음 (계속 0이었던...)
- 현재 방식의 업데이트(`setCount(c => c + 1)`) 인 경우, 람다식을 이용해 count 참조 하지 않고, 초기값 0인 상태에서 부터, 기존 상태를 가지고 업데이트 방식을 정의함
- 두번째 렌더링 부터는 이펙트를 실행하지 않음
- 따라서 정확이 1초마다 값이 1씩 증가
