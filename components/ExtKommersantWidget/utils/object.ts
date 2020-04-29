function hasOwnProperty(target: {}, property: string): boolean {
    return Object.prototype.hasOwnProperty.call(target, property);
}

export { hasOwnProperty };
