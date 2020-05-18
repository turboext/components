function isJSON(str: string): boolean {
    try {
        const result = JSON.parse(str);
        return typeof result === 'object' && result !== null;
    } catch (e) {
        return false;
    }
}

export { isJSON };

