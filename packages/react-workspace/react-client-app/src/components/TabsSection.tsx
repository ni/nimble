import { useState } from 'react';
import { NimbleButton } from '@ni/nimble-react/button';
import { NimbleTabs } from '@ni/nimble-react/tabs';
import { NimbleTab } from '@ni/nimble-react/tab';
import { NimbleTabsToolbar } from '@ni/nimble-react/tabs-toolbar';
import { NimbleTabPanel } from '@ni/nimble-react/tab-panel';
import { NimbleSelect } from '@ni/nimble-react/select';
import { NimbleListOption } from '@ni/nimble-react/list-option';
import { SubContainer } from './SubContainer';

export function TabsSection(): React.JSX.Element {
    const [activeTabId, setActiveTabId] = useState('tab-1');

    function onTabToolbarButtonClick(): void {
        alert('Tab toolbar button clicked');
    }

    return (
        <SubContainer label="Tabs">
            <NimbleTabs
                activeid={activeTabId}
                onChange={e => setActiveTabId(e.target.activeid)}
            >
                <NimbleTab id="tab-1">Tab 1</NimbleTab>
                <NimbleTab id="tab-2">Tab 2</NimbleTab>
                <NimbleTab id="tab-3" disabled>Tab 3 (Disabled)</NimbleTab>
                <NimbleTabsToolbar>
                    <NimbleButton
                        onClick={onTabToolbarButtonClick}
                    >Toolbar button</NimbleButton>
                </NimbleTabsToolbar>
                <NimbleTabPanel>
                    <div className="container-label">Tab 1 content</div>
                </NimbleTabPanel>
                <NimbleTabPanel>
                    <div className="container-label">Tab 2 content</div>
                </NimbleTabPanel>
                <NimbleTabPanel>
                    <div className="container-label">Tab 3 content</div>
                </NimbleTabPanel>
            </NimbleTabs>
            <label id="activeTabLabel">
                Active tab:
            </label>
            <NimbleSelect
                value={activeTabId}
                onChange={e => setActiveTabId(e.target.value)}
                aria-labelledby="activeTabLabel">
                <NimbleListOption value="tab-1">Tab 1</NimbleListOption>
                <NimbleListOption value="tab-2">Tab 2</NimbleListOption>
                <NimbleListOption value="tab-3">Tab 3</NimbleListOption>
            </NimbleSelect>
        </SubContainer>
    );
}
