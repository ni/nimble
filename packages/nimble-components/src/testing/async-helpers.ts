import { DOM } from '@microsoft/fast-element';

/**
 * Allows test code to wait for the render update cycle of components.
 */
export const queueAsyncUpdate = async (): Promise<void> => DOM.nextUpdate();

/**
 * Allows test code to force the update queue to process synchronously.
 */
export const processUpdateQueueSync = (): void => DOM.processUpdates();