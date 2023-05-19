/**
 * Build script for generating nimble-blazor integration for Nimble enums.
 *
 * Iterates through imported enums from nimble-components, and generates a C# file for each
 * (enum declaration, and Extensions class with conversion methods)
 */

import { pascalCase, Direction, Orientation } from '@microsoft/fast-web-utilities';
import { AnchorAppearance } from '@ni/nimble-components/dist/esm/anchor/types';
import { BannerSeverity } from '@ni/nimble-components/dist/esm/banner/types';
// import { ComboboxAutocomplete } from '@ni/nimble-components/dist/esm/combobox/types';
import { BreadcrumbAppearance } from '@ni/nimble-components/dist/esm/breadcrumb/types';
import { ButtonAppearance, ButtonAppearanceVariant } from '@ni/nimble-components/dist/esm/patterns/button/types';
import { DrawerLocation } from '@ni/nimble-components/dist/esm/drawer/types';
import { DropdownAppearance, DropdownPosition } from '@ni/nimble-components/dist/esm/patterns/dropdown/types';
import { IconSeverity } from '@ni/nimble-components/dist/esm/icon-base/types';
import { MenuButtonPosition } from '@ni/nimble-components/dist/esm/menu-button/types';
import { NumberFieldAppearance } from '@ni/nimble-components/dist/esm/number-field/types';
import { TreeViewSelectionMode } from '@ni/nimble-components/dist/esm/tree-view/types';
import { TableColumnSortDirection, TableRowSelectionMode } from '@ni/nimble-components/dist/esm/table/types';
// import { TextAreaAppearance, TextAreaResize } from '@ni/nimble-components/dist/esm/text-area/types';
// import { TextFieldAppearance, TextFieldType } from '@ni/nimble-components/dist/esm/text-field/types';
import { Theme } from '@ni/nimble-components/dist/esm/theme-provider/types';
import { TooltipSeverity } from '@ni/nimble-components/dist/esm/tooltip/types';

const allEnums = {
    AnchorAppearance,
    // ComboboxAutocomplete,
    BannerSeverity,
    BreadcrumbAppearance,
    ButtonAppearanceVariant,
    ButtonAppearance,
    Direction,
    DrawerLocation,
    DropdownAppearance,
    IconSeverity,
    MenuButtonPosition,
    NumberFieldAppearance,
    Orientation,
    DropdownPosition,
    TreeViewSelectionMode,
    TableColumnSortDirection,
    TableRowSelectionMode,
    // TextAreaAppearance,
    // TextAreaResize,
    // TextFieldAppearance,
    // TextFieldType,
    Theme,
    TooltipSeverity
};
const enumsToRename = {
    DropdownPosition: 'Position'
};

const fs = require('fs');
const path = require('path');

const generatedFilePrefix = `// AUTO-GENERATED FILE - DO NOT EDIT DIRECTLY
// See generation source in nimble-blazor/build/generate-enums\n`;

const packageDirectory = path.resolve(__dirname, '../../../');
const enumsDirectory = path.resolve(packageDirectory, 'NimbleBlazor/Enums');
console.log(enumsDirectory);

if (fs.existsSync(enumsDirectory)) {
    console.log(`Deleting existing enums directory "${enumsDirectory}"`);
    fs.rmSync(enumsDirectory, { recursive: true });
    console.log('Finished deleting existing enums directory');
}
console.log(`Creating enums directory "${enumsDirectory}"`);
fs.mkdirSync(enumsDirectory);
console.log('Finished creating enums directory');

console.log('Writing enum C# files');
for (const key of Object.keys(allEnums)) {
    let enumName = key;
    if (enumsToRename[enumName]) {
        enumName = enumsToRename[enumName];
    }
    const enumeration = allEnums[key];
    const enumValues = [];
    let defaultEnumValueName;
    for (const enumValueName of Object.keys(enumeration)) {
        const enumValue = enumeration[enumValueName];
        if (enumValue === undefined) {
            defaultEnumValueName = pascalCase(enumValueName);
            continue;
        }
        enumValues.push(pascalCase(enumValue));
    }
    let enumValueIsUnsetCheck = 'value == null';
    if (defaultEnumValueName !== undefined) {
        enumValues.unshift(defaultEnumValueName);
        enumValueIsUnsetCheck = `value == null || value == ${enumName}.${defaultEnumValueName}`;
    }

    const allIndentedEnumValues = enumValues.map(v => `    ${v}`).join(',\n');
    const directiveFileContents = `${generatedFilePrefix}
namespace NimbleBlazor;

public enum ${enumName}
{
${allIndentedEnumValues}
}

internal static class ${enumName}Extensions
{
    internal static readonly Dictionary<${enumName}, string> EnumValues = AttributeHelpers.GetEnumNamesAsKebabCaseValues<${enumName}>();

    public static string? ToAttributeValue(this ${enumName}? value) => (${enumValueIsUnsetCheck}) ? null : EnumValues[value.Value];
}
`;
    const enumFileName = `${enumName}.cs`;
    const enumFilePath = path.resolve(enumsDirectory, enumFileName);
    fs.writeFileSync(enumFilePath, directiveFileContents, { encoding: 'utf-8' });
}
console.log('Finshed writing enum C# files');
