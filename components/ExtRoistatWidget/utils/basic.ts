function hasOwnProperty(target: {}, property: string): boolean {
    return Object.prototype.hasOwnProperty.call(target, property);
}

function tryConvertWin1251(encodedURIComponent: string): string | null {
    const win1251toUtf8Map = { '%E0': '%D0%B0', '%E1': '%D0%B1', '%E2': '%D0%B2', '%E3': '%D0%B3', '%E4': '%D0%B4', '%E5': '%D0%B5', '%B8': '%D1%91', '%E6': '%D0%B6', '%E7': '%D0%B7', '%E8': '%D0%B8', '%E9': '%D0%B9', '%EA': '%D0%BA', '%EB': '%D0%BB', '%EC': '%D0%BC', '%ED': '%D0%BD', '%EE': '%D0%BE', '%EF': '%D0%BF', '%F0': '%D1%80', '%F1': '%D1%81', '%F2': '%D1%82', '%F3': '%D1%83', '%F4': '%D1%84', '%F5': '%D1%85', '%F6': '%D1%86', '%F7': '%D1%87', '%F8': '%D1%88', '%F9': '%D1%89', '%FC': '%D1%8C', '%FB': '%D1%8B', '%FA': '%D1%8A', '%FD': '%D1%8D', '%FE': '%D1%8E', '%FF': '%D1%8F', '%C0': '%D0%90', '%C1': '%D0%91', '%C2': '%D0%92', '%C3': '%D0%93', '%C4': '%D0%94', '%C5': '%D0%95', '%A8': '%D0%81', '%C6': '%D0%96', '%C7': '%D0%97', '%C8': '%D0%98', '%C9': '%D0%99', '%CA': '%D0%9A', '%CB': '%D0%9B', '%CC': '%D0%9C', '%CD': '%D0%9D', '%CE': '%D0%9E', '%CF': '%D0%9F', '%D0': '%D0%A0', '%D1': '%D0%A1', '%D2': '%D0%A2', '%D3': '%D0%A3', '%D4': '%D0%A4', '%D5': '%D0%A5', '%D6': '%D0%A6', '%D7': '%D0%A7', '%D8': '%D0%A8', '%D9': '%D0%A9', '%DC': '%D0%AC', '%DB': '%D0%AB', '%DA': '%D0%AA', '%DD': '%D0%AD', '%DE': '%D0%AE', '%DF': '%D0%AF' };
    let result = '';
    let i = 0;

    while (i < encodedURIComponent.length) {
        const matchSubstring = encodedURIComponent.substring(i, i + 3);

        if (Object.prototype.hasOwnProperty.call(win1251toUtf8Map, matchSubstring)) {
            result += win1251toUtf8Map[matchSubstring];
            i += 3;
        } else {
            result += encodedURIComponent.substring(i, i + 1);
            i += 1;
        }
    }

    try {
        return decodeURIComponent(result);
    } catch (e) {
        return null;
    }
}

function decodeURIComponentSafe(encodedURIComponent: string): string {
    try {
        return decodeURIComponent(encodedURIComponent);
    } catch (e) {
        const result = tryConvertWin1251(encodedURIComponent);
        if (result === null) {
            return encodedURIComponent;
        }
        return result;
    }
}

function roistatGetCookie(name: string): string | null {
    const replacedName = name.replace(/([.$?*|{}()[]\/+^])/g, '\\$1');
    const matches = document.cookie.match(new RegExp(`(?:^|; )${replacedName}=([^;]*)`));
    return matches ? decodeURIComponentSafe(matches[1]) : null;
}

function roistatSetCookie(name: string, value: string, options: {expires: Date|number|string; path: string}): void {
    const cookieOptions = options || {};
    let { expires } = cookieOptions;

    if (typeof expires === 'number' && expires) {
        const d = new Date();
        const expireTime = expires * 1000;
        d.setTime(d.getTime() + expireTime);
        expires = d;
        options.expires = d;
    }

    if (expires && expires instanceof Date) {
        cookieOptions.expires = expires.toUTCString();
    }

    const encodedValue = encodeURIComponent(value);
    let updatedCookie = `${name}=${encodedValue}`;

    for (const propName in cookieOptions) {
        if (hasOwnProperty(cookieOptions, propName)) {
            updatedCookie += `; ${propName}`;
            const propValue = cookieOptions[propName];
            if (propValue !== true) {
                updatedCookie += `=${propValue}`;
            }
        }
    }
    document.cookie = updatedCookie;
}

export { hasOwnProperty, roistatGetCookie, roistatSetCookie };
