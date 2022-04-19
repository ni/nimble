import { html } from '@microsoft/fast-element';
import type { Meta, StoryObj } from '@storybook/html';
import { createRenderer } from '../../utilities/tests/storybook';
import '..';

interface QueryBuilderArgs {
    disabled: boolean;
}

const overviewText = 'This is a query builder';

const metadata: Meta<QueryBuilderArgs> = {
    title: 'Query Builder',
    parameters: {
        docs: {
            description: {
                component: overviewText
            }
        },
    },
    // prettier-ignore
    render: createRenderer(html<QueryBuilderArgs>`
        <script>
            var printButton = document.querySelector('#printValueButton');
            printButton.addEventListener('click', event => {
                console.log(document.querySelector('nimble-query-builder').value);
            });
        </script>
        <nimble-query-builder ?disabled="${x => x.disabled}">
        </nimble-query-builder>
        
        <br>
        <br>
        <br>

        <nimble-button id="printValueButton">Print value</nimble-button>
    `),
    args: {
    }
};

export default metadata;

export const queryBuilder: StoryObj<QueryBuilderArgs> = {
    args: {
        disabled: false
    }
};
