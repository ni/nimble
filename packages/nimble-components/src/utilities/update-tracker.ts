import { DOM } from '@microsoft/fast-element';
import type { UpdaTable } from './types';

/**
 * custom update bingo card
 */
type RequiredUpdates<Type> = {
    [Property in keyof Type]: boolean;
};
/**
 * custom update bingo card helper
 */
export class UpdateTracker<Type> {
    protected requiredUpdates: RequiredUpdates<Type>;
    private readonly baseInstance: UpdaTable;
    private updateQueued = false;

    public constructor(baseInstance: UpdaTable) {
        this.baseInstance = baseInstance;
        this.requiredUpdates = {} as RequiredUpdates<Type>;
        for (const key of Object.keys(this.requiredUpdates) as (keyof Type)[]) {
            this.requiredUpdates[key] = false;
        }
    }

    public get hasPendingUpdates(): boolean {
        return this.updateQueued;
    }

    public track<Property extends keyof Type>(key: Property): void {
        this.requiredUpdates[key] = true;
        this.queueUpdate();
    }

    public update<Property extends keyof Type>(key: Property): boolean {
        return this.requiredUpdates[key];
    }

    public trackAllStateChanged(): void {
        this.setAllKeys(true);
        this.queueUpdate();
    }

    protected queueUpdate(): void {
        if (!this.baseInstance.$fastController.isConnected) {
            return;
        }
        if (!this.updateQueued) {
            this.updateQueued = true;
            DOM.queueUpdate(() => {
                this.baseInstance.update();
                this.setAllKeys(false);
                this.updateQueued = false;
            });
        }
    }

    private setAllKeys(value: boolean): void {
        (Object.keys(this.requiredUpdates) as (keyof Type)[]).forEach(key => {
            this.requiredUpdates[key] = value;
        });
    }
}