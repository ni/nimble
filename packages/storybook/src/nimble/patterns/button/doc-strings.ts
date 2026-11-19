import {
    textContentDescription as baseTextContentDescription,
    iconDescription as baseIconDescription
} from '../../../utilities/storybook';

export const textContentDescription = (options: {
    componentName: string
}): string => `${baseTextContentDescription(options)} Keep the text when using \`content-hidden\`; it provides the accessible name.`;

export const appearanceDescription = 'Choose the visual emphasis of the button.';

export const appearanceVariantDescription = 'Choose the color treatment for outline or block buttons. Ignored for ghost; accent is unavailable in the color theme.';

export const contentHiddenDescription = 'When set, this attribute hides the text and end icon, leaving only the start icon visible.';

export const iconDescription = `${baseIconDescription} With \`content-hidden\`, the start icon remains visible while the text and end icon are hidden.`;

// 'Set `slot="end"` to include an icon after the text content.'
export const endIconDescription = 'Set `slot="end"` to include an icon after the text content. This icon will be hidden when `content-hidden` is set to `true`.';
