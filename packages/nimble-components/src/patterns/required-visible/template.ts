import { ViewTemplate, html, when } from '@microsoft/fast-element';
import { iconAsteriskTag } from '../../icons/asterisk';
import type { RequiredVisiblePattern } from './types';

/**
 * Given the template for a control label, creates a new template that includes
 * an icon next to the label to indicate whether or not the control is required.
 *
 * This function is intended to be used with components leveraging `mixinRequiredVisiblePattern`.
 */
/* eslint-disable @typescript-eslint/indent */
export function createRequiredVisibleLabelTemplate(
    labelTemplate: ViewTemplate<RequiredVisiblePattern>
): ViewTemplate<RequiredVisiblePattern> {
    return html`
        <div class="annotated-label">
            ${labelTemplate}
            ${when(
                x => x.requiredVisible,
                html`
                <${iconAsteriskTag} class="required-icon" severity="error"></${iconAsteriskTag}>
            `
            )}
        </div>
    `;
}
