# no-async

Forbids usage of browser-only globals on the server.

## Rule Details

This rule usage of browser-only globals when they can throw an error.

Examples of **incorrect** code for this rule:

```js
alert(123);
```
```js
window.document.createElement('div')
```

Examples of **correct** code for this rule:

```js
import * as React from 'react'

export class asd extends React.PureComponent {
  componentDidMount() {
    alert(123);
  }
}
```
```js
let a = 1;

if (typeof window !== 'undefined') {
  alert(a);
}

```

```js
const canUseDom = typeof window == 'undefined' && window.document && window.document.createElement;
let a = 1;

if (canUseDom) {
  alert(a);
}

```

```js
let a = 1;

typeof window !== 'undefined' && alert(a)

```

```js
let a = 1;

typeof window === 'undefined' ? console.log(a) : alert(a)

```
