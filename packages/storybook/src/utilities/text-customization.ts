import { html, ViewTemplate } from '@ni/fast-element';

/**
 * Applies a style to customize text for all elements
 */
export const textCustomizationWrapper = (
    template: ViewTemplate
): ViewTemplate => {
    return html`
        <style>
            * {
                font-style: italic;
            }
        </style>
        ${template}
    `;
};
