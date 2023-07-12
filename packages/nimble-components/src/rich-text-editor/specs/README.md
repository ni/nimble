# Nimble Rich Text Editor and Nimble Rich Text Viewer

## Overview

-   The `nimble-rich-text-editor` component is a text editing tool that offers a comprehensive range of functionalities for
    incorporating rich text content. It provides users with the ability to apply different text styles and formats to their content.
-   The `nimble-rich-text-viewer` component is a way to view all the rich text content.

### Background

Collaboration is a key requirement in order for users to adopt a tool at scale and would help improve overall customer satisfaction with the product.
The Comment Feature, designed for adding and viewing comments with rich text content, should be generic enough to be reused in several workflows.
Therefore, it is essential to develop web components that allow users to view and create rich text content, enabling their use in various scenarios,
including Comments and other instances that necessitate rich text capabilities.

[Nimble issue #1288](https://github.com/ni/nimble/issues/1288)

[Comments UI mockup](https://www.figma.com/proto/Q5SU1OwrnD08keon3zObRX/SystemLink?type=design&node-id=6280-94118&scaling=min-zoom&page-id=2428%3A32954&starting-point-node-id=6280%3A94118&show-proto-sidebar=1)

[Comments Feature](https://dev.azure.com/ni/DevCentral/_backlogs/backlog/ASW%20SystemLink%20Platform/Initiatives/?workitem=2205215)

[Rich Text Editor FE Library Decision](https://dev.azure.com/ni/DevCentral/_git/Skyline?path=/docs/design-documents/Platform/Comments/Comments-FE-Library-Decision.md&version=GBmaster&_a=preview)

### Non-goals

-   Blazor integration will be initially out of scope for this component as we have no experience in Blazor component development or other
    related technology. Blazor example app addition will also be not covered in this spec.

### Features

Both components provide support for the following basic text formatting options:

1. Bold
2. Italics
3. Numbered List
4. Bulleted List

The `nimble-rich-text-editor` component will also offer APIs and interactive methods to format text in the following ways:

1. Using the buttons located below the editor to modify the text formatting for the selected texts.
2. Using the keyboard shortcuts to modify the text formatting in the editor.
3. The underlying representation of the editor is a markdown value in the flavor of [CommonMark](http://commonmark.org/).
4. Support to get and set markdown value through an API.

The `nimble-rich-text-viewer` provides support for converting the input markdown value to HTML in order to render it in the viewer component.

#### _Additional features out of scope of this spec_

-   Allowing the user to tag or mention by entering `@` in the editor and selecting the user name from the drop-down list.
-   Support for adding images to the editor either by uploading or by pasting it.
-   Support for adding hyperlinks to the existing words in the editor.
-   Support for [striking out](https://tiptap.dev/api/marks/strike) and [underlining](https://tiptap.dev/api/marks/underline) text. We use the
    [prosemirror-markdown](https://github.com/ProseMirror/prosemirror-markdown) serializer and parser to convert the text into markdown format and vice
    versa. However, the supported functionality of prosemirror-markdown, as mentioned in their
    [documentation](https://github.com/ProseMirror/prosemirror-markdown#documentation), does not include support for a strikeout and underline. To
    address this limitation, we need to extend the class and add the necessary nodes to both the serializer and parser which will be added in the
    subsequent releases.
-   Provide APIs to configure visibility/disabled state of toolbar buttons for a rich text editor.

### Risks and Challenges

-   Due to immediate requirements for comments feature from a business customer, any additional enhancements or requirements apart from whatever is
    mentioned in this spec are deferred to future scope.
-   Currently, we will begin by referring to the existing
    [Interaction design workflow](https://www.figma.com/proto/Q5SU1OwrnD08keon3zObRX/SystemLink?type=design&node-id=6280-94118&scaling=min-zoom&page-id=2428%3A32954&starting-point-node-id=6280%3A94118&show-proto-sidebar=1)
    of the comments feature. Once the visual design for these components is complete, we will then be implementing those specific changes within the defined
    scope of development. However, we will still make use of existing nimble components such as `nimble-toggle-button` and `nimble-text-area` to maintain a
    consistent design for the initial release.

### Prior Art/Examples

Sample Mockup Screenshots

_`nimble-rich-text-editor`_

![Editor](./spec-images/editor-sample.png)

_`nimble-rich-text-viewer`_

![Viewer](./spec-images/viewer-sample.png)

## Design

### `nimble-rich-text-editor`

The `nimble-rich-text-editor` will be divided into two sections namely an `editor` section and a `footer` section.

1. `editor` section is the actual text area to add or update rich text content.
2. `footer` section consists of `nimble-toggle-button` to control each text formatting functionalities like bold, italic, etc, and a
   `footer-actions` slot element which is typically used to add action buttons to the right bottom of the component.

Example usage of the `nimble-rich-text-editor` in the application layer is as follows:

```html
<nimble-rich-text-editor>
    <nimble-button slot="footer-actions">Cancel</nimble-button>
    <nimble-button slot="footer-actions">Add Comment</nimble-button>
</nimble-rich-text-editor>
```

### API

_Props/Attrs_

-   `markdown` - is an accessor used to get and set the markdown value.
    -   `getter` - this will serialize the content by extracting the Node from the editor and convert it into a markdown string using
        [prosemirror-markdown serializer](https://github.com/ProseMirror/prosemirror-markdown/blob/master/src/to_markdown.ts#L30).
    -   `setter` - this will parse the markdown string into a Node and load it back into the editor using
        [prosemirror-markdown parser](https://github.com/ProseMirror/prosemirror-markdown/blob/master/src/from_markdown.ts#L199).
-   `isEmpty` - is a read-only property that indicates whether the editor is empty or not. This will be achieved through Tiptap's
    [isEmpty](https://tiptap.dev/api/editor#is-empty) API. The component and the Angular directive will have a getter method
    that can be used to bind it in the Angular application.
-   `fitToContent` - is a boolean attribute allows the text area to expand vertically to fit the content.

_Alternatives_

_Decision on choosing `markdown` as an accessor over methods_:

Initially, we thought of having `getMarkdown()` and `setMarkdown()` methods to retrieve and set the markdown string. We chose this approach
because converting the rich text content entered in the editor to a markdown string is an expensive operation and not wanted to trigger it as an
event for every change in the editor or as a property to enable two-way data binding for the client application.

However, we realized that we could achieve the same benefits by using an `accessor` instead, by incorporating the same functionality within the
`getters` and `setters`. Additionally, accessor provides a property-like syntax for clients, enabling one-way data binding and simplifying the syntax.
This allows clients to retrieve the `markdown` representation only when necessary, rather than for every single change. For a example use case, when the user
completes entering the entire content in the editor and clicks a button, the client can access the `markdown` output only once. This way the
application's performance is enhanced as the operation is performed only once, thus eliminating unnecessary reading of an accessor.

_Methods_

-   none

_Events_

-   `input` - event emitted when there is a change in the editor. This can be achieved through Tiptap's [update event](https://tiptap.dev/api/events#update).
    Below are a few scenarios to understand when this event will fire:

    1. This event will fired for every input in the content of the editor, including text inputs, text formatting changes, and text removals.
    2. This event will not fire when there are no changes made to the content of the editor. For example, all mouse events, selecting the texts, state
       changes, etc,

_CSS Classes and CSS Custom Properties that affect the component_

-   The minimum height of the component will be set to show at least one line in the text area along with a footer section. If the content exceeds
    the current height (set by the client), a vertical scrollbar will appear, allowing users to view the hidden content.
-   The minimum width of the component will be determined based on ensuring all buttons in the footer are visible. We have arrived to this decision
    to align with the minimal requirement for the initial release. However, adjustments will be made later based on the visual design for mobile view is complete.
-   The content in the text area will adjust its layout based on the width, potentially increasing the height of the editor. But in case of having
    a long nested lists that is beyond the current width (set by the client), a horizontal scrollbar will appear within the text area to view the content.
    If the `fitToContent` enabled, the text area will grow to fit the entered content in the editor section.
-   The client will determine the maximum height and width of the component. When the client does not override sizing, the component will have a default height and width.
-   The `formatting toolbar` in the footer section will occupy space based on the number of formatting buttons used. For the initial scope of this
    component, four formatting buttons will be included, following standard size and spacing guidelines. The `footer-actions` section will occupy the remaining
    space in the footer.

_Note_: This initial component design serves as a starting point for implementation, and it may undergo changes once the visual design is completed.

### Anatomy

_Shadow DOM template_

```html
<template>
    <section id="editor"></section>
    <footer>
        <section id="toolbar">
            <nimble-toolbar>
                <nimble-toggle-button></nimble-toggle-button>
            </nimble-toolbar>
            <slot name="footer-actions"></slot>
        </section>
    </footer>
</template>
```

_Slot Names_

-   `footer-actions`:
    1. It is a container that allows a client to easily place buttons at the right bottom of the component to interact with the editor.
    2. If no content is slotted in the `footer-actions`, the element will be emptied and shrunk to accommodate buttons from the
       toolbar.
    3. If the content is slotted in the footer-actions, it will occupy a maximum of thirty percent of the entire horizontal footer. If
       there are additional elements beyond this limit, they will be positioned below within the same footer-actions container.

_Note_: The positioning of these slot elements in the mobile view of the component has not yet been confirmed.

_Host Classes_

-   none

_Slotted Content/Slotted Classes_

-   none

_CSS Parts_

-   none

### `nimble-rich-text-viewer`

The `nimble-rich-text-viewer` is used for viewing rich text content when a markdown string is passed to it. It performs the post-processing
tasks to convert the markdown string to corresponding HTML nodes for each text formatting.

### API

_Props/Attrs_

-   `markdown` - is an accessor used to get and set the markdown value.
    -   `getter` - this will merely return the markdown string that is set to the component.
    -   `setter` - this will parse the markdown string into a Node using
        [prosemirror-markdown parser](https://github.com/ProseMirror/prosemirror-markdown/blob/master/src/from_markdown.ts#L199) and convert to an HTML to
        render it in the component section.
-   `fitToContent` - is a boolean attribute allows the text area to expand vertically to fit the content.

_Methods_

-   none

_Events_

-   none

_CSS Classes and CSS Custom Properties that affect the component_

-   The sizing behavior of the component will remain same as the editor component. The height of the component will grow to fit the content based
    on the `fitToContent` attribute.
-   The width of the component will be determined by the client. Reducing the width will cause the content to reflow, resulting in an increased height
    of the component or will enable the vertical scrollbar.

### Anatomy

_Slot Names_

-   none

_Host Classes_

-   none

_Slotted Content/Slotted Classes_

-   none

_CSS Parts_

-   none

### Angular integration

An Angular directive will be created for both components. Input and accessor APIs will be created for the attributes and properties and output event
emitters will be created for the events, similar to how it's done in other directives. The components will not have form
association, so a `ControlValueAccessor` will not be created.

### Blazor integration

A Blazor wrapper is initially out of scope for these components.

### Visual Appearance

Visual design has been requested is currently still pending.

## Implementation

We have chosen to utilize the [Tiptap](https://tiptap.dev/) rich text editor as the underlying third-party library for developing the
`nimble-rich-text-editor`. This decision was made due to its extensive range of customization options compared to other third-party libraries for rich
text editing, making it the ideal choice for meeting our specific use cases. For more details, refer
[Comments FE Library Decision](https://dev.azure.com/ni/DevCentral/_git/Skyline?path=/docs/design-documents/Platform/Comments/Comments-FE-Library-Decision.md&version=GBmaster&_a=preview)
document. Some of the highlighted points are mentioned below:

1. Includes all [basic functionalities](https://tiptap.dev/) like bold, italics, numbered and bulleted lists, etc.
2. Includes support to work seamlessly inside the `shadow root`.
3. [Tiptap](https://tiptap.dev/introduction) is built on top of ProseMirror and so has access to all the powerful APIs provided by
   ProseMirror through [`@tiptap/pm`](https://tiptap.dev/guide/prosemirror).
4. Includes support to render the content of the editor with markdown input.
5. Includes support to retrieve the content of the editor as HTML and Markdown output (using
   [prosemirror-markdown](https://github.com/ProseMirror/prosemirror-markdown)).
6. Includes extensions to support [@mention](https://tiptap.dev/api/nodes/mention) functionality (Future scope).

The `nimble-rich-text-editor` is initialized by creating an instance of the [Editor](https://tiptap.dev/api/editor#introduction) class from Tiptap's core
library. With that, we have access to all the APIs exposed, by utilizing some of their extensions like
[StarterKit](https://tiptap.dev/api/extensions/starter-kit) which is a collection of the most popular Tiptap extensions including bold, italics, and all
other basic rich text formatting options. All these formatting options can also be accessed individually through Tiptap's
[marks](https://tiptap.dev/api/marks) and [nodes](https://tiptap.dev/api/nodes).

-   The term `Marks` in the Tiptap are formatting styles applied to specific portions of text, such as bold, italic, or underlined.
-   `Nodes` in the Tiptap editor are the building blocks of the document structure, representing different types of content elements like paragraphs,
    headings, lists, images, and more.

The rich text content entered in the editor is converted to markdown output using
[prosemirror-markdown](https://github.com/ProseMirror/prosemirror-markdown) serializer. Here is the reference for the supported formatting schema in the
markdown based on [CommonMark](http://commonmark.org/) flavor:

-   Bold - `**Bold**`
-   Italics - `*Italics*`
-   Numbered list - `1. Numbered list`
-   Bulleted list - `* Bulleted list`

The `nimble-rich-text-viewer` will be responsible for converting the input markdown string to HTML Fragments with the help of
`prosemirror-markdown` parser, which is then converted to HTML string and rendered into the component to view all rich text content.

### Prototype

[`Tiptap prototype in Stackblitz`](https://stackblitz.com/edit/typescript-g3yfmo?file=index.ts)

The prototype includes the below functionalities,

1. Basic formatting support.
2. Image support. - The prototype includes [`Tiptap Extension`](https://tiptap.dev/api/nodes/image) to support images.
3. `@mention` support. - The prototype includes a default user list that gets triggered using `@` character.
4. Markdown support. - The prototype includes support to render/retrieve content in markdown format.
5. `Shadow root` support - The prototype uses [Microsoft Fast](https://github.com/microsoft/fast) to create the rich text editor as a
   custom component that renders in the shadow root.
6. `Top layer` support - Hyperlink using `nimble-dialog` which renders the popup in the top layer.

**_Note_**: This prototype is not made in a responsive fashion for smaller screens and is intended only for testing the specific functionalities listed
above.

### States

_Button State_

The buttons in the toolbar will indicate the formatting status of the selected text in the editor. We use the
[nimble-toggle-button](https://nimble.ni.dev/storybook/?path=/docs/toggle-button--docs) to determine whether it's in an active or inactive state.
Below is the sample screenshot which shows the active state of the `nimble-toggle-button` when the cursor is focused on the `Bold` and `Numbered` List`
text in the editor.

![Bold and Numbered Button State](./spec-images/button-state.png)

### Accessibility

[Tiptap Accessibility](https://tiptap.dev/guide/accessibility)

[Toolbar Accessibility](https://www.w3.org/WAI/ARIA/apg/patterns/toolbar/)

[Button Accessibility](https://www.w3.org/WAI/ARIA/apg/patterns/button/)

_Focus_

-   Focus state of the editor will be the same as the `nimble-text-area`.
-   Focus state of the buttons will be the same as the `nimble-toggle-button`.

_Keyboard accessibility and shortcuts for text formatting_

All the basic keyboard accessibility for the tiptap rich text editor is mentioned in their
[keyboard shortcut](https://tiptap.dev/api/keyboard-shortcuts#predefined-keyboard-shortcuts) page. To facilitate easy access, listed down
the supported text formatting keyboard shortcuts in the tiptap editor. All instances of the `Ctrl` key mentioned below will be substituted with the `Cmd` key
in macOS.

| Key                     | Behavior                                                 |
| ----------------------- | -------------------------------------------------------- |
| Tab                     | To reach the editor                                      |
| Shift + Arrow keys      | To select the group of texts in the editor               |
| Ctrl + B                | To make the selected text bold                           |
| Ctrl + I                | To make the selected text italic                         |
| Ctrl + Shift + 7        | To enable the focused paragraph a numbered list          |
| Ctrl + Shift + 8        | To enable the focused paragraph a bulleted list          |
| Tab (For lists)         | To create a sub point within a bulleted or numbered list |
| Shift + Tab (For lists) | To remove a sub point from a bulleted or numbered lists  |

_Keyboard navigation with toolbar buttons focused_

| Key             | Behavior                                                                       |
| --------------- | ------------------------------------------------------------------------------ |
| Space, Enter    | Enable the selected text formatting feature and return the focus to the editor |
| Right/Left keys | To move the focus forward/backward in the formatting options toolbar menu      |
| Tab             | To move the focus towards the footer action buttons                            |
| Shift + Tab     | To move the focus back to the editor                                           |

_Note_: All other keyboard interaction determined by the slotted element will not be defined in this document.

### Globalization

Currently, there is no need to localize any string data for this component. However, in the footer menu, a few icon buttons will have tooltip strings, which
will be implemented using the `title` attribute. To enable localization for these accessible strings, we will configure the titles in the buttons according to
the specifications outlined in [spec (#1272)](https://github.com/ni/nimble/pull/1272), once the issue (
[#1090](https://github.com/ni/nimble/issues/1090)) regarding the same is closed.

### Security

-   Prose mirror uses markdown-it for converting markdown to HTML and HTML to markdown. We will follow the
    [security guidelines of markdown-it](https://github.com/markdown-it/markdown-it/blob/master/docs/security.md#security) to turn
    off HTML at source as given in the [API docs](https://markdown-it.github.io/markdown-it/#MarkdownIt.new). Prosemirror-markdown follows the same as
    shown in this
    [specific line of code](https://github.com/ProseMirror/prosemirror-markdown/blob/26e58302399b7d9a9b3bc8fc3bf5807627ca29e5/src/from_markdown.ts#L245).
-   For additional safety, we may use [sanitize-html](https://www.npmjs.com/package/sanitize-html) package on a need basis if HTML is turned on. This will
    whitelist only specific HTML tags needed for rich text markdown.

### Performance

Performance of tiptap explained in an example of having [long texts](https://tiptap.dev/examples/book).

### Dependencies

This component is dependent on the [`tiptap`](https://tiptap.dev/) third party library. As mentioned,
[tiptap](https://tiptap.dev/introduction#why-should-i-use-tiptap) is built on top of prosemirror, we might also use some of the prosemirror's
library. For the currently supported features, we will include the following libraries that will be added to the package.json

-   [@tiptap/core](https://www.npmjs.com/package/@tiptap/core)
-   [@tiptap/pm](https://www.npmjs.com/package/@tiptap/pm)
-   [@tiptap/starter-kit](https://www.npmjs.com/package/@tiptap/starter-kit)

These packages will add up to a total space of approximately 800 KB in the components bundle. For more info see
[this discussion on Teams](https://teams.microsoft.com/l/message/19:b6a61b8a7ffd451696e0cbbb8976c03b@thread.skype/1686833093592?tenantId=87ba1f9a-44cd-43a6-b008-6fdb45a5204e&groupId=41626d4a-3f1f-49e2-abdc-f590be4a329d&parentMessageId=1686833093592&teamName=ASW%20SystemLink&channelName=LIMS&createdTime=1686833093592).

**_Note_**: For markdown parser and serializer, [prosemirror-markdown](https://github.com/ProseMirror/prosemirror-markdown) internal dependencies will be
installed along with this.

### Test Plan

The current testing plan involves writing unit tests to verify the core functionality of the component. All tests for this component will
follow the standards set by the nimble repository, which include unit tests to assess component logic and Chromatic tests to cover all
visual states of the component.

### Tooling

NA

### Documentation

As with other nimble components, a story will be added in storybook for the new component. Relevant documentation will be added there.

---

## Open Issues

-   none
