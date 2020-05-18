import { MessageType } from '../ExtKommersantWidget';

function makeScriptElement(src: string): string {
    return `<script src="${src}" type="text/javascript"></script>`;
}

function makeStyleLink(href: string): string {
    return `<link href="${href}" rel="stylesheet" type="text/css" />`;
}

function getWidgetHandlersScript(Id: string): string {
    return `<script type="text/javascript">
        const parentLocation = '${document.location}';
        window.ExtKommersantWidget = {
            id: '${Id}',
            container: document.getElementById('${Id}'),
            setHeight() {
                const height = this.container.scrollHeight;
                const message = {id: this.id, type: '${MessageType.SetContentHeight}', message: height};
                parent.postMessage(JSON.stringify(message), parentLocation);
            },
            setLoaded() {
                const message = {id: this.id, type: '${MessageType.IsLoaded}'};
                parent.postMessage(JSON.stringify(message), parentLocation);
            },
            setError(errorMessage) {
                const message = {id: this.id, type: '${MessageType.Error}', message: errorMessage};
                parent.postMessage(JSON.stringify(message), parentLocation);
            }
        };
    </script>`;
}

export { makeScriptElement, makeStyleLink, getWidgetHandlersScript };

