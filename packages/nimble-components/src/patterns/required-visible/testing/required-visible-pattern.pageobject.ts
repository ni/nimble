import type { FoundationElement } from '@microsoft/fast-foundation';

/**
 * A page object for the elements that use the required-visible mixin.
 */
export class RequiredVisiblePatternPageObject {
    public constructor(private readonly element: FoundationElement) {}

    public isRequiredVisibleIconVisible(): boolean {
        const icon = this.getRequiredVisibleIcon();
        if (!icon) {
            return false;
        }
        return getComputedStyle(icon).display !== 'none';
    }

    private getRequiredVisibleIcon(): HTMLElement | null {
        return this.element.shadowRoot!.querySelector('.required-icon');
    }
}
