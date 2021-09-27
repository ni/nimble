import { DOM } from '@microsoft/fast-element';

/**
 * Resolves with the next DOM update.
 */
export const domNextUpdate = async (): Promise<void> => DOM.nextUpdate();
