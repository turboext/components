# correct-file-export

Check for correct named exports usage.

## Rule Details

This rule allows only named exports. Export name should be equal to file name.

Examples of **incorrect** code for this rule:

```js
import * as React from 'react'

export default class asd extends React.PureComponent {}
```
```js
export default function asd () {}
```

```js
import * as React from 'react'

class asdPresenter extends React.PureComponent {}
export const asd = asdPresenter;
```

Examples of **correct** code for this rule:

```js
import * as React from 'react'

export class asd extends React.PureComponent {}
```
```js
import * as React from 'react'

class asd extends React.PureComponent {}
export { asd };
```
```js
export function asd () {}
```
```js
function asd () {}
export { asd };
```
