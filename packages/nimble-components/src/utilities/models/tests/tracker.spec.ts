import { Tracker } from '../tracker';

describe('The Tracker Utility', () => {
    let tracker: Tracker<['a', 'b']>;

    beforeEach(() => {
        tracker = new Tracker(['a', 'b']);
    });

    it('can track the specified items', () => {
        tracker.track('a');
        expect(tracker.getTrackedItems().a).toBe(true);
    });

    it('can untrack the specified items', () => {
        tracker.track('a');
        tracker.untrack('a');
        expect(tracker.getTrackedItems().a).toBe(false);
    });

    it('can track all the specified items at once', () => {
        tracker.trackAll();
        expect(
            tracker.getTrackedItems().a && tracker.getTrackedItems().b
        ).toBe(true);
    });

    it('can untrack all the specified items at once', () => {
        tracker.trackAll();
        tracker.untrackAll();
        expect(
            tracker.getTrackedItems().a || tracker.getTrackedItems().b
        ).toBe(false);
    });

    it('can check if all items are tracked', () => {
        tracker.trackAll();
        expect(tracker.allTracked()).toBe(true);
    });

    it('can check if not all items are tracked', () => {
        tracker.track('a');
        expect(tracker.allTracked()).toBe(false);
    });

    it('can check if any items are tracked', () => {
        tracker.track('a');
        expect(tracker.anyTracked()).toBe(true);
    });

    it('can check if no items are tracked', () => {
        tracker.track('a');
        tracker.untrackAll();
        expect(tracker.noneTracked()).toBe(true);
    });

    describe('handle change', () => {
        it('is called when track() changes state', () => {
            const spy = vi.spyOn(tracker, 'onTrackingChange');
            tracker.track('a');
            expect(spy).toHaveBeenCalledTimes(1);
        });

        it('is not called when track() does not change state', () => {
            tracker.track('a');
            const spy = vi.spyOn(tracker, 'onTrackingChange');
            tracker.track('a');
            expect(spy).not.toHaveBeenCalled();
        });

        it('is called when untrack() changes state', () => {
            tracker.track('a');
            const spy = vi.spyOn(tracker, 'onTrackingChange');
            tracker.untrack('a');
            expect(spy).toHaveBeenCalledTimes(1);
        });

        it('is not called when untrack() does not change state', () => {
            const spy = vi.spyOn(tracker, 'onTrackingChange');
            tracker.untrack('a');
            expect(spy).not.toHaveBeenCalled();
        });

        it('is called when trackAll() changes state', () => {
            const spy = vi.spyOn(tracker, 'onTrackingChange');
            tracker.trackAll();
            expect(spy).toHaveBeenCalledTimes(1);
        });

        it('is not called when trackAll() does not change state', () => {
            tracker.trackAll();
            const spy = vi.spyOn(tracker, 'onTrackingChange');
            tracker.trackAll();
            expect(spy).not.toHaveBeenCalled();
        });

        it('is called when untrackAll() changes state', () => {
            tracker.trackAll();
            const spy = vi.spyOn(tracker, 'onTrackingChange');
            tracker.untrackAll();
            expect(spy).toHaveBeenCalledTimes(1);
        });

        it('is not called when untrackAll() does not change state', () => {
            const spy = vi.spyOn(tracker, 'onTrackingChange');
            tracker.untrackAll();
            expect(spy).not.toHaveBeenCalled();
        });
    });
});
