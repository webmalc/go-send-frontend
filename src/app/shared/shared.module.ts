import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

@NgModule({
    declarations: [],
    exports: [
        CommonModule,
        FormsModule,
        HttpClientModule,
    ]
})
export class SharedModule { }
