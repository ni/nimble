import type { FoundationElement } from '@microsoft/fast-foundation';

/**
 * custom update bingo card
 */
export class RequiredUpdates<Type extends FoundationElement> {
    [key: string]: boolean;
    public constructor(baseInstance: Type) {
        for (const key of Object.keys(baseInstance)) {
            this[key] = false;
        }
    }
}