import { NimbleThemeProvider, Theme } from '@ni/nimble-react/theme-provider';
import { NimbleSelect } from '@ni/nimble-react/select';
import { NimbleListOption } from '@ni/nimble-react/list-option';

import './App.scss';
import { useState } from 'react';

import { OverviewSection } from './OverviewSection';
import { AnchorSection } from './AnchorSection';
import { BannerSection } from './BannerSection';
import { BreadcrumbSection } from './BreadcrumbSection';
import { ButtonsSection } from './ButtonsSection';
import { AnchorButtonsSection } from './AnchorButtonsSection';
import { ToggleButtonsSection } from './ToggleButtonsSection';
import { CardSection } from './CardSection';
import { CardButtonSection } from './CardButtonSection';
import { CheckboxSection } from './CheckboxSection';
import { RadioButtonsSection } from './RadioButtonsSection';
import { DialogSection } from './DialogSection';
import { DrawerSection } from './DrawerSection';
import { MenuSection } from './MenuSection';
import { MenuButtonSection } from './MenuButtonSection';
import { NumberFieldSection } from './NumberFieldSection';
import { SelectSection } from './SelectSection';
import { ComboboxSection } from './ComboboxSection';
import { RichTextEditorSection } from './RichTextEditorSection';
import { RichTextViewerSection } from './RichTextViewerSection';
import { SpinnerSection } from './SpinnerSection';
import { StepperSection } from './StepperSection';
import { SwitchSection } from './SwitchSection';
import { TableSection } from './TableSection';
import { DelayedHierarchyTableSection } from './DelayedHierarchyTableSection';
import { TabsSection } from './TabsSection';
import { AnchorTabsSection } from './AnchorTabsSection';
import { TextAreaSection } from './TextAreaSection';
import { TextFieldSection } from './TextFieldSection';
import { ToolbarSection } from './ToolbarSection';
import { TooltipSection } from './TooltipSection';
import { TreeViewSection } from './TreeViewSection';
import { ChatConversationSection } from './ChatConversationSection';
import { RectangleSection } from './RectangleSection';
import { OkButtonSection } from './OkButtonSection';

export function App(): React.JSX.Element {
    const prefersColorSchemeDarkMediaQuery: MediaQueryList = window.matchMedia(
        '(prefers-color-scheme: dark)'
    );
    const [theme, setTheme] = useState<Theme>(prefersColorSchemeDarkMediaQuery.matches ? 'dark' : 'light');

    return (
        <>
            <NimbleThemeProvider theme={theme}>
                <div className="example-root">
                    <div className="header">
                        <NimbleSelect
                            className="theme-select"
                            appearance="frameless"
                            value={theme}
                            onChange={e => setTheme(e.target.value as Theme)}
                        >
                            {Object.values(Theme).map(item => (
                                <NimbleListOption
                                    key={item}
                                    value={item}
                                >
                                    {`${item.charAt(0).toUpperCase()}${item.slice(1)}`} Theme
                                </NimbleListOption>
                            ))}
                        </NimbleSelect>
                    </div>
                    <div className="content-container-wrapper">
                        <div className="content-container">
                            <div className="container">
                                <OverviewSection />
                                <AnchorSection />
                                <BannerSection />
                                <BreadcrumbSection />
                                <ButtonsSection />
                                <AnchorButtonsSection />
                                <ToggleButtonsSection />
                                <CardSection />
                                <CardButtonSection />
                                <CheckboxSection />
                                <RadioButtonsSection />
                                <DialogSection />
                                <DrawerSection />
                                <MenuSection />
                                <MenuButtonSection />
                                <NumberFieldSection />
                                <SelectSection />
                                <ComboboxSection />
                                <RichTextEditorSection />
                                <RichTextViewerSection />
                                <SpinnerSection />
                                <StepperSection />
                                <SwitchSection />
                                <TableSection />
                                <DelayedHierarchyTableSection />
                                <TabsSection />
                                <AnchorTabsSection />
                                <TextAreaSection />
                                <TextFieldSection />
                                <ToolbarSection />
                                <TooltipSection />
                                <TreeViewSection />
                                <ChatConversationSection />
                                <RectangleSection />
                                <OkButtonSection />
                            </div>
                        </div>
                    </div>
                </div>
            </NimbleThemeProvider>
        </>
    );
}
