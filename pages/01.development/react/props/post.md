# 리액트의 Component와 Props

> https://ko.reactjs.org/docs/components-and-props.html

# 컴포넌트 합성

Welcome을 여러 번 렌더링하는 App 컴포넌트를 만들 수 있다.

```javascript
function Welcome(props) {
  return <h1>Hello, {props.name}</h1>;
}

function App() {
  return (
    <div>
      <Welcome name="Sara" />
      <Welcome name="Cahal" />
      <Welcome name="Edite" />
    </div>
  );
}
```

# Props

함수 컴포넌트나 클래스 컴포넌트 모두 컴포넌트의 자체 props를 수정해서는 안 된다.

## 순수 함수

입력값을 바꾸려 하지 않고 항상 동일한 입력값에 대해 동일한 결과를 반환하는 함수

```javascript
function sum(a, b) {
  return a + b;
}
```

반면에 다음 함수는 자신의 입력값을 변경하기 때문에 순수 함수가 아니다.

```javascript
function withdraw(account, amount) {
  account.total -= amount;
}
```

> 모든 React 컴포넌트는 자신의 props를 다룰 때 반드시 순수 함수처럼 동작해야 한다.

React 컴포넌트는 state를 통해 위 규칙을 위반하지 않고 사용자 액션, 네트워크 응답 및 다른 요소에 대한 응답으로 시간에 따라 자신의 출력값을 변경할 수 있다.
