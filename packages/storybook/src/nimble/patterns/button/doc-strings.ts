import { iconDescription as baseIconDescription } from '../../../utilities/storybook';

export const appearanceDescription = 'This attribute affects the appearance of the button.';

export const appearanceVariantDescription = 'This attribute has no effect on buttons with a `ghost` appearance. There is no `accent` appearance-variant for the `color` UI.';

export const contentHiddenDescription = 'When set, this attribute hides the text and end icon, leaving only the start icon visible.';

export const iconDescription = `${baseIconDescription} When \`content-hidden\` is set the icon will be displayed instead of the text content.

<details>
    <summary>Icon Usage</summary>
    Icons should be consistent and only used when necessary.

    <ul>
        <li>Icon and text buttons: 
            <br/>Use a label plus icon to help reinforce a button's functionality, and increase the visual impact of the action.  
            It should promote additional clarity, and should not be used solely for decoration. 
        </li>
        <br/>
        <li>Icon only buttons: 
            <br/>Use primarily for the purpose of limited space, and when the button's action is common and expected.
            <br/>Replicate the usage to create patterns, but do not assume the user will understand the icon's meaning.
            <br/>When a label isn't present, use a tooltip to give extra information.
        </li>
        <li>
            <h4>
                Be sure to use consistent label and icon styling for groups of buttons. Do not mix button types with grouped items.
            </h4>
        </li>
    </ul>
</details>`;

// 'Set `slot="end"` to include an icon after the text content.'
export const endIconDescription = 'Set `slot="end"` to include an icon after the text content. This icon will be hidden when `content-hidden` is set to `true`.';
