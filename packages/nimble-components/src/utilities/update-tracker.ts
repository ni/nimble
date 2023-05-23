/**
 * custom update bingo card
 */
type ObjectFromList<T extends readonly string[], V = string> = {
    [K in (T extends readonly (infer U)[] ? U : never)]: V
};
/**
 * custom update bingo card helper
 */
export abstract class UpdateTracker<TrackedProperties extends readonly string[]> {
    public requiredUpdates: ObjectFromList<TrackedProperties, boolean>;

    public constructor(requiredUpdates: TrackedProperties) {
        type RequiredUpdates = typeof this.requiredUpdates;
        this.requiredUpdates = {} as RequiredUpdates;
        this.requiredUpdates = requiredUpdates.reduce<RequiredUpdates>((r, key): RequiredUpdates => {
            return {
                ...r,
                [key]: false
            };
        }, this.requiredUpdates);
    }

    public track(key: keyof ObjectFromList<TrackedProperties, boolean>): void {
        this.requiredUpdates[key] = true;
        this.queueUpdate();
    }

    public trackAll(): void {
        this.setAllKeys(true);
        this.queueUpdate();
    }

    protected abstract queueUpdate(): void;
    protected setAllKeys(value: boolean): void {
        type RequiredUpdates = typeof this.requiredUpdates;
        this.requiredUpdates = Object.keys(this.requiredUpdates).reduce<RequiredUpdates>((r, key): RequiredUpdates => {
            return {
                ...r,
                [key]: value
            };
        }, this.requiredUpdates);
    }
}