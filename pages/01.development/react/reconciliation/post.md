# Reconcilation (재조정)

> 실제 DOM과 Virtual DOM의 동기화

리액트에서는 state나 props가 갱신되면 렌더링이 일어나고, 이것은 render() 함수가 새로운 React 엘리먼트를 반환하게 되는 것을 의미한다.
이렇게 하나의 트리를 가지고 다른 트리로 변환하기 위한 최적 알고리즘은 $$O(N^{3})$$ 이다.

따라서, 리액트는 아래 두가지 가정을 두고 $$O(N)$$ 복잡도의 휴리스틱 알고리즘을 이용하여 트리를 변환하여 렌더링 성능을 높인다.

1. 서로 다른 타입의 두 엘리먼트는 서로 다른 트리를 만들어낸다.
2. 개발자가 key prop을 통해, 여러 렌더링 사이에서 어떤 자식 엘리먼트가 변경되지 않아야 할지 표시해 줄 수 있다.

## 비교 알고리즘 (Diffing Alogrithm)

### 엘리먼트 타입이 다른 경우

두 루트 엘리먼트의 타입이 다르면, React는 이전 트리를 버리고 완전히 새로운 트리를 구축한다.

``` javascript
// 이전 컴포넌트
<div>
  <Counter />
</div>
// 새로운 컴포넌트
<span>
  <Counter />
</span>
```

### DOM 엘리먼트 타입이 같은 경우

리액트는 두 컴포넌트의 엘리먼트가 동일하면, 두 엘리먼트의 속성을 확인하여, 현재 DOM 노드 상의 동일한 내역은 유지하고 변경도니 속성들만 갱신한다.

예를들면,

`className`만 수정
```javascript
<div className="before" title="stuff" />

<div className="after" title="stuff" />
```

`fontWeight`는 수정하지 않고 `color`속성만 수정
```javascript
<div style={{color: 'red', fontWeight: 'bold'}} />

<div style={{color: 'green', fontWeight: 'bold'}} />
```

## 자식에 대한 재귀적 처리

DOM 노드의 자식들을 재귀적으로 처리할 때, React는 기본적으로 동시에 두 리스트를 순회하고 차이점이 있으면 변경을 생성한다.

예를 들어, 아래 처럼 자식의 끝에 엘리먼트를 추가하면 변경이 잘 동작한다.
```javascript
<ul>
  <li>first</li>
  <li>second</li>
</ul>

<ul>
  <li>first</li>
  <li>second</li>
  <li>third</li>
</ul>
```
React는 두 트리에서 <li>first</li>가 일치하는 것을 확인하고, <li>second</li>가 일치하는 것을 확인합니다. 그리고 마지막으로 <li>third</li>를 트리에 추가한다.

하지만 리스트의 맨 앞에 엘리먼트를 추가하는 경우 성능이 좋지 않다.

```javascript
<ul>
  <li>Duke</li>
  <li>Villanova</li>
</ul>

<ul>
  <li>Connecticut</li>
  <li>Duke</li>
  <li>Villanova</li>
</ul>
```

> 이러한 문제를 해결하기 위헤 React는 Key 속성을 제공한다.


```javascript
<ul>
  <li key="2015">Duke</li>
  <li key="2016">Villanova</li>
</ul>

<ul>
  <li key="2014">Connecticut</li>
  <li key="2015">Duke</li>
  <li key="2016">Villanova</li>
</ul>
```

## key의 존재 유무에 따른 업데이트 방식

아래와 같은 배열이 랜더링 된다고 가정해보자.

```javascript
const array = ['a', 'b', 'c', 'd'];
array.map(item => <div>{item}</div>);
```

위 배열의 b 와 c 사이에 z 를 삽입하게 된다면, 리렌더링을 하게 될 때 `<div>b</div>` 와 `<div>c</div>` 사이에 새 `div` 태그를 삽입을 하게 되는 것이 아니라, 기존의 c 가 z 로바뀌고, d 는 c 로 바뀌고, 맨 마지막에 d 가 새로 삽입된다..

그 다음에 a 를 제거하게 된다면, 기존의 a 가 b 로 바뀌고, b 는 z 로 바뀌고, z는 c로 바뀌고, c는 d 로바뀌고, 맨 마지막에 있는 d 가 제거된다.

하지만, `key`가 있다면 위 처럼 비효율 적으로 업데이트 되는 것이 아니라, 수정되지 않는 기존의 값은 그대로 두고 원하는 곳에 내용을 삽입하거나 삭제한다.
