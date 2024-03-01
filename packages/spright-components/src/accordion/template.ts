import { html } from '@microsoft/fast-element';
import type { Accordion } from '.';

export const template = html<Accordion>`
    ${
    '' /* Explicitly set role to work around Lighthouse error. See https://github.com/ni/nimble/issues/1650. */
}
    <section role="region" aria-labelledby="title-slot">
        <slot name="title" id="title-slot"></slot>
        <slot></slot>
    </section>
`;
