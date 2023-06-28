import { spinalCase } from '@microsoft/fast-web-utilities';

export function getPropertyName(jsKey: string): string {
    return jsKey.replace(/Label$/, '');
}

export function getAttributeName(jsKey: string): string {
    return spinalCase(getPropertyName(jsKey));
}
