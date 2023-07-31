export const sharedMappingValidityDescription = `Readonly object of boolean values that represents the validity states that the column's configuration can be in.
The object's type is \`TableColumnValidity\`, and it contains the following boolean properties:

-   \`invalidMappingKeyValueForType\`: \`true\` when a mapping has a \`key\` that is not of the \`key-type\` declared by the column
-   \`unsupportedMappingType\`: \`true\` when the column contains a mapping element other than \`nimble-mapping-text\`
-   \`duplicateMappingKey\`: \`true\` when multiple mappings have the same \`key\` value
-   \`missingKeyValue\`: \`true\` when a mapping has no \`key\` value
-   \`missingLabelValue\`: \`true\` when a mapping has no \`label\` value
`;
