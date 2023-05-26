import { Tracker } from './tracker';

/**
 * Generic Update Tracker Utility which extends Tracker Utility with update logic
 */
export abstract class UpdateTracker<
    TrackedProperties extends readonly string[]
> extends Tracker<TrackedProperties> {
    public constructor(requiredUpdates: TrackedProperties) {
        super(requiredUpdates);
    }

    protected abstract queueUpdate(): void;
}
