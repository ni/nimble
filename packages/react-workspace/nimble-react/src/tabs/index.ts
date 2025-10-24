import { Tabs } from '@ni/nimble-components/dist/esm/tabs';
import { wrap, type EventName } from '../utilities/react-wrapper';

export { type Tabs };
export const NimbleTabs = wrap(Tabs, {
    events: {
        onChange: 'change' as EventName<TabsChangeEvent>,
    }
});
export interface TabsChangeEvent extends CustomEvent {
    target: Tabs;
}
