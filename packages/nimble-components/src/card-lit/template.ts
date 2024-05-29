import { html } from 'lit';

export const template = html`
    <section aria-labelledby="title-slot">
        <span id="title-slot"><slot name="title"></slot></span>
        <slot></slot>
    </section>
`;
