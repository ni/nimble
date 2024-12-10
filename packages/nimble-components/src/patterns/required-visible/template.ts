import { ViewTemplate, html, when } from '@microsoft/fast-element';
import { iconAsteriskTag } from '../../icons/asterisk';
import type { RequiredVisiblePattern } from './types';

export function getLabelTemplate(
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
