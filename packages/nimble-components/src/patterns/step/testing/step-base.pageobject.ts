import { iconCheckTag } from '../../../icons/check';
import { iconExclamationMarkTag } from '../../../icons/exclamation-mark';
import { iconTriangleFilledTag } from '../../../icons/triangle-filled';
import type { StepPattern } from '../types';

/**
 * Page object base for step and anchor step
 */
export abstract class StepBasePageObject<T extends StepPattern = StepPattern> {
    public constructor(
        protected readonly element: T,
    ) {}

    public getSuccessSeverityLabel(): string {
        const label = this.element.shadowRoot?.querySelector(`.icon-severity ${iconCheckTag}[aria-label]`)?.ariaLabel;
        if (typeof label !== 'string') {
            throw new Error('Success severity label not found');
        }
        return label;
    }

    public getErrorSeverityLabel(): string {
        const label = this.element.shadowRoot?.querySelector(`.icon-severity ${iconExclamationMarkTag}[aria-label]`)?.ariaLabel;
        if (typeof label !== 'string') {
            throw new Error('Error severity label not found');
        }
        return label;
    }

    public getWarningSeverityLabel(): string {
        const label = this.element.shadowRoot?.querySelector(`.icon-severity ${iconTriangleFilledTag}[aria-label]`)?.ariaLabel;
        if (typeof label !== 'string') {
            throw new Error('Warning severity label not found');
        }
        return label;
    }

    public getSelectedStateLabel(): string {
        const label = this.element.shadowRoot?.querySelector('.current-label')?.textContent;
        if (typeof label !== 'string') {
            throw new Error('Selected state label not found');
        }
        return label;
    }
}
