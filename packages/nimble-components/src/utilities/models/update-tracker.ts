import { Tracker } from './tracker';

/**
 * Generic Update Tracker Utility
 */
export abstract class UpdateTracker<
    TrackedProperties extends readonly string[]
> extends Tracker<TrackedProperties> {
    public constructor(requiredUpdates: TrackedProperties) {
        super(requiredUpdates);
    }

    public trackProperty(key: TrackedProperties extends readonly (infer U)[] ? U : never): void {
        this.track(key);
        this.queueUpdate();
    }

    public trackAllProperties(): void {
        this.trackAll();
        this.queueUpdate();
    }

    protected abstract queueUpdate(): void;
}