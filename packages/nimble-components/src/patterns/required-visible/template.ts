import { ViewTemplate, html, when } from '@microsoft/fast-element';
import { iconAsteriskTag } from '../../icons/asterisk';
import type { RequiredVisiblePattern } from './types';

/* eslint-disable @typescript-eslint/indent */
export function getRequiredVisibleLabelTemplate(
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
