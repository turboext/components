import * as React from 'react';
import './ExtKommersantWidget.scss';
import {
    getWidgetHandlersScript,
    makeScriptElement,
    makeStyleLink
} from './utils/elements';
import { isJSON } from './utils/json';
import { hasOwnProperty } from './utils/object';
import { ExtEmbed } from '../ExtEmbed/ExtEmbed';

interface IWidgetProps {
    'data-root-id': string;
    'data-js-dependencies': string[];
    'data-css-dependencies': string[];
    'data-iframe-width'?: string;
    'data-iframe-height'?: string;
    'data-footer-text'?: string;
    'data-footer-link'?: string;
}

interface IWidgetState {
    widgetHtml: string | null;
    iframeHeight: string | null;
    errorOccurred: boolean;
    isLoaded: boolean;
}

export enum MessageType {
    Error = 'error',
    IsLoaded = 'is-loaded',
    SetContentHeight = 'content-height',
}

const DEFAULT_WIDTH = '100%';
const DEFAULT_HEIGHT = '120';

export class ExtKommersantWidget extends React.Component<IWidgetProps, IWidgetState> {
    public readonly state: IWidgetState = {
        widgetHtml: null,
        iframeHeight: null,
        errorOccurred: false,
        isLoaded: false
    }

    private messageHandlers: {[TKey in MessageType]: (message: string) => void} = {
        [MessageType.Error]: (message: string) => this.handleError(message),
        [MessageType.SetContentHeight]: (message: string) => this.setIframeHeight(message),
        [MessageType.IsLoaded]: () => this.setLoadingFinished()
    };

    public constructor(props: IWidgetProps) {
        super(props);
        this.handleMessage = this.handleMessage.bind(this);
    }

    public componentDidMount(): void {
        this.setWidgetHtml();
    }

    public render(): React.ReactNode {
        const { errorOccurred, widgetHtml, isLoaded } = this.state;
        const width = this.getIframeWidth();
        const height = this.getIframeHeight();
        if (widgetHtml && !errorOccurred) {
            return (
                <div className="ext-simple-widget">
                    <ExtEmbed
                        html={widgetHtml}
                        iframeHeight={height}
                        iframeWidth={width}
                        isLoaded={isLoaded}
                        onMessage={this.handleMessage}
                    />
                    {this.props['data-footer-text'] && isLoaded ? (
                        <div className="ext-simple-widget__footer">
                            {this.props['data-footer-link'] ? (
                                <a className="ext-simple-widget__footer-link" href={this.props['data-footer-link']}>{this.props['data-footer-text']}</a>
                            ) : this.props['data-footer-text']}
                        </div>
                    ) : null}
                </div>
            );
        }
        return null;
    }

    private getJsDependencies(): string {
        return this.props['data-js-dependencies'].map((dependencyUri: string): string => makeScriptElement(dependencyUri)).join('');
    }

    private getCssDependencies(): string {
        return this.props['data-css-dependencies'].map((dependencyUri: string): string => makeStyleLink(dependencyUri)).join('');
    }

    private getWidgetHtml(): string {
        return `
            <style type="text/css">body>* {height: auto; position: initial}</style>
            ${this.getCssDependencies()}
            <div id="${this.props['data-root-id']}"></div>
            ${getWidgetHandlersScript(this.props['data-root-id'])}
            ${this.getJsDependencies()}
        `;
    }

    private setWidgetHtml(): void {
        this.setState({
            widgetHtml: this.getWidgetHtml()
        });
    }

    private handleError(message: string): void {
        console.error(message);
        this.setState({
            errorOccurred: true
        });
    }

    private getIframeWidth(): string {
        return this.props['data-iframe-width'] || DEFAULT_WIDTH;
    }

    private getIframeHeight(): string {
        return this.state.iframeHeight || this.props['data-iframe-height'] || DEFAULT_HEIGHT;
    }

    private setIframeHeight(value: string): void {
        this.setState({
            iframeHeight: value
        });
    }

    private setLoadingFinished(): void {
        this.setState({
            isLoaded: true
        });
    }

    private handleMessage(event: MessageEvent): void {
        const message = event && event.data;
        if (isJSON(message)) {
            const parsed = JSON.parse(message);
            if (parsed.id === this.props['data-root-id'] && parsed.type) {
                if (hasOwnProperty(this.messageHandlers, parsed.type)) {
                    this.messageHandlers[parsed.type](parsed.message);
                }
            }
        }
    }
}
