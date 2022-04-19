import { html } from '@microsoft/fast-element';
import type { Meta, StoryObj } from '@storybook/html';
import { createRenderer } from '../../utilities/tests/storybook';
import '..';
import type { RuleSet } from '../interfaces';

interface QueryBuilderArgs {
    disabled: boolean;
    initialData: RuleSet;
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
            var loadButton = document.querySelector('#loadDataButton');
            loadButton.addEventListener('click', event => {
                document.querySelector('nimble-query-builder').data = {
                    condition: 'or',
                    rules: [{
                        field: 'mySecondBool',
                        operator: '==',
                        value: true
                    }, {
                        field: 'stringValue',
                        operator: 'contains',
                        value: 'foobar'
                    }]
                };
            });

            var printLinqButton = document.querySelector('#printLinqButton');
            printLinqButton.addEventListener('click', event => {
                var linqString = document.querySelector('nimble-query-builder').linqString;
                document.querySelector('#linqOutput').innerText = linqString;
            });
        </script>
        <nimble-query-builder ?disabled="${x => x.disabled}">
        </nimble-query-builder>
        
        <br>
        <br>
        <br>

        <nimble-button id="loadDataButton">Load data</nimble-button>
        <nimble-button id="printLinqButton">Print linq</nimble-button>

        <br>
        <br>

        <span id="linqOutput"></span>
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
