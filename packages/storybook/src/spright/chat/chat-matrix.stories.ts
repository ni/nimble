import type { StoryFn, Meta } from '@storybook/html';
import { html, ViewTemplate } from '@microsoft/fast-element';
import { chatMessageTag } from '../../../../spright-components/src/chat/message';
import { ChatMessageType } from '../../../../spright-components/src/chat/types';
import {
    createMatrix,
    sharedMatrixParameters,
    createMatrixThemeStory
} from '../../utilities/matrix';
import { createStory } from '../../utilities/storybook';
import { hiddenWrapper } from '../../utilities/hidden';
import { loremIpsum } from '../../utilities/lorem-ipsum';
import { richTextViewerTag } from '../../../../nimble-components/src/rich-text/viewer';
import { chatConversationTag } from '../../../../spright-components/src/chat/conversation';
import { textCustomizationWrapper } from '../../utilities/text-customization';

const chatMessageTypes = [
    ['outbound', ChatMessageType.outbound],
    ['inbound', ChatMessageType.inbound],
    ['system', ChatMessageType.system]
] as const;
type ChatMessageTypeState = (typeof chatMessageTypes)[number];

const metadata: Meta = {
    title: 'Tests Spright/Chat',
    parameters: {
        ...sharedMatrixParameters()
    }
};

export default metadata;

const multiLineMessage = `
Introduction to TestStand

NI TestStand is a flexible and open test management framework for building, customizing, and deploying a full-featured test management system.

**TestStand Sequence Editor**

The sequence editor is a development environment in which you create, edit, execute, and debug sequences and the tests sequences call. Use the sequence editor to access all features, such as step types and process models. Refer to the Process Models section of this tutorial for more information about process models.

You can debug a sequence using the following techniques, similar to how you debug in application development environments (ADEs) such as LabVIEW, LabWindows/CVI (ANSI), and Microsoft Visual Studio:

- Setting breakpoints
- Stepping into, out of, or over steps
- Tracing through program executions
- Displaying variables
- Monitoring variables, expressions, and output messages during executions
- Performing static analysis of sequence files to locate errors and enforce coding guidelines

In the sequence editor, you can start multiple concurrent executions, execute multiple instances of the same sequence, or execute different sequences at the same time. Each execution instance opens an Execution window. In Trace Mode, the Execution window shows the steps in the currently executing sequence. If the execution suspends, the Execution window shows the next step to execute and provides debugging options.

In the sequence editor, you can fully customize the pane and tab layout to optimize development and debugging tasks. You can also customize the menus, toolbars, and keyboard shortcuts.
`;

const component = ([
    chatMessageTypeName,
    messageType
]: ChatMessageTypeState): ViewTemplate => html`

    <${chatMessageTag}
        message-type=${() => messageType}>
            ${() => `Message Type: ${chatMessageTypeName}`}</${chatMessageTag}>
`;

const differentChatMessageSizeTestCase = (
    [message]: [string],
    [messageType]: [string]
): ViewTemplate => html`
    <${chatMessageTag}
        message-type=${() => messageType}
        style="outline: 1px dashed red; margin: 0px 20px 20px 0px">
        <${richTextViewerTag}
            :markdown="${_ => message}">
        </${richTextViewerTag}
    </${chatMessageTag}>
`;

const messageWithFixSizeTestCase = (
    [message]: [string],
    [messageType]: [string]
): ViewTemplate => html`
    <${chatMessageTag}
        message-type=${() => messageType}
        style="outline: 1px dashed red; margin: 0px 20px 20px 0px">
        <${richTextViewerTag}
            style="width: 400px; height: 80px;"
            :markdown="${_ => message}">
        </${richTextViewerTag}
    </${chatMessageTag}>
`;

const differentChatConversationSizeTestCase = ([message]: [
    string
]): ViewTemplate => html`
    <${chatConversationTag}
        style="width: 900px; height: 400px; margin: 0px 0px 5px 0px">
        <${chatMessageTag} message-type='outbound' style="outline: 1px dashed red;">
            <${richTextViewerTag} :markdown="${_x => message}"></${richTextViewerTag}>
        </${chatMessageTag}>
        <${chatMessageTag} message-type='inbound' style="outline: 1px dashed red;">
            <${richTextViewerTag} :markdown="${_x => message}"></${richTextViewerTag}>
        </${chatMessageTag}>
        <${chatMessageTag} message-type='system' style="outline: 1px dashed red;">
            <${richTextViewerTag} :markdown="${_x => message}"></${richTextViewerTag}>
        </${chatMessageTag}>
    </${chatConversationTag}>
`;

export const messageThemeMatrix: StoryFn = createMatrixThemeStory(
    createMatrix(component, [chatMessageTypes])
);

export const messageTinySizing: StoryFn = createStory(html`
    ${createMatrix(differentChatMessageSizeTestCase, [
        [['a']],
        [['outbound'], ['inbound'], ['system']]
    ])}
`);

export const messageExtraWideSizing: StoryFn = createStory(html`
    ${createMatrix(differentChatMessageSizeTestCase, [
        [[loremIpsum]],
        [['outbound'], ['inbound'], ['system']]
    ])}
`);

export const messageWithFixedSizeSizing: StoryFn = createStory(html`
    ${createMatrix(messageWithFixSizeTestCase, [
        [[loremIpsum]],
        [['outbound'], ['inbound'], ['system']]
    ])}
`);

export const messageManyLinesSizing: StoryFn = createStory(html`
    ${createMatrix(differentChatMessageSizeTestCase, [
        [[multiLineMessage]],
        [['outbound'], ['inbound'], ['system']]
    ])}
`);

export const conversationTinySizing: StoryFn = createStory(html`
    ${createMatrix(differentChatConversationSizeTestCase, [[['a']]])}
`);

export const conversationExtraWideSizing: StoryFn = createStory(html`
    ${createMatrix(differentChatConversationSizeTestCase, [[[loremIpsum]]])}
`);

export const conversationManyLinesSizing: StoryFn = createStory(html`
    ${createMatrix(differentChatConversationSizeTestCase, [
        [[multiLineMessage]]
    ])}
`);

export const messageHidden: StoryFn = createStory(
    hiddenWrapper(
        html`<${chatMessageTag} hidden>Hidden Chat Message</${chatMessageTag}>`
    )
);

export const conversationHidden: StoryFn = createStory(
    hiddenWrapper(
        html`<${chatConversationTag} hidden>Hidden Chat Conversation</${chatConversationTag}>`
    )
);

export const messageTextCustomized: StoryFn = createMatrixThemeStory(
    textCustomizationWrapper(
        html`<${chatMessageTag}>Message</${chatMessageTag}>`
    )
);
