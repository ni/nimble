import { html, ref } from '@ni/fast-element';

export const template = html`
    <template>
        <div ${ref('flotElement')} class="flot-container">
        </div>
    </template>
`;
