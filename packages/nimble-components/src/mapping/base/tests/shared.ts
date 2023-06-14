export function keyDescription(renderedThing: string) {
    return `The value which, when matched to the data value for a cell, will result in ${renderedThing} being rendered in that cell. The string value given in the html is parsed to the type specified by the containing column's \`keyType\` attribute. If that type is \`boolean\`, the key value must be either \`"true"\` or \`"false"\`.`;
}