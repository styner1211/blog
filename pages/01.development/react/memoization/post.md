# Memoization

> 부모 컴포넌트의 props 변경으로 인해 모든 자식 컴포넌트가 처음부터 리랜더링 되는 것을 방지

## React.memo

컴포넌트가 동일한 props로 동일한 결과를 렌더링해낸다면, React.memo를 호출하고 결과를 메모이징(Memoizing)하도록 래핑하는 [고차 컴포넌트](/01.development/react/hoc).

즉, React는 컴포넌트를 렌더링하지 않고 마지막으로 렌더링된 결과를 재사용한다.

> React.memo는 props 변화에만 영향을 준다.. React.memo로 감싸진 함수 컴포넌트 구현에 useState, useReducer 또는 useContext 훅을 사용한다면, 여전히 state나 context가 변할 때 다시 렌더링된다.

```javascript
const MyComponent = React.memo(function MyComponent(props) {
  /* props를 사용하여 렌더링 */
});
```

props가 갖는 복잡한 객체에 대하여 얕은 비교만을 수행하는 것이 기본 동작입니다. 다른 비교 동작을 원한다면, 두 번째 인자로 별도의 비교 함수를 제공하면 된다.

```javascript
function MyComponent(props) {
  /* props를 사용하여 렌더링 */
}
function areEqual(prevProps, nextProps) {
  /*
  nextProps가 prevProps와 동일한 값을 가지면 true를 반환하고, 그렇지 않다면 false를 반환
  */
}
export default React.memo(MyComponent, areEqual);
```

## useMemo

> 메모이제이션 된 값을 반환

```javascript
const memoizedValue = useMemo(() => computeExpensiveValue(a, b), [a, b]);
```

## useCallback

> 메모이제이션 된 함수를 반환

부모 컴포넌트가 리랜더링 될 때, 부모 컴포넌트 내에 선언된 함수도 재생성이 되기 때문에 해당 함수를 props로 전달 받는 자식 컴포넌트는 이것을 props 변경으로 감지하여 리랜더링 되게 된다. 이것을 방지하기 위해 아래 처럼 해당 함수를 Memoization 할 수 있다.

```javascript
const memoizedCallback = useCallback(() => {
  doSomething(a, b);
}, [a, b]);
```
