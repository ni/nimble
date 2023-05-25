type ObjectFromList<T extends readonly string[]> = {
    [K in T extends readonly (infer U)[] ? U : never]: boolean;
};

/**
 * Generic Tracker which sets or resets provided flags
 */
export class Tracker<TrackedItemsList extends readonly string[]> {
    private trackedItemsState: ObjectFromList<TrackedItemsList>;

    public constructor(trackedItemsList: TrackedItemsList) {
        type TrackedItems = typeof this.trackedItemsState;
        this.trackedItemsState = {} as TrackedItems;
        this.trackedItemsState = trackedItemsList.reduce<TrackedItems>(
            (r, key): TrackedItems => {
                return {
                    ...r,
                    [key]: false
                };
            },
            this.trackedItemsState
        );
    }

    public get trackedItems(): ObjectFromList<TrackedItemsList> {
        return this.trackedItemsState;
    }

    public trackedItemState(
        key: keyof ObjectFromList<TrackedItemsList>
    ): boolean {
        return this.trackedItemsState[key];
    }

    public track(key: keyof ObjectFromList<TrackedItemsList>): void {
        this.trackedItemsState[key] = true;
    }

    public untrack(key: keyof ObjectFromList<TrackedItemsList>): void {
        this.trackedItemsState[key] = false;
    }

    public trackAll(): void {
        this.setAllKeys(true);
    }

    public untrackAll(): void {
        this.setAllKeys(false);
    }

    public allTracked(): boolean {
        return Object.values(this.trackedItemsState).every(x => x);
    }

    public anyTracked(): boolean {
        return Object.values(this.trackedItemsState).some(x => x);
    }

    public noneTracked(): boolean {
        return Object.values(this.trackedItemsState).every(x => !x);
    }

    protected setAllKeys(value: boolean): void {
        type TrackedItems = typeof this.trackedItemsState;
        this.trackedItemsState = Object.keys(
            this.trackedItemsState
        ).reduce<TrackedItems>((r, key): TrackedItems => {
            return {
                ...r,
                [key]: value
            };
        }, this.trackedItemsState);
    }
}
