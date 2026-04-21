import { Directive } from '@angular/core';
import { type IconNigelChat, iconNigelChatTag } from '@ni/spright-components/dist/esm/icons/nigel-chat';
import '@ni/spright-components/dist/esm/icons/nigel-chat';
import { SprightIconBaseDirective } from '@ni/spright-angular/icon-base';

export { type IconNigelChat, iconNigelChatTag };

/**
 * Spright Nigel chat brand icon directive
 */
@Directive({
    selector: 'spright-icon-nigel-chat',
    standalone: true
})
export class SprightIconNigelChatDirective extends SprightIconBaseDirective {
}
