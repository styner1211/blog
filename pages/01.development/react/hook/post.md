# Hook

> Hook은 React 버전 16.8부터 React 요소로 새로 추가되었다.

Hook은 함수 컴포넌트에서 React state와 생명주기 기능(lifecycle features)을 “연동(hook into)“할 수 있게 해주는 함수이다.

## React에서 제공하는 내장 Hook

- useState
- useEffect
- useContext
- (useReducer)
  ...

## Hook을 사용하는 이유

> Hook을 사용하면 컴포넌트로부터 상태 관련 로직을 추상화할 수 있음

### 클래스형 컴포넌트에서의 생명 주기

```javascript
class FriendStatusWithCounter extends React.Component {
  constructor(props) {
    super(props);
    this.state = { count: 0, isOnline: null };
    this.handleStatusChange = this.handleStatusChange.bind(this);
  }

  componentDidMount() {
    document.title = `You clicked ${this.state.count} times`;
    ChatAPI.subscribeToFriendStatus(
      this.props.friend.id,
      this.handleStatusChange
    );
  }

  componentDidUpdate() {
    document.title = `You clicked ${this.state.count} times`;
  }

  componentWillUnmount() {
    ChatAPI.unsubscribeFromFriendStatus(
      this.props.friend.id,
      this.handleStatusChange
    );
  }

  handleStatusChange(status) {
    this.setState({
      isOnline: status.isOnline
    });
  }
  // ...
```

document.title을 설정하는 로직이 componentDidMount와 componentDidUpdate에 나누어져 있다.

구독(subscription)로직 또한 componentDidMount와 componentWillUnmount에 나누어져 있다.

즉, componentDidMount가 두 가지의 작업을 위한 코드를 모두 가지고 있다...

### 함수형 컴포넌트에서 useEffect 활용

> Effect를 이용하여 서로 관련이 없는 로직들을 갈라놓을 수 있다.

```javascript
function FriendStatusWithCounter(props) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    document.title = `You clicked ${count} times`;
  });

  const [isOnline, setIsOnline] = useState(null);
  useEffect(() => {
    function handleStatusChange(status) {
      setIsOnline(status.isOnline);
    }

    ChatAPI.subscribeToFriendStatus(props.friend.id, handleStatusChange);
    return () => {
      ChatAPI.unsubscribeFromFriendStatus(props.friend.id, handleStatusChange);
    };
  });
  // ...
}
```

## Custom Hook 만들기

개발을 하다 보면 가끔 상태 관련 로직을 컴포넌트 간에 재사용하고 싶은 경우가 생긴다.

이 문제를 해결하기 위한 전통적인 방법이 두 가지

- higher-order components
- render props

Custom Hook은 이들 둘과는 달리 컴포넌트 트리에 새 컴포넌트를 추가하지 않고도 이것을 가능하게 해준다.

> use{Name}와 같은 형태의 컨벤션을 따름

### Custom Hook 예시

```javascript
import React, { useState, useEffect } from "react";

function useFriendStatus(friendID) {
  const [isOnline, setIsOnline] = useState(null);

  function handleStatusChange(status) {
    setIsOnline(status.isOnline);
  }

  useEffect(() => {
    ChatAPI.subscribeToFriendStatus(friendID, handleStatusChange);
    return () => {
      ChatAPI.unsubscribeFromFriendStatus(friendID, handleStatusChange);
    };
  });

  return isOnline;
}
```

### Custom Hook 적용 예

```javascript
function FriendStatus(props) {
  const isOnline = useFriendStatus(props.friend.id);

  if (isOnline === null) {
    return "Loading...";
  }
  return isOnline ? "Online" : "Offline";
}
```

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
