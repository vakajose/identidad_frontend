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

export function fromTokenDataCompatible<T>(hex: string): T {
    return jsonToObject(hexToText(hex));
}

export function blockTimestampToDate(timestamp: number): Date {
    return new Date(timestamp * 1000);
}

export function documentDataToCedula(data:any, tokenId?:string): any {
    return {
        ...fromTokenDataCompatible(data.encryptedData),
        tokenId: tokenId || null,
        isCurrent: data.isCurrent,
        createdAt: blockTimestampToDate(Number(data.createdAt)),
        updatedAt: blockTimestampToDate(Number(data.updatedAt))
    };
}