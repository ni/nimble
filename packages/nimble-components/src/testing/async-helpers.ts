import { DOM } from '@microsoft/fast-element';

/**
 * Allows test code to wait for components to complete pending asynchronous updates that resulted
 * from DOM interactions like property or attribute changes.
 */
export const waitForUpdatesAsync = async (): Promise<void> => DOM.nextUpdate();

/**
 * Allows test code to force components to synchronously complete normally asynchronous pending
 * updates that resulted from DOM interactions like property or attribute changes.
 */
export const processUpdates = (): void => DOM.processUpdates();
