const meta = /<meta http-equiv="Content-Security-Policy" content="[^"]+">/;

export default function removeCSP(rawHtml: string): string {
    return rawHtml.replace(meta, '');
}
