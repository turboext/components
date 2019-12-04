import * as React from 'react';
import * as Inline from './Strossle.inline.js';

export function Strossle(props: Record<string, string>): JSX.Element {
    return (
        <div
            data-spklw-widget={props['data-widget']}
        >
            <script async src="https://widgets.sprinklecontent.com/v2/sprinkle.js"></script>
            <script dangerouslySetInnerHTML={{ __html: Inline }}></script>
        </div>
    );
}
