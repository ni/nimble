import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { OkFvEditCommitBarDirective } from './ok-fv-edit-commit-bar.directive';

import '@ni/ok-components/dist/esm/fv/edit-commit-bar';

@NgModule({
    declarations: [OkFvEditCommitBarDirective],
    imports: [CommonModule],
    exports: [OkFvEditCommitBarDirective]
})
export class OkFvEditCommitBarModule {}
