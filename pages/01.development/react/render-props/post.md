# Render Props

render props 패턴으로 구현된 컴포넌트는 자체적으로 렌더링 로직을 구현하는 대신, react 엘리먼트 요소를 반환하고 이를 호출하는 함수를 사용합니다.
render props를 사용하는 라이브러리는 React Router, Downshift, Formik이 있다.

> props로 반드시 render를 사용할 필요는 없다!

```javascript
<DataProvider render={data => (
  <h1>Hello {data.target}</h1>
)}/>
```
> 캡슐화된 상태나 동작을 재사용성 할 수 있는 방법을 제공

다음과 같이, 웹 어플리케이션에서 마우스 위치를 추적하는 로직을 생각해 보자.

스크린 주위로 마우스 커서를 움직이면, 컴포넌트가 마우스의 (x, y) 좌표를 <p>에 나타난다.
```javascript
class MouseTracker extends React.Component {
  constructor(props) {
    super(props);
    this.handleMouseMove = this.handleMouseMove.bind(this);
    this.state = { x: 0, y: 0 };
  }

  handleMouseMove(event) {
    this.setState({
      x: event.clientX,
      y: event.clientY
    });
  }

  render() {
    return (
      <div style={{ height: '100vh' }} onMouseMove={this.handleMouseMove}>
        <h1>Move the mouse around!</h1>
        <p>The current mouse position is ({this.state.x}, {this.state.y})</p>
      </div>
    );
  }
}
```

이때, 마우스 커스 트래킹 행위를 `<Mouse>` 컴포넌트를 캡슐화하여 어디서든 사용할 수 있게 고쳐보자.

```javascript
// <Mouse> 컴포넌트는 우리가 원하는 행위를 캡슐화 합니다...
class Mouse extends React.Component {
  constructor(props) {
    super(props);
    this.handleMouseMove = this.handleMouseMove.bind(this);
    this.state = { x: 0, y: 0 };
  }

  handleMouseMove(event) {
    this.setState({
      x: event.clientX,
      y: event.clientY
    });
  }

  render() {
    return (
      <div style={{ height: '100vh' }} onMouseMove={this.handleMouseMove}>

        {/* ...하지만 <p>가 아닌 다른것을 렌더링하려면 어떻게 해야 할까요? */}
        <p>The current mouse position is ({this.state.x}, {this.state.y})</p>
      </div>
    );
  }
}

class MouseTracker extends React.Component {
  render() {
    return (
      <>
        <h1>Move the mouse around!</h1>
        <Mouse />
      </>
    );
  }
}
```

하지만, 만약 마우스 위치에 고양이 그림을 붙여주고 싶으면, 아래와 같이 좀 더 리팩토링이 필요하다.

```javascript
class Cat extends React.Component {
  render() {
    const mouse = this.props.mouse;
    return (
      <img src="/cat.jpg" style={{ position: 'absolute', left: mouse.x, top: mouse.y }} />
    );
  }
}

class MouseWithCat extends React.Component {
  constructor(props) {
    super(props);
    this.handleMouseMove = this.handleMouseMove.bind(this);
    this.state = { x: 0, y: 0 };
  }

  handleMouseMove(event) {
    this.setState({
      x: event.clientX,
      y: event.clientY
    });
  }

  render() {
    return (
      <div style={{ height: '100vh' }} onMouseMove={this.handleMouseMove}>

        {/*
          여기서 <p>를 <Cat>으로 바꿀 수 있습니다. ... 그러나 이 경우
          Mouse 컴포넌트를 사용할 때 마다 별도의 <MouseWithSomethingElse>
          컴포넌트를 만들어야 합니다, 그러므로 <MouseWithCat>는
          아직 정말로 재사용이 가능한게 아닙니다.
        */}
        <Cat mouse={this.state} />
      </div>
    );
  }
}

class MouseTracker extends React.Component {
  render() {
    return (
      <div>
        <h1>Move the mouse around!</h1>
        <MouseWithCat />
      </div>
    );
  }
}
```

여기서 `<Cat> 컴포넌트 대신, 원하는 컴포넌트를 동적으로 렌더링 할 수 있또록 하는 함수 props를 전달 할 수 있는데, 이것이 render props의 개념이다.

> render prop은 무엇을 렌더링할지 컴포넌트에 알려주는 함수입니다.

```javascript
class Cat extends React.Component {
  render() {
    const mouse = this.props.mouse;
    return (
      <img src="/cat.jpg" style={{ position: 'absolute', left: mouse.x, top: mouse.y }} />
    );
  }
}

class Mouse extends React.Component {
  constructor(props) {
    super(props);
    this.handleMouseMove = this.handleMouseMove.bind(this);
    this.state = { x: 0, y: 0 };
  }

  handleMouseMove(event) {
    this.setState({
      x: event.clientX,
      y: event.clientY
    });
  }

  render() {
    return (
      <div style={{ height: '100vh' }} onMouseMove={this.handleMouseMove}>

        {/*
          <Mouse>가 무엇을 렌더링하는지에 대해 명확히 코드로 표기하는 대신,
          `render` prop을 사용하여 무엇을 렌더링할지 동적으로 결정할 수 있습니다.
        */}
        {this.props.render(this.state)}
      </div>
    );
  }
}

class MouseTracker extends React.Component {
  render() {
    return (
      <div>
        <h1>Move the mouse around!</h1>
        <Mouse render={mouse => (
          <Cat mouse={mouse} />
        )}/>
      </div>
    );
  }
}
```

다시 말하면, render props를 이용하면 마우스 트래킹과 같은 행위를 매우 쉽게 공유할 수 있도록 만들어 준다.

ender props에 대해 한가지 흥미로운 점은 대부분의 higher-order components(HOC)에 render props pattern을 이식할 수 있다.

예를 들면, <Mouse> 컴포넌트보다 withMouse HOC를 더 선호한다면 render prop을 이용해서 다음과 같이 쉽게 [HOC](/01.development/react/hoc)를 만들 수 있다.

```javascript
// 어떤 이유 때문에 HOC를 만들기 원한다면, 쉽게 구현할 수 있습니다.
// render prop을 이용해서 일반적인 컴포넌트를 만드세요!
function withMouse(Component) {
  return class extends React.Component {
    render() {
      return (
        <Mouse render={mouse => (
          <Component {...this.props} mouse={mouse} />
        )}/>
      );
    }
  }
}
```