export function inlineScript(): void {
    window.addEventListener('message', event => {
        try {
            const data = JSON.parse(event.data);

            if (data.event === 'resize') {
                window.parent.postMessage(data, '*');
            }
        } catch (e) {}
    });
}
