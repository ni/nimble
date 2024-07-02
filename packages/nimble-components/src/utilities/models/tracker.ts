type ObjectFromList<T extends readonly string[]> = {
    [K in T extends readonly (infer U)[] ? U : never]: boolean;
};

/**
 * Generic Tracker which sets or resets provided flags
 */
export class Tracker<TrackedItemsList extends readonly string[]> {
    private trackedItems: ObjectFromList<TrackedItemsList>;

    public constructor(trackedItemsList: TrackedItemsList) {
        type TrackedItems = typeof this.trackedItems;
        this.trackedItems = {} as TrackedItems;
        this.trackedItems = trackedItemsList.reduce<TrackedItems>(
            (r, key): TrackedItems => {
                return {
                    ...r,
                    [key]: false
                };
            },
            this.trackedItems
        );
    }

    public getTrackedItems(): ObjectFromList<TrackedItemsList> {
        return { ...this.trackedItems };
    }

    public isTracked(key: keyof ObjectFromList<TrackedItemsList>): boolean {
        return this.trackedItems[key];
    }

    public track(key: keyof ObjectFromList<TrackedItemsList>): void {
        const wasTracked = this.trackedItems[key];
        if (!wasTracked) {
            this.trackedItems[key] = true;
            this.onTrackingChange();
        }
    }

    public untrack(key: keyof ObjectFromList<TrackedItemsList>): void {
        const wasTracked = this.trackedItems[key];
        if (wasTracked) {
            this.trackedItems[key] = false;
            this.onTrackingChange();
        }
    }

    public trackAll(): void {
        if (this.allTracked()) {
            return;
        }

        this.setAllKeys(true);
        this.onTrackingChange();
    }

    public untrackAll(): void {
        if (this.noneTracked()) {
            return;
        }

        this.setAllKeys(false);
        this.onTrackingChange();
    }

    public allTracked(): boolean {
        return Object.values(this.trackedItems).every(x => x);
    }

    public anyTracked(): boolean {
        return Object.values(this.trackedItems).some(x => x);
    }

    public noneTracked(): boolean {
        return Object.values(this.trackedItems).every(x => !x);
    }

    protected onTrackingChange(): void {}

    private setAllKeys(value: boolean): void {
        type TrackedItems = typeof this.trackedItems;
        this.trackedItems = Object.keys(this.trackedItems).reduce<TrackedItems>(
            (r, key): TrackedItems => {
                return {
                    ...r,
                    [key]: value
                };
            },
            this.trackedItems
        );
    }
}
