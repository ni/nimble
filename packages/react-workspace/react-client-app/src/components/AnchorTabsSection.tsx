import { useState } from 'react';
import { NimbleButton } from '@ni/nimble-react/button';
import { NimbleAnchorTabs } from '@ni/nimble-react/anchor-tabs';
import { NimbleAnchorTab } from '@ni/nimble-react/anchor-tab';
import { NimbleTabsToolbar } from '@ni/nimble-react/tabs-toolbar';
import { NimbleSelect } from '@ni/nimble-react/select';
import { NimbleListOption } from '@ni/nimble-react/list-option';
import { SubContainer } from './SubContainer';

export function AnchorTabsSection(): React.JSX.Element {
    const [activeAnchorTabId, setActiveAnchorTabId] = useState('a-tab-2');

    function onTabToolbarButtonClick(): void {
        alert('Tab toolbar button clicked');
    }

    return (
        <SubContainer label="Tabs - Anchor">
            <NimbleAnchorTabs
                activeid={activeAnchorTabId}
            >
                <NimbleAnchorTab id="a-tab-1" href="https://nimble.ni.dev">Tab 1</NimbleAnchorTab>
                <NimbleAnchorTab id="a-tab-2" href="https://ni.com">Tab 2</NimbleAnchorTab>
                <NimbleAnchorTab disabled id="a-tab-3" href="https://google.com">Tab 3 (Disabled)</NimbleAnchorTab>
                <NimbleTabsToolbar>
                    <NimbleButton
                        onClick={onTabToolbarButtonClick}
                    >Toolbar button</NimbleButton>
                </NimbleTabsToolbar>
            </NimbleAnchorTabs>
            <label id="activeAnchorTabLabel">
                Active tab:
            </label>
            <NimbleSelect
                value={activeAnchorTabId}
                onChange={e => setActiveAnchorTabId(e.target.value)}
                aria-labelledby="activeAnchorTabLabel">
                <NimbleListOption value="a-tab-1">Tab 1</NimbleListOption>
                <NimbleListOption value="a-tab-2">Tab 2</NimbleListOption>
                <NimbleListOption value="a-tab-3">Tab 3</NimbleListOption>
            </NimbleSelect>
        </SubContainer>
    );
}
