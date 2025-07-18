import type { Meta } from '@storybook/html-vite';
import type { DesignToken } from '@ni/fast-foundation';
import { apiCategory } from '../../../utilities/storybook';

export interface LabelUserArgs {
    usedLabels: null;
}

export function addLabelUseMetadata<TArgs extends LabelUserArgs>(
    metadata: Meta<TArgs>,
    labelProviderTag: string,
    ...labelTokens: DesignToken<string>[]
): void {
    let tokenContent: string;
    if (labelTokens.length === 0) {
        tokenContent = '- (All tokens on this provider are used)';
    } else {
        tokenContent = labelTokens
            .map(token => `- \`${token.name}\``)
            .join('\n');
    }
    if (metadata.argTypes === undefined) {
        metadata.argTypes = {};
    }
    metadata.argTypes.usedLabels = {
        name: 'Localizable labels',
        description: `Label Provider:\`${labelProviderTag}\`
${tokenContent}

See the [Tokens/Label Providers docs page](./?path=/docs/tokens-label-providers--docs) for more information.
`,
        control: false,
        table: { category: apiCategory.localizableLabels }
    };
}
