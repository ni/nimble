export default {
    title: 'Internal/LLM API Reference',
    parameters: {
        docs: { page: null },
        previewTabs: {
            canvas: { hidden: true }
        }
    }
};

export const apiReference = {
    render: () => {
        const container = document.createElement('div');
        container.style.cssText = 'font-family: monospace; white-space: pre-wrap; padding: 20px; max-width: none; overflow-x: auto;';
        container.textContent = `# Nimble Design System API Reference

This document contains comprehensive API documentation for Nimble Design System components, generated from Storybook stories and optimized for LLM consumption.

**Generated:** 2025-09-19T00:06:07.519Z
**Components:** 56

## Component Index

- anchorButton (nimble): anchor-button
- anchorTabs (nimble): anchor-tabs
- anchor (nimble): anchor
- anchoredRegion (nimble): anchored-region
- banner (nimble): banner
- breadcrumb (nimble): breadcrumb
- button (nimble): button
- cardButton (nimble): card-button
- card (nimble): card
- checkbox (nimble): checkbox
- combobox (nimble): combobox
- dialog (nimble): dialog
- drawer (nimble): drawer
- iconCheck (nimble): icon-check
- tableColumnText (nimble): table-column-text
- labelProviderCore (nimble): label-provider-core
- labelProviderRichText (nimble): label-provider-rich-text
- labelProviderTable (nimble): label-provider-table
- listOption (nimble): list-option
- menuButton (nimble): menu-button
- menu (nimble): menu
- numberField (nimble): number-field
- tableColumnAnchor (nimble): table-column-anchor
- radioGroup (nimble): radio-group
- radio (nimble): radio
- mappingText (nimble): mapping-text
- richTextMentionUsersView (nimble): rich-text-mention-users-view
- richTextEditor (nimble): rich-text-editor
- richTextMentionListbox (nimble): rich-text-mention-listbox
- richTextViewer (nimble): rich-text-viewer
- select (nimble): select
- spinner (nimble): spinner
- switch (nimble): switch
- tableColumnDateText (nimble): table-column-date-text
- tableColumnDurationText (nimble): table-column-duration-text
- mappingEmpty (nimble): mapping-empty
- tableColumnMapping (nimble): table-column-mapping
- tableColumnMenuButton (nimble): table-column-menu-button
- menuItem (nimble): menu-item
- tableColumnNumberText (nimble): table-column-number-text
- table (nimble): table
- tabs (nimble): tabs
- textArea (nimble): text-area
- textField (nimble): text-field
- themeProvider (nimble): theme-provider
- toggleButton (nimble): toggle-button
- toolbar (nimble): toolbar
- tooltip (nimble): tooltip
- treeView (nimble): tree-view
- waferMap (nimble): wafer-map
- iconThumbUp (spright): icon-thumb-up
- iconThreeDotsLine (spright): icon-three-dots-line
- chatInput (spright): chat-input
- chatMessage (spright): chat-message
- iconThumbDown (nimble): icon-thumb-down
- rectangle (spright): rectangle

## Component Specifications


### anchorButton

**Component Library**: nimble (Core Design System)
**Package**: @ni/nimble-components
**Custom Element Tag**: anchor-button

**API Surface**:

Attributes:
- href: string
  - 
- appearance: string
  - 
- appearance-variant: string
  - 
- content-hidden: string
  - 
- disabled: string
  - 

Slots:
- default: 
- start: 
- end: 





---


### anchorTabs

**Component Library**: nimble (Core Design System)
**Package**: @ni/nimble-components
**Custom Element Tag**: anchor-tabs

**API Surface**:

Attributes:








---


### anchor

**Component Library**: nimble (Core Design System)
**Package**: @ni/nimble-components
**Custom Element Tag**: anchor

**API Surface**:

Attributes:
- href: string
  - 
- underline-hidden: string
  - Causes the underline to be hidden except on hover. Set this for anchors that are not part of blocks of text.
- appearance: string
  - Set to \`prominent\` to make the anchor appear in a different color than normal text. This has no effect under the Color theme.
- contenteditable: string
  - Set this to the string "true" (or an empty string)  when the anchor is within an editable region (i.e. element/hierarchy with [contenteditable](https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes/contenteditable)). Whereas native elements inherit their \`contenteditable\` value by default, the \`nimble-anchor\` requires this attribute be explicitly set.

Slots:
- default: The text to display in the anchor.





---


### anchoredRegion

**Component Library**: nimble (Core Design System)
**Package**: @ni/nimble-components
**Custom Element Tag**: anchored-region

**API Surface**:

Attributes:
- horizontalPosition: start | end | left | right | center | unset
  - 
  - Options: start, end, left, right, center, unset
- verticalPosition: top | bottom | center | unset
  - 
  - Options: top, bottom, center, unset







---


### banner

**Component Library**: nimble (Core Design System)
**Package**: @ni/nimble-components
**Custom Element Tag**: banner

**API Surface**:

Attributes:








---


### breadcrumb

**Component Library**: nimble (Core Design System)
**Package**: @ni/nimble-components
**Custom Element Tag**: breadcrumb

**API Surface**:

Attributes:








---


### button

**Component Library**: nimble (Core Design System)
**Package**: @ni/nimble-components
**Custom Element Tag**: button

**API Surface**:

Attributes:
- appearance: string
  - 
- appearance-variant: string
  - 
- content-hidden: string
  - 
- disabled: string
  - 

Slots:
- default: 
- start: 
- end: 

Events:
- click: string - Event emitted when the button is activated by either keyboard or mouse.



---


### cardButton

**Component Library**: nimble (Core Design System)
**Package**: @ni/nimble-components
**Custom Element Tag**: card-button

**API Surface**:

Attributes:
- disabled: string
  - 
- selected: string
  - Styles the card button to indicate it is selected.

Slots:
- default: The card button allows arbitrary HTML child content in its default slot.

Events:
- click: string - Event emitted when the card button is activated by either keyboard or mouse.



---


### card

**Component Library**: nimble (Core Design System)
**Package**: @ni/nimble-components
**Custom Element Tag**: card

**API Surface**:

Attributes:


Slots:
- title: Text displayed as a title inside the card. This text should be short enough to fit within two lines when displayed. Cards should **always include a title**. The title is used to provide an accessible name to assistive technologies.
- default: Content to be displayed inside the card.





---


### checkbox

**Component Library**: nimble (Core Design System)
**Package**: @ni/nimble-components
**Custom Element Tag**: checkbox

**API Surface**:

Attributes:
- checked: string
  - Whether the checkbox is initially checked. Setting this attribute after the checkbox initializes will not affect its visual state. Note that the \`checked\` property behaves differently than the \`checked\` attribute.
- disabled: string
  - 
- error-text: string
  - 
- error-visible: string
  - 

Slots:
- default: 

Events:
- change: string - Event emitted when the user checks or unchecks the checkbox.



---


### combobox

**Component Library**: nimble (Core Design System)
**Package**: @ni/nimble-components
**Custom Element Tag**: combobox

**API Surface**:

Attributes:
- autocomplete: string
  - 
- position: above | below
  - 
  - Options: above, below
- appearance: string
  - 
- full-bleed: string
  - 
- disabled: string
  - 
- appearance-readonly: string
  - 
- error-text: string
  - 
- error-visible: string
  - 
- placeholder: string
  - 
- required-visible: string
  - 

Slots:
- default: 
- default: 

Events:
- change: string - Emitted when the user changes the selected option, either by selecting an item from the dropdown or by committing a typed value.
- input: string - Emitted when the user types in the combobox. Use this event if you need to update the list of options based on the text input.



---


### dialog

**Component Library**: nimble (Core Design System)
**Package**: @ni/nimble-components
**Custom Element Tag**: dialog

**API Surface**:

Attributes:
- prevent-dismiss: string
  - 
- header-hidden: string
  - Setting \`header-hidden\` hides the title and subtitle of the dialog and allows the main content of the dialog to fill the space that would otherwise be reserved for the header. A title (and optionally a subtitle) should still be provided when \`header-hidden\` is set to ensure the dialog has a label that can be used by assistive technologies.
- footer-hidden: string
  - Setting \`footer-hidden\` hides the footer of the dialog and any content that has been slotted within it. Setting \`footer-hidden\` also allows the main content of the dialog to fill the space that would otherwise be reserved for the footer.
- openAndHandleResult: string
  - 

Slots:
- title: Primary text that is displayed in the header when \`header-hidden\` is not set. Dialogs should **always include a title** even when \`header-hidden\` is set. The title is used to provide an accessible name to assistive technologies regardless of the value of \`header-hidden\`.<br><br>The title should be specified using an \`inline\` element, such as a \`<span>\`.
- subtitle: Secondary text that is displayed in the header when \`header-hidden\` is not set. If a dialog has an appropriate value to set for the subtitle, it should be included even when \`header-hidden\` is set. If the subtitle is set, it is used with the title to provide an accessible name to assistive technologies regardless of the value of \`header-hidden\`.<br><br>The subtitle should be specified using an \`inline\` element, such as a \`<span>\`.
- default: The dialog content, which can be arbitrary HTML.
- footer: Content like buttons which appear at the bottom of the dialog.



Methods:
- show()(string) - Call this member function to open the dialog. It returns a \`Promise\` that is resolved when the dialog is closed. The resolved value is either the reason passed to \`close(...)\` or the symbol \`UserDismissed\` if the dialog was dismissed via the \`Esc\` key.
- close(reason)(string) - Call this member function to close the dialog. It takes an optional \`reason\` value which can be any type. This value is returned from \`show()\` via a \`Promise\`.

---


### drawer

**Component Library**: nimble (Core Design System)
**Package**: @ni/nimble-components
**Custom Element Tag**: drawer

**API Surface**:

Attributes:
- location: left | right
  - The side of the screen from which the drawer will slide in
  - Options: left, right
- prevent-dismiss: string
  - 
- drawerRef: string
  - 
- textFieldRef: string
  - 
- openAndHandleResult: string
  - 

Slots:
- content: The drawer content, which can be arbitrary HTML.



Methods:
- show()(string) - Call this member function to open the drawer. It returns a \`Promise\` that is resolved when the drawer is closed. The resolved value is either the reason passed to \`close(...)\` or the symbol \`UserDismissed\` if the drawer was dismissed via the \`Esc\` key.
- close(reason)(string) - Call this member function to close the drawer. It takes an optional \`reason\` value which can be any type. This value is returned from \`show()\` via a \`Promise\`.

---


### iconCheck

**Component Library**: nimble (Core Design System)
**Package**: @ni/nimble-components
**Custom Element Tag**: icon-check

**API Surface**:

Attributes:








---


### tableColumnText

**Component Library**: nimble (Core Design System)
**Package**: @ni/nimble-components
**Custom Element Tag**: table-column-text

**API Surface**:

Attributes:
- selectionMode: string
  - 







---


### labelProviderCore

**Component Library**: nimble (Core Design System)
**Package**: @ni/nimble-components
**Custom Element Tag**: label-provider-core

**API Surface**:

Attributes:








---


### labelProviderRichText

**Component Library**: nimble (Core Design System)
**Package**: @ni/nimble-components
**Custom Element Tag**: label-provider-rich-text

**API Surface**:

Attributes:








---


### labelProviderTable

**Component Library**: nimble (Core Design System)
**Package**: @ni/nimble-components
**Custom Element Tag**: label-provider-table

**API Surface**:

Attributes:








---


### listOption

**Component Library**: nimble (Core Design System)
**Package**: @ni/nimble-components
**Custom Element Tag**: list-option

**API Surface**:

Attributes:








---


### menuButton

**Component Library**: nimble (Core Design System)
**Package**: @ni/nimble-components
**Custom Element Tag**: menu-button

**API Surface**:

Attributes:
- appearance: string
  - 
- appearance-variant: string
  - 
- open: string
  - Opens the menu.
- disabled: string
  - 
- content-hidden: string
  - 
- menu-position: string
  - The position of the menu relative to the button.

Slots:
- default: 
- start: 
- end: 
- menu: The [nimble-menu](./?path=/docs/components-menu--docs) to be displayed when the button is toggled.

Events:
- toggle: string - Event emitted after the menu button is toggled.
- beforetoggle: string - Event emitted before the menu button is toggled. This can be used to populate the menu before it is opened.
- change: string - Bubbling event emitted by a menu item child when selected. Easier to listen for the event on parent menu button than on each menu item child.



---


### menu

**Component Library**: nimble (Core Design System)
**Package**: @ni/nimble-components
**Custom Element Tag**: menu

**API Surface**:

Attributes:








---


### numberField

**Component Library**: nimble (Core Design System)
**Package**: @ni/nimble-components
**Custom Element Tag**: number-field

**API Surface**:

Attributes:
- placeholder: string
  - 
- appearance: string
  - 
- full-bleed: string
  - 
- readonly: string
  - 
- disabled: string
  - 
- appearance-readonly: string
  - 
- step: string
  - The amount to increase or decrease the value when a step button is pressed.
- hide-step: string
  - Configures the visibility of the increment and decrement step buttons. Consider hiding the buttons if the input values will commonly have varied levels of precision (for example both integers and decimal numbers).
- min: string
  - The minimum value that can be set.
- max: string
  - The maximum value that can be set.
- error-visible: string
  - 
- error-text: string
  - 
- required-visible: string
  - 

Slots:
- default: 

Events:
- change: string - Event emitted when the user commits a new value to the number field.
- input: string - Event emitted on each user keystroke within the number field.



---


### tableColumnAnchor

**Component Library**: nimble (Core Design System)
**Package**: @ni/nimble-components
**Custom Element Tag**: table-column-anchor

**API Surface**:

Attributes:
- tableRef: string
  - 
- setTableData: string
  - 
- richTextViewerRef: string
  - 
- setRichTextViewerData: string
  - 







---


### radioGroup

**Component Library**: nimble (Core Design System)
**Package**: @ni/nimble-components
**Custom Element Tag**: radio-group

**API Surface**:

Attributes:








---


### radio

**Component Library**: nimble (Core Design System)
**Package**: @ni/nimble-components
**Custom Element Tag**: radio

**API Surface**:

Attributes:








---


### mappingText

**Component Library**: nimble (Core Design System)
**Package**: @ni/nimble-components
**Custom Element Tag**: mapping-text

**API Surface**:

Attributes:








---


### richTextMentionUsersView

**Component Library**: nimble (Core Design System)
**Package**: @ni/nimble-components
**Custom Element Tag**: rich-text-mention-users-view

**API Surface**:

Attributes:








---


### richTextEditor

**Component Library**: nimble (Core Design System)
**Package**: @ni/nimble-components
**Custom Element Tag**: rich-text-editor

**API Surface**:

Attributes:
- editorRef: string
  - 
- setMarkdownData: string
  - 
- disabled: string
  - 
- errorVisible: string
  - 
- errorText: string
  - 
- placeholder: string
  - 
- footerHidden: string
  - Hides the footer section which consists of all formatting option buttons and the \`footer-actions\` slot content.

Slots:
- default: 
- footer-actions: 

Events:
- input: string - Event emitted when there is a change in the content of the editor.

Methods:
- setMarkdown(value)(string) - 
- getMarkdown()(string) - 
- getMentionedHrefs()(string) - Returns an array of strings listing the hrefs of current mentions in the rich text components.
- checkValidity()(string) - 

---


### richTextMentionListbox

**Component Library**: nimble (Core Design System)
**Package**: @ni/nimble-components
**Custom Element Tag**: rich-text-mention-listbox

**API Surface**:

Attributes:








---


### richTextViewer

**Component Library**: nimble (Core Design System)
**Package**: @ni/nimble-components
**Custom Element Tag**: rich-text-viewer

**API Surface**:

Attributes:
- markdown: string
  - Input markdown string for the supported text formatting options in a [CommonMark](https://commonmark.org/) flavor.

Slots:
- default: 



Methods:
- checkValidity()(string) - 
- getMentionedHrefs()(string) - Returns an array of strings listing the hrefs of current mentions in the rich text components.

---


### select

**Component Library**: nimble (Core Design System)
**Package**: @ni/nimble-components
**Custom Element Tag**: select

**API Surface**:

Attributes:
- position: above | below
  - 
  - Options: above, below
- appearance: string
  - 
- full-bleed: string
  - 
- filter-mode: string
  - 
- disabled: string
  - 
- appearance-readonly: string
  - 
- error-text: string
  - 
- error-visible: string
  - 
- clearable: string
  - 
- loading-visible: string
  - 
- required-visible: string
  - 

Slots:
- default: 
- default: 

Events:
- change: string - Emitted when the user changes the selected option.
- filter-input: string - Emitted when the user types in the filter input.



---


### spinner

**Component Library**: nimble (Core Design System)
**Package**: @ni/nimble-components
**Custom Element Tag**: spinner

**API Surface**:

Attributes:
- appearance: string
  - 







---


### switch

**Component Library**: nimble (Core Design System)
**Package**: @ni/nimble-components
**Custom Element Tag**: switch

**API Surface**:

Attributes:
- checked: string
  - Whether the switch is toggled on.
- disabled: string
  - 

Slots:
- default: 
- checked-message: A \`span\` element containing the message to display when the switch is toggled on.
- unchecked-message: A \`span\` element containing the message to display when the switch is toggled off.

Events:
- change: string - Event emitted when the user toggles the switch.



---


### tableColumnDateText

**Component Library**: nimble (Core Design System)
**Package**: @ni/nimble-components
**Custom Element Tag**: table-column-date-text

**API Surface**:

Attributes:
- selectionMode: string
  - 







---


### tableColumnDurationText

**Component Library**: nimble (Core Design System)
**Package**: @ni/nimble-components
**Custom Element Tag**: table-column-duration-text

**API Surface**:

Attributes:
- selectionMode: string
  - 







---


### mappingEmpty

**Component Library**: nimble (Core Design System)
**Package**: @ni/nimble-components
**Custom Element Tag**: mapping-empty

**API Surface**:

Attributes:








---


### tableColumnMapping

**Component Library**: nimble (Core Design System)
**Package**: @ni/nimble-components
**Custom Element Tag**: table-column-mapping

**API Surface**:

Attributes:








---


### tableColumnMenuButton

**Component Library**: nimble (Core Design System)
**Package**: @ni/nimble-components
**Custom Element Tag**: table-column-menu-button

**API Surface**:

Attributes:








---


### menuItem

**Component Library**: nimble (Core Design System)
**Package**: @ni/nimble-components
**Custom Element Tag**: menu-item

**API Surface**:

Attributes:
- selectionMode: string
  - 







---


### tableColumnNumberText

**Component Library**: nimble (Core Design System)
**Package**: @ni/nimble-components
**Custom Element Tag**: table-column-number-text

**API Surface**:

Attributes:
- selectionMode: string
  - 







---


### table

**Component Library**: nimble (Core Design System)
**Package**: @ni/nimble-components
**Custom Element Tag**: table

**API Surface**:

Attributes:
- tableRef: string
  - 
- updateData: string
  - 







---


### tabs

**Component Library**: nimble (Core Design System)
**Package**: @ni/nimble-components
**Custom Element Tag**: tabs

**API Surface**:

Attributes:








---


### textArea

**Component Library**: nimble (Core Design System)
**Package**: @ni/nimble-components
**Custom Element Tag**: text-area

**API Surface**:

Attributes:
- appearance: string
  - 
- placeholder: string
  - 
- readonly: string
  - Disallows input on the text area while maintaining enabled appearance.
- disabled: string
  - 
- appearance-readonly: string
  - 
- error-text: string
  - 
- error-visible: string
  - 
- spellcheck: string
  - Specifies whether the text area is subject to spell checking by the underlying browser/OS.
- resize: string
  - Direction(s) the text area is sizeable by the user. Setting a fixed \`height\` and \`width\` on the text area is not supported while it is sizeable. You may instead use \`rows\` and \`cols\` to set an initial size.
- rows: string
  - Number of visible rows of text.
- cols: string
  - Visible width of the text, in average character widths
- maxlength: string
  - Maximum number of characters that may be entered by the user
- required-visible: string
  - 

Slots:
- default: 

Events:
- change: string - Event emitted when the user commits a new value to the text area.
- input: string - Event emitted on each user keystroke within the text area.



---


### textField

**Component Library**: nimble (Core Design System)
**Package**: @ni/nimble-components
**Custom Element Tag**: text-field

**API Surface**:

Attributes:
- placeholder: string
  - 
- type: string
  - They type of input to accept and render in the text field. This corresponds to [the \`type\` attribute of the native \`input\` element](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input#type) though only a subset of values are supported.
- appearance: string
  - 
- full-bleed: string
  - 
- value: string
  - The initial string displayed in the text field. Changing this after the text field initializes has no effect. Note that the property behaves differently.
- readonly: string
  - 
- disabled: string
  - 
- appearance-readonly: string
  - 
- error-visible: string
  - 
- error-text: string
  - 
- required-visible: string
  - 

Slots:
- default: 
- actions: 
- start: 

Events:
- change: string - Event emitted when the user commits a new value to the text field.
- input: string - Event emitted on each user keystroke within the text field.



---


### themeProvider

**Component Library**: nimble (Core Design System)
**Package**: @ni/nimble-components
**Custom Element Tag**: theme-provider

**API Surface**:

Attributes:
- selectionMode: string
  - 







---


### toggleButton

**Component Library**: nimble (Core Design System)
**Package**: @ni/nimble-components
**Custom Element Tag**: toggle-button

**API Surface**:

Attributes:
- appearance: string
  - 
- appearance-variant: string
  - 
- content-hidden: string
  - 
- disabled: string
  - 
- checked: string
  - Whether the toggle button is pressed (on) or not pressed (off).

Slots:
- default: 
- start: 
- end: 

Events:
- change: string - Event emitted when the toggle button is pressed via mouse or keyboard.



---


### toolbar

**Component Library**: nimble (Core Design System)
**Package**: @ni/nimble-components
**Custom Element Tag**: toolbar

**API Surface**:

Attributes:


Slots:
- start: Content which will be positioned at the start of the toolbar.
- end: Content which will be positioned at the end of the toolbar.





---


### tooltip

**Component Library**: nimble (Core Design System)
**Package**: @ni/nimble-components
**Custom Element Tag**: tooltip

**API Surface**:

Attributes:
- visible: string
  - Whether the tooltip is visible by default.
- auto-update-mode: anchor | auto
  - Controls when the tooltip updates its position. The default is \`anchor\`, which only updates when the anchor is resized. \`auto\` will update on scroll/resize events.
  - Options: anchor, auto
- icon-visible: string
  - Whether to show an icon in the tooltip. The icon is determined by the severity of the tooltip.
- delay: string
  - The delay in milliseconds before a tooltip is shown after a hover event
- severity: string
  - The severity of the message presented by the tooltip.
- anchorRef: string
  - 
- getUniqueId: string
  - 

Slots:
- default: The content to display in the tooltip.





---


### treeView

**Component Library**: nimble (Core Design System)
**Package**: @ni/nimble-components
**Custom Element Tag**: tree-view

**API Surface**:

Attributes:








---


### waferMap

**Component Library**: nimble (Core Design System)
**Package**: @ni/nimble-components
**Custom Element Tag**: wafer-map

**API Surface**:

Attributes:
- API Version: stable | experimental = "stable"
  - Select the API version of the component. The stable version is the one that is recommended for production use, while the experimental version is the one that is still under development and is not recommended for production use. The default value is \`stable\`. To enable the Experimental API in code, the \`diesTable\` should be used in place of the \`dies\`.
  - Options: stable, experimental
- color-scale-mode: string
  - Enum value that determines if the color scale represents continuous gradient values (linear), or is set categorically (ordinal).
- die-labels-hidden: string
  - Boolean value that determines if the dies labels in the wafer map view are shown or not. Default value is false.
- die-labels-suffix: string
  - String that can be added as a label at the end of each wafer map die value
- max-characters: string
  - Represents the number of characters allowed to be displayed within a single die. As the die values are represented by Floating point numbers, we must have the liberty of limiting how many characters we are willing to display within a single die.
- orientation: string
  - Notch orientation
- origin-location: string
  - Represents the starting point and the direction of the two axes, X and Y, which are used for displaying the die grid on the wafer map canvas.
- grid-min-x: string
  - Represents the X coordinate of the minimum corner of the the grid bounding box for rendering the wafer map. Leaving the value \`undefined\` will set the value to the minimum X value of the bounding box of the input dies coordinates.
- grid-max-x: string
  - Represents the X coordinate of the maximum corner of the the grid bounding box for rendering the wafer map. Leaving the value \`undefined\` will set the value to the maximum X value of the bounding box of the input dies coordinates.
- grid-min-y: string
  - Represents the Y coordinate of the minimum corner of the the grid bounding box for rendering the wafer map. Leaving the value \`undefined\` will set the value to the minimum Y value of the bounding box of the input dies coordinates.
- grid-max-y: string
  - Represents the Y coordinate of the maximum corner of the the grid bounding box for rendering the wafer map. Leaving the value \`undefined\` will set the value to the maximum Y value of the bounding box of the input dies coordinates.



Events:
- die-hover: string - Event emitted whenever the mouse enters or leaves a die. In the event data, \`detail.currentDie\` will be set to the \`WaferMapDie\` element of the \`dies\` array that is being hovered or \`undefined\` if the mouse is leaving a die.

Methods:
- checkValidity()(string) - 
- setData(data)(string) - Used to set data to the wafer map. Part of the Experimental API. The \`data\` parameter is an apache-arrow \`Table\`.

---


### iconThumbUp

**Component Library**: spright (SPRIGHT)
**Package**: @ni/spright-components
**Custom Element Tag**: icon-thumb-up

**API Surface**:

Attributes:








---


### iconThreeDotsLine

**Component Library**: spright (SPRIGHT)
**Package**: @ni/spright-components
**Custom Element Tag**: icon-three-dots-line

**API Surface**:

Attributes:








---


### chatInput

**Component Library**: spright (SPRIGHT)
**Package**: @ni/spright-components
**Custom Element Tag**: chat-input

**API Surface**:

Attributes:








---


### chatMessage

**Component Library**: spright (SPRIGHT)
**Package**: @ni/spright-components
**Custom Element Tag**: chat-message

**API Surface**:

Attributes:








---


### iconThumbDown

**Component Library**: nimble (Core Design System)
**Package**: @ni/nimble-components
**Custom Element Tag**: icon-thumb-down

**API Surface**:

Attributes:
- message-type: string
  - The type of the chat message.

Slots:
- footer-actions: 
- end: 





---


### rectangle

**Component Library**: spright (SPRIGHT)
**Package**: @ni/spright-components
**Custom Element Tag**: rectangle

**API Surface**:

Attributes:
- disabled: string
  - 

Slots:
- text: The text to display in the rectangle.





---

`;
        return container;
    }
};
