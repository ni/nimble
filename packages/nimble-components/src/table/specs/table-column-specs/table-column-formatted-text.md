# Formatted Text Columns

## Overview

Clients will wish to display non-string text data in table columns for use cases like the following:

1. integer data like counts, formatted to be displayed with no trailing decimals ("4", "100")
2. floating point data formatted to display values in standard ways ("3.1415", "1.04E47", "Infinity", -0.03)
3. a mix of the above with formatting determined by the application ("1.000", "-0.030", "1024.000")
4. numeric values with a static unit string appended before or after (e.g. "$4.23" or "15%")
5. numeric values with custom unit logic. Examples:
    - a file size column that could show the value 1000 as "1000 bytes" but the value 1024 as "1KB"
    - an elapsed time column that could show 63 seconds as "00:01:03" or "1 minute, 3 seconds"
6. enum and boolean values formatted as localized strings (0 -> "Fail", 1 -> "Pass")
7. date/time values formatted in various ways ("October 27", "yesterday", "2023-12-28 08:27")

In all of the above cases:

-   data should be sortable and groupable by its actual numeric value, not the string representation
-   text styling like font and alignment should be provided by Nimble
-   columns should support i18n behaviors like decimal separators, date/time formats, and localized content
-   there should be an option to show "placeholder" text if no value is specified
-   there should be a way to show the full value of truncated text (likely via a title / tooltip on hover)

We may not choose to support all of the above initially but we should design our solutions with these use cases in mind.

### Background

[Number column work item](https://github.com/ni/nimble/issues/1011)

[Date/time column work item](https://github.com/ni/nimble/issues/1014)

[Boolean text column work item](https://github.com/ni/nimble/issues/1103)

[Table Column API](../table-columns-hld.md)

[Table Spec](../README.md)

[Table Column Text Spec](./table-column-text-field.md)

[Visual Design Spec](https://xd.adobe.com/view/5b476816-dad1-4671-b20a-efe796631c72-0e14/specs/)

### Non-goals

-   Combinations of the use cases listed above in a single column. This will be needed in cases where the source data isn't uniformly typed (e.g. SLE tag values or notebook outputs). This HLD focuses on uniform data types; future HLDs will discuss ways to configure multiple types of columns to be conditionally displayed together.
-   Editable numbers. This is not supported by the text column yet either.
-   Customizing the styling of the column content (other than possibly text alignment). This is not supported by the text column yet either.

---

## Design

### Summary

Nimble will provide a base class that can be derived from to define columns that call a formatting function to render their data as text. Clients which require app-specific formatting logic to support above use cases like 5 (custom unit logic) will define custom columns in their application that derive from this base class.

Nimble will also provide several columns that derive from this base class and provide higher level formatting APIs for specific data types. We plan to provide column implementations that can handle the above use cases 1-4 (numeric formatting and static units) in a first pass with 6 and 7 (enum/boolean and date) coming later. These will be easier to use than the above custom column approach:
 - the columns will be configurable via HTML attributes, saving clients from writing JS code (a particular challenge in Blazor)
 - they provide strict type validation of the data record
 - clients don't need to manage the lifecycle of registering a new column custom element in their application

### Formatted text column base class

*Originally called "Alternative 2: Client specifies formatting function"*

When configuring a column, clients could provide a callback function that converts data of any supported type into a formatted string.

There isn't a good way to set a function as an attribute value on a column, so the function would be specified in JS code via clients overriding an abstract base class and registering a new column type:

```html
<nimble-table>
    <my-app-progress-column
        field-name="progress"
        placeholder="Not started"
    >
        Progress
    <my-app-progress-column>`
</nimble-table>
```

```ts
class MyAppProgressColumn : NimbleFormattedTextColumnBase<number> {
    public override format(value: number) : string {
        return `${100 * value}%`;
    }

    public override shouldUsePlaceholder(value: number | undefined) : boolean {
        return value === undefined;
    }
}

MyAppProgressColumn.registerColumn('my-app-progress-column');
```

Some of this is prototyped in the [number-column-prototype branch](https://github.com/ni/nimble/compare/main...number-column-prototype?expand=1).

### Nimble formatted text columns

*Originally called "Alternative 3: Nimble provides column implementation for common use cases"*

#### Numeric text column

We will introduce `nimble-table-column-numeric` which formats a numeric field value and displays it as text. It will offer sufficient configuration to support use cases 1-4 above.

Similar to `nimble-table-column-text`:
- it will offer attributes to control which field is displayed and placeholder text when that field isn't a number.
- it will sort and group by the field value, not the display value.
- it will allow sizing by fractional widths with a minimum pixel width.
- it will truncate using an ellipsis and show a tooltip on hover when the value is truncated

The primary formatting API will leverage the native browser [`Intl.NumberFormat` API](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/NumberFormat/NumberFormat) which gives highly configurable formatting with great documentation. It supports features like locale-specific formatting, decimal separators, thousands separators, digits of precision, and units. Since it doesn't support some unit strings required by clients, the column will also offer ways to set a fixed prefix or suffix on every number.

##### ``nimble-table-column-numeric` API

_*Props/Attrs*_
- `field-name` - 
- `placeholder` - The string value to use if the value of the field is `undefined`, `null`, `NaN`, or isn't of type `number`. Note that other "special" values like `Infinity` will be formatted and displayed.
- TODO: ALIGNMENT
- `prefix` - A string to append before the formatted value of each cell. It will not include any spacing.
- `suffix` - A string to append after the formatted value of each cell. It will not include any spacing.
- `number-format-locales` - Corresponds to the [`locales` parameter of `NumberFormat`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/NumberFormat/NumberFormat#parameters). Note that initially we will not support an array of locales; if this is necessary we could consider parsing this field as a comma-separated list.
- `number-format-options-*` - attributes that correspond to the properties of the [`options` parameter of `NumberFormat`]. Each property name will be converted from `camelCase` to `dash-case`. For example, `number-format-options-compact-display="long"` or `number-format-options-currency-display="narrowSymbol"`.

For values being passed through to the `NumberFormat` API we will provide types similar to [the TypeScript types from the browser API](https://github.com/microsoft/TypeScript/blob/0f724c04308e20d93d397e82b11f82ad6f810c44/src/lib/es2020.intl.d.ts#L232). Default values if the attribute is not provided will match the `NumberFormat` API.

```html
<nimble-table>
    <nimble-table-column-numeric
        field-name="progress"
        number-format-locales="en-US"
        number-format-options-style="percent"
        number-format-options-minimum-fraction-digits=2
    >
        Progress
    <nimble-table-column-numeric>

    <nimble-table-column-numeric
        field-name="count"
        number-format-locales="en-US"
        number-format-options-style="decimal"
        number-format-options-use-grouping=false
        number-format-options-maximum-fraction-digits=0
        number-format-options-rounding-mode="trunc"
    >
        Count
    <nimble-table-column-numeric>

    <nimble-table-column-numeric
        field-name="voltage"
        number-format-locales="en-US"
        number-format-options-style="decimal"
        number-format-options-use-grouping=false
        suffix=" V"
    >
        Voltage
    <nimble-table-column-numeric>
</nimble-table>
```



####  Boolean Text Column

We will eventually provide an column type that maps boolean values to localized strings. This is an example API but the details will be updated in this document before implementation.

```html
<nimble-table>
    <nimble-table-column-boolean-text
        field-name="testResult"
        true-message="Pass"
        false-message="Fail"
        placeholder="N/A"
    >
        Test Result
    <nimble-table-boolean-text>
</nimble-table>
```

##### Example E: Enum Text Column

We will eventually provide an column type that maps enum values to localized strings. This is an example API but the details will be updated in this document before implementation.

```html
<nimble-table>
    <nimble-table-column-enum-text
        field-name="status"
        placeholder="Unknown"
    >
        Status
        <nimble-list-option slot="enum-string-0" value="0">Pass</nimble-list-option>
        <nimble-list-option slot="enum-string-1" value="1">Fail</nimble-list-option>
    <nimble-table-column-enum-text>
</nimble-table>
```

### API

_Component Name_

_*Props/Attrs*_

_Type Reference_

### Anatomy

### Angular integration

### Blazor integration

I propose we **would not** encourage Blazor clients to write formatting code in .NET due to performance concerns.

### Visual Appearance

###
TODO Items I asked Mert to include on hyperlink spec

---

## Implementation

### Alternatives considered

#### Other ways to provide a formatting function

1. setting the formatting function as a property on a column element.
2. setting an [`Intl.NumberFormat`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/NumberFormat) object as a property on a column element.

Both of these require JS code which finds a specific column element and configures it. This is difficult to achieve in Blazor.

#### Use `table-column-text`

*Originally called "Alternative 1"*

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

*Originally called "Alternative 4"*

Nimble already has a mechanism for clients to provide custom columns by deriving from a base class, specifying the data fields / template / styling, and registering the column type with Nimble. We could ask clients to use this mechanism for text column types.

**Pros:**

-   Zero implementation cost to Nimble team
-   Powerful; clients can format data however they want, including via browser APIs which are i18n-friendly

**Cons:**

-   Higher burden on clients to specify template, styling, numeric formatting, etc in JS. This is especially burdensome in frameworks like Blazor.
-   Difficult to enforce styling differences between string and numeric columns (e.g. right vs left text alignment)
-   Potential cross-app inconsistency if formatting code isn't shared



### States

### Accessibility

### Globalization

### Security

### Performance

### Dependencies

### Test Plan

### Tooling

### Documentation

---

## Open Issues

1. API to configure text alignment of column content and column headers (e.g. right align numeric columns but left align string columns). We'll update the HLD with a recommendation once we reach consensus on which alternatives to pursue (you're welcome to comment with ideas now though).
2. The APIs in this document are examples, not yet proposals. Once we agree on high-level direction I will do more prototyping to propose concrete APIs.
