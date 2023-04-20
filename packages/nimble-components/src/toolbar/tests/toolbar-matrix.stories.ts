import type { StoryFn, Meta } from '@storybook/html';
import { html } from '@microsoft/fast-element';
import { sharedMatrixParameters } from '../../utilities/tests/matrix';
import {
    createMatrixThemeStory,
    createStory
} from '../../utilities/tests/storybook';
import { hiddenWrapper } from '../../utilities/tests/hidden';
import { toolbarTag } from '..';
import { buttonTag } from '../../button';
import { iconArrowRotateRightTag } from '../../icons/arrow-rotate-right';
import { iconCogTag } from '../../icons/cog';
import { iconEyeTag } from '../../icons/eye';
import { iconFilterTag } from '../../icons/filter';
import { iconPencilTag } from '../../icons/pencil';
import { iconThumbtackTag } from '../../icons/thumbtack';
import { iconTrashTag } from '../../icons/trash';

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
