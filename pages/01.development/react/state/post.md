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

## 리액트의 생명 주기(Life Cycle)

### 클래스형 컴포넌트의 생명 주기

```javascript
class Clock extends React.Component {
  constructor(props) {
    super(props);
    this.state = { date: new Date() }; // 기본 state 셋팅
  }

  componentDidMount() {
    // useEffect의 effect 함수 + deps = []
    this.timerID = setInterval(() => this.tick(), 1000);
  }

  componentWillUnmount() {
    // useEffect의 clean-up 함수와 비슷
    clearInterval(this.timerID);
  }

  tick() {
    this.setState({
      date: new Date(),
    });
  }

  render() {
    return (
      <div>
        <h1>Hello, world!</h1>
        <h2>It is {this.state.date.toLocaleTimeString()}.</h2>
      </div>
    );
  }
}

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<Clock />);
```

### state의 함수형 업데이트

> React는 성능을 위해 여러 setState() 호출을 단일 업데이트로 한꺼번에 처리할 수 있다.

this.props와 this.state가 비동기적으로 업데이트될 수 있기 때문에 다음 state를 계산할 때 해당 값에 의존해서는 안된다.

```
// Wrong
this.setState({
  counter: this.state.counter + this.props.increment,
});
```

따라서, 객체보다는 함수를 인자로 사용하는 다른 형태의 setState()를 사용 한다.

```
// Correct
this.setState((state, props) => ({
  counter: state.counter + props.increment
}));
```

인자로 사용된 함수는 이전 state를 첫 번째 인자로 받아들일 것이고, 업데이트가 적용된 시점의 props를 두 번째 인자로 받아들인다.
