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
6. enum values formatted as localized strings (0 -> "Fail", 1 -> "Pass")
7. date/time values formatted in various ways ("October 27", "yesterday", "2023-12-28 08:27")
8. combinations of the above in a single column in cases where the source data isn't uniformly typed (e.g. SLE tag values)

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

[Table Column API](../table-columns-hld.md)

[Table Spec](../README.md)

[Table Column Text Spec](./table-column-text-field.md)

[Visual Design Spec](https://xd.adobe.com/view/5b476816-dad1-4671-b20a-efe796631c72-0e14/specs/)

### Non-goals

-   Editable numbers. This is not supported by the text column yet either.
-   Customizing the styling of the column content (other than possibly text alignment). This is not supported by the text column yet either.

---

## Design

### Alternatives

Below are different alternatives to solve these use cases. Some alternatives will work better for certain use cases and worse for others. We may choose to implement a few of these alternatives in order to provide a great experience for all use cases. See below for an initial proposal.

At this stage, code examples are meant to be illustrative pseudo-code, not proposed APIs.

#### Alternative 1: Use `table-column-text`

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

#### Alternative 2: Client specifies formatting function

When configuring a column, clients could provide a callback function that converts data of any supported type into a formatted string.

There isn't a good way to set a function as an attribute value on a column, so the function would be specified in JS code. One possible mechanism would be for clients to override an abstract base class and register a new column type:

```html
<nimble-table>
    <my-app-progress-column
        field-name="progress"
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

Other variants of this idea include:

1. setting the formatting function as a property on a column element.
2. setting an [`Intl.NumberFormat`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/NumberFormat) object as a property on a column element.

**Pros:**

-   Small memory footprint and fast data update time because formatting function is called on-demand
-   Powerful; clients can format data however they want, including via browser APIs which are i18n-friendly
-   Easy to enforce styling differences between string and numeric columns (e.g. right vs left text alignment)

**Cons:**

-   Possible reduced scroll performance because formatting function is called on-demand
-   Requires creating a custom element to do formatting which is non-trivial for clients (must consider naming, registration, sharing, etc)
-   Requires JS code to do formatting which is less convenient in frameworks like Blazor
-   Some potential for cross-app inconsistency if numeric formatting code isn't shared (versus Alternative 3)

**Implementation Cost:**

-   Expose mechanism for providing format function

#### Alternative 3: Nimble provides column implementation for common use cases

For common use cases we could provide column types that expose simplified formatting APIs:

##### Example A: Nimble-designed API for known use cases

```html
<nimble-table>
    <nimble-table-column-numeric
        field-name="progress"
        digits-width=2
        suffix="%"
    >
        Progress
    <nimble-table-column-numeric>
</nimble-table>
```

##### Example B: Pass through Intl.NumberFormat API

The [NumberFormat API](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/NumberFormat/NumberFormat) gives highly configurable formatting with great documentation. It would solve use cases 1-4 above provided they use [supported units](https://tc39.es/proposal-unified-intl-numberformat/section6/locales-currencies-tz_proposed_out.html#sec-issanctionedsimpleunitidentifier) (includes `%`, currency, temperature, time). Unfortunately it throws for unsupported units (like volts and amps) and doesn't really support unit conversion. (Aside: it [almost supports](https://stackoverflow.com/a/73974452) our file size column use case but browsers use metric conversions (1KB === 1000B) but we want binary conversions (1KB === 1024B)).

```html
<nimble-table>
    <nimble-table-column-numeric
        field-name="progress"
        locales="en-US"
        style="percent"
        minimum-fraction-digits=2
    >
        Progress
    <nimble-table-column-numeric>

    <nimble-table-column-numeric
        field-name="count"
        locales="en-US"
        style="decimal"
        use-grouping=false
        maximum-fraction-digits=0
        rounding-mode="trunc"
    >
        Count
    <nimble-table-column-numeric>
</nimble-table>
```

##### Example C: Provide pre-configured formatters for NumberFormat API

To improve consistency and reduce client configuration, we could provide formatters for common use cases like integers and percent.

```html
<nimble-table>
    <nimble-table-column-numeric
        field-name="progress"
        nimble-numeric-format="percent"
    >
        Progress
    <nimble-table-column-numeric>

    <nimble-table-column-numeric
        field-name="count"
        nimble-numeric-format="integer"
    >
        Count
    <nimble-table-column-numeric>
</nimble-table>
```

##### Example D: Enum Column

We may try to provide an easy way for clients to map enum values to localized strings. Here is a concept for an API which probably has issues.

```html
<nimble-table>
    <nimble-table-column-enum
        field-name="status"
    >
        Status
        <nimble-list-option slot="enum-string-0" value="0">Pass</nimble-list-option>
        <nimble-list-option slot="enum-string-1" value="1">Fail</nimble-list-option>
    <nimble-table-column-enum>
</nimble-table>
```

**Pros:**

-   Easy for clients to use since configuration is declarative. This means Blazor apps could do configuration from .NET code and not need to write JS.
-   Consistent numeric formatting across apps
-   Easy to enforce styling differences between string and numeric columns (e.g. right vs left text alignment)

**Cons:**

-   Requires Nimble team to design simple but powerful formatting and i18n APIs
-   Can't solve some use cases like app-specific formatting logic

**Implementation Cost:**

-   API design and implementation for each new column type

#### Alternative 4: Client provides custom column implementation for each use case

Nimble already has a mechanism for clients to provide custom columns by deriving from a base class, specifying the data fields / template / styling, and registering the column type with Nimble. We could ask clients to use this mechanism for text column types.

**Pros:**

-   Zero implementation cost to Nimble team
-   Powerful; clients can format data however they want, including via browser APIs which are i18n-friendly

**Cons:**

-   Higher burden on clients to specify template, styling, numeric formatting, etc in JS. This is especially burdensome in frameworks like Blazor.
-   Difficult to enforce styling differences between string and numeric columns (e.g. right vs left text alignment)
-   Potential cross-app inconsistency if formatting code isn't shared

### Strawman Proposal

For the sake of discussion my initial proposal is:

1. We need to offer an approach for columns that require app-specific formatting logic to support above use cases like 5 (custom unit logic) and 8 (data of unknown type).
    - I believe the cons of **Client provides a custom column implementation for each use case** are too great so we should invest in an approach that offers clients more consistency and simplicity.
    - I'm leaning towards **Client specifies formatting function** over **Use `table-column-text`** because it more clearly encodes that the column is numeric, giving better type safety and allowing for more consistent styling. I'd like to do performance profiling to see how it impacts scroll performance before committing to this direction.
2. I would also like to pursue **Nimble provides column implementation for common use cases** to save clients from having to write JS code. Ideally we would provide column implementations that can handle the above use cases 1-4 (numeric formatting and static units) in a first pass with 6 and 7 (enum and date) coming later.

### API

_Component Name_

_*Props/Attrs*_

_Type Reference_

### Anatomy

### Angular integration

### Blazor integration

### Visual Appearance

---

## Implementation

### Alternatives considered

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
