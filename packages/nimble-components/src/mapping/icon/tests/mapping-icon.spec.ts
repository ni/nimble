import { html } from '@ni/fast-element';
import { MappingIcon, mappingIconTag } from '..';
import {
    fixture,
    uniqueElementName,
    type Fixture
} from '../../../utilities/tests/fixture';
import { waitForUpdatesAsync } from '../../../testing/async-helpers';
import { Icon, registerIcon } from '../../../icon-base';

describe('Icon Mapping', () => {
    const testIconElementName = uniqueElementName();
    class TestIcon extends Icon {}

    let element: MappingIcon;
    let connect: () => Promise<void>;
    let disconnect: () => Promise<void>;

    // prettier-ignore
    async function setup(): Promise<Fixture<MappingIcon>> {
        return await fixture<MappingIcon>(html`
        <${mappingIconTag}
            key="foo"
            text="foo"
            icon="nimble-${testIconElementName}">
        </${mappingIconTag}>`);
    }

    it('can construct an element instance', () => {
        expect(document.createElement(mappingIconTag)).toBeInstanceOf(
            MappingIcon
        );
    });

    it('resolves icon after it is defined', async () => {
        ({ element, connect, disconnect } = await setup());
        await connect();
        await waitForUpdatesAsync();

        expect(element.resolvedIcon).toBeUndefined();

        registerIcon(testIconElementName, TestIcon);
        await waitForUpdatesAsync();

        expect(element.resolvedIcon).toBeDefined();

        await disconnect();
    });
});
