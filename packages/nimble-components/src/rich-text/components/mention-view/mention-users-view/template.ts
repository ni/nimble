import { html, when } from '@microsoft/fast-element';
import type { RichTextMentionUsersView } from '.';
import { iconAtTag } from '../../../../icons/at';

export const template = html<RichTextMentionUsersView>`<template>
    ${when(
        x => !x.editing,
        html<RichTextMentionUsersView>`
    <span
        class="control"
        part="control"
><${iconAtTag}></${iconAtTag}>${x => x.mentionLabel}</span>
`
    )}<slot contenteditable="true"></slot
></template>`;
