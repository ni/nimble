import { DOM } from '@microsoft/fast-element';

/**
 * Allows test code to wait for the render update cycle of the components.
 */
export const domNextUpdate = async (): Promise<void> => DOM.nextUpdate();
