# react-snap으로 정적페이지 빌드

## Basic usage with create-react-app

Install:

```sh
yarn add --dev react-snap
```

Change `package.json`:

```json
"scripts": {
  "postbuild": "react-snap"
}
```

Change `src/index.js` (for React 16+):

```js
import { hydrate, render } from "react-dom";

const rootElement = document.getElementById("root");
if (rootElement.hasChildNodes()) {
  hydrate(<App />, rootElement);
} else {
  render(<App />, rootElement);
}
```

That's it!