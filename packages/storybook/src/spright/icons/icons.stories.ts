import type { Meta, StoryObj } from '@storybook/html-vite';
import { html, ref, repeat } from '@ni/fast-element';
import { iconCalendarCalibrationTag, iconCalendarMaintenanceTag, iconCalendarReservationTag, iconCalendarTestPlanTag, iconCalendarTransportOrderTag } from '@ni/spright-components/dist/esm/icons';

import { Table, tableTag } from '@ni/nimble-components/dist/esm/table';
import { tableColumnMappingTag } from '@ni/nimble-components/dist/esm/table-column/mapping';
import { mappingIconTag } from '@ni/nimble-components/dist/esm/mapping/icon';
import { tableColumnTextTag } from '@ni/nimble-components/dist/esm/table-column/text';
import { tableFitRowsHeight } from '@ni/nimble-components/dist/esm/theme-provider/design-tokens';
import { createUserSelectedThemeStory,
    fastParameters } from '../../utilities/storybook';

const data = [
    {
        tag: iconCalendarCalibrationTag,
        metaphor: 'calibration, quality, measurement, standards'
    },
    {
        tag: iconCalendarMaintenanceTag,
        metaphor: 'maintenance, repair, service, tools'
    },
    {
        tag: iconCalendarReservationTag,
        metaphor: 'reservation, booking, schedule, time slot'
    },
    {
        tag: iconCalendarTestPlanTag,
        metaphor: 'testing, verification, quality assurance, checklist'
    },
    {
        tag: iconCalendarTransportOrderTag,
        metaphor: 'logistics, delivery, transport, shipping'
    }
];

type Data = (typeof data)[number];

interface IconArgs {
    tableRef: Table<Data>;
}

const metadata: Meta<IconArgs> = {
    title: 'Spright/Icons',
    parameters: {
        ...fastParameters()
    }
};

export default metadata;

const updateData = (tableRef: Table<Data>): void => {
    void (async () => {
        // Safari workaround: the table element instance is made at this point
        // but doesn't seem to be upgraded to a custom element yet
        await customElements.whenDefined(tableTag);
        await tableRef.setData(data);
    })();
};

export const icons: StoryObj<IconArgs> = {
    args: {
        tableRef: undefined
    },
    argTypes: {
        tableRef: {
            table: {
                disable: true
            }
        }
    },
    render: createUserSelectedThemeStory(html`
        <style class="code-hide">
            ${tableTag} {
                height: var(${tableFitRowsHeight.cssCustomProperty});
                max-height: none;
            }
        </style>
        <${tableTag}
            ${ref('tableRef')}
            data-unused="${x => updateData(x.tableRef)}"
        >
            <${tableColumnMappingTag} field-name="tag" key-type="string" fractional-width="0.2" >
                Icon
                ${repeat(() => data, html<Data, IconArgs>`
                    <${mappingIconTag}
                        key="${x => x.tag}"
                        icon="${x => x.tag}"
                        text="${x => x.tag}"
                        text-hidden
                    ></${mappingIconTag}>
                `)}
            </${tableColumnMappingTag}>
            <${tableColumnTextTag} field-name="tag">
                Tag Name
            </${tableColumnTextTag}>
            <${tableColumnTextTag} sorting-disabled field-name="metaphor">
                Metaphors
            </${tableColumnTextTag}>
        </${tableTag}>
    `)
};
