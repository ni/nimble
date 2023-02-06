import type * as TokensNamespace from './design-tokens';

type TokenName = keyof typeof TokensNamespace;

export const comments: { readonly [key in TokenName]: string | null } = {
    actionRgbPartialColor:
        'DEPRECATED: *-partial tokens are used with rgba() to set color transparency in component stylesheets',
    applicationBackgroundColor: 'Primary background color for the application',
    dividerBackgroundColor: 'Divider background color',
    headerBackgroundColor: 'Background color for application headers',
    sectionBackgroundColor: 'Background color for menus and dropdown lists',
    fillSelectedColor: 'Control fill color when a control is selected',
    fillSelectedRgbPartialColor:
        'DEPRECATED: *-partial tokens are used with rgba() to set color transparency in component stylesheets',
    fillHoverSelectedColor:
        'Control fill color when hovering a selected control',
    fillHoverColor: 'Control fill color when hovering component',
    fillDownColor: 'Control fill color when mousedown event occurs',
    borderColor: 'Standard control outline or border color',
    borderRgbPartialColor:
        'DEPRECATED: *-partial tokens are used with rgba() to set color transparency in component stylesheets',
    failColor: 'Used to highlight errors or invalid input',
    warningColor:
        'Used to highlight invalid input or for icons to indicate that a process errored or failed',
    passColor:
        'Used to highlight a correct state or the successful completion of a process',
    informationColor:
        'Used to highlight information, which provides more details on the item',
    borderHoverColor: 'Border color when hovering component',
    iconColor: 'Equivalent to the font color for icons',
    modalBackdropColor: 'Color of background overlay behind modal dialog boxes',
    popupBorderColor: 'Border color for menus and dialog boxes',
    controlHeight:
        'Standard layout height for all controls. Add "labelHeight" for labels on top.',
    smallPadding: 'Small layout padding for components',
    standardPadding: 'Standard layout padding for components',
    labelHeight:
        'Standard label height for components. Set the label font rather than explicitly setting the height for a label.',
    borderWidth: 'Standard border width for most components',
    iconSize: 'Standard layout height for all icons',
    groupHeaderTextTransform: 'CSS text-transform string to use for headers',
    drawerWidth: 'TODO: delete when able',
    spinnerSmallHeight: 'Small height (16px) for a spinner component',
    spinnerMediumHeight: 'Medium height (32px) for a spinner component',
    spinnerLargeHeight: 'Large height (64px) for a spinner component',
    smallDelay:
        'Elements with small transition areas, such as icons and selection controls, have short durations.',
    mediumDelay:
        'Elements with larger transition areas, such as bottom sheets and expanding chips, have slightly longer durations.',
    largeDelay:
        'Animated elements that traverse a large portion of the screen have the longest durations.',
    headlinePlus1Font: 'Font shorthand for the "Headline_2" base token',
    headlinePlus1FontColor: 'Font color for the "Headline_2" base token',
    headlinePlus1DisabledFontColor:
        'Disabled font color for the "Headline_2" base token',
    headlinePlus1FontFamily: 'Font family for the "Headline_2" base token',
    headlinePlus1FontSize: 'Font size for the "Headline_2" base token',
    headlinePlus1FontWeight: 'Font weight for the "Headline_2" base token',
    headlinePlus1FontLineHeight:
        'Font line height for the "Headline_2" base token',
    headlinePlus1FallbackFontFamily: null,
    headlineFont: 'Font shorthand for the "Headline_1" base token',
    headlineFontColor: 'Font color for the "Headline_1" base token',
    headlineDisabledFontColor:
        'Disabled font color for the "Headline_1" base token',
    headlineFontFamily: 'Font family for the "Headline_1" base token',
    headlineFontSize: 'Font size for the "Headline_1" base token',
    headlineFontWeight: 'Font weight for the "Headline_1" base token',
    headlineFontLineHeight: 'Font line height for the "Headline_1" base token',
    headlineFallbackFontFamily:
        'Fallback font family for the "Headline_1" base token',
    tableHeaderFont: 'Font shorthand for the "Grid_Header" base token',
    tableHeaderFontColor: 'Font color for the "Grid_Header" base token',
    tableHeaderDisabledFontColor:
        'Disabled font color for the "Grid_Header" base token',
    tableHeaderFontFamily: 'Font family for the "Grid_Header" base token',
    tableHeaderFontSize: 'Font size for the "Grid_Header" base token',
    tableHeaderFontWeight: 'Font weight for the "Grid_Header" base token',
    tableHeaderFontLineHeight:
        'Font line height for the "Grid_Header" base token',
    tableHeaderFallbackFontFamily:
        'Fallback font family for the "Grid_Header" base token',
    titlePlus2Font: 'Font shorthand for the "Title_3" base token',
    titlePlus2FontColor: 'Font color for the "Title_3" base token',
    titlePlus2DisabledFontColor:
        'Disabled font color for the "Title_3" base token',
    titlePlus2FontFamily: 'Font family for the "Title_3" base token',
    titlePlus2FontSize: 'Font size for the "Title_3" base token',
    titlePlus2FontWeight: 'Font weight for the "Title_3" base token',
    titlePlus2FontLineHeight: 'Font line height for the "Title_3" base token',
    titlePlus2FallbackFontFamily:
        'Fallback font family for the "Title_3" base token',
    titlePlus1Font: 'Font shorthand for the "Title_2" base token',
    titlePlus1FontColor: 'Font color for the "Title_2" base token',
    titlePlus1DisabledFontColor:
        'Disabled font color for the "Title_2" base token',
    titlePlus1FontFamily: 'Font family for the "Title_2" base token',
    titlePlus1FontSize: 'Font size for the "Title_2" base token',
    titlePlus1FontWeight: 'Font weight for the "Title_2" base token',
    titlePlus1FontLineHeight: 'Font line height for the "Title_2" base token',
    titlePlus1FallbackFontFamily:
        'Fallback font family for the "Title_2" base token',
    titleFont: 'Font shorthand for the "Title_1" base token',
    titleFontColor: 'Font color for the "Title_1" base token',
    titleDisabledFontColor: 'Disabled font color for the "Title_1" base token',
    titleFontFamily: 'Font family for the "Title_1" base token',
    titleFontSize: 'Font size for the "Title_1" base token',
    titleFontWeight: 'Font weight for the "Title_1" base token',
    titleFontLineHeight: 'Font line height for the "Title_1" base token',
    titleFallbackFontFamily:
        'Fallback font family for the "Title_1" base token',
    subtitlePlus1Font: 'Font shorthand for the "Subtitle_2" base token',
    subtitlePlus1FontColor: 'Font color for the "Subtitle_2" base token',
    subtitlePlus1DisabledFontColor:
        'Disabled font color for the "Subtitle_2" base token',
    subtitlePlus1FontFamily: 'Font family for the "Subtitle_2" base token',
    subtitlePlus1FontSize: 'Font size for the "Subitle_2" base token',
    subtitlePlus1FontWeight: 'Font weight for the "Subtitle_2" base token',
    subtitlePlus1FontLineHeight:
        'Font line height for the "Subtitle_2" base token',
    subtitlePlus1FallbackFontFamily:
        'Fallback font family for the "Subtitle_2" base token',
    subtitleFont: 'Font shorthand for the "Subtitle_1" base token',
    subtitleFontColor: 'Font color for the "Subtitle_1" base token',
    subtitleDisabledFontColor:
        'Disabled font color for the "Subtitle_1" base token',
    subtitleFontFamily: 'Font family for the "Subtitle_1" base token',
    subtitleFontSize: 'Font size for the "Subitle_1" base token',
    subtitleFontWeight: 'Font weight for the "Subtitle_1" base token',
    subtitleFontLineHeight: 'Font line height for the "Subtitle_1" base token',
    subtitleFallbackFontFamily:
        'Fallback font family for the "Subtitle_1" base token',
    linkFont: 'Font shorthand for links',
    linkFontColor: 'Font color for links',
    linkDisabledFontColor: 'Disabled font color for links',
    linkFontFamily: 'Font family for links',
    linkFontSize: 'Font size for links',
    linkFontWeight: 'Font weight for links',
    linkFontLineHeight: 'Font line height for links',
    linkFallbackFontFamily: 'Fallback font family for links',
    linkActiveFont: 'Font shorthand for active links',
    linkActiveFontColor: 'Font color for active links',
    linkActiveDisabledFontColor: 'Disabled font color for active links',
    linkActiveFontFamily: 'Font family for active links',
    linkActiveFontSize: 'Font size for active links',
    linkActiveFontWeight: 'Font weight for active links',
    linkActiveFontLineHeight: 'Font line height for active links',
    linkActiveFallbackFontFamily: 'Fallback font family for active links',
    linkProminentFont: 'Font shorthand for prominent links',
    linkProminentFontColor: 'Font color for prominent links',
    linkProminentDisabledFontColor: 'Disabled font color for prominent links',
    linkProminentFontFamily: 'Font family for prominent links',
    linkProminentFontSize: 'Font size for prominent links',
    linkProminentFontWeight: 'Font weight for prominent links',
    linkProminentFontLineHeight: 'Font line height for prominent links',
    linkProminentFallbackFontFamily: 'Fallback font family for prominent links',
    linkActiveProminentFont: 'Font shorthand for active prominent links',
    linkActiveProminentFontColor: 'Font color for active prominent links',
    linkActiveProminentDisabledFontColor:
        'Disabled font color for active prominent links',
    linkActiveProminentFontFamily: 'Font family for active prominent links',
    linkActiveProminentFontSize: 'Font size for active prominent links',
    linkActiveProminentFontWeight: 'Font weight for active prominent links',
    linkActiveProminentFontLineHeight:
        'Font line height for active prominent links',
    linkActiveProminentFallbackFontFamily:
        'Fallback font family for active prominent links',
    placeholderFont: 'Font shorthand for the "Placeholder" base token',
    placeholderFontColor: 'Font color for the "Placeholder" base token',
    placeholderDisabledFontColor:
        'Disabled font color for the "Placeholder" base token',
    placeholderFontFamily: 'Font family for the "Placeholder" base token',
    placeholderFontSize: 'Font size for the "Placeholder" base token',
    placeholderFontWeight: 'Font weight for the "Placeholder" base token',
    placeholderFontLineHeight:
        'Font line height for the "Placeholder" base token',
    placeholderFallbackFontFamily:
        'Fallback font family for the "Placeholder" base token',
    bodyEmphasizedFont: 'Font shorthand for the "Body_Emphasized" base token',
    bodyEmphasizedFontColor: 'Font color for the "Body_Emphasized" base token',
    bodyEmphasizedDisabledFontColor:
        'Disabled font color for the "Body_Emphasized" base token',
    bodyEmphasizedFontFamily:
        'Font family for the "Body_Emphasized" base token',
    bodyEmphasizedFontSize: 'Font size for the "Body_Emphasized" base token',
    bodyEmphasizedFontWeight:
        'Font weight for the "Body_Emphasized" base token',
    bodyEmphasizedFontLineHeight:
        'Font line height for the "Body_Emphasized" base token',
    bodyEmphasizedFallbackFontFamily:
        'Fallback font family for the "Body_Emphasized" base token',
    bodyFont: 'Font shorthand for the "Body" base token',
    bodyFontColor: 'Font color for the "Body" base token',
    bodyDisabledFontColor: 'Disabled font color for the "Body" base token',
    bodyFontFamily: 'Font family for the "Body" base token',
    bodyFontSize: 'Font size for the "Body" base token',
    bodyFontWeight: 'Font weight for the "Body" base token',
    bodyFontLineHeight: 'Font line height for the "Body" base token',
    bodyFallbackFontFamily: 'Fallback font family for the "Body" base token',
    groupHeaderFont: 'Font shorthand for the "Group_Header_1" base token',
    groupHeaderFontColor: 'Font color for the "Group_Header_1" base token',
    groupHeaderDisabledFontColor:
        'Disabled font color for the"Group_Header_1" base token',
    groupHeaderFontFamily: 'Font family for the "Group_Header_1" base token',
    groupHeaderFontSize: 'Font size for the "Group_Header_1" base token',
    groupHeaderFontWeight: 'Font weight for the "Group_Header_1" base token',
    groupHeaderFontLineHeight:
        'Font line height for the "Group_Header_1" base token',
    groupHeaderFallbackFontFamily:
        'Fallback font family for the "Group_Header_1" base token',
    controlLabelFont: 'Font shorthand for the "Control_Label_1" base token',
    controlLabelFontColor: 'Font color for the "Control_Label_1" base token',
    controlLabelDisabledFontColor:
        'Disabled font color for the "Control_Label_1" base token',
    controlLabelFontFamily: 'Font family for the "Control_Label_1" base token',
    controlLabelFontSize: 'Font size for the "Control_Label_1" base token',
    controlLabelFontWeight: 'Font weight for the "Control_Label_1" base token',
    controlLabelFontLineHeight:
        'Font line height for the "Control_Label_1" base token',
    controlLabelFallbackFontFamily:
        'Fallback font family for the "Control_Label_1" base token',
    buttonLabelFont: 'Font shorthand for the "Button_Label_1" base token',
    buttonLabelFontColor: 'Font color for the "Button_Label_1" base token',
    buttonLabelDisabledFontColor:
        'Disabled font color for the "Button_Label_1" base token',
    buttonLabelFontFamily: 'Font family for the "Button_Label_1" base token',
    buttonLabelFontSize: 'Font size for the "Button_Label_1" base token',
    buttonLabelFontWeight: 'Font weight for the "Button_Label_1" base token',
    buttonLabelFontLineHeight:
        'Font line height for the "Button_Label_1" base token',
    buttonLabelFallbackFontFamily:
        'Fallback font family for the "Button_Label_1" base token',
    tooltipCaptionFont: 'Font shorthand for the "Tooltip_Caption" base token',
    tooltipCaptionFontColor: 'Font color for the "Tooltip_Caption" base token',
    tooltipCaptionDisabledFontColor:
        'Disabled font color for the "Tooltip_Caption" base token',
    tooltipCaptionFontFamily:
        'Font family for the "Tooltip_Caption" base token',
    tooltipCaptionFontSize: 'Font size for the "Tooltip_Caption" base token',
    tooltipCaptionFontWeight:
        'Font weight for the "Tooltip_Caption" base token',
    tooltipCaptionFontLineHeight:
        'Font line height for the "Tooltip_Caption" base token',
    tooltipCaptionFallbackFontFamily:
        'Fallback font family for the "Tooltip_Caption" base token',
    tooltipBackgroundColor: 'Default background color for tooltips',
    errorTextFont: 'Font shorthand for the "Error_LightUi" base token',
    errorTextFontColor: 'Font color for the "Error_LightUi" base token',
    errorTextDisabledFontColor:
        'Disabled font color for the "Error_LightUi" base token',
    errorTextFontFamily: 'Font family for the "Error_LightUi" base token',
    errorTextFontSize: 'Font size for the "Error_LightUi" base token',
    errorTextFontWeight: 'Font weight for the "Error_LightUi" base token',
    errorTextFontLineHeight:
        'Font line height for the "Error_LightUi" base token',
    errorTextFallbackFontFamily:
        'Fallback font family for the "Error_LightUi" base token',
    tableRowBorderColor: 'Color for the border of rows in the table',
    elevation1BoxShadow:
        'The box shadow for elevation 1. Used for component hover states.',
    elevation2BoxShadow:
        'The box shadow for elevation 2. Used for components such as menus, banners, tooltips, error notifications, and scrolling.',
    elevation3BoxShadow:
        'The box shadow for elevation 3. Used for components such as dialogs, overlays, and pop-ups.'
};
