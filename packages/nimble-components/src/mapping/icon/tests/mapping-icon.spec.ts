import { html } from '@microsoft/fast-element';
import { DesignSystem } from '@microsoft/fast-foundation';
import { MappingIcon, mappingIconTag } from '..';
import { fixture, type Fixture } from '../../../utilities/tests/fixture';
import { waitForUpdatesAsync } from '../../../testing/async-helpers';
import { Icon } from '../../../icon-base';

describe('Icon Mapping', () => {
    class TestIcon extends Icon {}

    let element: MappingIcon;
    let connect: () => Promise<void>;
    let disconnect: () => Promise<void>;

    // prettier-ignore
    async function setup(): Promise<Fixture<MappingIcon>> {
        return fixture<MappingIcon>(html`
        <${mappingIconTag}
            key="foo"
            text="foo"
            icon="nimble-test-icon">
        </${mappingIconTag}>`);
    }

    it('resolves icon after it is defined', async () => {
        ({ element, connect, disconnect } = await setup());
        await connect();
        await waitForUpdatesAsync();

        expect(element.resolvedIcon).toBeUndefined();

        DesignSystem.getOrCreate()
            .withPrefix('nimble')
            .register(
                TestIcon.compose({
                    baseName: 'test-icon',
                    template: html`<nimble-xmark-icon></nimble-xmark-icon>`
                })()
            );
        await waitForUpdatesAsync();

        expect(element.resolvedIcon).toBeDefined();

        await disconnect();
    });
});
