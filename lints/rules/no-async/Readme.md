# no-async

Forbids usage of async javascript on the server.

## Rule Details

This rule disallows server-side async javascript functions.

Examples of **incorrect** code for this rule:

```js
setTimeout(() => console.log(123));
```
```js
new Promise().then(() => {})
```

```js
import('some-module').then(/* ... */)
```

Examples of **correct** code for this rule:

```js
import * as React from 'react'

export class asd extends React.PureComponent {
  componentDidMount() {
    setTimeout(() => { this.setState({a: 1}) })
  }
}
```
```js
let a = 1;

if (typeof window !== 'undefined') {
  setTimeout(() => a = 3);
}

```

```js
const canUseDom = typeof window == 'undefined' && window.document;
let a = 1;`

if (canUseDome) {
  setTimeout(() => a = 3);
}

```

```js
let a = 1;

typeof window !== 'undefined' && setTimeout(() => a = 3)

```

```js
const promiseLike = typeof window === 'undefined' ? {then(fn) { fn() }} : new Promise();
```
