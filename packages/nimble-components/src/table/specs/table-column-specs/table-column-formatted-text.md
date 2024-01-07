# Formatted Text Columns

## Overview

Clients will wish to display non-string data as text in table columns for use cases like the following:

1. integer data like counts, formatted to be displayed with no trailing decimals ("4", "100")
2. floating point data formatted to display values in standard ways ("3.1415", "1.04E47", "Infinity", "-0.03")
3. a mix of the above with formatting determined by the application ("1.000", "-0.030", "1024.000")
4. numeric values with a static unit string appended before or after (e.g. "$4.23" or "15%")
5. numeric values with custom unit logic. Examples:
    - a file size column that could show the value 1000 as "1000 bytes" but the value 1024 as "1KB"
    - a [duration column](./table-column-duration-text-hld.md) that could show 63 seconds as "00:01:03" or "1 min, 3 sec"
6. date/time values formatted in various ways ("October 27", "yesterday", "2023-12-28 08:27")

In all of the above cases:

-   data should be sortable and groupable by its actual value, not the string representation
-   text styling like font and alignment should be provided by Nimble
-   columns should support i18n behaviors like decimal separators, date/time formats, and localized content
-   there should be a way to show the full value of truncated text (likely via a title / tooltip on hover)

We may not choose to support all of the above initially but we should design our solutions with these use cases in mind.

### Background

[Number column work item](https://github.com/ni/nimble/issues/1011)

[Date/time column work item](https://github.com/ni/nimble/issues/1014)

[Table Column API](../table-columns-hld.md)

[Table Spec](../README.md)

[Table Column Text Spec](./table-column-text-field.md)

[Visual Design Spec](https://xd.adobe.com/view/5b476816-dad1-4671-b20a-efe796631c72-0e14/specs/)

### Non-goals

-   Combinations of the use cases listed above in a single column. This will be needed in cases where the source data isn't uniformly typed (e.g. SLE tag values or notebook outputs). This HLD focuses on uniform data types; future HLDs may discuss ways to configure multiple types of columns to be conditionally displayed together.
-   Editable numbers. This is not supported by the text column yet either.
-   Numeric formatting for `nimble-number-field`. While we may choose to expose similar APIs for its numeric formatting, the complexities of it being an editable input control make this out of scope for now.
-   Customizing the styling of the column content (other than text alignment). This is not supported by the text column yet either.
-   Enum and boolean values formatted as localized strings (0 -> "Fail", 1 -> "Pass"). These will likely use the [mapping column](./table-column-mapping.md).

---

## Design

### Summary

Nimble will provide base classes that can be derived from to define columns that call a formatting function to render their data as text.

Nimble will provide several columns that derive from these base classes and provide higher level formatting APIs for specific data types. We plan to provide column implementations that can handle the above use cases 1-4 (numeric formatting and static units) and 6 (date).

Nimble may add additional column types or configurations in future to support additional cases. These cases may be contributed by client teams or include application-specific logic (possibly as "incubating" components). Defining columns in Nimble and configuring their formatting in apps via attributes is preferable to applications defining custom columns with JS formatting logic for several reasons:

-   the columns can be made available to other applications written in any of the UI frameworks that Nimble supports
-   the columns can be built using Nimble infrastructure, saving apps from incorporating FAST or JS code (a particular challenge in Blazor)
-   clients don't need to manage the lifecycle of registering a new column custom element in their application

### Formatted text column base classes

Nimble will provide abstract base classes, templates, and styles which handle rendering a string as text. Just like `nimble-table-column-text` today, these columns will:

-   offer attributes to control which field is displayed
-   sort and group by the field value, not the display value.
-   allow sizing by fractional widths with a minimum pixel width.
-   truncate using an ellipsis and show a tooltip on hover when the value is truncated

The base classes provided will be:

-   `TableColumnTextBase` - specifies the custom element logic to configure the column
-   `TableColumnTextCellViewBase` - derives from `TableCellView` to specify the custom element logic that renders a cell
-   `TableColumnTextGroupHeaderViewBase` - derives from `TableGroupHeaderView` to specify the custom element logic that renders a group row

Both clients and Nimble itself will derive from these base classes to specify the type of data that the column supports and how to convert it to a string. They will register the derived classes as custom elements using the same FAST APIs that Nimble itself uses.

**Use column custom element in an application**

```html
<nimble-table>
    <my-app-progress-column
        field-name="progress"
    >
        Progress
    <my-app-progress-column>`
</nimble-table>
```

**Define and register column custom element**

```ts
export class MyAppProgressColumn extends TableColumnTextBase {
    protected override getColumnInternalsOptions(): ColumnInternalsOptions {
        return {
            cellRecordFieldNames: ['value'],
            cellViewTag: tableColumnNumericTextCellViewTag,
            groupHeaderViewTag: tableColumnNumericTextGroupHeaderTag,
            sortOperation: TableColumnSortOperation.basic
        };
    }
}

const myAppProgressColumn = MyAppProgressColumn.compose({
    baseName: 'nimble-table-column-progress',
    template,
    styles
});

DesignSystem.getOrCreate().withPrefix('nimble').withPrefix('my-app').register(myAppProgressColumn());
export const myAppProgressColumnTag = DesignSystem.tagFor(MyAppProgressColumn);
```

**Specify formatting of cells and group headers in their custom elements**

```ts
export class MyAppProgressColumnCellView extends TableColumnTextCellViewBase<
    TableColumnNumericTextCellRecord,
    TableColumnNumericTextColumnConfig
> {
    public override get text(): string {
        return `${100 * this.cellRecord.value}%`;
    }
}

export class MyAppProgressColumnGroupHeaderView extends TableColumnTextGroupHeaderViewBase<
    TableNumberFieldValue,
    TableColumnNumericTextColumnConfig
> {
    public override get text(): string {
        return `${100 * this.groupHeaderValue}%`;
    }
}

// Not shown: registering the above two custom elements
```

This is prototyped in the [formatted-text-column branch](https://github.com/ni/nimble/compare/main...users/jattas/formatted-text-column?expand=1).

### Nimble formatted text columns

Nimble will provide several columns that derive from the above base classes and provide higher level text formatting APIs for specific data types.

All columns will include a `field-name` string attribute to select the field to display.

All columns will offer standard Angular and Blazor integration.

#### Column naming

Follows the [Column Type Philosophy](/packages/nimble-components/src/table/specs/table-columns-hld.md#column-type-philosophy) where:

-   category: `table-column`
-   presentation: `text`
-   variants: Different variants are allowed for configurations that vary significantly / don't make sense to add to `table-column-text`, ie for a `table-column-number-text` or `table-column-date-text`

#### Text column

`nimble-table-column-text` will continue to present the same API it does today, but will derive from the base classes described above.

#### Number column

Nimble will introduce `nimble-table-column-number-text` which formats a numeric field value and displays it as text. It will offer sufficient configuration to support use cases 1-4 above, as well partial support for 5.

##### API

-   `alignment` - a string value matching `"left"`, `"right"`, or `undefined` (the default, meaning `"automatic"`) which controls whether values and column headers are left or right aligned within the column. If set to `undefined` Nimble will choose left or right based on the value of other configuration. Clients should select `right` if it is known that the decimal separators of all values in the column will align in the given the `format`.
-   `format` - a string which controls how the number is formatted for display. It can take one of the following values:
    -   `undefined` - use a default formatter that displays integers with no trailing zeros, limits to 6 digits, and uses exponential notation when the formatted value is large (\`>= 1e6\`) or small (\`< 1e-3\`) in magnitude. Will be displayed left-aligned by default (since numbers will display an inconsistent number of fractional digits).
    -   `'decimal'` - format all values as decimal values (e.g. 123.45) with a number of digits after the separator determined by `decimal-digits` or `decimal-maximum-digits`. Exponential notation is never used. If required, values will be rounded to reach the specified number of decimial digits. Configuring `decimal-digits` to `0` will round the value to the nearest integer and display it with no decimal places. Default alignment will be left if either `decimal-maximum-digits` or a unit is set, otherwise right (since the decimal separators should align in that case).
    -   This could be extended to other pre-configured formats in future. Their configuration attributes would be prefixed with the name of the format mode.
    -   **Note:** all of the above will be implemented using a `Intl.NumberFormat` formatter. Nimble will configure the formatter with defaults to match the [visual design spec](https://github.com/ni/nimble/issues/887). The exception is that we will set `useGrouping: true` to achieve `1,000` rather than `1000` because this styles the values in a way that is more human readable.
-   `decimal-digits` - when format is `decimal`, a number that controls how many digits are shown to the right of the decimal separator. Possible values are from 0 to 20. Defaults to 2 (unless `decimal-maximum-digits` is specified).
    -   It is invalid to specify both `decimal-digits` and `decimal-maximum-digits`.
    -   Formats other than `decimal` ignore `decimal-digits`.
-   `decimal-maximum-digits` - when format is `decimal`, a number that controls the maximum number of possible digits shown to the right of the decimal separator (i.e. omits trailing zeros). Possible values are from 0 to 20.
    -   It is invalid to specify both `decimal-digits` and `decimal-maximum-digits`.
    -   Formats other than `decimal` ignore `decimal-maximum-digits`.

This column will display a blank cell when `typeof` the value is not `"number"` (i.e. if the value is `null`, `undefined`, not present, or has a different runtime data type). Note that IEE 754 numbers like Infinity, NaN, and -0 are type `"number"` so will be displayed how each formatter converts them. This will preserve values like `"∞"` and `"NaN"`.

This column will trigger `invalidColumnConfiguration` on the table's validity state and will include flags in the column's validity state if both `decimal-digits` and `decimal-maximum-digits` are specified, or its configuration can't be translated to a valid `Intl.NumberFormat` object. To provide better developer feedback about what's wrong with the configuration, the column could expose a public method like `createNumberFormat()` which would use the column's configuration to construct the formatter but allow any exceptions to be thrown.

##### Units

A unit for the column may be configured by providing a `nimble-unit-<name>` element as content (in addition to the column label). Unit elements represent a set of related, scaled units, e.g. `nimble-unit-byte` represents bytes, KB, MB, etc. Values are converted from a source unit (e.g. bytes) to the largest scaled unit (e.g. KB, MB, etc.) that can represent that value with magnitude >= 1. The source data for the column is expected to be given in the base unit specified in the tag name, e.g. for `nimble-unit-byte`, a source value should be a number of bytes. Note that unit elements have no visual representation of their own. They are strictly configuration components, and by nature of being components, allow selective loading of translation data for only the needed units. The initial set of unit elements are:

-   `nimble-unit-byte` - Labels in this unit scale are `byte`/`bytes`, `KB`, `MB`, `GB`, `TB`, `PB`
    -   `binary` - boolean attribute that indicates a binary conversion factor of 1024 should be used rather than 1000. The resulting unit labels are `byte`/`bytes`, `KiB`, `MiB`, `GiB`, `TiB`, `PiB`.
-   `nimble-unit-volt` - Labels in this unit scale are `volt`/`volts`, plus `V` prefixed by all supported metric prefixes.

Supported metric prefixes are f (femto), p (pico), n (nano), μ (micro), m (milli), c (centi), d (deci), k (kilo), M (mega), G (giga), T (tera), P (peta), and E (exa). This set is intended to be suitable for other units we may support in the future (e.g. ohms, amps), but any particular unit scale can diverge from this set as needed.

If a value with a unit would be formatted with exponential notation, it will always be given in its base unit. E.g. instead of "1e6 PB", it would render as "1e21 bytes".

When displaying units, `Intl.NumberFormat` will translate unit strings for the [units that it supports](https://tc39.es/ecma402/#table-sanctioned-single-unit-identifiers) and localize the number (for comma/decimal). We will include our own logic for converting between unit values. For a unit scale not supported by `Intl.NumberFormat`, we will provide our own translations (for French, German, Japanese, and Chinese) in a `nimble-unit-<name>` element. If the client requests a translation for one of these units in a language we don't support, we will fall back to English.

Unit elements will be capable of enumerating the individual units supported. The enumerated unit objects will be capable of formatting a given number into a localized string including the unit label. Below is an example of the abstractions/APIs that might be used to implement this.

```TS
// a specific unit, e.g. kilobyte, millivolt, etc.
interface ScaledUnit {
    public conversionFactor: number;
    public format(value: number): string;
}

// a set of related units, e.g. {byte, kilobyte, megabyte, gigabyte, terabyte, petabyte}
interface UnitScale {
    public getSupportedUnits(lang: string, formatterOptions: Intl.NumberFormatOptions): ScaledUnit[];
}

// unit scale supported by Intl.NumberFormat
class UnitByte extends FoundationElement implements UnitScale {
    public getSupportedUnits(lang: string, formatterOptions: Intl.NumberFormatOptions): ScaledUnit[] {
        // returns implementations of ScaledUnit that wrap Intl.NumberFormat instances configured for a specific locale and a specific unit (e.g. 'fr-FR' and 'kilobyte')
    }
}

// unit scale with Nimble-provided unit translations
class UnitVolt extends FoundationElement implements UnitScale {
    public getSupportedUnits(lang: string, formatterOptions: Intl.NumberFormatOptions): ScaledUnit[] {
        // returns implementations of ScaledUnit that contain a shared Intl.NumberFormat (for formatting the number) and a specific translated unit string to append
    }
}
```

We will use `nimble-unit-byte` to display file sizes in SLE tables. Currently, SLE displays these values with the common `KB`/`MB`/`GB` unit labels, but uses a factor of 1024 to convert between units (which is [not uncommon](https://en.wikipedia.org/wiki/JEDEC_memory_standards#Unit_prefixes_for_semiconductor_storage_capacity), but [technically incorrect](https://physics.nist.gov/cuu/Units/binary.html)). Whether SLE chooses to standardize on the default 1000-based byte units or the 1024-based ones, it will be a change from the current behavior. To ensure consistency, we will update SLE's file size pipe and search for other places where byte values are being converted so they can be updated accordingly.

##### Examples

```html
<nimble-table>
    <nimble-table-column-number-text field-name="numericTag">
        Tag
    </nimble-table-column-number-text>

    <nimble-table-column-number-text
        field-name="count"
        format="decimal"
        decimal-digits="0"
    >
        Count
    </nimble-table-column-number-text>

    <nimble-table-column-number-text
        field-name="temperature"
        format="decimal"
        decimal-digits="1"
    >
        Temperature (°C)
    </nimble-table-column-number-text>

    <nimble-table-column-number-text
        field-name="fileSize"
        format="decimal"
        decimal-maximum-digits="1"
    >
        File Size
        <nimble-unit-byte></nimble-unit-byte>
    </nimble-table-column-number-text>
</nimble-table>
```

#### Date Column

Nimble will introduce `nimble-table-column-date-text` which maps numbers containing Unix timestamp values (milliseconds since the Unix epoch) to localized date/time strings.

##### Date types

We considered allowing clients to provide date values using native date types like [JavaScript `Date`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date) or [.NET `DateTime`](https://learn.microsoft.com/en-us/dotnet/api/system.datetime?view=net-7.0). We opted not to allow this in the `setData()` function to ensure the best possible performance and to avoid ambiguities about copying values. For now, clients can convert those values to Unix timestamps. In future we may choose to support these types in a more first-class way. That would require a future HLD update to answer some of the questions posed [in this discussion thread](https://github.com/ni/nimble/pull/1268#discussion_r1204674219).

##### API

-   `format` - a string which can take one of the following values
    -   `undefined` - use the default formatter, which will display values similar to `Dec 19, 2020, 9:23:16 PM` and include support for localization. It will be implemented using `Intl.DateTimeFormat` with `options.dateStyle` and `options.timeStyle` set to `"medium"`.
    -   `'custom'` - use [`Intl.DateTimeFormat`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/DateTimeFormat) configured with values specified in other attributes.
    -   This could be extended to other pre-configured formats in future. Their configuration attributes would similarly be prefixed with the name of the format mode.
-   `custom-*` - when format is `custom`, these attribute-cased values will be passed to the equivalent camelCased fields of the `options` parameter of the `Intl.DateTimeFormat` constructor. For example, `options.dateStyle` will be set to the value of `custom-date-style`. These fields are all string, boolean, or number and their property equivalents will be strictly typed.

This column will display a blank cell when the value is `null` or `isNaN(new Date(value))` returns `true` (i.e. if the value is `null`, `undefined`, not present, has a non-`number` runtime data type, or is a `number` that produces an invalid `Date` like `NaN`/`Infinity`) (see ["Detecting an invalid Date instance"](https://stackoverflow.com/a/1353711)). Note that `new Date(null)` is behaves the same as `new Date(0)` so Nimble treating `null` as invalid will require a special case.

This column will trigger `invalidColumnConfiguration` on the table's validity state and will include flags in the column's validity state if its configuration can't be translated to a valid `Intl.DateTimeFormat` object. To provide better developer feedback about what's wrong with the configuration, the column could expose a public method like `createDateTimeFormat()` which would use the column's configuration to construct the formatter but allow any exceptions to be thrown.

##### Examples

```html
<nimble-table>
    <nimble-table-column-date-text field-name="start">
        Start
    </nimble-table-column-date-text>

    <nimble-table-column-date-text
        field-name="dueDate"
        format="custom"
        custom-date-style="full"
    >
        Due Date
    </nimble-table-column-date-text>
</nimble-table>
```

#### Elapsed Time Column

Nimble could introduce a column type that maps time duration to localized strings (e.g. "1 minute, 10 seconds"). Its API will be discussed in a future update to this document. It might use [Temporal duration values](https://tc39.es/proposal-temporal/docs/duration.html) formatted with [`Intl.DurationFormat`](https://tc39.es/proposal-intl-duration-format/) but those APIs are not yet approved for implementation in browsers. The [`Intl.RelativeTimeFormat` API](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/RelativeTimeFormat) also looks promising but it includes relative words like "ago" and "in" which are difficult to remove, even when using [`formatToParts`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/RelativeTimeFormat/formatToParts).

#### Specifying locale

The columns described above will format numbers, dates, and times differently depending on the locale. To specify the locale, the column implementations will read a Nimble configuration design token for locale and pass its value to the `locales` input of the `Intl.NumberFormat` or `Intl.DateTimeFormat` constructor. If the value of that token changes on the column element, the column will re-render with the new locale.

The design token for configuring locale will be a new token following the patterns described in [Automatic theme / Runtime Configuration HLD](https://github.com/ni/nimble/pull/1257) for tokens like `theme` and `direction`. Its attribute name on the theme provider will be `lang`. It will be a string expected to conform with the [BCP 47 locale format](https://en.wikipedia.org/wiki/IETF_language_tag) (e.g. `en-us` or `de`). Its initial value will be set by reading the `lang` attribute from the page's `<html>` element.

_Alternative_: We considered naming the token attribute `locale` to distinguish it from the [HTML global `lang` attribute](https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes/lang) since it won't behave identically (for example, the HTML attribute can be set on any element but Nimble will only respect setting it on the HTML element or a theme provider). But we decided the behavior was similar enough to use the same name and to rely on documentation to convey those differences.

---

## Implementation

### Alternatives considered

#### Other ways to provide a formatting function

1. setting the formatting function as a property on a column element.
2. registering a formatter with Nimble using a unique string name and then configuring the column to use that formatter by an attribute (described in more detail [in Milan's comment](https://github.com/ni/nimble/pull/1054#discussion_r1136319757))
3. setting an [`Intl.NumberFormat`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/NumberFormat) object as a property on a column element.

All of these require JS code which finds a specific column element and configures it. This is difficult to achieve in Blazor.

#### Use `table-column-text`

With the changes proposed in [HLD for programmatically sorting columns](../table-column-sort-hld.md) to allow a column to be sorted by a different data field than the one being used for display, many of the above use cases could be met with minor changes to the existing text column. Clients would write custom logic to populate their data with a new string field that contains formatted values. Then they would configure the table to display that string field while sorting by the original numeric field.

```html
<nimble-table>
    <nimble-table-column-text
        operand-data-record-name="progress"
        field-name="formattedProgress"
    >
        Progress
    <nimble-table-column-text>`
</nimble-table>
```

```ts
const originalData = [{ progress: 0.1 }, { progress: 0.2 }];
const tableData = originalData.map(x => {
    progress: x.progress;
    formattedProgress: x ? `${100 * x.progress}%` : undefined;
});
table.setData(tableData);
```

**Pros:**

-   formatted data is specified up front, guaranteeing fast scroll performance
-   powerful; clients can format data however they want, including via browser APIs which are i18n-friendly or via server-side logic

**Cons:**

-   Increased memory usage and data update time from clients pre-populating data with field for each formatted column
-   Added complexity of writing procedural code even for simple numeric formatting use cases
-   Potential cross-app inconsistency if numeric formatting code isn't shared (versus Alternative 3)
-   Difficult to enforce styling differences between string and numeric columns (e.g. right vs left text alignment)

**Implementation Cost:**

-   Exposing `operand-data-record-name` to be set by client code rather than column definition
-   Exposing an API for clients to indicate their data should be styled as numeric data (right aligned)

#### Client provides custom column implementation for each use case

Nimble already has a mechanism for clients to provide custom columns by deriving from a base class, specifying the data fields / template / styling, and registering the column type with Nimble. We could ask clients to use this mechanism for text column types.

**Pros:**

-   Zero implementation cost to Nimble team
-   Powerful; clients can format data however they want, including via browser APIs which are i18n-friendly

**Cons:**

-   Higher burden on clients to specify template, styling, numeric formatting, etc in JS. This is especially burdensome in frameworks like Blazor.
-   Difficult to enforce styling differences between string and numeric columns (e.g. right vs left text alignment)
-   Potential cross-app inconsistency if formatting code isn't shared

### Other number/date/time formatting APIs

1. Existing SLE applications use the [Angular DatePipe](https://angular.io/api/common/DatePipe). This offers similar options to the `Intl.DateTimeFormat` (including locale-specific formatting) but would be a challenge to support in non-Angular applications.
2. The TC39 ECMAScript standard is working on [a proposal for Temporal](https://github.com/tc39/proposal-temporal), which includes a new [immutable format for representing time](https://tc39.es/proposal-temporal/docs/index.html) and namespace for manipulating it. It's in Stage 3 meaning the API isn't expected to change and [polyfills](https://github.com/tc39/proposal-temporal#polyfills) are available. Since the formatting APIs that browsers support today are sufficient, we propose to use them instead.
3. There are numerous libraries for formatting including the standards-based [Format.js](https://formatjs.io/), the opinionated [moment.js](https://momentjs.com/docs/), and [various successors](https://momentjs.com/docs/#/-project-status/recommendations/). We may choose to depend on one in the future to expose additional formatting options but will start with browser APIs as they require no additional dependencies.

### Additional unit APIs

We considered some alternative approaches for configuring units:

#### Third-party libraries

Other libraries considered for number conversion and/or unit label localization include [globalizejs](https://github.com/globalizejs/globalize), [convert](https://convert.js.org/), [convert-units](https://github.com/convert-units/convert-units), and [iLib](https://github.com/iLib-js/iLib). None of these provided sufficient functionality to justify including them as a dependency.

#### Attribute-based unit API

An alternative to the `nimble-unit-<name>` element-based API is to just configure the unit through one or more attributes on the column:

-   `unit` - `'byte'`, `'volt'`, or `undefined` (no unit)
-   `unit-byte-binary` - (byte type only) boolean flag indicating to use 1024-based unit labels/conversions

**Pros:**

-   More discoverable
-   Auto-complete support
-   More compact

**Cons:**

-   All units' translated labels (for all languages) always loaded -- potential bloat
-   Any unit-specific configuration now part of the column API rather than encapsulated by a unit element
-   Clients cannot define their own custom types

#### Expose unit and unitDisplay from the Intl.NumberFormatter

We could add attributes for `unit` and `unit-display` that mirror the `unit` and `unitDisplay` configuration options on the `Intl.NumberFormatter`.

**Pros:**

-   Built-in localization support

**Cons:**

-   `Intl.NumberFormatter` [supports a fairly limited amount of `unit` values](https://tc39.es/ecma402/#table-sanctioned-single-unit-identifiers) with no way to extend the supported set
-   Requires all records to have the same unit

#### Add prefix and suffix attributes

We could add attributes for `prefix` and `suffix` that could be used to specify any string to append to the front or back of the formatted number.

**Pros:**

-   Fairly flexible, as it does not impose any restrictions on the units that are supported

**Cons:**

-   Poses localization challenges. For example:
    -   The prefix or suffix might need to change based on the value of the number (e.g. `1 gram` vs `2 grams`)
    -   A prefix in one locale might be a suffix in another locale (e.g. `56.8 degrees Celsius` in English will be represented as `摂氏 56.8 度` in Japanese)
-   Doesn't provide the flexibility of having different units for each record

#### Specify prefix and suffix through additional fields in the record

We could add attributes for `prefix-field-name` and `suffix-field-name` which would allow those values to be populated with a dynamic field value rather than a constant string. This could help use cases where values have disparate types or units. See [this thread](https://github.com/ni/nimble/pull/1268#discussion_r1212385898) for more discussion.

**Pros:**

-   Flexible; allows different units per record and does not impose any restrictions on the units that are supported.
-   Solves the problem where units might change based on the value of the number (e.g `1 gram` vs `2 grams`)

**Cons:**

-   Requires adding additional fields to each record, which could significantly increase memory usage in the cases where there are many records, each of which has many numeric values requiring prefix and/or suffix fields
-   Poses localization challenges. For example:
    -   A prefix in one locale might be a suffix in another locale (e.g. `56.8 degrees Celsius` in English will be represented as `摂氏 56.8 度` in Japanese)

### Expose all configuration options of Intl.NumberFormatter

The `nimble-table-column-number-text` can be made more flexible by adding an additional `custom` format along with `custom-*` attributes that correspond to each option that can be passed to the `Intl.NumberFormatter` constructor. This would give a client a lot of flexibility in displaying their numbers, but it also creates a large API to maintain for an unknown benefit. As there aren't any specific client requirements driving the need to have this amount of flexibility, it isn't clear if exposing every option would even meet the needs of an advanced client. Therefore, we have chosen to limit the API to configuration we know will be needed by clients so that we can ensure that a more complex API added in the future is done purposefully and in a way that clients will find it beneficial.

---

### States

N/A

### Accessibility

No unique considerations

### Globalization

Formatting APIs support locale-specific formatting and include user-visible strings in the browser.

### Security

No unique considerations

### Performance

We will do manual testing to ensure the browser formatting functions don't impact scroll performance.

### Dependencies

None

### Test Plan

We will add standard unit tests, Blazor/Angular tests, and Chromatic tests for new column types. The unit tests will exercise formatting corner cases including:

#### Number column

-   number edge cases (-Inf, Inf, -0, +0, NaN, Number.MAX_SAFE_INTEGER + n, Number.MIN_SAFE_INTEGER - n) should render as numbers (the exact presentation on the numbers will depend on the formatting options chosen)
-   non-number edge cases (e.g. strings containing numbers, undefined, null) should display blank
-   formatting should change with different locales
-   invalid formatter configuration should be reflected in column validity state

#### Date column

-   date edge cases (min and max date, different time zones)
-   non-date edge cases (e.g. non-dates, invalid dates) should display blank
-   formatting should change with different locales
-   invalid formatter configuration should be reflected in column validity state

### Tooling

N/A

### Documentation

Standard Storybook documentation for column APIs.

---

## Open Issues

1. Visual design recommends that column header text alignment match data alignment. Once we prototype this we may hit implementation concerns (e.g. clash with proposed header menu button).

2. Do we provide a way for clients to replicate the same formatting used in the number-text column, for use cases outside the table? Here is a possible direction:

    To help SLE and other clients maintain consistent formatting of number strings in and out of the table, we will provide a static function on the number column that returns a configured formatter object. The formatter object will expose one function that takes a number and returns a formatted string. Details TBD.
