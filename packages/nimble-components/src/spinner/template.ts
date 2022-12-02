import { html } from '@microsoft/fast-element';
import type { Spinner } from '.';

export const template = html<Spinner>`
    <template role="progressbar">
        <div class="container">
            <div class="bit1"></div>
            <div class="bit1 fade-copy"></div>
            <div class="bit2 fade-copy"></div>
            <div class="bit2"></div>
        </div>
    </template>
`;
