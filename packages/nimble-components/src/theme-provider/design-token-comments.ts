import type * as TokensNamespace from './design-tokens';

type TokenName = keyof typeof TokensNamespace;

export const comments: { readonly [key in TokenName]: string } = {
    actionColorRgbPartial: 'e.g. Outline button border color',
    backgroundLevel3Color: 'Background color for dialogs and menus',
    backgroundLevel2Color: 'Background color for application headers',
    backgroundLevel1Color: 'Primary background color for the application',
    fillColorSelected: 'Control fill color when a control is selected',
    fillColorSelectedRgbPartial:
        '*-partial tokens are used with rgba() to set color transparency in component or application stylesheets',
    fillColorSelectedHover:
        'Control fill color when hovering a selected control',
    fillColorHover: 'Control fill color when hoving component',
    borderColor: 'e.g. Checkbox border color',
    borderColorRgbPartial:
        '*-partial tokens are used with rgba() to set color transparency in component or application stylesheets',
    failColor: 'Used to highlight errors or invalid input',
    warningColor:
        'Used to highlight invalid input or for icons to indicate that a process errored or failed',
    passColor:
        'Used to highlight a correct state or the successful completion of a process',
    borderColorHover: 'Border color when hovering component',
    highlightEnterpriseColor:
        'Used to sparingly bring Enterprise color to application stylesheets',
    iconColor: 'Equivalent to the font color for icons',
    popupBoxShadowColor: 'Shadow color for menus and dialog boxes',
    popupBorderColor: 'Border color for menus and dialog boxes',
    controlHeight:
        'Standard layout height for all controls. Add 16px for labels on top.',
    standardPadding: 'Standard layout padding for components',
    labelHeight: 'Standard label height for components',
    borderWidth: 'e.g. Checkbox border width',
    iconSize: 'Standard layout height for all icons',
    groupHeader1TextTransform: 'CSS text-transform string to use for headers',
    drawerWidth: 'TODO: delete when able',
    smallDelay:
        'Elements with small transition areas, such as icons and selection controls, have short durations.',
    mediumDelay:
        'Elements with larger transition areas, such as bottom sheets and expanding chips, have slightly longer durations.',
    largeDelay:
        'Animated elements that traverse a large portion of the screen have the longest durations.',
    headline2Font: 'Headline_2 font shorthand',
    headline1Font: 'Headline_1 font shorthand',
    title3Font: 'Title_3 font shorthand',
    title2Font: 'Title_2 font shorthand',
    title1Font: 'Title_1 font shorthand',
    subtitle2Font: 'Subtitle_2 font shorthand',
    subtitle1Font: 'Subtitle_1 font shorthand',
    linkStandard1Font: 'Link_Standard_1 font shorthand',
    placeholderFont: 'Placeholder font shorthand',
    bodyEmphasizedFont: 'Body_Emphasized font shorthand',
    bodyFont: 'Body font shorthand',
    groupHeader1Font: 'Group_Header_1 font shorthand',
    controlLabel1Font: 'Control_Label_1 font shorthand',
    buttonLabel1Font: 'Button_Label_1 font shorthand',
    tooltipCaptionFont: 'Tooltip_Caption font shorthand',
    headline2FontColor: 'Headline_2 regular font color',
    headline1FontColor: 'Headline_1 regular font color',
    title3FontColor: 'Title_3 regular font color',
    title2FontColor: 'Title_2 regular font color',
    title1FontColor: 'Title_1 regular font color',
    subtitle2FontColor: 'Subtitle_2 regular font color',
    subtitle1FontColor: 'Subtitle_1 regular font color',
    standard1FontColor: 'Link_Standard_1 regular font color',
    placeholderFontColor: 'Placeholder regular font color',
    bodyEmphasizedFontColor: 'Body_Emphasized regular font color',
    bodyFontColor: 'Body regular font color',
    groupHeader1FontColor: 'Group_Header_1 regular font color',
    controlLabel1FontColor: 'Control_Label_1 regular font color',
    buttonLabel1FontColor: 'Button_Label_1 regular font color',
    tooltipCaptionFontColor: 'Tooltip_Caption regular font color',
    headline2FontColorDisabled: 'Headline_2 disabled font color',
    headline1FontColorDisabled: 'Headline_1 disabled font color',
    title3FontColorDisabled: 'Title_3 disabled font color',
    title2FontColorDisabled: 'Title_2 disabled font color',
    title1FontColorDisabled: 'Title_1 disabled font color',
    subtitle2FontColorDisabled: 'Subtitle_2 disabled font color',
    subtitle1FontColorDisabled: 'Subtitle_1 disabled font color',
    standard1FontColorDisabled: 'Link_Standard_1 disabled font color',
    placeholderFontColorDisabled: 'Placeholder disabled font color',
    bodyEmphasizedFontColorDisabled: 'Body_Emphasized disabled font color',
    bodyFontColorDisabled: 'Body disabled font color',
    groupHeader1FontColorDisabled: 'Group_Header_1 disabled font color',
    controlLabel1FontColorDisabled: 'Control_Label_1 disabled font color',
    buttonLabel1FontColorDisabled: 'Button_Label_1 disabled font color',
    tooltipCaptionFontColorDisabled: 'Tooltip_Caption disabled font color'
};
