# Formatted Text Columns

## Overview

Clients will wish to display non-string text data in table columns for use cases like the following:
1. integer data like counts, formatted to be displayed with no trailing decimals
2. floating point data formatted to display values in standard ways ("3.1415", "1.04E47", "Infinity", -0.03)
3. a mix of the above with formatting determined by the application
4. numeric values with a static unit string appended before or after (e.g. "$4.23" or "15%")
5. numeric values with custom unit logic. Examples:
   - a file size column that could show the value 1000 as "1000 bytes" but the value 1024 as "1KB"
   - an elapsed time column that could show 63 seconds as "00:01:03" or "1 minute and 3 seconds"
6. enum values formatted as localized strings (0 -> "Fail", 1 -> "Pass")
7. date/time values formatted in various ways ("October 27", "yesterday", "2023-12-28 08:27")

In all of the above cases:
 - data should be sortable and groupable by its actual numeric value, not the string representation
 - text styling like font and alignment should be provided by Nimble
 - columns should support i18n behaviors like decimal separators, date/time formats, and localized content
 - there should be an option to show "placeholder" text if no value is specified

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
-   Customizing the styling or alignment of the column content. This is not supported by the text column yet either.


---

## Design

### Alternatives

Below are different alternatives to solve these use cases. Some alternatives will work better for certain use cases and worse for others. We may choose to implement a few of these alternatives in order to provide a great experience for all use cases.

At this stage, code examples are meant to be illustrative pseudo-code, not proposed APIs.

#### Use `table-column-text`

With the changes proposed in [HLD for programmatically sorting columns](https://github.com/ni/nimble/pull/1049) to allow a column to be sorted by a different data field than the one being used for display, many of the above use cases could be met with minor changes to the existing text column. Clients would write custom logic populate their data with a new string field that contains formatted values. Then they would configure the table to display that string field while sorting by the original numeric field.

```html
<nimble-table>
    <nimble-table-column-text
        operational-data-field-name="progress"
        field-name="formattedProgress"
    >
        Progress
    <nimble-table-column-text>`
</nimble-table>
```

```ts
const originalData = [{progress: 0.1}, {progress: 0.2}];
const tableData = originalData.map(x => {
    progress: x.progress;
    formattedProgress: x ? `${100 * x.progress}%` : undefined;
});
table.data = tableData;
```

**Pros:**

- formatted data is specified up front, guaranteeing fast scroll performance
- powerful; clients can format data however they want, including via browser APIs which are i18n-friendly or on the server

**Cons:**

- increased memory usage and data update time from clients pre-populating data with field for each formatted column
- added complexity of writing procedural code even for simple formatting use cases
- reduced cross-app consistency if formatting code isn't shared

**Implementation Cost:**

- Exposing `operational-data-field-name` to be set by client code rather than column definition


#### Client specifies formatting function

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

**Pros:**

- small memory footprint and fast data update time because formatting function is called on-demand
- powerful; clients can format data however they want, including via browser APIs which are i18n-friendly

**Cons:**

- possible reduced scroll performance because formatting function is called on-demand
- requires JS code to do formatting which is less convenient in frameworks like Blazor

**Implementation Cost:**

- Expose mechanism for providing format function

#### Nimble provides column implementation for common use cases

For common use cases we could provide column types that expose simplified formatting APIs:

```html
<nimble-table>
    <nimble-table-column-numeric 
        field-name="progress"
        digits-width=2
        suffix="%"
    >
        Progress
    <nimble-table-column-numeric>`
    <nimble-table-column-date-time field-name="start" display-mode='date'>Start date</nimble-table-column-date>
</nimble-table>
```

**Pros:**

- easy for clients to use since configuration is declarative

**Cons:**

- requires Nimble team to design simple but powerful formatting and i18n APIs
- can't solve some use cases like app-specific formatting logic

**Implementation Cost:**

- API design and implementation for each new column type

#### Client provides custom column implementation for each use case

Nimble already has a mechanism for clients to provide custom columns by deriving from a base class, specifying the data fields / template / styling, and registering the column type with Nimble. We could ask clients to use this mechanism for text column types.

**Pros:**

- Zero implementation cost to Nimble team

**Cons:**

- Higher burden on clients to specify template, styling, etc in JS
- Potential for inconsistent styling


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

