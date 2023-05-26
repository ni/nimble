# Localization for Labels in Nimble Components

## Problem Statement

We want to have consistent guidance for when & how to use labels for accessible text inside Nimble components. We also need a plan for how to support localization to non-English languages for those labels.

## Links To Relevant Work Items and Reference Material

[#1090: Unified strategy for providing localized title and aria label for icons within components](https://github.com/ni/nimble/issues/1090)

[PR 1257: Runtime Configuration HLD](https://github.com/ni/nimble/pull/1257)

## Accessible Labels
For many Nimble components, we already have a sufficient strategy for accessible labels. Guidance for specific components is documented in [nimble-components/docs/accessibility.md](../../packages/nimble-components/docs/accessibility.md).

Issue #1090 primarily covers the various icons used in Nimble components. A summary of our plan for accessible labels for icons currently used in Nimble components is:
- Increment/decrement buttons in `nimble-number-field` ([#617](https://github.com/ni/nimble/issues/617)): These are `nimble-button` with `content-hidden`, and "Increment" and "Decrement" text. That approach is sufficient, but the text needs localization.
- `nimble-banner` and `nimble-tooltip` severity icons: No accessible label specifically for the severity icons is currently planned. The banner/tooltip text should usually be sufficient to indicate if the message is an error or informational, so additional "Warning" or "Error" labels would usually be redundant. For the banner, the accessible text comes from the `title`. If we need to specifically support high-severity errors that we want to call the user's attention to, we could consider using the ARIA `role=alert` in that case.
- `nimble-banner` dismiss button icon: `nimble-button` with `content-hidden`, text comes from `dismissButtonLabel`, with a fallback as "Close". That approach is sufficient. `dismissButtonLabel` should be localized by the clients, the "Close" fallback text is Nimble-provided and needs localization.

The Nimble table will have many labels, which are summarized here:
- Expand/Collapse Group button, Collapse All buttons: These are already `nimble-button` with `content-hidden`, but currently contain no text. We need to add text content for them (which will need localization).
- Action menu button in table cells ([#859](https://github.com/ni/nimble/issues/859)): Base table column already has `action-menu-label` for the accessible label (for which clients would handle localizing themselves). Currently providing `action-menu-label` is not required, so we may want to define a table fallback string to use if it's not provided (e.g. "Configure" or "Options") which would need localization.
- Column menu (button in column header): Will need a Nimble-provided label (like "Column Options") which will need localization. Each menu item will be both an icon and a visible label/ menu text, so no `title`/label specifically on the icons in the menu items is needed. Each menu item's text will be Nimble-provided (and need localization).
- Sort indicators (ascending/descending icon) in table headers: No accessible label specifically for these icons is currently planned. The primary sorted column is already indicated with `aria-sort="ascending"` or `aria-sort="descending"`. The [ARIA APG's sortable table example](https://www.w3.org/WAI/ARIA/apg/patterns/table/examples/sortable-table/) follows similar logic, and says sort labels are not added to each column header button "to prevent repetitious verbosity that could interfere with understanding of the column titles".
- Client-provided icon elements in the table (e.g. icons as the primary content of table headers): Follows the same guidance in [accessibility.md](../../packages/nimble-components/docs/accessibility.md), i.e. the icons should provide accessible text via the `title` attribute (and clients will handle localizing it themselves).
- (Mapping/ Icon Columns: As currently specced, `nimble-table-column-icon`'s `nimble-mapping-icon` has a `label` attribute which will become the icon `title`)

## Localization

Our general approach to localization is that clients will handle localizing strings. That has led us to add attributes on some Nimble components for clients to provide localized labels, but that doesn't scale well to components with many labels like the table.

### Plan for Nimble-Provided Labels

Conceptually the localized strings are very similar to the sharing pattern of Design Tokens. The vast majority of the time, you want to use the same value (i.e. numeric increment/decrement button text or collapse button text is not control instance specific) but want to adjust to a global config, i.e. theme or language. But also want to be able to override for specific controls as needed.

We will create non-CSS-property design tokens, similar to the `theme` and `direction` design tokens. The values can be set via the `nimble-theme-provider`:

```html
<nimble-theme-provider
    label-number-field-decrement="Increment"
    label-number-field-increment="Decrement"
    label-table-collapse-all="Collapse All"
>
<nimble-table></nimble-table>
</nimble-theme-provider>
```

Pros:

- Easy discovery of localized string configuration. They are all on the theme-provider.
- Can configure once for the whole page in one spot, does not need to be per control. Much fewer duplicated attributes / slotted elements in the page.
- Can override for specific elements as needed by wrapping in a theme-provider.
- Can configure to be attribute or slotted on the theme provider. But if don't need mixed content then attribute makes sense.
- User provided control-specific content should still be provided via attributes / slots. This is for control provided content (the table control defines the collapse button, not the user).

Cons: 

- Still somewhat verbose in the page, to have all of the localized strings as attributes
    - We can consider using the  `fromView` attribute mode on the attributes for the strings on the theme-provider. If clients set the strings using the theme-provider properties rather than as attributes in the HTML (as is currently proposed for Angular), `fromView` would not reflect those strings back to the DOM.
- Not an originally intended use case for DesignToken
- Only nimble-components defined within Nimble can add new attributes to the theme-provider.
  - We're encouraging clients to add new components to Nimble, including custom column types for the table, and those can use this approach
  - Components outside Nimble could still have accessible labels by defining attributes on their components for them

#### Implementation Details

See the prototype branch: [localizable-labels-prototype](https://github.com/ni/nimble/commit/0b088a67af4a860fce17003e37ea1bf8dfd10e8b)

**nimble-components**  
We'll create a file containing the label IDs and English string values. A simple version of this is a JSON file (Prototype: [`labels.json`](https://github.com/ni/nimble/commit/0b088a67af4a860fce17003e37ea1bf8dfd10e8b#diff-0e77bd18c80fb68ad9624a1eeccbec4a539f98b92e2ff97a013f763cc897a8ce)):
```json
{
    "labelNumberFieldIncrement": "Increment",
    "labelNumberFieldDecrement": "Decrement",
    ...
}
```
We'll code-gen source files from that (Prototype: [`build/generate-labels/`](https://github.com/ni/nimble/commit/0b088a67af4a860fce17003e37ea1bf8dfd10e8b#diff-7eb7cdf375d9cf88a5e1083a264b299d3143779ce57906cc42aaa408df354f1a)):
- For each label, an exported `DesignToken<string>` for it (with default of the English string). Prototype: [`labels/index.ts`](https://github.com/ni/nimble/commit/0b088a67af4a860fce17003e37ea1bf8dfd10e8b#diff-67d489e618f4180c3d10019eb8252b7b13a5f52516585c6baba2e4fc6d5b9914)
- Collections of the label names and values, which can be used in subsequent builds / Storybook stories. Prototype: `label-names.ts` and `label-values.ts`
- A `ThemeProviderBase` class with `@attr` properties and `Changed()` methods for each label, which ThemeProvider will derive from. Prototype: [`theme-provider-base.ts`](https://github.com/ni/nimble/commit/0b088a67af4a860fce17003e37ea1bf8dfd10e8b#diff-e90f67f575dfcd6fd5835a58a2663c8d1f05c0837328902751c8759fac817df9). (This may change slightly with the proposed `nimble-global-theme-provider` from PR 1257. The expectation is that both ThemeProvider and the GlobalThemeProvider would have the same attributes/properties to configure the labels.)

**nimble-angular**  
One goal for the nimble-angular label support is to make it easy (or automatic) for clients to pick up new localized strings/labels when they uptake new nimble-angular versions. The way the prototype accomplishes that is:
- Export (codegen) a [`NimbleLabels` class](https://github.com/ni/nimble/commit/0b088a67af4a860fce17003e37ea1bf8dfd10e8b#diff-8ada6f05dc0978bee3e574b5e06167631a98b8fd1ac8f5467aa3828e3ba933f1) that has properties for all Nimble labels, and uses the Angular `localize` function:
```ts
export class NimbleLabels {
    public static readonly labelNumberFieldIncrement = $localize`Increment`;
    public static readonly labelNumberFieldDecrement = $localize`Decrement`;
}
```
(We may encode the label ID as the description so it shows up in the message files, i.e. ``$localize`:nimble-label-number-field-decrement:Decrement` ``).  
If a consumer of nimble-angular imports the module containing the `NimbleLabels` class, once they run `ng extract-i18n` for their app, the message files will then contain the Nimble strings for translation. Additionally, once a client has done that, labels/strings in future nimble-angular version updates would automatically get pulled in by `ng extract-i18n` if it was run again after a package update.
- Export (codegen) a directive which will automatically set all of the labels on a Nimble theme provider, with the values from `NimbleLabels`. In the prototype this is [`NimbleThemeProviderInitializeAllLabelsDirective`](https://github.com/ni/nimble/commit/0b088a67af4a860fce17003e37ea1bf8dfd10e8b#diff-a8bb0152269fed064bdc90ef28541bdedaeaf86f3a4e2b1751d2da68a6090aca) with selector `nimble-theme-provider[initializeAllLabels]`. Assuming that an app is OK with pulling in and localizing all of Nimble's strings/labels, using this directive will make the process of using those localized strings mostly automatic.
- Codegen [`NimbleThemeProviderBaseDirective`](https://github.com/ni/nimble/commit/0b088a67af4a860fce17003e37ea1bf8dfd10e8b#diff-a339dcfbd672a173f9daf1b67e96ed59cd7de2167935aae338d76a277476b026): Similar to the nimble-components version, this exposes properties for all of the Nimble labels. This allows apps to pick & choose to only localize a few labels (e.g. if they're only using a subset of the controls), or override specific label values (set on an ancestor theme provider, or override the values from the *InitializeAllLabels directive). However the app wouldn't automatically pick up new strings if they only set labels this way.

*Possible Alternatives:*
- Codegen an Angular component that contains a `nimble-theme-provider`, sets the label attributes in the component HTML, adds `i18n-` versions of the attributes, and contains `<ng-content />`, then apps would use this component instead of nimble-theme-provider. Not prototyped so not sure if this is feasible or not.
- Same as the previous idea, but the component is manually created in systemlink-lib-angular. This should work fine, but since it's not in Nimble / not codegen'd from the strings, it would be a manual process to update it with new Nimble labels in new nimble-angular versions.

**nimble-blazor**  
Label support for Nimble Blazor is more rudimentary than nimble-angular. Additionally, the prototype doesn't yet codegen for Blazor, but it has some hardcoded changes to illustrate the concepts:
- [`NimbleBlazor\NimbleResources\NimbleLabels.resx`](https://github.com/ni/nimble/commit/0b088a67af4a860fce17003e37ea1bf8dfd10e8b#diff-cfca56c824b9b81654e41d45429aa8dad759211ca1ceb8e5bac7886b75bbeab4): Contains labels and English values, i.e. `labelNumberFieldIncrement` => `'Increment'` (this would be codegen'd)
  - In the [csproj](https://github.com/ni/nimble/commit/0b088a67af4a860fce17003e37ea1bf8dfd10e8b#diff-3635dce04cb0a44d829f97259dce31b8f2abf8d0e80a4c5ccf9506babc93a78aR38), the Build Action for this is Content (not EmbeddedResource), `copyToOutput=true`, `IncludeInPackage=true`. This results in the resx file being included in the NuGet, in [contentFiles/](https://learn.microsoft.com/en-us/nuget/reference/nuspec#using-the-contentfiles-element-for-content-files)
- [`Components\NimbleThemeProvider.razor`](https://github.com/ni/nimble/commit/0b088a67af4a860fce17003e37ea1bf8dfd10e8b#diff-935610f630ad061236774e447badf29f08dd1467f6c4c6e45ead7214641afe6d): Add code/markup for labels: i.e. `label-number-field-increment="@LabelNumberFieldIncrement"` in the Razor file, `[Parameter] public string? LabelNumberFieldIncrement { get; set; }` in the C# code. We may need to fully codegen the Razor file to add the attribute bindings.

Once clients add a reference to the NuGet, `NimbleResources\NimbleLabels.resx` will appear in their project as a link (to that file in the NuGet). At that point, the remaining process is somewhat convoluted, and would need documentation. The prototype branch has done some of this in `Demo.Shared` and `Demo.Server`:
- Browse to that resx file on disk, and manually copy it into the app project directory, in `Resources\`
- Add it to the Blazor project (as Build Action = Embedded Resource). Then, open it in the resx editor, and set Access Modifier = Public or Internal (to generate the `.designer.cs` file)
- To translate/localize the resources, clone the resx file (e.g. `NimbleLabels.fr.resx`) and translate the values in it. The app also needs to follow the [Microsoft Blazor localization docs](https://learn.microsoft.com/en-us/aspnet/core/blazor/globalization-localization?view=aspnetcore-7.0&pivots=server) in terms of opting into localization, configuring the supported locales, etc.
- To consume the resources, in the Razor file using the NimbleThemeProvider, add:
```cs
[Inject]
internal IStringLocalizer<NimbleLabels>? LabelProvider { get; set; }
```
Then bind to the theme provider labels in the Razor template:
```xml
<NimbleThemeProvider Theme="Theme" LabelNumberFieldDecrement="@LabelProvider!["labelNumberFieldDecrement"]" LabelNumberFieldIncrement="@LabelProvider!["labelNumberFieldIncrement"]">
```

The process above isn't great. When updated versions of Nimble Blazor are released, if they have new labels, the consuming app would need to repeat the process of manually copying the resx, and translating it. They'd also need to manually add the new label properties in their Razor file using the NimbleThemeProvider.

If we have any clients that will be using Nimble Blazor and non-English locales we should probably do additional research to see if we can come up with a more seamless approach.

*Possible Alternatives:*
- Add an `IStringLocalizer` property to the `NimbleThemeProvider` Razor component, and codegen the `Label*` properties to use it if it's set. This would improve the process of telling Nimble about the localized resources, but wouldn't change the process of manually copying the resx to start with.
- Define an MSBuild task that copies the resx file, similar to what's outlined in [this GitHub comment](https://github.com/ni/nimble/issues/558#issuecomment-1129279985). Not much better / still a manual process.

### Plan for Client-Provided Labels
Examples: Button content, menu item content, `nimble-banner` `dismissButtonLabel`, `nimble-table` column `action-menu-label`

Almost all of these labels are context-specific, i.e. different buttons on the page will have different text, and different columns will have different action menu labels.

Clients will localize those labels themselves:
- For Angular, they can use the `localize` function and/or `i18n` attributes/ attribute prefixes
- For Blazor, they can use `.resx` files and `IStringLocalizer`

The banner's `dismissButtonLabel` will be semi-redundant once we have a Nimble-provided label for banner dismiss buttons, so we could consider removing that attribute in the future.

## Alternative Implementations / Designs

Alternative options for Nimble-provided labels:
### Slots

Create slots per localized string on the element.

```html
<nimble-table>
   <span slot="collapse-all-button-label">Hello World</span>
</nimble-table>
```

Pros:
- Useful for mixed content (if that is even needed, maybe not?)
- Can maybe make shareable slotted content within a framework
  - Angular: Create a shared component that emits elements with those slots
  - Blazor: I expect a blazor component written that way would work too
- Slots can have default content easily

Cons:
- DOM gets littered with many additional elements for providing localized strings
- Lots of duplicated slotted content / elements. Have to emit into every table element as children.

### Attributes

Create attribute per localized string on the element.

```html
<nimble-table
    collapse-all-button-label="Hello World"
></nimble-table>
```

Pros:
- Easy discovery of available properties? Type checked in Angular at least

Cons:
- Maybe not as easy to share / reuse attribute configuration?
    - Angular: Might need to write a custom directive that will emit the attributes onto the host. I think that works
    - Blazor: ?
- Lots of duplicated attributes. Have to emit into every table element as children.
- Only text content (maybe that's okay)

## Open Issues

- Are the label IDs (`label-number-field-increment`) sufficient information for someone to translate the strings from? (Should we include an additional/optional description with each label/string?)
- Does Nimble need to support more advanced use cases of strings/labels like format specifiers or [ICU expressions](https://angular.io/guide/i18n-common-prepare#icu-expressions)?
