import { html } from '@ni/fast-element';
import type { Meta, StoryObj } from '@storybook/html-vite';
import { buttonTag } from '@ni/nimble-components/dist/esm/button';
import { queryBuilderTag } from '@ni/nimble-components/dist/esm/query-builder';
import { type RuleSet } from '@ni/nimble-components/dist/esm/query-builder/types';
import { createUserSelectedThemeStory } from '../../utilities/storybook';

interface QueryBuilderArgs {
    disabled: boolean;
    initialData: RuleSet;
}

const overviewText = 'This is a query builder';

const metadata: Meta<QueryBuilderArgs> = {
    title: 'Components/Query Builder',
    parameters: {
        docs: {
            description: {
                component: overviewText
            }
        },
    },
    // prettier-ignore
    render: createUserSelectedThemeStory(html<QueryBuilderArgs>`
        <script>
            debugger;
            
        </script>
        <${queryBuilderTag} ?disabled="${x => x.disabled}">
        </${queryBuilderTag}>
        
        <br>
        <br>
        <br>

        <${buttonTag} id="loadDataButton">
            Load data
        </${buttonTag}>
        <${buttonTag} id="printLinqButton">
            Print linq
        </${buttonTag}>

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

queryBuilder.play = async ({ args, canvasElement }) => {
    const queryBuilderElement = canvasElement.querySelector(queryBuilderTag)!;
    const loadButton = document.querySelector('#loadDataButton')!;
    loadButton.addEventListener('click', () => {
        queryBuilderElement.data = {
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

    const printLinqButton = document.querySelector('#printLinqButton')!;
    printLinqButton.addEventListener('click', () => {
        const linqString = queryBuilderElement.linqString;
        (document.querySelector<HTMLSpanElement>('#linqOutput')!).innerText = linqString;
    });
};