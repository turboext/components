import * as React from 'react';
import {
    hasOwnProperty,
    roistatGetCookie,
    roistatSetCookie
} from './utils/basic';
import { ExtEmbed } from '../ExtEmbed/ExtEmbed';

interface IWidgetProps {
    'data-key': string;
}

interface IWidgetState {
    widgetHtml: string | null;
    hasError: boolean;
    isLoaded: boolean;
}

export enum MessageType {
    Error = 'error',
    VisitInited = 'visit_inited',
}

export class ExtRoistatWidget extends React.PureComponent<IWidgetProps, IWidgetState> {
    public readonly state: IWidgetState = {
        widgetHtml: null,
        hasError: false,
        isLoaded: false
    }

    private readonly roistatDefaultContainerId: string = 'roistat_container';

    private readonly roistatVisitCookie: string = 'roistat_visit';

    private readonly roistatVisitCookieExpireTime: number = 7 * 24 * 60 * 60;

    private messageHandlers: {[TKey in MessageType]: (visitId: number) => void} = {
        [MessageType.Error]: () => this.handleError(),
        [MessageType.VisitInited]: (visitId: number) => this.visitInited(visitId)
    };

    public componentDidMount(): void {
        if (typeof window !== 'undefined') {
            window.addEventListener('message', event => this.handleMessage(event.data));
        }
        this.setWidgetHtml();
    }

    public render(): React.ReactNode {
        const { hasError, widgetHtml, isLoaded } = this.state;
        const width = '1';
        const height = '1';

        if (widgetHtml && !hasError) {
            return (
                <div style={{ display: 'none' }}>
                    <ExtEmbed
                        html={widgetHtml}
                        iframeHeight={height}
                        iframeWidth={width}
                        isLoaded={isLoaded}
                    />
                </div>
            );
        }
        return null;
    }

    private setWidgetHtml(): void {
        const visitFromCookie = roistatGetCookie(this.roistatVisitCookie);
        const widgetHtml = visitFromCookie ? null : this.getWidgetHtml();
        this.setState({
            widgetHtml
        });
    }

    private handleMessage(data: { id: string; visitId: string; type: string }): void {
        const handlers = this.messageHandlers;
        if (data.id === this.roistatDefaultContainerId && data.type && hasOwnProperty(handlers, data.type)) {
            handlers[data.type](data.visitId);
        }
    }

    private visitInited(visitId: number): void {
        roistatSetCookie(this.roistatVisitCookie, visitId.toString(), { expires: this.roistatVisitCookieExpireTime, path: '/' },);
        this.setState({
            isLoaded: true
        });
    }


    private handleError(): void {
        this.setState({
            isLoaded: true,
            hasError: true
        });
    }

    private getWidgetHtml(): string {
        return `
            <div id="${this.roistatDefaultContainerId}"></div>
            ${this.getWidgetHandlersScript(this.roistatDefaultContainerId, this.props['data-key'])}
        `;
    }

    private getWidgetHandlersScript(id: string, key: string): string {
        const initUrl = `https://cloud.roistat.com/api/site/1.0/${key}/turbo/init`;
        const location = typeof window === 'undefined' ? null : document.location;
        const referrer = typeof window === 'undefined' ? null : document.referrer;

        return `<script type="text/javascript">
            window.roistatInitTurbo = function(visitId, calltracking, emailtracking) {
                id: '${id}';
                container: document.getElementById('${id}');
                message = {id: '${id}', visitId: visitId, type: '${MessageType.VisitInited}'};
                parent.postMessage(message, '${location}');
            };
            setTimeout(function() {
                var script = document.createElement('script');
                script.onload = script.onreadystatechange = function() {
                    var state = this.readyState ? this.readyState : 'unknown';
                };
                script.src = '${initUrl}?page=${location}&ref=${referrer}';
                script.type = "text/javascript";
                script.async = true;
                script.id = 'roistat-js-script';
                var otherScript = document.getElementsByTagName('script')[0];
                otherScript.parentNode.insertBefore(script, otherScript);
            }, 100);
        </script>`;
    }
}
