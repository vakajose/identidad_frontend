export function textToHex(text: string): string {
    return text.split('').map(char => char.charCodeAt(0).toString(16)).join('');
}

export function hexToText(hex: string): string {
    return hex.match(/.{1,2}/g)?.map(byte => String.fromCharCode(parseInt(byte, 16))).join('') || '';
}

export function objectToJson(obj: any): string {
    return JSON.stringify(obj);
}

export function jsonToObject<T>(json: string): T {
    return JSON.parse(json) as T;
}

export function toTokenDataCompatible(data: any):string {
    return textToHex(objectToJson(data));
}