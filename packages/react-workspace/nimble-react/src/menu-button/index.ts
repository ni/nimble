import { MenuButton } from '@ni/nimble-components/dist/esm/menu-button';
import { wrap } from '../utilities/react-wrapper';

export const NimbleMenuButton = wrap(MenuButton, {
    events: {
        onChange: 'change',
        onToggle: 'toggle',
        onBeforetoggle: 'beforetoggle',
    }
});
