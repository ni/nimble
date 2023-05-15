# Formatted Text Columns

## Overview

Clients will wish to display non-string data as text in table columns for use cases like the following:

1. integer data like counts, formatted to be displayed with no trailing decimals ("4", "100")
2. floating point data formatted to display values in standard ways ("3.1415", "1.04E47", "Infinity", "-0.03")
3. a mix of the above with formatting determined by the application ("1.000", "-0.030", "1024.000")
4. numeric values with a static unit string appended before or after (e.g. "$4.23" or "15%")
5. numeric values with custom unit logic. Examples:
    - a file size column that could show the value 1000 as "1000 bytes" but the value 1024 as "1KB"
    - an elapsed time column that could show 63 seconds as "00:01:03" or "1 minute, 3 seconds"
6. date/time values formatted in various ways ("October 27", "yesterday", "2023-12-28 08:27")

In all of the above cases:

-   data should be sortable and groupable by its actual value, not the string representation
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

-   Combinations of the use cases listed above in a single column. This will be needed in cases where the source data isn't uniformly typed (e.g. SLE tag values or notebook outputs). This HLD focuses on uniform data types; future HLDs may discuss ways to configure multiple types of columns to be conditionally displayed together.
-   Editable numbers. This is not supported by the text column yet either.
-   Numeric formatting for `nimble-number-field`. While we may choose to expose similar APIs for its numeric formatting, the complexities of it being an editable input control make this out of scope for now.
-   Customizing the styling of the column content (other than text alignment). This is not supported by the text column yet either.
-   Enum and boolean values formatted as localized strings (0 -> "Fail", 1 -> "Pass"). These will likely use the [mapping column being discussed elsewhere](https://github.com/ni/nimble/pull/1220).

---

## Design

### Summary

Nimble will provide base classes that can be derived from to define columns that call a formatting function to render their data as text.

Nimble will provide several columns that derive from these base classes and provide higher level formatting APIs for specific data types. We plan to provide column implementations that can handle the above use cases 1-4 (numeric formatting and static units) in a first pass with 6 (date) coming later.

Clients which require app-specific formatting logic to support above use cases like 5 (custom unit logic) will define custom columns in their application that derive from these base classes.

We'll strongly encourage clients to prefer columns defined in Nimble as these will be easier to use than custom columns defined in their application:

-   the columns will be configurable via HTML attributes, saving clients from writing JS code (a particular challenge in Blazor)
-   they provide strict type validation of the data field
-   clients don't need to manage the lifecycle of registering a new column custom element in their application

### Formatted text column base classes

Nimble will provide abstract base classes, templates, and styles which handle rendering a string as text. Just like `nimble-table-column-text` today, these columns will:

-   offer attributes to control which field is displayed and placeholder text when that field isn't of type "number" (values like Infinity and NaN are considered numbers and will be displayed as such).
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
        placeholder="Not started"
    >
        Progress
    <my-app-progress-column>`
</nimble-table>
```

**Define and register column custom element**

```ts
export class MyAppProgressColumn extends TableColumnTextBase {
    public constructor() {
        super({
            cellRecordFieldNames: ['value'],
            cellViewTag: tableColumnNumericTextCellViewTag,
            groupHeaderViewTag: tableColumnNumericTextGroupHeaderTag
        });
        this.columnInternals.sortOperation = TableColumnSortOperation.basic;
    }
}

const myAppProgressColumn = MyAppProgressColumn.compose({
    baseName: 'table-column-progress',
    template,
    styles
});

DesignSystem.getOrCreate().withPrefix('my-app').register(myAppProgressColumn());
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

    public override get placeholder(): string {
        return this.columnConfig.placeholder;
    }

    public override get shouldUsePlaceholder(): boolean {
        return typeof this.cellRecord.value !== 'number';
    }
}

export class MyAppProgressColumnGroupHeaderView extends TableColumnTextGroupHeaderViewBase<
    TableNumberFieldValue,
    TableColumnNumericTextColumnConfig
> {
    public override get text(): string {
        return `${100 * this.groupHeaderValue}%`;
    }

    public override get placeholder(): string {
        return this.columnConfig.placeholder;
    }

    public override get shouldUsePlaceholder(): boolean {
        return typeof this.groupHeaderValue !== 'number';
    }
}

// Not shown: registering the above two custom elements
```

This is prototyped in the [formatted-text-column branch](https://github.com/ni/nimble/compare/main...users/jattas/formatted-text-column?expand=1).

### Nimble formatted text columns

Nimble will provide several columns that derive from the above base classes and provide higher level text formatting APIs for specific data types.

All columns will include a `field-name` string attribute to select the field to display and a `placeholder` string attribute to specify the text to display if the field value isn't in the expected format (more details about expected formats for each column type).

All columns will offer standard Angular and Blazor integration.

#### Column naming

Follows the [Column Type Philosophy](/packages/nimble-components/src/table/specs/table-columns-hld.md#column-type-philosophy) where:

-   category: `table-column`
-   presentation: `text`
-   variants: Different variants are allowed for configurations that vary significantly / don't make sense to add to `table-column-text`, ie for a `table-column-numeric-text` or `table-column-date-text`

#### Text column

`nimble-table-column-text` will continue to present the same API it does today, but will derive from the base classes described above.

#### Number column

Nimble will introduce `nimble-table-column-number-text` which formats a numeric field value and displays it as text. It will offer sufficient configuration to support use cases 1-4 above.

##### API

-   `prefix` - a string which will be appended before each value (e.g. `'$'`). Defaults to `''`.
-   `suffix` - a string which will be appended after each value (e.g. `'%'` or `' V'`). Defaults to `''`. Spacing will be at the discretion of clients, but Nimble will recommend including a space before the unit except for non-letter units like `%`, `°`, and `°C`. This [matches the Chicago Manual of Style](https://www.chicagomanualofstyle.org/book/ed17/part2/ch09/psec016.html) (requires VPN) which is NI's documentation style guide.
-   `format` - a string which can take one of the following values
    -   `null` - use the default formatter, which will format similarly to [`Number.toString()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number/toString#description). This displays integers with no trailing zeros, limits to about 16 significant digits, and switches to exponential notation for very large and small numbers. It will be implemented using `Intl.NumberFormat` to achieve more consistent i18n (`toString` always uses a `.` separator and displays the English word for "Infinity").
    -   `'intl'` - use [`Intl.NumberFormat`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/NumberFormat/NumberFormat) configured with values specified in other attributes.
    -   This could be extended to other pre-configured formats in future. Their configuration attributes would similarly be prefixed with the name of the format mode.
-   `locales` - a string containing a comma-separated list of locales to pass to the `locales` parameter of the `NumberFormat` constructor.
-   `intl-*` - when format is `intl`, these attribute-cased values will be passed to the equivalent camelCased fields of the `options` parameter of the `NumberFormat` constructor. For example, `options.maximumFractionDigits` will be set to the value of `intl-maximum-fraction-digits`. These fields are all string, boolean, or number and their property equivalents will be strictly typed.

This column will display the `placeholder` when `typeof` the value is not `"number"` (i.e. if the value is `null`, `undefined`, not present, or has a different runtime data type). Note that IEE 754 numbers like Infinity, NaN, and -0 are type `"number"` so will be displayed how each formatter converts them. This will preserve values like `"∞"`, `"NaN"` and `"-0"`.

##### Examples

```html
<nimble-table>
    <nimble-table-column-number-text field-name="count" placeholder="Not found">
        Count
    </nimble-table-column-number-text>

    <nimble-table-column-number-text
        field-name="voltage"
        format="intl"
        locales="en-US"
        intl-style="decimal"
        intl-use-grouping="false"
        suffix=" V"
    >
        Voltage
    </nimble-table-column-number-text>
</nimble-table>
```

#### Date Column

Nimble will introduce `nimble-table-column-date-text` which maps [JavaScript `Date`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date) values to localized strings.

Note that mutating a `Date` object does not cause the value to be rendered again.

##### API

-   `format` - a string which can take one of the following values
    -   `null` - use the default formatter, which will display values similar to `Dec 19, 2020, 9:23:16 PM` and include support for localization. It will be implemented using `Intl.DateTimeFormat` with `options.dateStyle` and `options.timeStyle` set to `"medium"`.
    -   `'intl'` - use [`Intl.DateTimeFormat`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/DateTimeFormat) configured with values specified in other attributes.
    -   This could be extended to other pre-configured formats in future. Their configuration attributes would similarly be prefixed with the name of the format mode.
-   `locales` - a string containing a comma-separated list of locales to pass to the `locales` parameter of the `DateTimeFormat` constructor.
-   `intl-*` - when format is `intl`, these attribute-cased values will be passed to the equivalent camelCased fields of the `options` parameter of the `DateTimeFormat` constructor. For example, `options.dateStyle` will be set to the value of `intl-date-style`. These fields are all string, boolean, or number and their property equivalents will be strictly typed.

This column will display the `placeholder` for a date when it's not `instanceof Date` or when `isNaN(date)` returns `true` (i.e. if the value is `null`, `undefined`, not present, has a non-`Date` runtime data type, or is an invalid `Date`) (see ["Detecting an invalid Date instance"](https://stackoverflow.com/a/1353711)).

##### Examples

```html
<nimble-table>
    <nimble-table-column-date-text field-name="start" placeholder="Not started">
        Start
    </nimble-table-column-date-text>

    <nimble-table-column-date-text
        field-name="dueDate"
        format="intl"
        locales="en-US"
        intl-date-style="full"
    >
        Due Date
    </nimble-table-column-date-text>
</nimble-table>
```

#### Elapsed Time Column

Nimble will introduce a column type that maps time duration to localized strings. Its API will be discussed in a future update to this document. Ideally it might use [Temporal duration values](https://tc39.es/proposal-temporal/docs/duration.html) formatted with [`Intl.DurationFormat`](https://tc39.es/proposal-intl-duration-format/) but those APIs are not yet approved for implementation in browsers.

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
2. The TC39 ECMAScript standard is working on [a proposal for Temporal](https://github.com/tc39/proposal-temporal), which includes a new [immutable format for representing time](https://tc39.es/proposal-temporal/docs/index.html) and namespace for manipulating it. It's in Stage 3 meaning the API isn't expected to change and [polyfills](https://github.com/tc39/proposal-temporal#polyfills) are available.
3. There are numerous libraries for formatting including the standards-based [Format.js](https://formatjs.io/), the opinionated [moment.js](https://momentjs.com/docs/), and [various successors](https://momentjs.com/docs/#/-project-status/recommendations/). We may choose to depend on one in the future to expose additional formatting options but will start with browser APIs as they require no additional dependencies.

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

-   number edge cases (-Inf, Inf, -0, +0, NaN, Number.MAX_SAFE_INTEGER + n, Number.MIN_SAFE_INTEGER -n) should render as numbers
-   non-number edge cases (e.g. strings containing numbers, undefined, null) should display the placeholder
-   formatting should change with different locales

#### Date column

-   date edge cases (min and max date, different time zones)
-   non-date edge cases (e.g. non-dates, invalid dates) should display the placeholder
-   formatting should change with different locales

### Tooling

N/A

### Documentation

Standard Storybook documentation for column APIs.

---

## Open Issues

1. API to configure text alignment of column content, placeholder text, and column headers (e.g. right align numeric columns but left align string columns and numeric columns with non-uniform formatting; [more discussion here](https://github.com/ni/nimble/issues/887)). We'll update the HLD with a recommendation when we start working on columns that need it (you're welcome to comment with ideas now though).
2. Type names
