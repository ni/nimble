import { html } from '@microsoft/fast-element';
import { MappingIcon, mappingIconTag } from '..';
import {
    fixture,
    uniqueElementName,
    type Fixture
} from '../../../utilities/tests/fixture';
import { waitForUpdatesAsync } from '../../../testing/async-helpers';
import { registerIcon } from '../../../icon-base';
import { IconXmark } from '../../../icons/xmark';

describe('Icon Mapping', () => {
    const testIconElementName = uniqueElementName();

    let element: MappingIcon;
    let connect: () => Promise<void>;
    let disconnect: () => Promise<void>;

    // prettier-ignore
    async function setup(): Promise<Fixture<MappingIcon>> {
        return fixture<MappingIcon>(html`
        <${mappingIconTag}
            key="foo"
            text="foo"
            icon="nimble-${testIconElementName}">
        </${mappingIconTag}>`);
    }

    it('should export its tag', () => {
        expect(mappingIconTag).toBe('nimble-mapping-icon');
    });

    it('can construct an element instance', () => {
        expect(document.createElement('nimble-mapping-icon')).toBeInstanceOf(
            MappingIcon
        );
    });

    it('resolves icon after it is defined', async () => {
        ({ element, connect, disconnect } = await setup());
        await connect();
        await waitForUpdatesAsync();

        expect(element.resolvedIcon).toBeUndefined();

        registerIcon(testIconElementName, IconXmark);
        await waitForUpdatesAsync();

        expect(element.resolvedIcon).toBeDefined();

        await disconnect();
    });
});
