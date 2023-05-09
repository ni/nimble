import { DOM } from '@microsoft/fast-element';
import { RequiredUpdates } from './required-updates';
import type { UpdaTable } from '../types';

/**
 * custom update bingo card helper
 */
export class UpdateTracker<Type extends UpdaTable> {
    protected requiredUpdates: RequiredUpdates<Type>;
    private readonly baseInstance: Type;
    private updateQueued = false;

    public constructor(baseInstance: Type) {
        this.baseInstance = baseInstance;
        this.requiredUpdates = new RequiredUpdates(baseInstance);
    }

    public trackAllStateChanged(): void {
        this.setAllKeys(true);
        this.queueUpdate();
    }

    public get hasPendingUpdates(): boolean {
        return this.updateQueued;
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
        Object.keys(this.requiredUpdates).forEach(key => {
            this.requiredUpdates[key] = value;
        });
    }
}