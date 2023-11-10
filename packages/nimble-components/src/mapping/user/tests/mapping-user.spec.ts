import { html } from '@microsoft/fast-element';
import { MappingUser, mappingUserTag } from '..';
import { fixture, Fixture } from '../../../utilities/tests/fixture';

describe('User Mapping', () => {
    let element: MappingUser;

    async function setup(): Promise<Fixture<MappingUser>> {
        return fixture<MappingUser>(html`
          <${mappingUserTag}
              key="foo"
              display-name="foo">
          </${mappingUserTag}>`);
    }

    it('should export its tag', () => {
        expect(mappingUserTag).toBe('nimble-mapping-user');
    });

    it('can construct an element instance', () => {
        expect(document.createElement('nimble-mapping-user')).toBeInstanceOf(
            MappingUser
        );
    });

    it('should have display name when defined', async () => {
        ({ element } = await setup());
        expect(element.displayName).toBe('foo');
    });
});