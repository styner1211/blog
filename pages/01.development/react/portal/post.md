# Portal

Portal은 부모 컴포넌트의 DOM 계층 구조 바깥에 있는 DOM 노드로 자식 컴포넌트를 렌더링하는 방법을 제공한다.


## `public/index.html` 수정

```html
...
<body>
    <noscript>You need to enable JavaScript to run this app.</noscript>
    <div id="root"></div>
    <div id="portal"></div>  <!-- 이곳에 portal-->
</body>
...
```

## portal 컴포넌트 활용

portal의 전형적인 유스케이스는 부모 컴포넌트에 overflow: hidden이나 z-index가 있는 경우이지만, 시각적으로 자식을 “튀어나오도록” 보여야 하는 경우도 있다.
예를 들면,
 - 다이얼로그
 - 호버카드나
 - 툴팁

```javascript
const Portal = (props) => {
    return createPortal(props.children, document.getElementById("portal")) // portal 컴포넌트 하위로 컴포넌트를 전달 할 수 있게 함
}

export default funtion Example() {
    return (
        <div onClick={() => console.log("div")}> // Portal 내부에 있는 컴포넌트를 클릭해도 로그가 찍힌다.
            <Portal>
                <ThankyouDialog />
            </Portal>
            <div style={ {position: "absolute"} }>
                <button>버튼</button>
            </div>
        </div>
    )
}
```

> `portal`은 `root` 영역과 별개로 존재하는 레이어이지만, `portal` 내부의 컴포넌트에 클릭 이벤트가 발생 했을 때, 이벤트 버블링이 일어나 `root` 컴포넌트에 이벤트가 전달 된다.