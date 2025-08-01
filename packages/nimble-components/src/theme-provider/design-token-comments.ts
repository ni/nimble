import type * as TokensNamespace from './design-tokens';

type TokenName = keyof typeof TokensNamespace;

export const comments: { readonly [key in TokenName]: string } = {
    actionRgbPartialColor:
        'DEPRECATED: *-partial tokens are used with rgba() to set color transparency in component stylesheets',
    applicationBackgroundColor: 'Primary background color for the application',
    dividerBackgroundColor: 'Divider background color',
    headerBackgroundColor: 'Background color for application headers',
    sectionBackgroundColor: 'Background color for sections',
    sectionBackgroundImage: 'Gradient background image for sections.',
    buttonFillPrimaryColor:
        'Control fill color for "primary" appearance-variant buttons',
    buttonPrimaryFontColor:
        'Font color for "primary" appearance-variant buttons',
    buttonFillAccentColor:
        'Control fill color for "accent" appearance-variant buttons',
    buttonAccentBlockFontColor:
        'Font color for "accent" appearance-variant block buttons',
    buttonAccentOutlineFontColor:
        'Font color for "accent" appearance-variant outline buttons',
    buttonBorderAccentOutlineColor:
        'Border color for "accent" appearance-variant outline buttons',
    fillSelectedColor: 'Control fill color when a control is selected',
    fillSelectedRgbPartialColor:
        'DEPRECATED: *-partial tokens are used with rgba() to set color transparency in component stylesheets',
    fillHoverSelectedColor:
        'Control fill color when hovering a selected control',
    fillHoverColor: 'Control fill color when hovering component',
    fillHoverRgbPartialColor:
        'DEPRECATED: *-partial tokens are used with rgba() to set color transparency in component stylesheets',
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
    cardBorderColor: 'Border color for cards',
    tagFillColor: 'Background fill color for tags, chips, or pills',
    controlHeight:
        'Standard layout height for all controls. Add "labelHeight" for labels on top.',
    controlSlimHeight:
        'Height of controls that are somewhat shorter than standard height.',
    smallPadding: 'Fixed 4px size ramp token for component layout',
    mediumPadding: 'Fixed 8px size ramp token for component layout',
    standardPadding: 'Fixed 16px size ramp token for component layout',
    largePadding: 'Fixed 24px size ramp token for component layout',
    labelHeight:
        'Standard label height for components. Set the label font rather than explicitly setting the height for a label.',
    borderWidth: 'Standard border width for most components',
    dividerWidth: 'Width of dividers between panes of an application',
    iconSize: 'Standard layout height for all icons',
    groupHeaderTextTransform: 'CSS text-transform string to use for headers',
    drawerWidth: 'TODO: delete when able',
    dialogSmallWidth:
        'Standard width for small dialogs like a confirmation dialog.',
    dialogSmallHeight:
        'Standard height for small dialogs like a confirmation dialog.',
    dialogSmallMaxHeight:
        'Standard maximum height for small dialogs like a confirmation dialog.',
    dialogLargeWidth: 'Standard width for large dialogs.',
    dialogLargeHeight: 'Standard height for large dialogs.',
    dialogLargeMaxHeight: 'Standard maximum height for large dialogs.',
    menuMinWidth: 'Standard menu min width for menu popup.',
    bannerGapSize: 'Space between stacked banners',
    spinnerSmallHeight: 'Small height (16px) for a spinner component',
    spinnerMediumHeight: 'Medium height (32px) for a spinner component',
    spinnerLargeHeight: 'Large height (64px) for a spinner component',
    tableFitRowsHeight:
        'The height of the table when all rows are visible. It is set automatically to the correct value within the scope of each table.',
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
    headlineFont: 'Font shorthand for the "Headline_1" base token',
    headlineFontColor: 'Font color for the "Headline_1" base token',
    headlineDisabledFontColor:
        'Disabled font color for the "Headline_1" base token',
    headlineFontFamily: 'Font family for the "Headline_1" base token',
    headlineFontSize: 'Font size for the "Headline_1" base token',
    headlineFontWeight: 'Font weight for the "Headline_1" base token',
    headlineFontLineHeight: 'Font line height for the "Headline_1" base token',
    tableHeaderFont: 'Font shorthand for the "Grid_Header" base token',
    tableHeaderFontColor: 'Font color for the "Grid_Header" base token',
    tableHeaderDisabledFontColor:
        'Disabled font color for the "Grid_Header" base token',
    tableHeaderFontFamily: 'Font family for the "Grid_Header" base token',
    tableHeaderFontSize: 'Font size for the "Grid_Header" base token',
    tableHeaderFontWeight: 'Font weight for the "Grid_Header" base token',
    tableHeaderFontLineHeight:
        'Font line height for the "Grid_Header" base token',
    titlePlus2Font: 'Font shorthand for the "Title_3" base token',
    titlePlus2FontColor: 'Font color for the "Title_3" base token',
    titlePlus2DisabledFontColor:
        'Disabled font color for the "Title_3" base token',
    titlePlus2FontFamily: 'Font family for the "Title_3" base token',
    titlePlus2FontSize: 'Font size for the "Title_3" base token',
    titlePlus2FontWeight: 'Font weight for the "Title_3" base token',
    titlePlus2FontLineHeight: 'Font line height for the "Title_3" base token',
    titlePlus1Font: 'Font shorthand for the "Title_2" base token',
    titlePlus1FontColor: 'Font color for the "Title_2" base token',
    titlePlus1DisabledFontColor:
        'Disabled font color for the "Title_2" base token',
    titlePlus1FontFamily: 'Font family for the "Title_2" base token',
    titlePlus1FontSize: 'Font size for the "Title_2" base token',
    titlePlus1FontWeight: 'Font weight for the "Title_2" base token',
    titlePlus1FontLineHeight: 'Font line height for the "Title_2" base token',
    titleFont: 'Font shorthand for the "Title_1" base token',
    titleFontColor: 'Font color for the "Title_1" base token',
    titleDisabledFontColor: 'Disabled font color for the "Title_1" base token',
    titleFontFamily: 'Font family for the "Title_1" base token',
    titleFontSize: 'Font size for the "Title_1" base token',
    titleFontWeight: 'Font weight for the "Title_1" base token',
    titleFontLineHeight: 'Font line height for the "Title_1" base token',
    subtitlePlus1Font: 'Font shorthand for the "Subtitle_2" base token',
    subtitlePlus1FontColor: 'Font color for the "Subtitle_2" base token',
    subtitlePlus1DisabledFontColor:
        'Disabled font color for the "Subtitle_2" base token',
    subtitlePlus1FontFamily: 'Font family for the "Subtitle_2" base token',
    subtitlePlus1FontSize: 'Font size for the "Subitle_2" base token',
    subtitlePlus1FontWeight: 'Font weight for the "Subtitle_2" base token',
    subtitlePlus1FontLineHeight:
        'Font line height for the "Subtitle_2" base token',
    subtitleFont: 'Font shorthand for the "Subtitle_1" base token',
    subtitleFontColor: 'Font color for the "Subtitle_1" base token',
    subtitleDisabledFontColor:
        'Disabled font color for the "Subtitle_1" base token',
    subtitleFontFamily: 'Font family for the "Subtitle_1" base token',
    subtitleFontSize: 'Font size for the "Subitle_1" base token',
    subtitleFontWeight: 'Font weight for the "Subtitle_1" base token',
    subtitleFontLineHeight: 'Font line height for the "Subtitle_1" base token',
    linkFont: 'Font shorthand for links',
    linkFontColor: 'Font color for links',
    linkDisabledFontColor: 'Disabled font color for links',
    linkFontFamily: 'Font family for links',
    linkFontSize: 'Font size for links',
    linkFontWeight: 'Font weight for links',
    linkFontLineHeight: 'Font line height for links',
    linkActiveFont: 'Font shorthand for active links',
    linkActiveFontColor: 'Font color for active links',
    linkActiveDisabledFontColor: 'Disabled font color for active links',
    linkActiveFontFamily: 'Font family for active links',
    linkActiveFontSize: 'Font size for active links',
    linkActiveFontWeight: 'Font weight for active links',
    linkActiveFontLineHeight: 'Font line height for active links',
    linkProminentFont: 'Font shorthand for prominent links',
    linkProminentFontColor: 'Font color for prominent links',
    linkProminentDisabledFontColor: 'Disabled font color for prominent links',
    linkProminentFontFamily: 'Font family for prominent links',
    linkProminentFontSize: 'Font size for prominent links',
    linkProminentFontWeight: 'Font weight for prominent links',
    linkProminentFontLineHeight: 'Font line height for prominent links',
    linkActiveProminentFont: 'Font shorthand for active prominent links',
    linkActiveProminentFontColor: 'Font color for active prominent links',
    linkActiveProminentDisabledFontColor:
        'Disabled font color for active prominent links',
    linkActiveProminentFontFamily: 'Font family for active prominent links',
    linkActiveProminentFontSize: 'Font size for active prominent links',
    linkActiveProminentFontWeight: 'Font weight for active prominent links',
    linkActiveProminentFontLineHeight:
        'Font line height for active prominent links',
    placeholderFont: 'Font shorthand for the "Placeholder" base token',
    placeholderFontColor: 'Font color for the "Placeholder" base token',
    placeholderDisabledFontColor:
        'Disabled font color for the "Placeholder" base token',
    placeholderFontFamily: 'Font family for the "Placeholder" base token',
    placeholderFontSize: 'Font size for the "Placeholder" base token',
    placeholderFontWeight: 'Font weight for the "Placeholder" base token',
    placeholderFontLineHeight:
        'Font line height for the "Placeholder" base token',
    bodyFont: 'Font shorthand for the "Body" base token',
    bodyFontColor: 'Font color for the "Body" base token',
    bodyDisabledFontColor: 'Disabled font color for the "Body" base token',
    bodyFontFamily: 'Font family for the "Body" base token',
    bodyFontSize: 'Font size for the "Body" base token',
    bodyFontWeight: 'Font weight for the "Body" base token',
    bodyFontLineHeight: 'Font line height for the "Body" base token',
    bodyEmphasizedFont: 'Font shorthand for the "BodyEmphasized" base token',
    bodyEmphasizedFontColor: 'Font color for the "BodyEmphasized" base token',
    bodyEmphasizedDisabledFontColor:
        'Disabled font color for the "BodyEmphasized" base token',
    bodyEmphasizedFontFamily: 'Font family for the "BodyEmphasized" base token',
    bodyEmphasizedFontSize: 'Font size for the "BodyEmphasized" base token',
    bodyEmphasizedFontWeight: 'Font weight for the "BodyEmphasized" base token',
    bodyEmphasizedFontLineHeight:
        'Font line height for the "BodyEmphasized" base token',
    bodyPlus1Font: 'Font shorthand for the "Body_2" base token',
    bodyPlus1FontColor: 'Font color for the "Body_2" base token',
    bodyPlus1DisabledFontColor:
        'Disabled font color for the "Body_2" base token',
    bodyPlus1FontFamily: 'Font family for the "Body_2" base token',
    bodyPlus1FontSize: 'Font size for the "Body_2" base token',
    bodyPlus1FontWeight: 'Font weight for the "Body_2" base token',
    bodyPlus1FontLineHeight: 'Font line height for the "Body_2" base token',
    bodyPlus1EmphasizedFont:
        'Font shorthand for the "BodyEmphasized_2" base token',
    bodyPlus1EmphasizedFontColor:
        'Font color for the "BodyEmphasized_2" base token',
    bodyPlus1EmphasizedDisabledFontColor:
        'Disabled font color for the "BodyEmphasized_2" base token',
    bodyPlus1EmphasizedFontFamily:
        'Font family for the "BodyEmphasized_2" base token',
    bodyPlus1EmphasizedFontSize:
        'Font size for the "BodyEmphasized_2" base token',
    bodyPlus1EmphasizedFontWeight:
        'Font weight for the "BodyEmphasized_2" base token',
    bodyPlus1EmphasizedFontLineHeight:
        'Font line height for the "BodyEmphasized_2" base token',
    groupHeaderFont: 'Font shorthand for the "Group_Header_1" base token',
    groupHeaderFontColor: 'Font color for the "Group_Header_1" base token',
    groupHeaderDisabledFontColor:
        'Disabled font color for the"Group_Header_1" base token',
    groupHeaderFontFamily: 'Font family for the "Group_Header_1" base token',
    groupHeaderFontSize: 'Font size for the "Group_Header_1" base token',
    groupHeaderFontWeight: 'Font weight for the "Group_Header_1" base token',
    groupHeaderFontLineHeight:
        'Font line height for the "Group_Header_1" base token',
    controlLabelFont: 'Font shorthand for the "Control_Label_1" base token',
    controlLabelFontColor: 'Font color for the "Control_Label_1" base token',
    controlLabelDisabledFontColor:
        'Disabled font color for the "Control_Label_1" base token',
    controlLabelFontFamily: 'Font family for the "Control_Label_1" base token',
    controlLabelFontSize: 'Font size for the "Control_Label_1" base token',
    controlLabelFontWeight: 'Font weight for the "Control_Label_1" base token',
    controlLabelFontLineHeight:
        'Font line height for the "Control_Label_1" base token',
    buttonLabelFont: 'Font shorthand for the "Button_Label_1" base token',
    buttonLabelFontColor: 'Font color for the "Button_Label_1" base token',
    buttonLabelDisabledFontColor:
        'Disabled font color for the "Button_Label_1" base token',
    buttonLabelFontFamily: 'Font family for the "Button_Label_1" base token',
    buttonLabelFontSize: 'Font size for the "Button_Label_1" base token',
    buttonLabelFontWeight: 'Font weight for the "Button_Label_1" base token',
    buttonLabelFontLineHeight:
        'Font line height for the "Button_Label_1" base token',
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
    tableRowBorderColor: 'Color for the border of rows in the table',
    elevation1BoxShadow:
        'The box shadow for elevation 1. Used for component hover states.',
    elevation2BoxShadow:
        'The box shadow for elevation 2. Used for components such as menus, banners, tooltips, error notifications, and scrolling.',
    elevation3BoxShadow:
        'The box shadow for elevation 3. Used for components such as dialogs, overlays, and pop-ups.',
    graphGridlineColor: 'Gridline color for graphs',
    graphTrace1Color: 'Color for the first graph trace',
    graphTrace2Color: 'Color for the second graph trace',
    graphTrace3Color: 'Color for the third graph trace',
    graphTrace4Color: 'Color for the fourth graph trace',
    graphTrace5Color: 'Color for the fifth graph trace',
    graphTrace6Color: 'Color for the sixth graph trace',
    graphTrace7Color: 'Color for the seventh graph trace',
    graphTrace8Color: 'Color for the eighth graph trace',
    mentionFont: 'Font shorthand for mention views',
    mentionFontColor: 'Font color for mention views',
    mentionDisabledFontColor: 'Disabled font color for mention views',
    mentionFontFamily: 'Font family for mention views',
    mentionFontSize: 'Font size for mention views',
    mentionFontWeight: 'Font weight for mention views',
    mentionFontLineHeight: 'Font line height for mention views',
    calendarEventBackgroundStaticColor:
        'Background color for static calendar events',
    calendarEventBackgroundDynamicColor:
        'Background color for dynamic calendar events',
    calendarEventBackgroundTransientColor:
        'Background color for transient calendar events',
    calendarEventBorderStaticColor: 'Border color for static calendar events',
    calendarEventBorderTransientColor:
        'Border color for transient calendar events',
    calendarEventStaticFontColor: 'Font color for static calendar events',
    calendarEventDynamicFontColor: 'Font color for dynamic calendar events',
    calendarEventTransientFontColor: 'Font color for transient calendar events',
    calendarEventBackgroundHoverStaticColor:
        'Color while hovering static calendar events',
    calendarEventBackgroundHoverDynamicColor:
        'Color while hovering dynamic calendar events',
    calendarEventBackgroundHoverTransientColor:
        'Color while hovering transient calendar events',
    calendarEventOuterBorderHighlightedColor:
        'Outer border color for calendar events when highlighted',
    calendarRowBackgroundSelectedColor:
        'Background color while calendar resource is selected/highlighted',
    calendarRowBackgroundConflictColor:
        'Background color for the calendar resource when its events are in conflict',
    calendarEventFillBlockedColor:
        'Background fill to indicate the occupied slots in calendar resource rows',
    calendarGrabHandleBackgroundColor:
        'Background fill color for the editable calendar event grab handle',
    calendarGridBorderColor: 'Border color for the calendar grid',
    calendarGroupHeaderBackgroundColor:
        'Background color for the calendar resource group header'
};
