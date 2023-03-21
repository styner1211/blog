# 고차 컴포넌트: HOC(Higher Order Component)

컴포넌트 로직을 재사용하기 위한 React의 고급 기술

> 고차 컴포넌트는 컴포넌트를 가져와 새 컴포넌트를 반환하는 함수이다.

## 클래스형 컴포넌트에서 고차 컴포넌트 사용의 예

외부로부터 데이터를 구독하여 댓글 목록을 렌더링

```javascript
class CommentList extends React.Component {
  constructor(props) {
    super(props);
    this.handleChange = this.handleChange.bind(this);
    this.state = {
      // "DataSource" 는 글로벌 데이터 소스입니다.
      comments: DataSource.getComments(),
    };
  }

  componentDidMount() {
    // 변화감지를 위해 리스너를 추가합니다.
    DataSource.addChangeListener(this.handleChange);
  }

  componentWillUnmount() {
    // 리스너를 제거합니다.
    DataSource.removeChangeListener(this.handleChange);
  }

  handleChange() {
    // 데이터 소스가 변경될때 마다 comments를 업데이트합니다.
    this.setState({
      comments: DataSource.getComments(),
    });
  }

  render() {
    return (
      <div>
        {this.state.comments.map((comment) => (
          <Comment comment={comment} key={comment.id} />
        ))}
      </div>
    );
  }
}
```

블로그 포스트를 구독하기 위해 위와 비슷한 패턴으로 컴포넌트를 작성

```javascript
class BlogPost extends React.Component {
  constructor(props) {
    super(props);
    this.handleChange = this.handleChange.bind(this);
    this.state = {
      blogPost: DataSource.getBlogPost(props.id),
    };
  }

  componentDidMount() {
    DataSource.addChangeListener(this.handleChange);
  }

  componentWillUnmount() {
    DataSource.removeChangeListener(this.handleChange);
  }

  handleChange() {
    this.setState({
      blogPost: DataSource.getBlogPost(this.props.id),
    });
  }

  render() {
    return <TextBlock text={this.state.blogPost} />;
  }
}
```

위 두 컴포넌트는 대부분의 구현체가 동일하다.

- 컴포넌트가 마운트되면, change 리스너를 `DataSource`에 추가
- 리스너 안에서, 데이터 소스가 변경되면 `setState`를 호출
- 컴포넌트가 마운트 해제되면 change 리스너를 제거

따라서, `DataSource` 를 구독하는 `CommentList` 나 `BlogPost` 같은 컴포넌트를 생성하는 함수, `withSubscription`를 만들어 활용할 수 있다.

```javascript
const CommentListWithSubscription = withSubscription(
  CommentList,
  (DataSource) => DataSource.getComments(),
);

const BlogPostWithSubscription = withSubscription(
  BlogPost,
  (DataSource, props) => DataSource.getBlogPost(props.id),
);
```

고차 컴포넌트 `withSubscription`

> 고차 컴포넌트는 원본 컴포넌트를 컨테이너 컴포넌트로 포장(Wrapping)하여 조합(compose)합니다.

```javascript
// 이 함수는 컴포넌트를 매개변수로 받고..
function withSubscription(WrappedComponent, selectData) {
  // ...다른 컴포넌트를 반환하는데...
  return class extends React.Component {
    constructor(props) {
      super(props);
      this.handleChange = this.handleChange.bind(this);
      this.state = {
        data: selectData(DataSource, props),
      };
    }

    componentDidMount() {
      // ... 구독을 담당하고...
      DataSource.addChangeListener(this.handleChange);
    }

    componentWillUnmount() {
      DataSource.removeChangeListener(this.handleChange);
    }

    handleChange() {
      this.setState({
        data: selectData(DataSource, this.props),
      });
    }

    render() {
      // ... 래핑된 컴포넌트를 새로운 데이터로 렌더링 합니다!
      // 컴포넌트에 추가로 props를 내려주는 것에 주목하세요.
      return <WrappedComponent data={this.state.data} {...this.props} />;
    }
  };
}
```

## 함수형 컴포넌트에서 고차 컴포넌트 사용의 예

```javascript
function withLoading(Component) {
  const WithLoadingComponent = (props) => {
    const [loading, setLoading] = useState(true);

    useEffect(() => {
      const timer = setTimeout(() => setLoading);
      return () => clearTimeout(timer);
    }, []);

    return loading ? <p>Loading ... </p> : <Component {...props} />;
  };
  return WithLoadingComponent;
}
```

```javascript
function Button() {
  return <button>Button</button>;
}

export default withLoading(Button);
```
