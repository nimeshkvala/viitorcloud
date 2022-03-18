import { NgModule } from '@angular/core';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

import { NotesRoutingModule } from './notes-routing.module';
import { LayoutComponent } from './layout.component';
import { ListComponent } from './list.component';
import { AddEditComponent } from './add-edit.component';
import { Ng2SearchPipeModule } from "ng2-search-filter";

@NgModule({
    imports: [
        CommonModule,
        ReactiveFormsModule,
        NotesRoutingModule,
        FormsModule,
        Ng2SearchPipeModule
    ],
    declarations: [
        LayoutComponent,
        ListComponent,
        AddEditComponent
    ]
})
export class NotesModule { }