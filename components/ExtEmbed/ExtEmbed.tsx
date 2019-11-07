import * as React from 'react';
import { ExtIframe } from '../ExtIframe/ExtIframe';

export interface IExtEmbed {
    type: string;
    src: string;
}

export function ExtEmbed({ src, type }: IExtEmbed): JSX.Element {
    return (
        <ExtIframe
            className={`embed_type_${type}`}
            frameSrc={src}
        />
    );
}
