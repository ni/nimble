import { attr } from '@microsoft/fast-element';
import { DesignSystem, FoundationElement } from '@microsoft/fast-foundation';
import { template } from './template';
import { styles } from './styles';

export class Image extends FoundationElement {
    @attr public readonly source = '';
}

const nimbleImage = Image.compose({
    baseName: 'image',
    template,
    styles
});

DesignSystem.getOrCreate().withPrefix('nimble').register(nimbleImage());