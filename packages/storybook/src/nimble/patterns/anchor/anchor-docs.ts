export const hrefDescription = (componentName: string, includeDisable: boolean): string => `The URL that the ${componentName} points to. 
${includeDisable ? 'To disable the control, remove the `href` attribute.' : ''}

In addition to \`href\`, all other attributes of \`<a>\` are also supported, e.g. \`ping\`, \`target\`, \`type\`, etc.
`;
