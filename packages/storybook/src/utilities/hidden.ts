import { html, ViewTemplate } from '@microsoft/fast-element';

/**
 * Wraps a given component template with a border and a message indicating
 * that the component is expected to be hidden.
 */
export const hiddenWrapper = (template: ViewTemplate): ViewTemplate => {
    return html`<span style="border: 1px solid black;">
        <span style="color: black;">Intentionally blank</span>
        ${template}
    </span> `;
};
