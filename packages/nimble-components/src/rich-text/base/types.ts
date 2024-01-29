import type { ValidityObject } from '../../utilities/models/validator';

export interface RichTextValidity extends ValidityObject {
    readonly invalidMentionConfiguration: boolean;
    readonly duplicateMentionConfiguration: boolean;
}
