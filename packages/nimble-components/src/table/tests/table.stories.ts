import type { Meta, StoryObj } from '@storybook/html';
import { withXD } from 'storybook-addon-xd-designs';
import { html } from '@microsoft/fast-element';
import { createUserSelectedThemeStory } from '../../utilities/tests/storybook';
import '../../all-components';

interface TableArgs {
    disabled: boolean;
    selected: boolean;
}

const metadata: Meta<TableArgs> = {
    title: 'Table',
    decorators: [withXD],
    parameters: {
        design: {
            artboardUrl:
                'https://xd.adobe.com/view/33ffad4a-eb2c-4241-b8c5-ebfff1faf6f6-66ac/screen/d4ebeb5d-023c-4ff2-a71c-f6385fffca20/specs/'
        }
    },
    // prettier-ignore
    render: createUserSelectedThemeStory(html`
        <nimble-table>
            <nimble-number-field-column columnId="x" columnTitle="X"></nimble-number-field-column>
            <nimble-number-field-column columnId="y" columnTitle="Y"></nimble-number-field-column>
            <nimble-number-field-column columnId="z" columnTitle="Z"></nimble-number-field-column>
        </nimble-table>
    `),
    args: {
        disabled: false,
        selected: false
    }
};

export default metadata;

export const table: StoryObj<TableArgs> = {};

