import { html } from '@microsoft/fast-element';
import type { Spinner } from '.';

/* eslint-disable @typescript-eslint/indent */
// prettier-ignore
export const template = html<Spinner>`
    <template role="progressbar">
        ${''
            /**
             * In Firefox, the 'title' set on the spinner is very finicky when
             * the spinner is animating. Therefore, put a transparent overlay on
             * top of the spinning bits so that the title displays as expected.
             */
        }
        <div class="overlay"></div>

        <div class="container">
            <div class="bit1"></div>
            <div class="bit2"></div>
        </div>
    </template>
`;
