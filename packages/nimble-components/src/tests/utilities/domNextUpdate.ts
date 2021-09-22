import { DOM } from '@microsoft/fast-element';

export const domNextUpdate = async (): Promise<void> => DOM.nextUpdate();
