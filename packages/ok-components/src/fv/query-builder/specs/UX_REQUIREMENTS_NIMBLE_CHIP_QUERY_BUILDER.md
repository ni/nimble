# UX Requirements: Token-Based Query Builder

## 1. Purpose

This document defines the user experience requirements for a compact, componentized, token-based query builder. The initial implementation focuses on the reusable query editor, not the complete builder workflow. It covers user workflows, interaction behavior, feedback, accessibility, and error handling.

The query builder should feel like editing a sentence in a text field:

- Conditions are represented as interactive chips.
- A text caret can move between chips.
- Users can type at the caret to insert a condition.
- Users can remove adjacent conditions with standard keyboard commands.
- Parentheses create logical groups.
- AND/OR chips define how conditions and groups relate.

The experience should support both guided users who prefer buttons and experienced users who prefer keyboard input.

---

## 2. Experience Goals

### 2.1 Primary goals

1. **Make simple queries fast to create**
   - A user should be able to create a condition without understanding query syntax.
   - Field autocomplete should reduce typing and prevent invalid field names.

2. **Make complex queries easy to scan**
   - Conditions should read as short, recognizable statements.
   - Logical relationships and group boundaries should remain visually clear.

3. **Support fluid keyboard editing**
   - The query should behave like a token-aware text editor.
   - Users should be able to navigate, insert, edit, and delete without switching to the pointer.

4. **Keep advanced functionality discoverable**
   - Add filter should remain available; a dedicated Add group action can follow later.
   - Keyboard shortcuts should be additive, not required.

5. **Prevent invalid queries**
   - Field and operator choices should come from valid options.
   - Incomplete and invalid conditions should be clearly identified before application.

### 2.2 Non-goals

- Writing or exposing a formal query language.
- Drag-and-drop condition reordering.
- Nested groups deeper than one visible grouping level.
- Automatically applying a query while it is incomplete.
- Requiring users to memorize keyboard shortcuts.

### 2.3 Component boundaries and initial scope

Componentize the builder around these responsibilities:

- **Query builder**: composes the query editor with optional saved-query, AI, and Clear/Cancel/Apply workflows.
- **Query editor**: owns the inline condition chips, AND/OR chips, parentheses, caret, autocomplete, and condition-editing popover. It must be usable without the surrounding builder workflows.
- **Expandable chip**: provides the reusable block-style chip interaction for opening a popover. Reuse existing chip capabilities where they meet the requirements; otherwise introduce `ok-fv-expandable-chip` rather than implementing a query-specific chip interaction.

The initial implementation targets the **QUERY CONDITIONS** area in the screenshot shared at 2:02.20: a single input-like editing surface containing `Status is any of Failed, Error`, an `AND` chip, and `Duration (ms) > 500`, with Add filter beneath it. Use the screenshot for the editor layout and expandable condition-chip affordance, not as a requirement to reproduce the entire builder.

Initial scope includes:

- Block-style condition chips with a down-arrow affordance and an editing popover.
- Regular text-input-like caret placement, typing, navigation, and deletion.
- Field autocomplete and context-aware AND/OR autocomplete.
- Distinct background colors for AND and OR chips.
- Parentheses defining filter groups, with minimal inline visual styling.
- Add filter, condition validation, and keyboard and accessibility support for these editor workflows.

Full-clause interpretation (section 8), dedicated Add group and contextual group removal actions (sections 12.2 and 12.4), saved queries (section 14), AI assistance (section 15), and Clear/Cancel/Apply workflows (section 16) are follow-on builder capabilities, not initial implementation requirements. Requirements referencing those capabilities apply when they are introduced.

---

## 3. Core Mental Model

The query field is a token editor containing:

1. Condition chips
2. AND/OR chips
3. Literal parentheses marking group boundaries
4. A movable text caret

The caret represents the current insertion point. It may appear:

- Before the first token
- Between adjacent tokens, including logic chips and parentheses
- After the last token
- Inside the active group

Typing creates content at the caret position rather than always appending to the end.

---

## 4. Query Condition Model

Each condition consists of:

1. **Field**
   - Example: `Status`
2. **Operator**
   - Example: `is any of`
3. **Value**
   - Example: `Failed, Error`

A complete condition should read naturally:

> Status is any of Failed, Error

### 4.1 Chip labels

Complete chip labels should include the field, operator, and value, and prioritize readability over displaying every detail. Emphasize the operator in bold text.

Examples:

- `Status is any of Failed, Error`
- `Duration (ms) > 500`
- `Workspace is Production`
- `Passed is True`

For a long multi-value condition:

- Show the first two values.
- Show the remaining count, such as `+3`.

For an incomplete condition:

- Show the selected field, operator, and a clear prompt, such as `Status is any of choose a value`.
- Use a visually distinct incomplete treatment.

---

## 5. Query Field Behavior

### 5.1 Default state

The query field must always be available, including when there are no conditions.

When empty:

- Show the text caret.
- Do not show placeholder text or a decorative input icon inside the field; provide guidance through the label or helper text.
- Keep the Add filter button available.

When the user types:

- The text input should expand to fit the typed content.
- Existing chips should reflow naturally.
- Autocomplete should remain anchored to the typed content.

### 5.2 Input feel and chip styling

Use the [ok-fv-chip-selector Storybook story](http://localhost:6006/?path=/story/ok-fv-chip-selector--fv-chip-selector) as the reference for block chip styling, inline text entry, wrapping, and the overall feel of a regular text input.

- Present one continuous input-like surface, not a row of separate input boxes.
- Use the existing chip's `block` appearance for condition chips rather than outlined or pill-shaped condition chips.
- Keep the caret visible at the current insertion point and let typed text flow naturally alongside the chips.
- Clicking unused space in the field should focus the editor and place the caret at the nearest valid insertion point.
- Keep normal text editing behavior while text is present; token navigation and deletion apply at token boundaries.
- Reuse the selector's visual patterns without requiring its value-picker semantics or copying its permanent remove buttons.

### 5.3 Pointer placement

Users should be able to click between chips to move the caret to that location.

The clickable insertion area should:

- Be large enough to target without introducing a visible permanent control.
- Show a subtle insertion indicator on hover.
- Place keyboard focus into the text caret after selection.

---

## 6. Keyboard Interaction Model

### 6.1 Moving the caret

When the caret contains no text:

- **Left Arrow** moves the caret one token position to the left.
- **Right Arrow** moves the caret one token position to the right.
- Movement stops at the beginning and end of the query.

Caret movement should preserve keyboard focus.

### 6.2 Inserting at the caret

Typing begins autocomplete at the current caret location. Depending on the query context, users can insert a condition or an AND/OR chip; parentheses insert group boundaries.

When the condition is committed:

- Insert the new chip at the caret.
- Move the caret after the inserted chip.
- Preserve the surrounding condition order.
- Update separators as needed.

### 6.3 Deleting adjacent chips

When the caret contains no text:

- **Backspace** removes the token immediately before the caret.
- **Delete** removes the token immediately after the caret.

After deletion:

- Keep focus in the query field.
- Keep the caret at the logical deletion position.
- Remove empty groups when appropriate.
- Preserve the remaining logical relationships.
- If deleting a logic chip or parenthesis leaves incomplete syntax, keep that state visible for correction rather than silently changing the query's meaning.

When the user is typing text:

- Backspace and Delete should edit the text normally.
- They should not remove chips until the typed text is empty.

### 6.4 Deleting a focused chip

When a chip itself has focus:

- **Backspace** or **Delete** removes that chip.
- The chip should not require a permanent remove icon.
- Focus should return to the query field at the removed chip’s position.

### 6.5 Escape

Escape should close the active popover or autocomplete menu without modifying the condition.

Focus should return to the element that opened the dismissed surface.

---

## 7. Field and Logic Autocomplete

### 7.1 Trigger

Field autocomplete appears as soon as typed text matches one or more available fields at the caret position.

Matching should:

- Ignore capitalization.
- Match field labels.
- Match common field identifiers or aliases where applicable.
- Support partial text within a field label.

Example:

> Typing `stat` should show `Status`.

After a condition or closing parenthesis, typing a partial case-insensitive AND/OR label should show matching logical-operator options in the autocomplete dropdown. Do not render or insert a logic chip while the prefix is being typed; insert it only after the user selects a suggestion. At the start of the query, after an opening parenthesis, or after a logical operator, field autocomplete should be offered instead of logic autocomplete.

### 7.2 Result presentation

Each field result should show:

- Field name
- Field category
- Field type, when useful for disambiguation

Each logic result should show the localized AND or OR label and identify it as a logical operator.

The top result should be selected and visibly highlighted by default so users can tell that Enter will select it.

### 7.3 Keyboard selection

When autocomplete is open:

- **Down Arrow** moves to the next result.
- **Up Arrow** moves to the previous result.
- Navigation wraps between the first and last result.
- **Tab** selects the highlighted result.
- **Enter** selects the highlighted result.
- **Escape** closes the result list.

### 7.4 Pointer selection

Hovering a result should update the highlighted result.

Clicking a result should behave the same as keyboard selection.

### 7.5 After field selection

Selecting a field should:

1. Create an incomplete chip at the caret position.
2. Clear the typed autocomplete text.
3. Open the condition editor for the new chip.
4. Move focus into the editor.

The user can then choose an operator and value without reopening the chip.

### 7.6 After logic selection

- Match AND and OR case-insensitively, including partial text such as `an` and `o`.
- Use the same pointer, arrow-key, Tab, and Enter selection behavior as field autocomplete.
- Insert the selected AND or OR chip at the caret, clear the typed text, and place the caret after the chip.
- Do not open the condition editor for a logic chip.
- If an automatically supplied separator already occupies that boundary, replace it rather than creating a duplicate.

---

## 8. Full-Clause Typing

Users may type more than a field name.

Examples:

- `Status is Failed`
- `Duration > 500`
- `Workspace is Production`

When the user commits a recognizable clause:

- Convert it into a condition chip.
- Insert it at the caret position.
- Preserve recognized field, operator, and value information.

When the clause cannot be confidently interpreted:

- Do not silently create an incorrect condition.
- Prefer opening the condition editor with the best matching field.
- Retain the user’s input when possible.
- Explain what still needs to be selected.

---

## 9. Condition Editor

### 9.1 Opening

The condition editor opens when:

- A chip is clicked.
- A focused chip is activated with Enter or Space.
- A field is selected from autocomplete.
- Add filter creates a new incomplete condition.

Position the condition editor below its activating chip, with the panel's top-left aligned to the chip's left edge. Use the supplied callout design: a white, square-cornered panel with a thin border, soft shadow, and 30×15px upward pointer centered on the chip.

Condition chips must visibly indicate that they open an editing popover:

- Show a down-arrow icon at the end of the chip.
- Provide a hover treatment and pointer cursor to communicate clickability.
- Make the whole chip activatable, not just the arrow.
- Provide a visible keyboard focus treatment and expose the popover's expanded state accessibly.
- Keep the arrow decorative for assistive technology; the chip's accessible name must communicate the condition and edit action.

If the existing chip cannot provide this block styling and accessible expandable interaction, create `ok-fv-expandable-chip` as the reusable component. Keep field, operator, and value editing in the query editor's popover rather than in the generic chip.

### 9.2 Editor contents

The editor should provide:

1. Field selection
2. Operator selection
3. Value input
4. Inline validation feedback
5. A Done action

### 9.3 Field changes

Changing the field should:

- Update the available operators.
- Select a valid default operator.
- Clear incompatible values.
- Clear errors associated with the previous field.

### 9.4 Operator changes

Changing the operator should:

- Preserve the value when it remains compatible.
- Clear or transform the value when the expected input shape changes.
- Update the value control appropriately.

For example, changing from a single-value operator to a multi-value operator should enable multiple values.

### 9.5 Completing an edit

The editor closes when the user:

- Selects Done.
- Presses Escape.
- Clicks outside the editor.

After closing:

- Return focus to the chip or query caret.
- Reflect changes immediately in the chip label.

---

## 10. Add Filter Workflow

The Add filter button must remain available even though conditions can be created through typing.

Selecting Add filter should:

1. Insert a new incomplete condition at the current caret position.
2. Use a sensible default field.
3. Open the condition editor immediately.
4. Move focus into the editor.

This workflow is the primary guided alternative to autocomplete.

---

## 11. Logical Operator Chips

### 11.1 Condition separators

Conditions and groups are connected by inline AND or OR chips.

- AND is the default when an insertion workflow supplies a separator.
- AND and OR must each have a distinct chip background color, different from each other and from condition chips.
- Keep the visible AND/OR labels so query meaning does not depend on color.
- Maintain readable contrast in supported themes.

Selecting a logic chip toggles between AND and OR. Logic chips do not use the condition-editing popover or its down-arrow affordance.

### 11.2 Keyboard behavior

Separators must be reachable by keyboard.

When focused:

- Enter or Space toggles the separator.
- The accessible name should communicate the current value and available action.

### 11.3 Insertion and deletion

When a condition is inserted or removed:

- Ensure every remaining condition after the first has one preceding separator.
- Do not leave duplicate or orphaned separators.
- Use AND as the default separator for a newly inserted condition unless a group convention provides a better default.
- Explicitly deleting a logic chip may leave an incomplete expression for editing; show validation feedback instead of silently reinserting AND.

---

## 12. Grouping

### 12.1 Creating a group with the keyboard

When the caret contains no text:

- Typing `(` starts a new group at the caret location.
- Typing `)` closes the active group.

While a group is open:

- New conditions are inserted into that group.
- The active group boundary should be visually apparent.

### 12.2 Creating a group with a button

This is a follow-on capability, not part of the initial query editor. The Add group action should:

- Create a new group.
- Place the caret or an incomplete condition inside it.
- Make it clear that subsequent conditions belong to the group.

### 12.3 Group presentation

Parentheses define filter groups; they are structural tokens, not decorative labels.

- Allow multiple independent groups in one expression. Nested groups are not represented by the current flat query model.
- Initially render groups using only inline condition chips, logic chips, and visible `(` and `)` characters.
- Use spacing and readable parentheses to make boundaries apparent, including while a group is being composed.
- Show an AND/OR chip between groups.
- Do not introduce group cards, enclosing panels, backgrounds, titles, or nested visual containers in the initial implementation.
- Preserve the inline order and understandable boundaries when the query wraps.

### 12.4 Removing groups

A contextual remove action is a follow-on capability. Initially, users remove group contents and parentheses through the editor's token-deletion behavior.

Removing a group should:

- Remove all conditions contained in the group.
- Remove its inter-group separator.
- Move the caret to the nearest valid position.
- Avoid leaving an empty structural container.

If all conditions inside a group are deleted individually, remove the empty group automatically unless it is the active group being composed.

---

## 13. Validation

### 13.1 Incomplete conditions

A condition is incomplete when required information is missing, such as:

- No value for an operator that requires one
- No operator
- An invalid value format

Incomplete chips should:

- Be visually distinct from complete chips.
- Avoid appearing destructive or invalid before the user has finished editing.
- Use language such as `choose a value`.

### 13.2 Errors

Errors should be shown:

- On the affected chip
- Inside the condition editor
- Near the control that needs correction

Error messages should:

- Explain what is missing or invalid.
- Avoid generic messages such as “Invalid input.”
- Remain visible until the error is corrected.

### 13.3 Applying an invalid query

The initial query editor must identify incomplete or invalid structure, including unmatched parentheses and missing or misplaced AND/OR chips, as well as invalid conditions. Keep unfinished expressions editable and expose their validation state to the containing builder.

When the builder's Apply workflow is introduced:

If the user selects Apply while errors exist:

- Do not apply the query.
- Move focus to the first invalid chip.
- Open its editor.
- Announce or display why the query cannot be applied.

---

## 14. Saved Queries

Superseded by [saved-query-ux-plan](./saved-query-ux-plan.md).

### 14.1 Opening saved queries

The Saved action reveals a list of reusable queries.

Each saved query should show:

- Name
- Short description
- Number of conditions

### 14.2 Loading

Loading a saved query should:

- Replace the current query after confirmation when unsaved work may be lost.
- Close the saved-query panel.
- Place the caret at the end of the loaded query.
- Announce that the query was loaded.

### 14.3 Saving

If Save current is presented but unavailable in the prototype:

- It should not misleadingly appear fully functional.
- Use a disabled, prototype, or forthcoming treatment.

---

## 15. AI-Assisted Query Workflow

### 15.1 Opening

The AI action reveals a natural-language text field without replacing the manual query editor.

### 15.2 Prompting

The user can describe a query in natural language.

Example:

> Failed tests in Production that took longer than one second.

### 15.3 Previewing results

The AI workflow should produce a query preview made from the same editable condition chips.

Users must be able to:

- Review every generated condition.
- Edit generated chips.
- Change AND/OR relationships.
- Remove incorrect conditions.
- Apply the query only after review.

### 15.4 Uncertainty

When the request is ambiguous:

- Do not invent hidden assumptions.
- Mark uncertain conditions.
- Ask the user to complete or confirm them in the standard condition editor.

---

## 16. Clear, Cancel, and Apply

### 16.1 Clear all

Clear all should:

- Remove every condition and group.
- Keep the query field available.
- Place the caret at the beginning.
- Close open editors and autocomplete surfaces.

When clearing a complex query could be accidental, provide an undo action or confirmation.

### 16.2 Cancel

Cancel should dismiss the builder without applying changes.

If the builder opened with an existing applied query:

- Restore the previously applied query.
- Discard uncommitted edits.

### 16.3 Apply

Apply should:

- Show the number of active conditions.
- Validate the query before closing.
- Apply the current condition order, grouping, and logic.
- Provide confirmation that filtering has been updated.

---

## 17. Feedback and State Changes

The interface should provide clear feedback when:

- A chip is inserted
- A chip is removed
- A group is created or removed
- A saved query is loaded
- AI creates a query preview
- A query is applied
- Validation fails

Feedback should be noticeable without interrupting keyboard flow.

Routine editing should not trigger modal confirmations.

---

## 18. Focus Management

Focus should behave predictably:

- Opening an editor moves focus into it.
- Closing an editor returns focus to the originating chip or caret.
- Deleting a chip keeps focus in the query field.
- Selecting a field autocomplete result moves focus into the condition editor.
- Selecting an AND/OR autocomplete result keeps focus at the query caret after the inserted logic chip.
- Closing autocomplete returns focus to the caret.
- Loading or clearing a query places focus at a useful query position.

Focus must never be lost to the page body during token editing.

---

## 19. Accessibility Requirements

### 19.1 Semantics

- The query field should be identified as an editable query or filter control.
- Field and logic autocomplete should expose combobox and listbox/option semantics, with a visual surface matching the Nimble menu.
- The highlighted autocomplete result should be announced.
- Keyboard navigation keeps DOM focus in the query field; `aria-activedescendant` and selection styling identify the active result without moving a focus ring between menu items.
- Condition editor controls use their built-in Nimble labels so the visible label and accessible name stay aligned.
- Chips should identify their condition and available edit action.
- Expandable condition chips should expose their popup relationship and expanded state.
- Separators should announce their current logic value.
- Group structure should be understandable without relying only on color.

### 19.2 Keyboard support

All query creation and editing workflows must be available with a keyboard:

- Move the caret
- Type conditions
- Select autocomplete results
- Edit chips
- Delete chips
- Toggle logic
- Create groups
- Close surfaces
- Apply or cancel

### 19.3 Visual accessibility

- Focus indicators must be clearly visible.
- Error, incomplete, and selected states must not rely only on color.
- Text and controls must meet appropriate contrast requirements.
- Long labels must remain understandable when truncated.

### 19.4 Announcements

Screen readers should receive concise announcements for structural changes, such as:

- “Status condition added.”
- “Duration condition removed.”
- “Group created.”
- “Saved query loaded.”
- “Query has one error.”

---

## 20. Responsive Behavior

On narrower screens:

- Chips may wrap to additional lines.
- The caret must remain visible at its insertion position.
- Autocomplete must stay within the viewport.
- The condition editor must remain usable without horizontal scrolling.
- Footer actions must remain available.
- Group structure must remain visually understandable after wrapping.

The ordering and keyboard model must remain the same across screen sizes.

---

## 21. Acceptance Criteria

### Query field

- [ ] The query editor is usable independently of saved queries, AI, and builder footer actions.
- [ ] Condition chips render inside a single query text field.
- [ ] Input feel, inline typing, and block chip styling follow the referenced chip-selector story.
- [ ] Condition chips use block styling rather than outlined or pill styling.
- [ ] The empty composer appears only as a text caret.
- [ ] No placeholder or decorative input icon is shown.
- [ ] Clicking between chips moves the caret to that location.

### Keyboard editing

- [ ] Left and Right Arrow move the empty caret between tokens, including logic chips and parentheses.
- [ ] Backspace removes the chip before the caret.
- [ ] Delete removes the chip after the caret.
- [ ] Typing inserts a condition at the current caret position.
- [ ] Chip deletion keeps focus in the query field.
- [ ] Deleting a condition chip leaves adjacent logic chips for separate deletion.

### Autocomplete

- [ ] Partial field text displays matching fields.
- [ ] Typing `stat` includes Status in the result list.
- [ ] The autocomplete listbox uses Nimble-menu surface, spacing, and option styling while preserving listbox/option semantics.
- [ ] Up and Down Arrow move through results.
- [ ] Tab or Enter selects the highlighted result.
- [ ] Field selection creates a chip at the caret.
- [ ] Field selection immediately opens the condition editor.
- [ ] After a condition or closing parenthesis, partial case-insensitive AND/OR text shows matching logic suggestions in the dropdown listbox.
- [ ] Typing an AND/OR prefix does not render or insert a logic chip before a suggestion is selected.
- [ ] Enter, Tab, or pointer activation selects a logic suggestion and inserts its chip without opening the condition editor.
- [ ] Logic completion replaces an existing default separator at that boundary instead of duplicating it.
- [ ] Fields, rather than invalid logic choices, are offered where an operand is required.

### Condition editing

- [ ] Clicking or activating a chip opens its editor.
- [ ] Condition chips show a down arrow, a clickable hover treatment, and visible keyboard focus.
- [ ] The whole condition chip opens its popover and exposes its expanded state accessibly.
- [ ] Existing chip capabilities are reused where sufficient; otherwise the expandable interaction is provided by `ok-fv-expandable-chip`.
- [ ] Field changes reset incompatible operator and value data.
- [ ] Operator changes update the expected value input.
- [ ] The editor region has no Done button and closes when keyboard focus leaves it.
- [ ] Moving focus between controls within the editor region keeps it open.
- [ ] The editor region uses a square-cornered popup treatment consistent with a Nimble menu.
- [ ] The editor region has normal padding around its controls.
- [ ] Escape closes the editor and returns focus predictably.

### Logic and grouping

- [ ] AND/OR separators can be toggled with pointer or keyboard.
- [ ] AND and OR chips have distinct background colors from each other and from condition chips, with readable text labels and contrast.
- [ ] Typing parentheses creates and closes groups.
- [ ] Initial group presentation uses only inline chips, parentheses, and spacing, without group panels or titles.
- [ ] Conditions typed while a group is active are inserted into that group.
- [ ] Condition insertion and deletion never leave duplicate or orphaned separators.
- [ ] Explicit logic-chip or parenthesis deletion leaves incomplete syntax visible and editable rather than silently changing query meaning.
- [ ] Empty groups are removed when appropriate.

### Initial editor validation and guided entry

- [ ] Incomplete chips are visibly distinct.
- [ ] Errors appear on the chip and in the editor.
- [ ] Unmatched parentheses and missing or misplaced logic chips produce structural validation feedback.
- [ ] The query editor exposes validity without requiring an Apply button.
- [ ] Add filter creates an incomplete condition at the caret and opens its editor.

### Follow-on builder workflows (not initial scope)

- [ ] Invalid queries cannot be applied.
- [ ] Clear all returns to an empty, focused query field.
- [ ] Apply reflects the active condition count.

- [ ] Recognizable full clauses can be converted to condition chips.
- [ ] Add group and contextual group removal actions are available.
- [ ] Saved queries can be previewed and loaded.
- [ ] AI-generated conditions remain fully editable before application.
