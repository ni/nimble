export const appearanceDescription = `This attribute affects the appearance of the button. 

<details>
    <summary>Appearance Usage</summary>
    There is a hierarchy to which button appearance should be used.
    <ul>
        <li>For appearance \`ghost\`:
            <br/>This is the default and standard option for buttons. They create an open / airy feel, and fit comfortably in tight spaces.
            <br/>Be careful when using that the surrounding context does not confuse this button for emphasized body text, tabs, or a standalone link. 
            <br/>Use this in combination with a primary outline and primary block buttons to create a hierarchy of importance.
        </li>
        <br/>
        <li>For appearance \`outline\`:
            <br/>This is an alternative standard button when a ghost button is not suitable, and a more visually direct button is needed. 
            <br/>This can also create a light and airy feel. Use in combination with ghost buttons to create hierarchy. Do not use in combination with block buttons.
        </li>                
        <li>For appearance \`block\`:
            <br/>This standard button should be used when the most visible solution is required. 
            <br/>It can be an alternative to overly subtle button solutions when it is important to emphasize an action and the functionality of the control.
            <br/>Use in combination with ghost buttons to create hierarchy. Do not use in combination with outline buttons.
        </li>
    </ul>
</details>
`;

export const appearanceVariantDescription = `This attribute has no effect on buttons with a \`ghost\` appearance. The appearance variant \`primary-accent\` has no effect on buttons using the "color" theme.

<details>
    <summary>Primary Button Usage</summary>
    Make a button primary to distinguish it visibly for one of the following reasons:
    <ul>
        <li>to indicate the action that allows the user to accomplish their most common or important goal</li>
        <li>to indicate the action that allows the user to complete their task</li>
    </ul>
</details>
`;

export const contentHiddenDescription = 'When set, this attribute hides the text and end icon, leaving only the start icon visible.';

export const iconDescription = `When including an icon, set \`slot="start"\` on the icon to ensure proper styling.

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

export const endIconDescription = `When including an icon after the text content, set \`slot="end"\` on the icon to ensure proper styling.

This icon will be hidden when \`contentHidden\` is set to \`true\`
.`;
