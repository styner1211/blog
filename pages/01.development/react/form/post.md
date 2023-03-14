# 리액트에서의 Form

> https://ko.reactjs.org/docs/forms.html

HTML 폼 엘리먼트는 폼 엘리먼트 자체가 내부 상태를 가지기 때문에, React의 다른 DOM 엘리먼트와 다르게 동작한다.

## HTML의 Form

```html
<form>
  <label>
    Name:
    <input type="text" name="name" />
  </label>
  <input type="submit" value="Submit" />
</form>
```

- 사용자가 폼을 제출하면 새로운 페이지로 이동하는 기본 HTML 폼 동작을 수행
- React에서 동일한 동작을 원한다면 그대로 사용하면 됩니다. 그러나 대부분의 경우, JavaScript 함수로 폼의 제출을 처리하고 사용자가 폼에 입력한 데이터에 접근하도록 하는 것이 편리

## 제어 컴포넌트 (Controlled Component)

> React에 의해 값이 제어되는 입력 폼 엘리먼트를 “제어 컴포넌트 (controlled component)“라고 한다.

- HTML에서 <input>, <textarea>, <select>와 같은 폼 엘리먼트는 일반적으로 사용자의 입력을 기반으로 자신의 state를 관리하고 업데이트합니다.
- React에서는 변경할 수 있는 state가 일반적으로 컴포넌트의 state 속성에 유지되며 setState()에 의해 업데이트됩니다.
- React 렌더링 생명주기에서 폼 엘리먼트의 `value 어트리뷰트`는 DOM의 value를 대체합니다.

```javascript
function ControlledComponet() {
    const (value, setValue) = useState("");

    function handleChange(event) {
        setState(event.target.value);
    }

    function handleSubmit(event) {
        alert('A name was submitted: ' + value);
        event.preventDefault();
    }

    return (
        <form onSubmit={handleSubmit}>
        <label>
          Name:
          <input type="text" value={value} onChange={handleChange} />
        </label>
        <input type="submit" value="Submit" />
      </form>
    )
}
```

## 비제어 컴포넌트 (Uncontrolled Component)

> 제어 컴포넌트에서 폼 데이터는 React 컴포넌트에서 다루어집니다. 대안인 비제어 컴포넌트는 DOM 자체에서 폼 데이터가 다루어집니다.

모든 state 업데이트에 대한 이벤트 핸들러를 작성하는 대신 비제어 컴포넌트를 만들려면 ref를 사용하여 DOM에서 폼 값을 가져올 수 있습니다.

```javascript
function UncontrolledComponet() {
  const fileInputRef = useRef(null);

  function handleSubmit(event) {
    event.preventDefault();
    alert(`Selected file - ${fileInputRef.current.files[0].name}`);
  }

  return (
    <form onSubmit={handleSubmit}>
      <label>
        Upload file:
        <input type="file" ref={fileInputRef} />
      </label>
      <input type="submit" value="Submit" />
    </form>
  );
}
```
