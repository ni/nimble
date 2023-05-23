import { Tracker } from './tracker';

/**
 * Generic Update Tracker Utility extends Tracker Utility
 */
export abstract class UpdateTracker<
    TrackedProperties extends readonly string[]
> extends Tracker<TrackedProperties> {
    public constructor(requiredUpdates: TrackedProperties) {
        super(requiredUpdates);
    }

    public trackAndQueue(
        key: TrackedProperties extends readonly (infer U)[] ? U : never
    ): void {
        this.track(key);
        this.queueUpdate();
    }

    public trackAllAndQueue(): void {
        this.trackAll();
        this.queueUpdate();
    }

    protected abstract queueUpdate(): void;
}
