import { Tabs } from '@ni/nimble-components/dist/esm/tabs';
import { wrap } from '../utilities/react-wrapper';

export const NimbleTabs = wrap(Tabs, {
    events: {
        onChange: 'change',
    }
});

export interface TabsChangeEvent extends CustomEvent {
    target: Tabs;
}
