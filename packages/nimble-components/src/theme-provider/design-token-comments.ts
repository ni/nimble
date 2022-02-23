import type * as TokensNamespace from './design-tokens';

type TokenName = keyof typeof TokensNamespace;

export const comments: { readonly [key in TokenName]: string } = {
    actionRgbPartialColor:
        'DEPRECATED: *-partial tokens are used with rgba() to set color transparency in component stylesheets',
    applicationBackgroundColor: 'Primary background color for the application',
    headerBackgroundColor: 'Background color for application headers',
    sectionBackgroundColor: 'Background color for dialogs and menus',
    fillColorSelected: 'Control fill color when a control is selected',
    fillSelectedRgbPartialColor:
        'DEPRECATED: *-partial tokens are used with rgba() to set color transparency in component stylesheets',
    fillHoverSelectedColor:
        'Control fill color when hovering a selected control',
    fillHoverColor: 'Control fill color when hovering component',
    borderColor: 'Standard control outline or border color',
    borderRgbPartialColor:
        'DEPRECATED: *-partial tokens are used with rgba() to set color transparency in component stylesheets',
    failColor: 'Used to highlight errors or invalid input',
    warningColor:
        'Used to highlight invalid input or for icons to indicate that a process errored or failed',
    passColor:
        'Used to highlight a correct state or the successful completion of a process',
    borderHoverColor: 'Border color when hovering component',
    iconColor: 'Equivalent to the font color for icons',
    popupBoxShadowColor: 'Shadow color for menus and dialog boxes',
    popupBorderColor: 'Border color for menus and dialog boxes',
    controlHeight:
        'Standard layout height for all controls. Add "labelHeight" for labels on top.',
    smallPadding: 'Small layout padding for components',
    standardPadding: 'Standard layout padding for components',
    labelHeight: 'Standard label height for components',
    borderWidth: 'Standard border width for most components',
    iconSize: 'Standard layout height for all icons',
    groupHeaderTextTransform: 'CSS text-transform string to use for headers',
    drawerWidth: 'TODO: delete when able',
    smallDelay:
        'Elements with small transition areas, such as icons and selection controls, have short durations.',
    mediumDelay:
        'Elements with larger transition areas, such as bottom sheets and expanding chips, have slightly longer durations.',
    largeDelay:
        'Animated elements that traverse a large portion of the screen have the longest durations.',
    headlinePlus1Font: 'Font shorthand for the "Headline_2" base token',
    headlineFont: 'Font shorthand for the "Headline_1" base token',
    titlePlus2Font: 'Font shorthand for the "Title_3" base token',
    titlePlus1Font: 'Font shorthand for the "Title_2" base token',
    titleFont: 'Font shorthand for the "Title_1" base token',
    subtitlePlus1Font: 'Font shorthand for the "Subtitle_2" base token',
    subtitleFont: 'Font shorthand for the "Subtitle_1" base token',
    linkStandardFont: 'Font shorthand for the "Link_standard_1" base token',
    placeholderFont: 'Font shorthand for the "Placeholder" base token',
    bodyEmphasizedFont: 'Font shorthand for the "Body_Emphasized" base token',
    bodyFont: 'Font shorthand for the "Body" base token',
    groupHeaderFont: 'Font shorthand for the "Group_Header_1" base token',
    controlLabelFont: 'Font shorthand for the "Control_Label_1" base token',
    buttonLabelFont: 'Font shorthand for the "Button_Label_1" base token',
    tooltipCaptionFont: 'Font shorthand for the "Tooltip_Caption" base token',
    headlinePlus1FontColor: 'Font color for "Headline_2" base token',
    headlineFontColor: 'Font color for "Headline_1" base token',
    titlePlus2FontColor: 'Font color for "Title_3" base token',
    titlePlus1FontColor: 'Font color for "Title_2" base token',
    titleFontColor: 'Font color for "Title_1" base token',
    subtitlePlus1FontColor: 'Font color for "Subtitle_2" base token',
    subtitleFontColor: 'Font color for "Subtitle_1" base token',
    linkStandardFontColor: 'Font color for "Link_Standard_1" base token',
    placeholderFontColor: 'Font color for "Placeholder" base token',
    bodyEmphasizedFontColor: 'Font color for "Body_Emphasized" base token',
    bodyFontColor: 'Font color for "Body" base token',
    groupHeaderFontColor: 'Font color for "Group_Header_1" base token',
    controlLabelFontColor: 'Font color for "Control_Label_1" base token',
    buttonLabelFontColor: 'Font color for "Button_Label_1" base token',
    tooltipCaptionFontColor: 'Font color for "Tooltip_Caption" base token',
    headlinePlus1DisabledFontColor:
        'Disabled font color for "Headline_2" base token',
    headlineDisabledFontColor:
        'Disabled font color for "Headline_1" base token',
    titlePlus2DisabledFontColor: 'Disabled font color for "Title_3" base token',
    titlePlus1DisabledFontColor: 'Disabled font color for "Title_2" base token',
    titleDisabledFontColor: 'Disabled font color for "Title_1" base token',
    subtitlePlus1DisabledFontColor:
        'Disabled font color for "Subtitle_2" base token',
    subtitleDisabledFontColor:
        'Disabled font color for "Subtitle_1" base token',
    linkStandardDisabledFontColor:
        'Disabled font color for "Link_Standard_1" base token',
    placeholderDisabledFontColor:
        'Disabled font color for "Placeholder" base token',
    bodyEmphasizedDisabledFontColor:
        'Disabled font color for "Body_Emphasized" base token',
    bodyDisabledFontColor: 'Disabled font color for "Body" base token',
    groupHeaderDisabledFontColor:
        'Disabled font color for "Group_Header_1" base token',
    controlLabelDisabledFontColor:
        'Disabled font color for "Control_Label_1" base token',
    buttonLabelDisabledFontColor:
        'Disabled font color for "Button_Label_1" base token',
    tooltipCaptionDisabledFontColor:
        'Disabled font color for "Tooltip_Caption" base token'
};
