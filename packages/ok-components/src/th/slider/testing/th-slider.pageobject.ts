import { waitForUpdatesAsync } from '@ni/nimble-components/dist/esm/testing/async-helpers';
import type { ThSlider } from '..';

/**
 * Page object for ok-th-slider tests.
 */
export class ThSliderPageObject {
    public constructor(private readonly sliderElement: ThSlider) {}

    public async pressKey(key: string): Promise<void> {
        this.sliderElement.dispatchEvent(
            new KeyboardEvent('keydown', { key, bubbles: true })
        );
        await waitForUpdatesAsync();
    }

    public async mouseDown(clientX = 0, clientY = 0): Promise<void> {
        this.sliderElement.dispatchEvent(
            new MouseEvent('mousedown', {
                bubbles: true,
                clientX,
                clientY
            })
        );
        await waitForUpdatesAsync();
    }

    public async mouseMove(clientX = 0, clientY = 0): Promise<void> {
        window.dispatchEvent(new MouseEvent('mousemove', { clientX, clientY }));
        await waitForUpdatesAsync();
    }

    public getTrackStartPosition(): string {
        return this.getElement('[part="track-start"]').style.cssText;
    }

    public hasPart(part: string): boolean {
        return !!this.sliderElement.shadowRoot?.querySelector(`[part="${part}"]`);
    }

    public getThumbPosition(): string {
        return this.getElement('[part="thumb-container"]').style.cssText;
    }

    public getValueLabelText(): string {
        return this.getElement('.value-label').textContent?.trim() ?? '';
    }

    public getRangeLabelText(className: 'minimum-label' | 'maximum-label'): string {
        return this.getElement(`.${className}`).textContent?.trim() ?? '';
    }

    public getRangeLabelDisplay(className: 'minimum-label' | 'maximum-label'): string {
        return getComputedStyle(this.getElement(`.${className}`)).display;
    }

    private getElement<T extends HTMLElement>(selector: string): T {
        const element = this.sliderElement.shadowRoot?.querySelector<T>(selector);
        if (!element) {
            throw new Error(`Expected slider element matching ${selector}`);
        }
        return element;
    }
}
