import { NimbleAnchor } from '@ni/nimble-react/dist/esm/anchor';
import { NimbleButton } from '@ni/nimble-react/dist/esm/button';
import { NimbleBanner, type BannerToggleEvent } from '@ni/nimble-react/dist/esm/banner';
import { NimbleBreadcrumb } from '@ni/nimble-react/dist/esm/breadcrumb';
import { NimbleBreadcrumbItem } from '@ni/nimble-react/dist/esm/breadcrumb-item';
import { NimbleToggleButton } from '@ni/nimble-react/dist/esm/toggle-button';
import { NimbleAnchorButton } from '@ni/nimble-react/dist/esm/anchor-button';
import { NimbleCard } from '@ni/nimble-react/dist/esm/card';
import { NimbleNumberField } from '@ni/nimble-react/dist/esm/number-field';
import { NimbleSelect } from '@ni/nimble-react/dist/esm/select';
import { NimbleListOption } from '@ni/nimble-react/dist/esm/list-option';
import { NimbleListOptionGroup } from '@ni/nimble-react/dist/esm/list-option-group';
import { NimbleCardButton } from '@ni/nimble-react/dist/esm/card-button';
import { NimbleCheckbox, type CheckboxChangeEvent } from '@ni/nimble-react/dist/esm/checkbox';
import { NimbleRadioGroup, type RadioGroupChangeEvent } from '@ni/nimble-react/dist/esm/radio-group';
import { NimbleRadio } from '@ni/nimble-react/dist/esm/radio';
import { NimbleTextField } from '@ni/nimble-react/dist/esm/text-field';
import { NimbleDialog, type Dialog, UserDismissed } from '@ni/nimble-react/dist/esm/dialog';
import { NimbleDrawer } from '@ni/nimble-react/dist/esm/drawer';
import { NimbleMenu } from '@ni/nimble-react/dist/esm/menu';
import { NimbleMenuItem } from '@ni/nimble-react/dist/esm/menu-item';
import { NimbleAnchorMenuItem } from '@ni/nimble-react/dist/esm/anchor-menu-item';
import { NimbleMenuButton } from '@ni/nimble-react/dist/esm/menu-button';
import { NimbleIconAdd } from '@ni/nimble-react/dist/esm/icons/add';
import { NimbleIconCheck } from '@ni/nimble-react/dist/esm/icons/check';
import { NimbleIconXmarkCheck } from '@ni/nimble-react/dist/esm/icons/xmark-check';
import { NimbleSpinner } from '@ni/nimble-react/dist/esm/spinner';
import { NimbleSwitch } from '@ni/nimble-react/dist/esm/switch';
import { NimbleTable } from '@ni/nimble-react/dist/esm/table';
import { NimbleTableColumnText } from '@ni/nimble-react/dist/esm/table-column/text';
import { NimbleTableColumnAnchor } from '@ni/nimble-react/dist/esm/table-column/anchor';
import { NimbleTableColumnDateText } from '@ni/nimble-react/dist/esm/table-column/date-text';
import { NimbleTableColumnMapping } from '@ni/nimble-react/dist/esm/table-column/mapping';
import { NimbleMappingText } from '@ni/nimble-react/dist/esm/mapping/text';
import { NimbleMappingIcon } from '@ni/nimble-react/dist/esm/mapping/icon';
import { NimbleMappingSpinner } from '@ni/nimble-react/dist/esm/mapping/spinner';
import { NimbleMappingEmpty } from '@ni/nimble-react/dist/esm/mapping/empty';
import { NimbleTableColumnNumberText } from '@ni/nimble-react/dist/esm/table-column/number-text';
import { NimbleTableColumnDurationText } from '@ni/nimble-react/dist/esm/table-column/duration-text';
import { NimbleTableColumnMenuButton } from '@ni/nimble-react/dist/esm/table-column/menu-button';
import { NimbleTabs } from '@ni/nimble-react/dist/esm/tabs';
import { NimbleTab } from '@ni/nimble-react/dist/esm/tab';
import { NimbleTabsToolbar } from '@ni/nimble-react/dist/esm/tabs-toolbar';
import { NimbleTabPanel } from '@ni/nimble-react/dist/esm/tab-panel';
import { NimbleAnchorTabs } from '@ni/nimble-react/dist/esm/anchor-tabs';
import { NimbleAnchorTab } from '@ni/nimble-react/dist/esm/anchor-tab';
import { NimbleTextArea } from '@ni/nimble-react/dist/esm/text-area';
import { NimbleToolbar } from '@ni/nimble-react/dist/esm/toolbar';
import { NimbleTooltip } from '@ni/nimble-react/dist/esm/tooltip';
import { NimbleTreeView } from '@ni/nimble-react/dist/esm/tree-view';
import { NimbleTreeItem } from '@ni/nimble-react/dist/esm/tree-item';
import { NimbleAnchorTreeItem } from '@ni/nimble-react/dist/esm/anchor-tree-item';
import { NimbleCombobox } from '@ni/nimble-react/dist/esm/combobox';
import { NimbleRichTextEditor } from '@ni/nimble-react/dist/esm/rich-text/editor';
import { NimbleRichTextMentionUsers } from '@ni/nimble-react/dist/esm/rich-text-mention/users';
import { NimbleMappingUser } from '@ni/nimble-react/dist/esm/mapping/user';
import { NimbleRichTextViewer } from '@ni/nimble-react/dist/esm/rich-text/viewer';
import { SprightChatConversation } from '@ni/spright-react/dist/esm/chat/conversation';
import { SprightChatMessage } from '@ni/spright-react/dist/esm/chat/message';
import { SprightRectangle } from '@ni/spright-react/dist/esm/rectangle';
import { NimbleIconCopyText } from '@ni/nimble-react/dist/esm/icons/copy-text';
import { NimbleIconWebviCustom } from '@ni/nimble-react/dist/esm/icons/webvi-custom';

import './App.scss';
import { useRef, useState } from 'react';

export function App(): JSX.Element {
    const [bannerOpen, setBannerOpen] = useState(true);
    const [selectedRadio, setSelectedRadio] = useState('mango');
    const dialogRef = useRef<Dialog<string>>(null);
    const [dialogCloseReason, setDialogCloseReason] = useState('');
    function openDialog(): void {
        void (async (): Promise<void> => {
            const closeReason = await dialogRef.current?.show() || 'unknown';
            setDialogCloseReason((closeReason === UserDismissed) ? 'escape pressed' : closeReason);
        })();
    }

    function closeDialog(reason: string): void {
        dialogRef.current?.close(reason);
    }

    return (
        <>
            <div className="content container">
                <p>
                    Explore the components below to see the Nimble components in action. See the <a
                        href="https://ni.github.io/nimble/storybook/">Nimble
                    component docs</a> for additional usage details.
                    Navigate to the <a href="../index.html">parent page</a>.
                </p>
                <div className="container">
                    <div className="sub-container">
                        <div className="container-label">Anchor</div>
                        <div><NimbleAnchor href="#" appearance="prominent">Site root</NimbleAnchor></div>
                    </div>
                    <div className="sub-container">
                        <div className="container-label">Banner</div>
                        <NimbleBanner
                            open={bannerOpen}
                            onToggle={e => setBannerOpen((e as BannerToggleEvent).detail.newState)}
                            severity="information">
                            <span slot="title">Title of the banner</span>
                            This is the message text of this banner. It tells you something interesting.
                        </NimbleBanner>
                        <NimbleCheckbox
                            checked={bannerOpen}
                            onChange={e => setBannerOpen((e as CheckboxChangeEvent).target.checked)}
                        >Show banner</NimbleCheckbox>
                    </div>
                    <div className="sub-container">
                        <div className="container-label">Breadcrumb</div>
                        <NimbleBreadcrumb>
                            <NimbleBreadcrumbItem href="#">Page 1</NimbleBreadcrumbItem>
                            <NimbleBreadcrumbItem
                                href="#"
                            >Page 2</NimbleBreadcrumbItem>
                            <NimbleBreadcrumbItem>Current Page (No Link)</NimbleBreadcrumbItem>
                        </NimbleBreadcrumb>
                    </div>
                    <div className="sub-container">
                        <div className="container-label">Buttons</div>
                        <NimbleButton appearance="outline">Outline Button</NimbleButton>
                        <NimbleButton appearance="block">Block Button</NimbleButton>
                        <NimbleButton appearance="ghost">Ghost Button</NimbleButton>
                    </div>
                    <div className="sub-container">
                        <div className="container-label">Buttons - Toggle</div>
                        <NimbleToggleButton appearance="outline">Outline Toggle Button</NimbleToggleButton>
                        <NimbleToggleButton appearance="block">Block Toggle Button</NimbleToggleButton>
                        <NimbleToggleButton appearance="ghost">Ghost Toggle Button</NimbleToggleButton>
                    </div>
                    <div className="sub-container">
                        <div className="container-label">Buttons - Anchor</div>
                        <NimbleAnchorButton
                            href="#"
                            appearance="outline">Outline Anchor Button</NimbleAnchorButton>
                        <NimbleAnchorButton
                            href="#"
                            appearance="block">Block Anchor Button</NimbleAnchorButton>
                        <NimbleAnchorButton
                            href="#"
                            appearance="ghost">Ghost Anchor Button</NimbleAnchorButton>
                    </div>
                    <div className="sub-container">
                        <div className="container-label">Card</div>
                        <NimbleCard>
                            <span slot="title">Title of the card</span>
                            <NimbleNumberField>Numeric field 1</NimbleNumberField>
                            <NimbleNumberField>Numeric field 2</NimbleNumberField>
                            <NimbleSelect>
                                Select
                                <NimbleListOption value="1">Option 1</NimbleListOption>
                                <NimbleListOption value="2">Option 2</NimbleListOption>
                                <NimbleListOption value="3">Option 3</NimbleListOption>
                            </NimbleSelect>
                        </NimbleCard>
                    </div>
                    <div className="sub-container">
                        <div className="container-label">Card Button</div>
                        <NimbleCardButton>
                            <span className="card-button-content">Card Button</span>
                        </NimbleCardButton>
                        <NimbleCardButton selected>
                            <span className="card-button-content">Selected Card Button</span>
                        </NimbleCardButton>
                    </div>
                    <div className="sub-container">
                        <div className="container-label">Checkbox</div>
                        <NimbleCheckbox>Checkbox label</NimbleCheckbox>
                        <NimbleCheckbox>Checkbox label</NimbleCheckbox>
                        <NimbleCheckbox>Checkbox label</NimbleCheckbox>
                    </div>
                    <div className="sub-container">
                        <div className="container-label">Radio Buttons</div>
                        <NimbleRadioGroup
                            value={selectedRadio}
                            onChange={e => setSelectedRadio((e as RadioGroupChangeEvent).target.value)}
                        >
                            <span slot="label">Fruit</span>
                            <NimbleRadio name="fruit" value="apple"
                            >Apple</NimbleRadio>
                            <NimbleRadio name="fruit" value="banana"
                            >Banana</NimbleRadio>
                            <NimbleRadio name="fruit" value="mango"
                            >Mango</NimbleRadio>
                        </NimbleRadioGroup>
                        <NimbleTextField
                            value={selectedRadio}
                        >Selected value</NimbleTextField>
                    </div>
                    <div className="sub-container">
                        <div className="container-label">Dialog</div>
                        <NimbleDialog
                            /* @ts-expect-error See: https://github.com/ni/nimble/issues/2617 */
                            ref={dialogRef}
                        >
                            <span slot="title">This is a dialog</span>
                            <div>It opened when you pushed the button</div>
                            <NimbleButton slot="footer"
                                onClick={_ => closeDialog('cancel pressed')}
                            >Cancel</NimbleButton>
                            <NimbleButton slot="footer"
                                onClick={_ => closeDialog('OK pressed')}
                            >OK</NimbleButton>
                        </NimbleDialog>
                        <NimbleButton
                            onClick={openDialog}
                        >Open Dialog</NimbleButton>
                        <NimbleTextField
                            value={dialogCloseReason}
                        >Closed Reason</NimbleTextField>
                    </div>
                    <div className="sub-container">
                        <div className="container-label">Drawer</div>
                        <NimbleDrawer
                        // #drawer
                        //  [location]="drawerLocation"
                        >
                            <header>This is a drawer</header>
                            <section>
                                <p style={{ height: '1000px' }}>It opened when you pushed the button</p>
                                <p>This is the bottom!</p>
                            </section>
                            <footer className="drawer-footer">
                                <NimbleButton appearance="ghost"
                                // (click)="closeDrawer('cancel pressed')"
                                >Cancel</NimbleButton>
                                <NimbleButton
                                //  (click)="closeDrawer('OK pressed')"
                                >OK</NimbleButton>
                            </footer>
                        </NimbleDrawer>
                        <NimbleButton
                        // (click)="openDrawer()"
                        >Open Drawer</NimbleButton>
                        <NimbleTextField
                            // readonly
                        // [ngModel]="drawerCloseReason"
                        >Closed Reason</NimbleTextField>
                        <NimbleSelect className="drawer-location-select"
                        //  [(ngModel)]="drawerLocation"
                        >
                            Drawer Location
                            <NimbleListOption
                            //  [value]="drawerLocations.left"
                            >Drawer: Left-side</NimbleListOption>
                            <NimbleListOption
                            //  [value]="drawerLocations.right"
                            >Drawer: Right-side</NimbleListOption>
                        </NimbleSelect>
                    </div>
                    <div className="sub-container">
                        <div className="container-label">Menu</div>
                        <NimbleMenu>
                            <header>Header 1</header>
                            <NimbleMenuItem>
                                Item 1
                                <NimbleIconAdd slot="start"></NimbleIconAdd>
                            </NimbleMenuItem>
                            <NimbleMenuItem>Item 2</NimbleMenuItem>
                            <hr />
                            <header>Header 2</header>
                            <NimbleMenuItem>Item 4</NimbleMenuItem>
                            <NimbleAnchorMenuItem
                            // nimbleRouterLink="/customapp"
                            >Item 5 (link)</NimbleAnchorMenuItem>
                        </NimbleMenu>
                    </div>
                    <div className="sub-container">
                        <div className="container-label">Menu Button</div>
                        <NimbleMenuButton>
                            Menu Button
                            <NimbleMenu slot="menu"
                            // (change)="onMenuButtonMenuChange($event)"
                            >
                                <header>Header 1</header>
                                <NimbleMenuItem>
                                    Item 1
                                    <NimbleIconAdd slot="start"></NimbleIconAdd>
                                </NimbleMenuItem>
                                <NimbleMenuItem>Item 2</NimbleMenuItem>
                                <hr/>
                                <header>Header 2</header>
                                <NimbleMenuItem>Item 4</NimbleMenuItem>
                            </NimbleMenu>
                        </NimbleMenuButton>
                    </div>
                    <div className="sub-container">
                        <div className="container-label">Number Field</div>
                        <NimbleNumberField appearance="underline" placeholder="Number Field" value="42">Underline Number Field</NimbleNumberField>
                        <NimbleNumberField appearance="outline" placeholder="Number Field" value="42">Outline Number Field</NimbleNumberField>
                        <NimbleNumberField appearance="block" placeholder="Number Field" value="42">Block Number Field</NimbleNumberField>
                    </div>
                    <div className="sub-container">
                        <div className="container-label">Select</div>
                        <NimbleSelect filter-mode="standard" appearance="underline">
                            Underline Select
                            <NimbleListOption hidden selected disabled>Select an option</NimbleListOption>
                            <NimbleListOptionGroup label="Group 1">
                                <NimbleListOption>Option 1</NimbleListOption>
                                <NimbleListOption>Option 2</NimbleListOption>
                            </NimbleListOptionGroup>
                            <NimbleListOptionGroup label="Group 2">
                                <NimbleListOption>Option 3</NimbleListOption>
                                <NimbleListOption>Option 4</NimbleListOption>
                            </NimbleListOptionGroup>
                        </NimbleSelect>
                        <NimbleSelect appearance="outline">
                            Outline Select
                            <NimbleListOption hidden selected disabled>Select an option</NimbleListOption>
                            <NimbleListOptionGroup label="Group 1">
                                <NimbleListOption>Option 1</NimbleListOption>
                                <NimbleListOption>Option 2</NimbleListOption>
                            </NimbleListOptionGroup>
                            <NimbleListOptionGroup label="Group 2">
                                <NimbleListOption>Option 3</NimbleListOption>
                                <NimbleListOption>Option 4</NimbleListOption>
                            </NimbleListOptionGroup>
                        </NimbleSelect>
                        <NimbleSelect appearance="block">
                            Block Select
                            <NimbleListOption hidden selected disabled>Select an option</NimbleListOption>
                            <NimbleListOptionGroup label="Group 1">
                                <NimbleListOption>Option 1</NimbleListOption>
                                <NimbleListOption>Option 2</NimbleListOption>
                            </NimbleListOptionGroup>
                            <NimbleListOptionGroup label="Group 2">
                                <NimbleListOption>Option 3</NimbleListOption>
                                <NimbleListOption>Option 4</NimbleListOption>
                            </NimbleListOptionGroup>
                        </NimbleSelect>
                        <div className="sub-container">
                            <div className="container-label">Select with dynamic options</div>
                            <NimbleSelect
                            // #dynamicSelect
                                appearance="underline" filter-mode="manual"
                            //  [(ngModel)]="dynamicSelectValue" (filter-input)="onDynamicSelectFilterInput($event)"
                            >
                                <NimbleListOption hidden selected disabled
                                // [ngValue]="dynamicSelectPlaceholderValue"
                                >Select an option</NimbleListOption>
                                <NimbleListOption
                                // #dynamicOptions *ngFor="let item of dynamicSelectItems" [ngValue]="item" [hidden]="shouldHideItem(item)"
                                >
                                    {/* {{ item.first }} {{ item.last }} */}
                                </NimbleListOption>
                            </NimbleSelect>
                        </div>
                    </div>
                    <div className="sub-container">
                        <div className="container-label">Combobox</div>
                        <NimbleCombobox aria-label="Combobox"
                        // [(ngModel)]="comboboxSelectedOption" (ngModelChange)="onComboboxChange($event)"
                            appearance="underline" autocomplete="both" placeholder="Select value...">
                            Underline Combobox
                            <NimbleListOption
                            //  *ngFor="let item of comboboxItems" [ngValue]="item"
                            >
                                {/* {{ item ? item.first : '' }} */}
                            </NimbleListOption>
                        </NimbleCombobox>
                        <div>
                            <span>
                                Last name:
                                {/* {{ comboboxSelectedLastName }} */}
                            </span>
                        </div>
                        <NimbleCombobox aria-label="Combobox"
                        // [(ngModel)]="comboboxSelectedOption" (ngModelChange)="onComboboxChange($event)"
                            appearance="outline" autocomplete="both" placeholder="Select value...">
                            Outline Combobox
                            <NimbleListOption
                            // *ngFor="let item of comboboxItems" [ngValue]="item"
                            >
                                {/* {{ item ? item.first : '' }} */}
                            </NimbleListOption>
                        </NimbleCombobox>
                        <NimbleCombobox aria-label="Combobox"
                        //  [(ngModel)]="comboboxSelectedOption" (ngModelChange)="onComboboxChange($event)"
                            appearance="block" autocomplete="both" placeholder="Select value...">
                            Block Combobox
                            <NimbleListOption
                            // *ngFor="let item of comboboxItems" [ngValue]="item"
                            >
                                {/* {{ item ? item.first : '' }} */}
                            </NimbleListOption>
                        </NimbleCombobox>
                    </div>
                    <div className="sub-container">
                        <div className="container-label">Rich Text Editor</div>
                        <div className="rich-text-editor-container">
                            <NimbleRichTextEditor className="rich-text-editor" placeholder="Rich text editor"
                            //  #editor
                            >
                                <NimbleRichTextMentionUsers pattern="^user:(.*)" button-label="Mention User">
                                    <NimbleMappingUser key="user:1" display-name="John Doe"></NimbleMappingUser>
                                    <NimbleMappingUser key="user:2" display-name="Mary Wilson"></NimbleMappingUser>
                                </NimbleRichTextMentionUsers>
                                <NimbleButton slot="footer-actions"
                                // (click)="loadRichTextEditorContent()"
                                >Load Content</NimbleButton>
                            </NimbleRichTextEditor>
                        </div>
                    </div>
                    <div className="sub-container">
                        <div className="container-label">Rich Text Viewer</div>
                        <div className="rich-text-viewer-container">
                            <NimbleRichTextViewer
                            // [markdown]="markdownString"
                            >
                                <NimbleRichTextMentionUsers pattern="^user:(.*)">
                                    <NimbleMappingUser key="user:1" display-name="John Doe"></NimbleMappingUser>
                                    <NimbleMappingUser key="user:2" display-name="Mary Wilson"></NimbleMappingUser>
                                </NimbleRichTextMentionUsers>
                            </NimbleRichTextViewer>
                        </div>
                    </div>
                    <div className="sub-container">
                        <div className="container-label">Spinner</div>
                        <NimbleSpinner aria-label="Loading example content"></NimbleSpinner>
                    </div>
                    <div className="sub-container">
                        <div className="container-label">Switch</div>
                        <NimbleSwitch>Switch</NimbleSwitch>
                        <NimbleSwitch checked>
                            Switch with checked/unchecked messages
                            <span slot="unchecked-message">Off</span>
                            <span slot="checked-message">On</span>
                        </NimbleSwitch>
                    </div>
                    <div className="sub-container">
                        <div className="container-label">Table</div>
                        <NimbleTable
                        // [data$]="tableData$"
                            id-field-name="id" parent-id-field-name="parentId" selection-mode="multiple">
                            <NimbleTableColumnText
                                field-name="stringValue1"
                                action-menu-slot="action-menu"
                                action-menu-label="Action menu"
                                fractional-width="2"
                                min-pixel-width="300"
                                sort-direction="ascending"
                                sort-index="0"
                            >
                                <NimbleIconCheck title="String 1"></NimbleIconCheck>
                            </NimbleTableColumnText>
                            <NimbleTableColumnAnchor
                                href-field-name="href"
                                label-field-name="linkLabel"
                            >
                                Link
                            </NimbleTableColumnAnchor>
                            <NimbleTableColumnDateText
                                field-name="date"
                            >
                                Date
                            </NimbleTableColumnDateText>
                            <NimbleTableColumnMapping
                                field-name="statusCode"
                                key-type="number"
                            >
                                <NimbleMappingText key="100" text="Status message 1"></NimbleMappingText>
                                <NimbleMappingText key="101" text="Status message 2"></NimbleMappingText>
                                Status
                            </NimbleTableColumnMapping>
                            <NimbleTableColumnMapping
                                field-name="result"
                                key-type="string"
                                width-mode="icon-size"
                            >
                                <NimbleMappingIcon
                                    key="success"
                                    text="Success"
                                    icon="nimble-icon-check"
                                    severity="success"
                                    text-hidden>
                                </NimbleMappingIcon>
                                <NimbleMappingSpinner
                                    key="calculating"
                                    text="Calculating"
                                    text-hidden>
                                </NimbleMappingSpinner>
                                <NimbleMappingEmpty
                                    key="unknown"
                                    text="Unknown">
                                </NimbleMappingEmpty>
                                <NimbleIconXmarkCheck title="Result"></NimbleIconXmarkCheck>
                            </NimbleTableColumnMapping>
                            <NimbleTableColumnNumberText
                                field-name="number"
                            >
                                Number
                            </NimbleTableColumnNumberText>
                            <NimbleTableColumnDurationText
                                field-name="duration"
                            >
                                Duration
                            </NimbleTableColumnDurationText>
                            <NimbleTableColumnText field-name="stringValue2" min-pixel-width="400" group-index="0">String 2</NimbleTableColumnText>
                            <NimbleTableColumnMenuButton field-name="color" menu-slot="color-menu"
                                // (menu-button-column-beforetoggle)="onMenuButtonColumnBeforeToggle($event)"
                            >
                                Color
                            </NimbleTableColumnMenuButton>

                            <NimbleMenu slot="action-menu">
                                <NimbleMenuItem>Item 1</NimbleMenuItem>
                                <NimbleMenuItem>Item 2</NimbleMenuItem>
                                <NimbleMenuItem>Item 3</NimbleMenuItem>
                            </NimbleMenu>

                            <NimbleMenu slot="color-menu">
                                <NimbleMenuItem
                                // *ngFor="let color of possibleColors" (change)="onColorSelected(color)"
                                >
                                    <NimbleIconCheck
                                    //  *ngIf="color === currentColor"
                                        slot="start"></NimbleIconCheck>
                                    {/* {{ color }} */}
                                </NimbleMenuItem>
                            </NimbleMenu>
                        </NimbleTable>
                        <NimbleButton className="add-table-row-button"
                        //  (click)="addTableRows(10)"
                        >Add rows</NimbleButton>
                    </div>
                    <div className="sub-container">
                        <div className="container-label">Table with delayed hierarchy</div>
                        <NimbleTable
                        // #delayedHierarchyTable
                            id-field-name="id" parent-id-field-name="parentId" selection-mode="multiple"
                        //  (row-expand-toggle)="onRowExpandToggle($event)"
                        >
                            <NimbleTableColumnText
                                field-name="firstName"
                            >
                                First name
                            </NimbleTableColumnText>
                            <NimbleTableColumnText
                                field-name="lastName"
                            >
                                Last name
                            </NimbleTableColumnText>
                            <NimbleTableColumnNumberText
                                field-name="age"
                                format="decimal"
                                decimal-digits="0"
                            >
                                Age
                            </NimbleTableColumnNumberText>
                        </NimbleTable>
                    </div>
                    <div className="sub-container">
                        <div className="container-label">Tabs</div>
                        <NimbleTabs
                        //  [(activeid)]="activeTabId"
                        >
                            <NimbleTab id="tab-1">Tab 1</NimbleTab>
                            <NimbleTab id="tab-2">Tab 2</NimbleTab>
                            <NimbleTab id="tab-3" disabled>Tab 3 (Disabled)</NimbleTab>
                            <NimbleTabsToolbar>
                                <NimbleButton
                                // (click)="onTabToolbarButtonClick()"
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
                        //  [(ngModel)]="activeTabId"
                            aria-labelledby="activeTabLabel">
                            <NimbleListOption value="tab-1">Tab 1</NimbleListOption>
                            <NimbleListOption value="tab-2">Tab 2</NimbleListOption>
                            <NimbleListOption value="tab-3">Tab 3</NimbleListOption>
                        </NimbleSelect>
                    </div>
                    <div className="sub-container">
                        <div className="container-label">Tabs - Anchor</div>
                        <NimbleAnchorTabs
                        // [activeid]="activeAnchorTabId"
                        >
                            <NimbleAnchorTab id="a-tab-1" href="https://nimble.ni.dev">Tab 1</NimbleAnchorTab>
                            <NimbleAnchorTab id="a-tab-2" href="https://ni.com">Tab 2</NimbleAnchorTab>
                            <NimbleAnchorTab disabled id="a-tab-3" href="https://google.com">Tab 3 (Disabled)</NimbleAnchorTab>
                            <NimbleTabsToolbar>
                                <NimbleButton
                                // (click)="onTabToolbarButtonClick()"
                                >Toolbar button</NimbleButton>
                            </NimbleTabsToolbar>
                        </NimbleAnchorTabs>
                        <label id="activeAnchorTabLabel">
                            Active tab:
                        </label>
                        <NimbleSelect
                        //  [(ngModel)]="activeAnchorTabId"
                            aria-labelledby="activeAnchorTabLabel">
                            <NimbleListOption value="a-tab-1">Tab 1</NimbleListOption>
                            <NimbleListOption value="a-tab-2">Tab 2</NimbleListOption>
                            <NimbleListOption value="a-tab-3">Tab 3</NimbleListOption>
                        </NimbleSelect>
                    </div>
                    <div className="sub-container">
                        <div className="container-label">Text Area</div>
                        <NimbleTextArea placeholder="Text Area" cols={50} rows={5} resize="horizontal" value="Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.">Text Area Label</NimbleTextArea>
                    </div>
                    <div className="sub-container">
                        <div className="container-label">Text Field</div>
                        <NimbleTextField appearance="underline" placeholder="Text Field" value="Here is text!">Underline Text Field</NimbleTextField>
                        <NimbleTextField appearance="outline" placeholder="Text Field" value="Here is text!">Outline Text Field</NimbleTextField>
                        <NimbleTextField appearance="block" placeholder="Text Field" value="Here is text!">Block Text Field</NimbleTextField>
                    </div>
                    <div className="sub-container">
                        <div className="container-label">Toolbar</div>
                        <NimbleToolbar>
                            <NimbleButton slot="start" appearance="outline">First button</NimbleButton>
                            <NimbleButton slot="start" appearance="outline">Second button</NimbleButton>
                            <NimbleButton>Middle button</NimbleButton>
                            <NimbleButton slot="end" appearance="outline">Last button</NimbleButton>
                        </NimbleToolbar>
                    </div>
                    <div className="sub-container">
                        <div className="container-label">Tooltip</div>
                        <NimbleButton id="anchor1">Default</NimbleButton>
                        <NimbleTooltip anchor="anchor1">Tooltip label</NimbleTooltip>
                        <NimbleButton id="anchor2">Fail</NimbleButton>
                        <NimbleTooltip anchor="anchor2" severity="error">Tooltip label</NimbleTooltip>
                        <NimbleButton id="anchor3">Information</NimbleButton>
                        <NimbleTooltip anchor="anchor3" severity="information">Tooltip label</NimbleTooltip>
                        <NimbleButton id="anchor4">Fail Icon </NimbleButton>
                        <NimbleTooltip anchor="anchor4" severity="error" icon-visible>Tooltip label</NimbleTooltip>
                        <NimbleButton id="anchor5">Information Icon</NimbleButton>
                        <NimbleTooltip anchor="anchor5" severity="information" icon-visible>Tooltip label</NimbleTooltip>
                    </div>
                    <div className="sub-container">
                        <div className="container-label">Tree View</div>
                        <NimbleTreeView>
                            <NimbleTreeItem>
                                Parent 1
                                <NimbleTreeItem>Child 1</NimbleTreeItem>
                                <NimbleAnchorTreeItem
                                // nimbleRouterLink="/customapp"
                                >Child 2 (link)</NimbleAnchorTreeItem>
                                <NimbleTreeItem disabled>Child 3</NimbleTreeItem>
                            </NimbleTreeItem>
                            <NimbleTreeItem expanded>
                                Parent 2
                                <NimbleTreeItem selected>Child 2-1</NimbleTreeItem>
                                <NimbleTreeItem>Child 2-2</NimbleTreeItem>
                                <NimbleTreeItem>Child 2-3</NimbleTreeItem>
                            </NimbleTreeItem>
                        </NimbleTreeView>
                    </div>
                    <div className="sub-container">
                        <div className="container-label">Chat Conversation and Messages (Spright)</div>
                        <SprightChatConversation>
                            <SprightChatMessage>To start, press any key.</SprightChatMessage>
                            <SprightChatMessage message-type="outbound">Where is the Any key?</SprightChatMessage>
                            <SprightChatMessage>
                                <NimbleSpinner appearance="accent"></NimbleSpinner>
                            </SprightChatMessage>
                            <SprightChatMessage message-type="inbound">
                                <NimbleButton slot="footer-actions" appearance='ghost' content-hidden>
                                    <NimbleIconCopyText slot="start"></NimbleIconCopyText>
                                    Copy
                                </NimbleButton>
                                <NimbleIconWebviCustom style={{ height: '100px', width: '100px' }}></NimbleIconWebviCustom>
                                <div>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
                                Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.</div>
                                <NimbleButton slot="end" appearance="block">Order a tab</NimbleButton>
                                <NimbleButton slot="end" appearance="block">Check core temperature</NimbleButton>
                            </SprightChatMessage>
                        </SprightChatConversation>
                    </div>
                    <div className="sub-container">
                        <div className="container-label">Rectangle (Spright)</div>
                        <SprightRectangle>Spright!</SprightRectangle>
                    </div>
                </div>
            </div>
        </>
    );
}
