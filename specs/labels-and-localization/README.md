# Localization for Labels in Nimble Components

## Problem Statement

We want to have consistent guidance for when & how to use labels for accessible text inside Nimble components. We also need a plan for how to support localization to non-English languages for those labels.

## Links To Relevant Work Items and Reference Material

[#1090: Unified strategy for providing localized title and aria label for icons within components](https://github.com/ni/nimble/issues/1090)

[PR 1257: Runtime Configuration HLD](https://github.com/ni/nimble/pull/1257)

## Accessible Labels
For many Nimble components, we already have a sufficient strategy for accessible labels. Guidance for specific components is documented in [nimble-components/docs/accessibility.md](../../packages/nimble-components/docs/accessibility.md).

[Issue #1090](https://github.com/ni/nimble/issues/1090) primarily covers the various icons used in Nimble components. A summary of our plan for accessible labels for icons currently used in Nimble components is:
- Increment/decrement buttons in `nimble-number-field` ([#617](https://github.com/ni/nimble/issues/617)): These are `nimble-button` with `content-hidden`, and "Increment" and "Decrement" text. That approach is sufficient, but the text needs localization.
- `nimble-banner` and `nimble-tooltip` severity icons: No accessible label specifically for the severity icons is currently planned. The banner/tooltip text should usually be sufficient to indicate if the message is an error or informational, so additional "Warning" or "Error" labels would usually be redundant. For the banner, the accessible text comes from the `title`. If we need to specifically support high-severity errors that we want to call the user's attention to, we could consider using the ARIA `role=alert` in that case.
- `nimble-banner` dismiss button icon: `nimble-button` with `content-hidden`, text comes from `dismissButtonLabel`, with a fallback as "Close".
    - The "Close" fallback text is Nimble-provided and needs localization.
    - We will probably remove `dismissButtonLabel` in the future, as all banners would generally use the same dismiss label text, so a per-element property isn't needed for it.

The Nimble table will have many labels, which are summarized here:
- Expand/Collapse Group button, Collapse All buttons: These are already `nimble-button` with `content-hidden`, but currently contain no text. We need to add text content for them (which will need localization).
- Action menu button in table cells ([#859](https://github.com/ni/nimble/issues/859)): Base table column already has `action-menu-label` for the accessible label (for which clients would handle localizing themselves). Currently providing `action-menu-label` is not required, so we may want to define a table fallback string to use if it's not provided (e.g. "Configure" or "Options") which would need localization.
- Column menu (button in column header): Will need a Nimble-provided label (like "Column Options") which will need localization. Each menu item will be both an icon and a visible label/ menu text, so no `title`/label specifically on the icons in the menu items is needed. Each menu item's text will be Nimble-provided (and need localization).
- Sort indicators (ascending/descending icon) in table column headers: No accessible label specifically for these icons is currently planned. The primary sorted column is already indicated with `aria-sort="ascending"` or `aria-sort="descending"`. The [ARIA APG's sortable table example](https://www.w3.org/WAI/ARIA/apg/patterns/table/examples/sortable-table/) follows similar logic, and says sort labels are not added to each column header button "to prevent repetitious verbosity that could interfere with understanding of the column titles".
- Grouped indicator in table column headers: Currently no ARIA attributes indicate a grouped column, so we'll probably want to add a label for this (probably via a `title` / tooltip)
- Client-provided icon elements in the table (e.g. icons as the primary content of table headers): Follows the same guidance in [accessibility.md](../../packages/nimble-components/docs/accessibility.md), i.e. the icons should provide accessible text via the `title` attribute (and clients will handle localizing it themselves).
- (Mapping/ Icon Columns: As currently specced, `nimble-table-column-icon`'s `nimble-mapping-icon` has a `label` attribute which will become the icon `title`)

## Localization

Our general approach to localization is that clients will handle localizing strings. That has led us to add attributes on some Nimble components for clients to provide localized labels, but that doesn't scale well to components with many labels like the table.

### Plan for Nimble-Provided Labels

Conceptually the localized strings are very similar to the sharing pattern of Design Tokens. The vast majority of the time, you want to use the same value (i.e. numeric increment/decrement button text is not control instance specific). However, we do want to be able to override the strings for specific controls as needed.

We will create non-CSS-property design tokens, similar to the `theme` and `direction` design tokens.
We will also create new `nimble-i18n-*` elements with APIs for setting the tokens. These will generally be direct children of the `nimble-theme-provider`, and the theme provider will be the target that the token values are set on.
```html
<nimble-theme-provider>
  <nimble-i18n-core
    number-field-increment="Increment"
    number-field-decrement="Decrement"
  ></nimble-i18n-core>
  <nimble-i18n-table
    table-groups-collapse-all="Collapse all groups"
  ></nimble-i18n-table>
</nimble-theme-provider>
```
Pros:
- Can configure once for the whole page in one spot, does not need to be per control. Much fewer duplicated attributes / slotted elements in the page.
- Can override for specific elements as needed (by wrapping in `nimble-theme-provider` and `nimble-i18n-*` elements)
- We can make more granular i18n providers, even down to the level of individual controls, if we're concerned about the number of strings apps would be automatically pulling in. (Note that currently we're just planning to have 2 though.)
- Code outside of Nimble could use the same concept (and derive from our i18n base class). If we end up with new controls in Nimble that are mostly specific to specific apps, we can also create new i18n providers for those elements, rather than sticking them all in the `i18n-core` element.

Cons
- More verbose than putting the APIs directly on nimble-theme-provider (but that's not really extensible)
- Still somewhat verbose in the page, to have all of the localized strings as attributes
    - We can consider using the `fromView` attribute mode on the attributes for the strings on the theme-provider. If clients set the strings using the theme-provider properties rather than as attributes in the HTML (as is currently proposed for Angular), `fromView` would not reflect those strings back to the DOM.
- Apps may be pulling in more strings than they need (i.e. if they just use the banner, they'll pick up the rest of the strings in `i18n-core`). Mitigation is to split off large sets of strings (e.g. those for the table).
- Not an originally intended use case for DesignToken

Other notes:
- We don't expect to need mixed content (i.e. other than simple strings), so attributes should be sufficient (vs. slots)
- If the page was automatically translated by something like Google Translate, the attributes on the i18n providers don't get translated. However we think this is OK because the expected usages of the labels (button content, slotted content, etc) would get translated.
- We may want to provide a description along with each English string, to aid in translation.

The current set of known labels for Nimble is shown below:

**nimble-i18n-core**  
| Token Name             | English string |
|------------------------|----------------|
| banner-dismiss         | Close         |
| number-field-increment | Increment     |
| number-field-decrement | Decrement     |

**nimble-i18n-table**  
| Token Name                            | English string      |
|---------------------------------------|---------------------|
| table-group-collapse                  | Collapse group      |
| table-group-expand                    | Expand group        |
| table-groups-collapse-all             | Collapse all groups |
| table-cell-action-menu-label          | Options             |
| table-column-header-menu              | Column Options      |
| table-column-header-grouped-indicator | Grouped             |
| table-column-sort-ascending           | Sort ascending      |
| table-column-sort-descending          | Sort descending     |
| table-column-group-by                 | Group by            |
| table-column-size-to-content          | Size to content     |

Note: We will probably remove the `table` prefix from the properties and attribute names on `nimble-i18n-table` as it's redundant. `table-cell-action-menu-label` is a fallback for when column.actionMenuLabel is unset.

The expected format for token names is:
- component name, e.g. `number-field` or `table`
- component part/category (optional), e.g. `column-header`
- specific functionality or sub-part, e.g. `decrement`
- the suffix `label` (will be omitted from the i18n properties/attributes)

Example:
```ts
export const numberFieldIncrementLabel = DesignToken.create<string>({
    name: 'number-field-increment-label',
    cssCustomPropertyName: null
}).withDefault('Increment');
// on the i18n element:
@attr({ attribute: 'number-field-increment' })
public numberFieldIncrement = 'Increment';
```

#### Implementation Details

See the prototype branch: [localizable-labels-prototype-2](https://github.com/ni/nimble/compare/%40ni/nimble-angular_v16.6.3...localizable-labels-prototype-2?expand=1)

**nimble-components**  
We'll define a base class (prototype: [i18n-base.ts](https://github.com/ni/nimble/blob/b13117639de55db3086561edccc4dfe5994f9829/packages/nimble-components/src/i18n/i18n-base.ts)) for the i18n providers, which handles setting the token values on the ancestor theme-provider. For each i18n provider, we'll have a file declaring the DesignTokens, with a class deriving from the base class that has attributes+properties for setting the token values (prototype: [i18n/core](https://github.com/ni/nimble/blob/b13117639de55db3086561edccc4dfe5994f9829/packages/nimble-components/src/i18n/core/index.ts) and [i18n/table](https://github.com/ni/nimble/blob/b13117639de55db3086561edccc4dfe5994f9829/packages/nimble-components/src/i18n/table/index.ts)).

**nimble-angular**  
Each i18n provider will have its own Angular directive and module (prototype: [nimble-i18n-core.directive](https://github.com/ni/nimble/blob/d51ee14dc49db7070e5cab726c225f69635de17b/angular-workspace/projects/ni/nimble-angular/src/directives/i18n/core/nimble-i18n-core.directive.ts) and [nimble-i18n-core.module](https://github.com/ni/nimble/blob/d51ee14dc49db7070e5cab726c225f69635de17b/angular-workspace/projects/ni/nimble-angular/src/directives/i18n/core/nimble-i18n-core.module.ts) for `i18n-core`.)

In order to make it easy/automatic for clients to pick up new localized strings/labels when they uptake new nimble-angular versions, each i18n provider has an additional directive that will set all of the Nimble-defined labels/strings, using Angular's `$localize` function on the English strings.  
Prototype: [nimble-i18n-core-with-defaults.directive](https://github.com/ni/nimble/blob/d51ee14dc49db7070e5cab726c225f69635de17b/angular-workspace/projects/ni/nimble-angular/src/directives/i18n/core/nimble-i18n-core-with-defaults.directive.ts)  
If we define descriptions for each string, we can include it so it appears in the message files, such as: ``$localize`:Nimble number-field increment button label:Increment` ``.

Once an Angular app uptakes the nimble-angular version that introduces these i18n modules, running `ng extract-i18n` will result in the app pulling in Nimble-provided labels/strings for localization. (Prototype: [messages.xlf](https://github.com/ni/nimble/blob/d51ee14dc49db7070e5cab726c225f69635de17b/angular-workspace/projects/example-client-app/src/locales/messages.xlf), output of `ng extract-i18n` after upgrading to this nimble-angular version)  
When they pull in new nimble-angular versions in the future and re-run that command, the new strings will again be pulled in for translation automatically.

For each i18n provider that an Angular app will use:
- The app imports that specific i18n module (prototype: [in example app module](https://github.com/ni/nimble/blob/d51ee14dc49db7070e5cab726c225f69635de17b/angular-workspace/projects/example-client-app/src/app/app.module.ts#L73)).
- The app adds that i18n element as a child to their theme provider ([prototype](https://github.com/ni/nimble/blob/d51ee14dc49db7070e5cab726c225f69635de17b/angular-workspace/projects/example-client-app/src/app/app.component.html#L2)):
```html
<nimble-theme-provider>
  <nimble-i18n-core withDefaults></nimble-i18n-core>
</nimble-theme-provider>
```
- If the app needs to customize any of the labels, they can do so via the i18n directive API. Generally the root i18n provider would use `withDefaults` to set all the labels to their localized values, and any nested ones would not.

We can consider codegen-ing the Angular directives, which would let us avoid copy-pasting the English strings/ descriptions at the nimble-angular level, but at the expense of obfucscating some of the code (in the generator scripts).

**nimble-blazor**  
We currently don't have a good solution for Blazor clients to automatically pick up or localize our labels/strings.  
We do still plan to create Razor components for each i18n provider, so that Blazor clients can manually specify/localize the labels if desired.  
(Prototype: [NimbleI18nCore.razor](https://github.com/ni/nimble/compare/@ni/nimble-angular_v16.6.3...localizable-labels-prototype-2?expand=1#diff-88863ebb8b90aab301573eeb66b6850c26327d12be6b0fa33bcd3cccaadca938) for `i18n-core`).

If we have any clients that will be using Nimble Blazor and non-English locales, we should probably do additional research to see if we can come up with a more seamless approach. Note that the `i18n-core` labels are not visible / are for accessibility only, so this may only be a priority for clients using the Nimble table (which will have visible strings needing localization).

### Plan for Client-Provided Labels
Examples: Button content, menu item content

Almost all of these labels are context-specific, i.e. different buttons on the page will have different text, and different columns will have different action menu labels.

Clients will localize those labels themselves:
- For Angular, they can use the `localize` function and/or `i18n` attributes/ attribute prefixes
- For Blazor, they could use `.resx` files and `IStringLocalizer`

The banner's `dismissButtonLabel` will be redundant once we have a Nimble-provided label for banner dismiss buttons, so we will probably remove that attribute in the future.

## Alternative Implementations / Designs

**Alternative options for Nimble-provided labels:**

### Putting the token APIs directly on theme-provider

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

- Only nimble-components defined within Nimble can add new attributes to the theme-provider.
  - We're encouraging clients to add new components to Nimble, including custom column types for the table, and those can use this approach
  - Components outside Nimble could still have accessible labels by defining attributes on their components for them

### Slots on each element

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

### Attributes on each element

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

### Define labels on span elements to aid automatic translation
Under the current proposals, the labels are specified as attributes on the i18n elements. If a user translates the page with Google Translate, the attributes will not be translated. However all of our current usages of the labels (as button text, menu items, slotted content) would still be translated.

If we wanted to ensure our labels on the i18n providers could be automatically translated, we might want to put them in translatable elements like `span`s:
```html
<nimble-i18n-core>
    <span nimble-label="number-field-increment">Increment</span>
</nimble-i18n-core>
```

We could still add on that approach in the future, for specific labels, if we identify any that would only be used by canvas-drawn elements (i.e. wafer map).

**Alternative implementation options:**

### Codegen more of the code (including nimble-components)
See the prototype branch: [localizable-labels-prototype](https://github.com/ni/nimble/commit/0b088a67af4a860fce17003e37ea1bf8dfd10e8b). Note that this prototype had all of the labels on the theme provider itself.

*nimble-components*  
We could define the labels in a JSON file (Prototype: [`labels.json`](https://github.com/ni/nimble/commit/0b088a67af4a860fce17003e37ea1bf8dfd10e8b#diff-0e77bd18c80fb68ad9624a1eeccbec4a539f98b92e2ff97a013f763cc897a8ce)):
```json
{
    "labelNumberFieldIncrement": "Increment",
    "labelNumberFieldDecrement": "Decrement",
    ...
}
```
From that we could codegen (Prototype: [`build/generate-labels/`](https://github.com/ni/nimble/commit/0b088a67af4a860fce17003e37ea1bf8dfd10e8b#diff-7eb7cdf375d9cf88a5e1083a264b299d3143779ce57906cc42aaa408df354f1a)):
- The label design tokens (Prototype: `labels/`), and APIs for them on the theme provider (Prototype: `theme-provider-base.ts`)

### Other options for nimble-angular
- Create separate directives for each component that defines labels. Each of these directives could still target `nimble-theme-provider` in their selector. With this model, each directive would probably have the `$localize` properties for the labels for just that component. This would allow apps to only pull in the labels for components they're using. However this would be much more difficult to codegen (we'd want the directives to be part of the modules for each component).
- Codegen an Angular component that contains a `nimble-theme-provider`, sets the label attributes in the component HTML, adds `i18n-` versions of the attributes, and contains `<ng-content />`, then apps would use this component instead of nimble-theme-provider. Not prototyped so not sure if this is feasible or not.
- Same as the previous idea, but the component is manually created in systemlink-lib-angular. This should work fine, but since it's not in Nimble / not codegen'd from the strings, it would be a manual process to update it with new Nimble labels in new nimble-angular versions.

### Provide a .resx file for Blazor
Prototype and description of this approach:
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

*Possible Alternatives:*
- Add an `IStringLocalizer` property to the `NimbleThemeProvider` Razor component, and codegen the `Label*` properties to use it if it's set. This would improve the process of telling Nimble about the localized resources, but wouldn't change the process of manually copying the resx to start with.
- Define an MSBuild task that copies the resx file, similar to what's outlined in [this GitHub comment](https://github.com/ni/nimble/issues/558#issuecomment-1129279985). Not much better / still a manual process.

## Open Issues

- Naming
   - Do we like having `i18n` in the element names, or should we pick something else? Once camel-cased it also looks strange, i.e. `NimbleI18nCore.razor`
- Best way to document this system (in Storybook)?
