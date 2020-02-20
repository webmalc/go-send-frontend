import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { DirComponent } from '@shared/components/dir/dir.component';
import { ClickStopPropagationDirective } from '@shared/directives/click-stop-propagation.directive';

@NgModule({
    declarations: [
        DirComponent,
        ClickStopPropagationDirective,
    ],
    imports: [
        CommonModule,
        IonicModule,
        FormsModule,
        RouterModule,
    ],
    exports: [
        CommonModule,
        FormsModule,
        DirComponent,
        ClickStopPropagationDirective,
    ],
})
export class SharedModule { }
