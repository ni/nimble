import type { StoryFn, Meta } from '@storybook/html';
import { html } from '@microsoft/fast-element';
import { buttonTag } from '../../../../nimble-components/src/button';
import { iconArrowRotateRightTag } from '../../../../nimble-components/src/icons/arrow-rotate-right';
import { iconCogTag } from '../../../../nimble-components/src/icons/cog';
import { iconEyeTag } from '../../../../nimble-components/src/icons/eye';
import { iconFilterTag } from '../../../../nimble-components/src/icons/filter';
import { iconPencilTag } from '../../../../nimble-components/src/icons/pencil';
import { iconThumbtackTag } from '../../../../nimble-components/src/icons/thumbtack';
import { iconTrashTag } from '../../../../nimble-components/src/icons/trash';
import { toolbarTag } from '../../../../nimble-components/src/toolbar';
import { hiddenWrapper } from '../../utilities/hidden';
import { createStory } from '../../utilities/storybook';
import {
    sharedMatrixParameters,
    createMatrixThemeStory
} from '../../utilities/matrix';

const metadata: Meta = {
    title: 'Tests/Toolbar',
    parameters: {
        ...sharedMatrixParameters()
    }
};

export default metadata;

// prettier-ignore
const component = html`
    <${toolbarTag}>
        <${buttonTag} appearance="ghost" slot="start">
            <${iconEyeTag} slot="start"></${iconEyeTag}>
            View
        </${buttonTag}>
        <${buttonTag} disabled appearance="ghost" slot="start">
            <${iconTrashTag} slot="start"></${iconTrashTag}>
            Delete
        </${buttonTag}>
        <${buttonTag} appearance="ghost" slot="start">
            <${iconPencilTag} slot="start"></${iconPencilTag}>
            Edit
        </${buttonTag}>

        <${buttonTag} appearance="ghost">
            <${iconArrowRotateRightTag} slot="start"></${iconArrowRotateRightTag}>
            Refresh
        </${buttonTag}>
        <${buttonTag} appearance="ghost">
            <${iconThumbtackTag} slot="start"></${iconThumbtackTag}>
            Pin
        </${buttonTag}>

        <${buttonTag} appearance="ghost" content-hidden slot="end">
            <${iconCogTag} slot="start"></${iconCogTag}>
            Settings
        </${buttonTag}>
        <${buttonTag} appearance="ghost" content-hidden slot="end">
            <${iconFilterTag} slot="start"></${iconFilterTag}>
            Filter
        </${buttonTag}>
    </${toolbarTag}>
`;

export const toolbarThemeMatrix: StoryFn = createMatrixThemeStory(component);

export const hiddenToolbar: StoryFn = createStory(
    hiddenWrapper(html`<${toolbarTag} hidden>Hidden Toolbar</${toolbarTag}>`)
);
