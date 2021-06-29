// TODO: Is exporting Foundation still necessary with the updated API's?
// export * from "@microsoft/fast-element";
import { DesignSystem } from '@microsoft/fast-foundation';
import { nimbleDesignSystemProvider } from  './design-system-provider/nimble-design-system';
import { nimbleButton } from './button/nimble-button';
import { nimbleTextField } from './text-field/index';

const allComponents = {
    nimbleDesignSystemProvider,
    nimbleButton,
    nimbleTextField
}

export const nimbleDesignSystem = DesignSystem.getOrCreate().withPrefix('nimble').register(
    ...Object.values(allComponents).map(definition => definition())
);