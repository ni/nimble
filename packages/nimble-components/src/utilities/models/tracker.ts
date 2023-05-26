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

    public trackedItemState(
        key: keyof ObjectFromList<TrackedItemsList>
    ): boolean {
        return this.trackedItems[key];
    }

    public track(key: keyof ObjectFromList<TrackedItemsList>): void {
        this.trackedItems[key] = true;
    }

    public untrack(key: keyof ObjectFromList<TrackedItemsList>): void {
        this.trackedItems[key] = false;
    }

    public trackAll(): void {
        this.setAllKeys(true);
    }

    public untrackAll(): void {
        this.setAllKeys(false);
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
