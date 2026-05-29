import type { DesignToken } from '@ni/fast-foundation';
import { apiCategory } from '../../../utilities/storybook';

export interface LocalizableLabelArgs {
    localizableLabels: null;
}

export const createLocalizableLabelArgTypes = (
    labelProviderTag: string,
    ...labelTokens: DesignToken<string>[]
): {
    localizableLabels: {
        name: string,
        description: string,
        control: false,
        table: {
            category: string
        }
    }
} => {
    const tokenContent = labelTokens.length > 0
        ? labelTokens
            .map(token => `- \`${token.name}\``)
            .join('\n')
        : '- (All tokens on this provider are used)';
    const argTypes = {
        localizableLabels: {
            name: 'Localizable labels',
            description: `Label Provider:\`${labelProviderTag}\`
${tokenContent}

See the [Tokens/Label Providers docs page](./?path=/docs/tokens-label-providers--docs) for more information.
`,
            control: false,
            table: { category: apiCategory.localizableLabels }
        }
    } as const;
    return argTypes;
};
