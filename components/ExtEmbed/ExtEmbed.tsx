import * as React from 'react';
import { ExtIframe } from '../ExtIframe/ExtIframe';

export interface IExtEmbed {
    type: string;
    src: string;
}

export function ExtEmbed({ src }: IExtEmbed): JSX.Element {
    return (
        <ExtIframe frameSrc={src} />
    );
}
