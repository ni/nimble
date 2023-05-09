import type { WaferMap } from '..';
import { UpdateTracker } from '../../utilities/update-tracker';

/**
 * Helper class to track what updates are needed to the wafer based on configuration
 * changes.
 */
export class WaferUpdateTracker extends UpdateTracker<WaferMap> {}